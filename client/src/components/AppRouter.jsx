import { Navigate, Route, Routes, useLocation } from 'react-router-dom'

import Chat from '../pages/Chat'
import Home from '../pages/Home'
import Explore from '../pages/Explore'
import Login from '../pages/Auth/Login'
import NotFound from '../pages/NotFound'
import Timeline from '../pages/Timeline'
import Register from '../pages/Auth/Register'
import Profile from '../pages/Auth/Profile'
import { useAuth } from '../contexts/AuthContext'
import Room from '../pages/Room'

export default function AppRouter() {
	const { currentUser } = useAuth()
	const location = useLocation()

	return (
		<Routes>
			<Route exact path='/' element={currentUser ? <Home /> : <Navigate to={{ pathname: '/login', state: { from: '/' } }} />} />
			<Route exact path='/explore' element={currentUser ? <Explore /> : <Navigate to={{ pathname: '/login', state: { from: '/explore' } }} />} />

			<Route path='/room'>
				<Route path=':id' element={currentUser ? <Room /> : <Navigate to={{ pathname: '/login', state: { from: '/room/:id' } }} />} />
				<Route path='' element={currentUser ? <Room /> : <Navigate to={{ pathname: '/login', state: { from: '/room' } }} />} />
			</Route>

			<Route path='/chat'>
				<Route path=':id' element={currentUser ? <Chat /> : <Navigate to={{ pathname: '/login', state: { from: '/chat:id' } }} />} />
				<Route path='' element={currentUser ? <Chat /> : <Navigate to={{ pathname: '/login', state: { from: '/chat' } }} />} />
			</Route>

			<Route path='/profile/:id?' element={currentUser ? <Profile /> : <Navigate to={{ pathname: '/login', state: { from: '/profile/:id?' } }} />} />
			<Route exact path='/login' element={currentUser ? <Navigate to={location.state?.from ?? '/'} /> : <Login />} />
			<Route exact path='/register' element={currentUser ? <Navigate to={location.state?.from ?? '/'} /> : <Register />} />
			<Route exact path='/timeline' element={currentUser ? <Timeline /> : <Navigate to={{ pathname: '/login', state: { from: '/timeline' } }} />} />
			<Route path='*' element={<NotFound />} />
		</Routes>
	)
}