import React, { useEffect, useState } from 'react'
import axios from 'axios'
import '../style/Explore.css'


const api = axios.create({
    baseURL: "https://insta-xz.onrender.com",
    withCredentials: true
})

const HeartIcon = ({ filled }) => (
    <svg viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" width="20" height="20">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
)

const CloseIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
)

const Explore = () => {

    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [selected, setSelected] = useState(null)   // post modal

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true)
            try {
                const res = await api.get('/api/posts/feed')
                // shuffle karo — trending/random feel
                const shuffled = (res.data.posts || []).sort(() => Math.random() - 0.5)
                setPosts(shuffled)
            } catch (err) {
                console.error('explore fetch failed', err)
            } finally {
                setLoading(false)
            }
        }
        fetchPosts()
    }, [])

    // close modal on ESC
    useEffect(() => {
        const handleKey = (e) => { if (e.key === 'Escape') setSelected(null) }
        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [])

    if (loading) {
        return (
            <main className="explore-page">
                <div className="explore-loading">
                    <div className="explore-spinner" />
                </div>
            </main>
        )
    }

    return (
        <main className="explore-page">

            {/* Header */}
            <div className="explore-header">
                <h1>Explore</h1>
                <p>{posts.length} posts</p>
            </div>

            {/* Grid */}
            {posts.length === 0 ? (
                <div className="explore-empty">
                    <p>No posts to explore yet.</p>
                </div>
            ) : (
                <div className="explore-grid">
                    {posts.map((post, i) => (
                        <div
                            key={post._id}
                            className={`explore-grid__item ${i % 7 === 0 ? 'explore-grid__item--large' : ''}`}
                            onClick={() => setSelected(post)}
                        >
                            <img src={post.imgUrl} alt={post.caption || 'post'} loading="lazy" />
                            <div className="explore-grid__overlay">
                                <span><HeartIcon filled /> {post.likeCount ?? 0}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Post Modal */}
            {selected && (
                <div className="explore-modal-backdrop" onClick={() => setSelected(null)}>
                    <div className="explore-modal" onClick={e => e.stopPropagation()}>

                        {/* Close */}
                        <button className="explore-modal__close" onClick={() => setSelected(null)}>
                            <CloseIcon />
                        </button>

                        {/* Image */}
                        <div className="explore-modal__img">
                            <img src={selected.imgUrl} alt={selected.caption || 'post'} />
                        </div>

                        {/* Info */}
                        <div className="explore-modal__info">

                            {/* User */}
                            <div className="explore-modal__user">
                                <div className="explore-modal__avatar">
                                    {selected.user?.profileImage
                                        ? <img src={selected.user.profileImage} alt={selected.user.username} />
                                        : <span>{selected.user?.username?.charAt(0).toUpperCase()}</span>
                                    }
                                </div>
                                <span className="explore-modal__username">
                                    {selected.user?.username}
                                </span>
                            </div>

                            {/* Caption */}
                            {selected.caption && (
                                <p className="explore-modal__caption">{selected.caption}</p>
                            )}

                            {/* Likes */}
                            <div className="explore-modal__likes">
                                <HeartIcon filled={selected.isLiked} />
                                <span>{selected.likeCount ?? 0} likes</span>
                            </div>

                            {/* Date */}
                            {selected.createdAt && (
                                <time className="explore-modal__time">
                                    {new Date(selected.createdAt).toLocaleDateString('en-US', {
                                        month: 'long', day: 'numeric', year: 'numeric'
                                    })}
                                </time>
                            )}

                        </div>
                    </div>
                </div>
            )}

        </main>
    )
}

export default Explore