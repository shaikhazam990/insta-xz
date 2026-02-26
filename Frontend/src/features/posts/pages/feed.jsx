import React, { useEffect } from 'react'
import '../style/feed.css'
import Post from '../components/post'
import { usePost } from '../hook/usePost'
import Nav from '../../shared/components/Nav'

const FeedSkeleton = () => (
    <div className="skeleton-card">
        <div className="skeleton-card__header">
            <div className="skeleton skeleton--circle" />
            <div className="skeleton-card__lines">
                <div className="skeleton skeleton--line skeleton--line-short" />
                <div className="skeleton skeleton--line skeleton--line-xshort" />
            </div>
        </div>
        <div className="skeleton skeleton--image" />
        <div className="skeleton-card__footer">
            <div className="skeleton skeleton--line skeleton--line-short" />
            <div className="skeleton skeleton--line skeleton--line-long" />
        </div>
    </div>
)

const Feed = () => {
    const { feed, handleGetFeed, loading, handleLike, handleUnLike } = usePost()

    useEffect(() => {
        handleGetFeed()
    }, [])

    return (
        <main className="feed-page">
            <Nav />
            <div className="feed-wrapper">
                <div className="feed-list">
                    {loading || !feed
                        ? Array.from({ length: 3 }).map((_, i) => <FeedSkeleton key={i} />)
                        : feed.length === 0
                            ? (
                                <div className="feed-empty">
                                    <span className="feed-empty__icon">📷</span>
                                    <h2>No posts yet</h2>
                                    <p>Follow some people to see their photos here.</p>
                                </div>
                            )
                            : feed.map(post => (
                                <Post
                                    key={post._id}
                                    user={post.user}
                                    post={post}
                                    handleLike={handleLike}
                                    handleUnLike={handleUnLike}
                                />
                            ))
                    }
                </div>
            </div>
        </main>
    )
}

export default Feed