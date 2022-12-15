import { Navigate, Route, Routes, useLocation } from 'react-router-dom'

import Home from '../pages/Home'
import Chat from '../pages/Chat/Chat'
import Login from '../pages/Auth/Login'
import NotFound from '../pages/NotFound'
import Timeline from '../pages/Timeline'
import Register from '../pages/Auth/Register'
import Profile from '../pages/Profile/Profile'
import { useAuth } from '../contexts/AuthContext'

export default function AppRouter() {
	const { currentUser } = useAuth()
	const location = useLocation()

	return (
		<Routes>
			<Route exact path='/' element={<Home />} />
			<Route exact path='/chat' element={currentUser ? <Chat /> : <Navigate to={{ pathname: '/login', state: { from: '/chat' } }} />} />
			<Route exact path='/profile' element={currentUser ? <Profile /> : <Navigate to={{ pathname: '/login', state: { from: '/profile' } }} />} />
			<Route exact path='/profile/:id' element={currentUser ? <Profile /> : <Navigate to={{ pathname: '/login', state: { from: '/profile/:id' } }} />} />
			<Route exact path='/login' element={currentUser ? <Navigate to={location.state?.from ?? '/'} /> : <Login />} />
			<Route exact path='/register' element={currentUser ? <Navigate to={location.state?.from ?? '/'} /> : <Register />} />
			<Route exact path='/timeline' element={currentUser ? <Timeline /> : <Navigate to={{ pathname: '/login', state: { from: '/timeline' } }} />} />
			<Route path='*' element={<NotFound />} />
		</Routes>
	)
}