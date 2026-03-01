import React, { useEffect, useState } from 'react'
import { useAuth } from '../hook/useAuth'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../style/profile.css'

const api = axios.create({
    baseURL: "https://insta-xz.onrender.com",
    withCredentials: true
})

const GridIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
    </svg>
)

const Profile = () => {
    const { user, setUser } = useAuth()
    const navigate = useNavigate()

    const [posts, setPosts] = useState([])
    const [followersCount, setFollowersCount] = useState(0)
    const [followingCount, setFollowingCount] = useState(0)
    const [pageLoading, setPageLoading] = useState(true)

    const [editOpen, setEditOpen] = useState(false)
    const [editForm, setEditForm] = useState({ username: '', bio: '' })
    const [editLoading, setEditLoading] = useState(false)
    const [editError, setEditError] = useState('')

    useEffect(() => {
        if (!user) {
            navigate('/login')
            return
        }

        const fetchData = async () => {
            setPageLoading(true)
            try {
                const [postsRes, followRes] = await Promise.all([
                    api.get('/api/posts/my-posts'),
                    api.get(`/api/users/follow-counts/${user.username}`)
                ])
                setPosts(postsRes.data.posts || [])
                setFollowersCount(followRes.data.followersCount || 0)
                setFollowingCount(followRes.data.followingCount || 0)
            } catch (err) {
                console.error('profile fetch failed', err)
            } finally {
                setPageLoading(false)
            }
        }

        fetchData()
    }, [user])

    const openEdit = () => {
        setEditForm({ username: user?.username || '', bio: user?.bio || '' })
        setEditError('')
        setEditOpen(true)
    }

    const handleEditSave = async () => {
        if (!editForm.username.trim()) {
            setEditError('Username cannot be empty')
            return
        }
        setEditLoading(true)
        try {
            const res = await api.patch('/api/users/update', editForm)
            setUser(res.data.user)
            setEditOpen(false)
        } catch (err) {
            setEditError(err.response?.data?.message || 'Update failed')
        } finally {
            setEditLoading(false)
        }
    }

    const avatarInitial = user?.username?.charAt(0).toUpperCase() || '?'

    if (pageLoading) {
        return (
            <main className="profile-page">
                <div className="profile-loading">
                    <div className="profile-spinner" />
                </div>
            </main>
        )
    }

    return (
        <main className="profile-page">
            <div className="profile-wrap">

                {/* Header */}
                <section className="profile-header">

                    <div className="profile-avatar">
                        {user?.profileImage
                            ? <img src={user.profileImage} alt={user.username} />
                            : <span>{avatarInitial}</span>
                        }
                    </div>

                    <div className="profile-meta">

                        <div className="profile-name-row">
                            <h2>{user?.username}</h2>
                            <button className="p-btn p-btn--edit" onClick={openEdit}>
                                Edit Profile
                            </button>
                        </div>

                        <div className="profile-stats">
                            <div className="profile-stat">
                                <strong>{posts.length}</strong>
                                <span>posts</span>
                            </div>
                            <div className="profile-stat">
                                <strong>{followersCount}</strong>
                                <span>followers</span>
                            </div>
                            <div className="profile-stat">
                                <strong>{followingCount}</strong>
                                <span>following</span>
                            </div>
                        </div>

                        {user?.bio && <p className="profile-bio">{user.bio}</p>}

                        <p className="profile-email">{user?.email}</p>

                    </div>
                </section>

                {/* Posts label */}
                <div className="profile-rule">
                    <GridIcon />
                    <span>POSTS</span>
                </div>

                {/* Grid */}
                {posts.length === 0 ? (
                    <div className="profile-empty">
                        <p>No posts yet.</p>
                        <button className="p-btn p-btn--primary" onClick={() => navigate('/create-post')}>
                            Create your first post
                        </button>
                    </div>
                ) : (
                    <div className="profile-grid">
                        {posts.map(post => (
                            <div key={post._id} className="profile-grid__item">
                                <img src={post.imgUrl} alt={post.caption || 'post'} loading="lazy" />
                                <div className="profile-grid__overlay">
                                    <span>❤️ {post.likeCount ?? 0}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>

            {/* Edit Modal */}
            {editOpen && (
                <div className="modal-backdrop" onClick={() => setEditOpen(false)}>
                    <div className="modal-card" onClick={e => e.stopPropagation()}>

                        <h3 className="modal-title">Edit Profile</h3>

                        <div className="modal-field">
                            <label>Username</label>
                            <input
                                type="text"
                                value={editForm.username}
                                onChange={e => setEditForm(f => ({ ...f, username: e.target.value }))}
                                placeholder="Username"
                            />
                        </div>

                        <div className="modal-field">
                            <label>Bio</label>
                            <textarea
                                value={editForm.bio}
                                onChange={e => setEditForm(f => ({ ...f, bio: e.target.value }))}
                                placeholder="Write something about yourself…"
                                rows={3}
                                maxLength={150}
                            />
                            <span className="modal-char">{editForm.bio.length} / 160</span>
                        </div>

                        {editError && <p className="modal-error">{editError}</p>}

                        <div className="modal-actions">
                            <button className="p-btn p-btn--ghost" onClick={() => setEditOpen(false)}>
                                Cancel
                            </button>
                            <button
                                className="p-btn p-btn--primary"
                                onClick={handleEditSave}
                                disabled={editLoading}
                            >
                                {editLoading ? 'Saving…' : 'Save'}
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </main>
    )
}

export default Profile