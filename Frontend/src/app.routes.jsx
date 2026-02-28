import { createBrowserRouter } from 'react-router-dom'

import Register from './features/auth/pages/Register'
import Home from './features/auth/pages/Home'
import Feed from './features/posts/pages/feed'
import Login from './features/auth/pages/Login'
import Profile from './features/auth/pages/Profile'
import CreatePost from './features/posts/pages/CreatePost'
import Explore from './features/posts/pages/Explore'
import Notifications from './features/auth/pages/Notification'
import Search from './features/auth/pages/Search'

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/feed",
        element: <Feed />
    },
    {
        path: "/create-post",
        element: <CreatePost />
    },
    {
    path: "/profile",
    element: <Profile />
    },
    {
        path: "/profile/:id",
        element: <Profile />
    },
    {
        path: "/explore",
        element: <Explore />
    },
    {
        path: "/notifs",
        element: <Notifications />
    },
    {
        path: "/search",
        element: <Search />
    }


    
])




































