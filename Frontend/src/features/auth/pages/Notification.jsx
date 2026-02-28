import React, { useEffect, useState } from 'react'
import axios from 'axios'
import '../style/notification.css'

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
})

const HeartIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
)

const FollowIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
    </svg>
)

const timeAgo = (date) => {
    const diff = Math.floor((Date.now() - new Date(date)) / 1000)
    if (diff < 60) return `${diff}s`
    if (diff < 3600) return `${Math.floor(diff / 60)}m`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`
    return `${Math.floor(diff / 86400)}d`
}

const Notifications = () => {

    const [notifications, setNotifications] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchNotifications = async () => {
            setLoading(true)
            try {
                const res = await api.get('/api/notifications')
                setNotifications(res.data.notifications || [])
            } catch (err) {
                console.error('notifications fetch failed', err)
            } finally {
                setLoading(false)
            }
        }
        fetchNotifications()
    }, [])

    if (loading) {
        return (
            <main className="notif-page">
                <div className="notif-loading">
                    <div className="notif-spinner" />
                </div>
            </main>
        )
    }

    return (
        <main className="notif-page">
            <div className="notif-wrap">

                <div className="notif-header">
                    <h1>Notifications</h1>
                    {notifications.length > 0 && (
                        <span className="notif-count">{notifications.length}</span>
                    )}
                </div>

                {notifications.length === 0 ? (
                    <div className="notif-empty">
                        <div className="notif-empty__icon">🔔</div>
                        <p>No notifications yet</p>
                        <span>When someone likes or follows you, it'll show up here.</span>
                    </div>
                ) : (
                    <div className="notif-list">
                        {notifications.map(notif => (
                            <div
                                key={notif._id}
                                className={`notif-item ${!notif.read ? 'notif-item--unread' : ''}`}
                            >
                                {/* Icon */}
                                <div className={`notif-item__icon ${notif.type === 'like' ? 'is-like' : 'is-follow'}`}>
                                    {notif.type === 'like' ? <HeartIcon /> : <FollowIcon />}
                                </div>

                                {/* Text */}
                                <div className="notif-item__body">
                                    <p>
                                        <strong>{notif.from}</strong>
                                        {notif.type === 'like'
                                            ? ' liked your post'
                                            : ' started following you'
                                        }
                                    </p>
                                    <span className="notif-item__time">{timeAgo(notif.createdAt)}</span>
                                </div>

                                {/* Post thumbnail for likes */}
                                {notif.type === 'like' && notif.post?.imgUrl && (
                                    <div className="notif-item__thumb">
                                        <img src={notif.post.imgUrl} alt="post" />
                                    </div>
                                )}

                                {/* Unread dot */}
                                {!notif.read && <div className="notif-item__dot" />}
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </main>
    )
}

export default Notifications