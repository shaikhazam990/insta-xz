import { getFeed, createPost, likePost, unLikePost } from "../services/post.api"
import { useContext, useEffect } from "react"
import { PostContext } from "../post.context"

export const usePost = () => {

    const context = useContext(PostContext)

    const { loading, setLoading, post, setPost, feed, setFeed } = context

    const handleGetFeed = async () => {
        setLoading(true)
        const data = await getFeed()
        setFeed(data.posts.reverse())
        setLoading(false)
    }

    const handleCreatePost = async (imageFile, caption) => {
        setLoading(true)
        const data = await createPost(imageFile, caption)
        setFeed([ data.post, ...feed ])
        setLoading(false)
    }

   const handleLike = async (postId) => {
    // optimistically update UI immediately
    setFeed(prev => prev.map(p =>
        p._id === postId
            ? { ...p, isLiked: true, likeCount: (p.likeCount || 0) + 1 }
            : p
    ))
    try {
        await likePost(postId)
    } catch {
        // revert on failure
        setFeed(prev => prev.map(p =>
            p._id === postId
                ? { ...p, isLiked: false, likeCount: (p.likeCount || 0) - 1 }
                : p
        ))
    }
}

const handleUnLike = async (postId) => {
    setFeed(prev => prev.map(p =>
        p._id === postId
            ? { ...p, isLiked: false, likeCount: Math.max((p.likeCount || 0) - 1, 0) }
            : p
    ))
    try {
        await unLikePost(postId)
    } catch {
        setFeed(prev => prev.map(p =>
            p._id === postId
                ? { ...p, isLiked: true, likeCount: (p.likeCount || 0) + 1 }
                : p
        ))
    }
}

    useEffect(() => {
        handleGetFeed()
    }, [])

    return { loading, feed, post, handleGetFeed, handleCreatePost, handleLike, handleUnLike }

}