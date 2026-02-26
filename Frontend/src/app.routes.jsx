import { createBrowserRouter } from 'react-router-dom'

import Register from './features/auth/pages/Register'
import Home from './features/auth/pages/Home'
import Feed from './features/posts/pages/feed'
import Login from './features/auth/pages/Login'
import Profile from './features/auth/pages/Profile'


export const router = createBrowserRouter([

    {
        path:"/login",
        element: <Login/>
    },
    {
        path:"/register",
        element:<Register/>
    },
    {
        path:"/feed",
        element:<Feed/>
    },
    {
        path:"/",
        element:<Home/>
    },
    {
        path:'/profile',
        element:<Profile/>
    }
])