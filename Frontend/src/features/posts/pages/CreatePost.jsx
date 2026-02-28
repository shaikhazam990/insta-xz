import React, { useState, useRef } from 'react'
import { usePost } from '../hook/usePost'
import { useNavigate } from 'react-router'
import "../style/createPost.css"

const CreatePost = () => {

    const [caption, setCaption] = useState("")
    const [preview, setPreview] = useState(null)
    const postImageInputFieldRef = useRef(null)

    const navigate = useNavigate()
    const { loading, handleCreatePost } = usePost()

    function handleFileChange(e) {
        const file = e.target.files[0]
        if (file) {
            setPreview(URL.createObjectURL(file))
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()
        const file = postImageInputFieldRef.current.files[0]
        await handleCreatePost(file, caption)
        navigate('/feed')
    }

    if (loading) {
        return (
            <main className='create-post-page'>
                <div className="form-container">
                    <div className="loading-card">
                        <div className="spinner" />
                        <h1>Sharing your moment…</h1>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className='create-post-page'>
            <div className="form-container">

                <h1>New Post</h1>
                <p className="subtitle">Share something worth remembering.</p>

                <form onSubmit={handleSubmit}>

                    <label className='post-image-label' htmlFor="postImage">
                        {preview ? (
                            <img className="preview" src={preview} alt="preview" />
                        ) : (
                            <>
                                <span>Click to select a photo</span>
                                <span className="upload-hint">JPG, PNG, WEBP</span>
                            </>
                        )}
                    </label>

                    <input
                        ref={postImageInputFieldRef}
                        hidden
                        type="file"
                        accept="image/*"
                        name='postImage'
                        id='postImage'
                        onChange={handleFileChange}
                    />

                    <input
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        type="text"
                        name='caption'
                        id='caption'
                        placeholder='Write a caption…'
                        maxLength={200}
                    />
                    <div className="caption-meta">{caption.length} / 200</div>

                    <button className='button primary-button' type="submit">
                        Share Post
                    </button>

                </form>
            </div>
        </main>
    )
}

export default CreatePost