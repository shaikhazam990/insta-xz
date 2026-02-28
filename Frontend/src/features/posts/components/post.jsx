import React, { useState, useEffect, useRef } from 'react'
import '../style/feed.css'

const HeartIcon = ({ filled }) => (
    <svg viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
)

const CommentIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
)

const ShareIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
)

const BookmarkIcon = ({ filled }) => (
    <svg viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
)

const MoreIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
        <circle cx="5" cy="12" r="2" />
        <circle cx="12" cy="12" r="2" />
        <circle cx="19" cy="12" r="2" />
    </svg>
)

const Post = ({ user, post, handleLike, handleUnLike }) => {
    const [saved, setSaved] = useState(false)
    const [animating, setAnimating] = useState(false)

    const [localLiked, setLocalLiked] = useState(post?.isLiked || false)
    const [localCount, setLocalCount] = useState(post?.likeCount || 0)
    const isProcessing = useRef(false)

    // keep in sync if parent feed refreshes
    useEffect(() => {
        setLocalLiked(post?.isLiked || false)
        setLocalCount(post?.likeCount || 0)
    }, [post?.isLiked, post?.likeCount])

    const handleLikeClick = () => {
        if (isProcessing.current) return   // block rapid clicks

        isProcessing.current = true
        setTimeout(() => { isProcessing.current = false }, 500)

        setAnimating(true)
        setTimeout(() => setAnimating(false), 350)

        if (localLiked) {
            setLocalLiked(false)
            setLocalCount(c => Math.max(c - 1, 0))
            handleUnLike(post._id)
        } else {
            setLocalLiked(true)
            setLocalCount(c => c + 1)
            handleLike(post._id)
        }
    }

    const avatarInitial = user?.username?.charAt(0).toUpperCase() || '?'

    return (
        <article className="post-card">
            {/* Header */}
            <header className="post-card__header">
                <div className="post-card__user">
                    <div className="post-card__avatar">
                        {user?.profileImage
                            ? <img src={user.profileImage} alt={user.username} />
                            : <span>{avatarInitial}</span>
                        }
                    </div>
                    <div className="post-card__user-info">
                        <span className="post-card__username">{user?.username}</span>
                        {post?.location && (
                            <span className="post-card__location">{post.location}</span>
                        )}
                    </div>
                </div>
                <button className="post-card__more" aria-label="More options">
                    <MoreIcon />
                </button>
            </header>

            {/* Image */}
            <div className="post-card__media">
                <img src={post?.imgUrl} alt={post?.caption || 'Post image'} loading="lazy" />
            </div>

            {/* Actions */}
            <div className="post-card__actions">
                <div className="post-card__actions-left">
                    <button
                        className={`post-card__action-btn${localLiked ? ' is-liked' : ''}${animating ? ' is-animating' : ''}`}
                        onClick={handleLikeClick}
                        aria-label={localLiked ? 'Unlike' : 'Like'}
                    >
                        <HeartIcon filled={localLiked} />
                    </button>
                    <button className="post-card__action-btn" aria-label="Comment">
                        <CommentIcon />
                    </button>
                    <button className="post-card__action-btn" aria-label="Share">
                        <ShareIcon />
                    </button>
                </div>
                <button
                    className={`post-card__action-btn post-card__bookmark${saved ? ' is-saved' : ''}`}
                    onClick={() => setSaved(s => !s)}
                    aria-label={saved ? 'Unsave' : 'Save'}
                >
                    <BookmarkIcon filled={saved} />
                </button>
            </div>

            {/* Likes */}
            {localCount > 0 && (
                <p className="post-card__likes">
                    {localCount.toLocaleString()} {localCount === 1 ? 'like' : 'likes'}
                </p>
            )}

            {/* Caption */}
            {post?.caption && (
                <div className="post-card__caption">
                    <span className="post-card__caption-user">{user?.username}</span>
                    <span className="post-card__caption-text">{post.caption}</span>
                </div>
            )}

            {/* Comments */}
            {post?.commentCount > 0 && (
                <button className="post-card__comments-link">
                    View all {post.commentCount} comments
                </button>
            )}

            {/* Timestamp */}
            {post?.createdAt && (
                <time className="post-card__time">
                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                        month: 'long', day: 'numeric'
                    })}
                </time>
            )}
        </article>
    )
}

export default Post