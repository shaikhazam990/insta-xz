import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../style/search.css'

const api = axios.create({
    baseURL: "https://insta-xz.onrender.com",
    withCredentials: true
})

const SearchIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
)

const CloseIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
)

const HISTORY_KEY = "insta_search_history"

const getHistory = () => {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [] }
    catch { return [] }
}

const saveHistory = (query) => {
    const prev = getHistory().filter(q => q !== query)
    const updated = [query, ...prev].slice(0, 8)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
}

const removeHistory = (query) => {
    const updated = getHistory().filter(q => q !== query)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
}

const Search = () => {
    const [query, setQuery] = useState('')
    const [users, setUsers] = useState([])
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(false)
    const [tab, setTab] = useState('users')   // 'users' | 'posts'
    const [history, setHistory] = useState(getHistory())
    const [searched, setSearched] = useState(false)

    const inputRef = useRef(null)
    const debounceRef = useRef(null)
    const navigate = useNavigate()

    // real-time debounced search
    useEffect(() => {
        if (!query.trim()) {
            setUsers([])
            setPosts([])
            setSearched(false)
            return
        }

        clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => {
            doSearch(query.trim())
        }, 400)

        return () => clearTimeout(debounceRef.current)
    }, [query])

    const doSearch = async (q) => {
        setLoading(true)
        try {
            const [usersRes, postsRes] = await Promise.all([
                api.get(`/api/users/search?q=${encodeURIComponent(q)}`),
                api.get(`/api/posts/search?q=${encodeURIComponent(q)}`)
            ])
            setUsers(usersRes.data.users || [])
            setPosts(postsRes.data.posts || [])
            setSearched(true)
            saveHistory(q)
            setHistory(getHistory())
        } catch (err) {
            console.error('search failed', err)
        } finally {
            setLoading(false)
        }
    }

    const handleHistoryClick = (q) => {
        setQuery(q)
        inputRef.current?.focus()
    }

    const handleRemoveHistory = (e, q) => {
        e.stopPropagation()
        removeHistory(q)
        setHistory(getHistory())
    }

    const clearAll = () => {
        localStorage.removeItem(HISTORY_KEY)
        setHistory([])
    }

    const clearInput = () => {
        setQuery('')
        setUsers([])
        setPosts([])
        setSearched(false)
        inputRef.current?.focus()
    }

    const hasResults = users.length > 0 || posts.length > 0

    return (
        <main className="search-page">
            <div className="search-wrap">

                {/* Search bar */}
                <div className="search-bar">
                    <span className="search-bar__icon"><SearchIcon /></span>
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Search users or captions…"
                        autoFocus
                        autoComplete="off"
                        spellCheck={false}
                    />
                    {query && (
                        <button className="search-bar__clear" onClick={clearInput}>
                            <CloseIcon />
                        </button>
                    )}
                </div>

                {/* Loading */}
                {loading && (
                    <div className="search-loading">
                        <div className="search-spinner" />
                    </div>
                )}

                {/* History — show when no query */}
                {!query && history.length > 0 && (
                    <div className="search-history">
                        <div className="search-history__header">
                            <span>Recent</span>
                            <button onClick={clearAll}>Clear all</button>
                        </div>
                        {history.map(q => (
                            <div
                                key={q}
                                className="search-history__item"
                                onClick={() => handleHistoryClick(q)}
                            >
                                <span className="search-history__icon"><SearchIcon /></span>
                                <span>{q}</span>
                                <button
                                    className="search-history__remove"
                                    onClick={e => handleRemoveHistory(e, q)}
                                >
                                    <CloseIcon />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Results */}
                {searched && !loading && (
                    <>
                        {/* Tabs */}
                        <div className="search-tabs">
                            <button
                                className={`search-tab ${tab === 'users' ? 'is-active' : ''}`}
                                onClick={() => setTab('users')}
                            >
                                Users {users.length > 0 && <span>{users.length}</span>}
                            </button>
                            <button
                                className={`search-tab ${tab === 'posts' ? 'is-active' : ''}`}
                                onClick={() => setTab('posts')}
                            >
                                Posts {posts.length > 0 && <span>{posts.length}</span>}
                            </button>
                        </div>

                        {/* No results */}
                        {!hasResults && (
                            <div className="search-empty">
                                <p>No results for "<strong>{query}</strong>"</p>
                                <span>Try a different username or caption</span>
                            </div>
                        )}

                        {/* Users tab */}
                        {tab === 'users' && users.length > 0 && (
                            <div className="search-users">
                                {users.map(user => (
                                    <div
                                        key={user._id}
                                        className="search-user"
                                        onClick={() => navigate(`/profile/${user.username}`)}
                                    >
                                        <div className="search-user__avatar">
                                            {user.profileImage
                                                ? <img src={user.profileImage} alt={user.username} />
                                                : <span>{user.username?.charAt(0).toUpperCase()}</span>
                                            }
                                        </div>
                                        <div className="search-user__info">
                                            <strong>{user.username}</strong>
                                            {user.bio && <span>{user.bio}</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Posts tab */}
                        {tab === 'posts' && posts.length > 0 && (
                            <div className="search-posts">
                                {posts.map(post => (
                                    <div key={post._id} className="search-post">
                                        <div className="search-post__thumb">
                                            <img src={post.imgUrl} alt={post.caption} loading="lazy" />
                                        </div>
                                        <div className="search-post__info">
                                            <div className="search-post__user">
                                                <div className="search-post__avatar">
                                                    {post.user?.profileImage
                                                        ? <img src={post.user.profileImage} alt={post.user.username} />
                                                        : <span>{post.user?.username?.charAt(0).toUpperCase()}</span>
                                                    }
                                                </div>
                                                <strong>{post.user?.username}</strong>
                                            </div>
                                            {post.caption && <p>{post.caption}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

            </div>
        </main>
    )
}

export default Search