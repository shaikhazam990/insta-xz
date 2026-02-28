import axios from "axios"

const api = axios.create({
    baseURL: "https://insta-xz.onrender.com",
    withCredentials: true
})

export async function followUser(username) {
    const response = await api.post(`/api/users/follow/${username}`)
    return response.data
}

export async function unfollowUser(username) {
    const response = await api.post(`/api/users/unfollow/${username}`)
    return response.data
}

export async function getUserProfile(username) {
    const response = await api.get(`/api/users/profile/${username}`)
    return response.data
}

export async function getFollowStatus(username) {
    const response = await api.get(`/api/users/follow-status/${username}`)
    return response.data
}