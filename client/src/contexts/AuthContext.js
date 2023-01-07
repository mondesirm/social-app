import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import { useSelector } from 'react-redux'
import { useToast } from '@chakra-ui/react'

import * as Auth from '../api/AuthRequests'
import * as User from '../api/UserRequests'

const AuthContext = createContext({
	currentUser: null,
	onlineUsers: [],
	isAuthenticating: false,
	isLoggingOut: false,
	isUpdating: false,
	isJoining: false,
	isLeaving: false,
	isFailing: false,
	toast: () => {},
	login: () => Promise,
	register: () => Promise,
	logout: () => Promise,
	one: () => Promise,
	update: () => Promise,
	remove: () => Promise,
	follow: () => Promise,
	unfollow: () => Promise,
	join: () => Promise,
	leave: () => Promise,
	upload: () => Promise
})

export const useAuth = () => useContext(AuthContext)

export default function AuthContextProvider({ children }) {
	const { currentUser, isAuthenticating, isUpdating, isJoining, isLeaving, isFailing } = useSelector(state => state.authReducer)
	const socket = useRef(io('ws://localhost:9000'))
	const [onlineUsers, setOnlineUsers] = useState([])
	const toast = useToast({ isClosable: true, status: 'success', duration: 2000 })

	useEffect(() => {
		if (currentUser) {
			// TODO socket.current = io(process.env.SOCKET_HOST.slice(0, -1))
			socket.current.emit('add-user', currentUser._id)
			// TODO redundancy: remove isOnline from User model
		}

		socket.current.on('get-users', users => setOnlineUsers(users))
	}, [currentUser])
	
	// Toasts
	useEffect(() => {
		if (isAuthenticating) {
			if (toast.isActive('auth')) toast.update('auth', { description: 'Authenticating...', status: 'info' })
			else toast({ id: 'auth', description: 'Authenticating...', status: 'info' })
		}

		if (isUpdating) {
			if (toast.isActive('auth')) toast.update('auth', { description: 'Updating...', status: 'info' })
			else toast({ id: 'auth', description: 'Updating...', status: 'info' })
		}

		if (isJoining) {
			if (toast.isActive('auth')) toast.update('auth', { description: 'Joining...', status: 'info' })
			else toast({ id: 'auth', description: 'Joining...', status: 'info' })
		}

		if (isLeaving) {
			if (toast.isActive('auth')) toast.update('auth', { description: 'Leaving...', status: 'info' })
			else toast({ id: 'auth', description: 'Leaving...', status: 'info' })
		}

		if (isFailing) {
			if (toast.isActive('auth')) toast.update('auth', { description: 'Action failed.', status: 'error' })
			else toast({ id: 'auth', description: 'Action failed.', status: 'error' })
		}
	}, [isAuthenticating, isUpdating, isJoining, isLeaving, isFailing, toast])

	const login = (inputs, navigate, location) => async dispatch => {
		dispatch({ type: 'AUTH_START' })

		try {
			const { data } = await Auth.login(inputs)
			dispatch({ type: 'AUTH_SUCCESS', data })
			navigate(location.state?.from ?? '/', { replace: true })

			if (toast.isActive('auth')) toast.update('auth', { description: `Logged in as @${data.username}.` })
			else toast({ id: 'auth', description: `Logged in as @${data.username}.` })
		} catch (err) { dispatch({ type: 'AUTH_FAIL' }) }
	}

	const register = (inputs, navigate, location) => async dispatch => {
		dispatch({ type: 'AUTH_START' })

		try {
			const { data } = await Auth.register(inputs)
			dispatch({ type: 'AUTH_SUCCESS', data })
			navigate(location.state?.from ?? '/', { replace: true })

			if (toast.isActive('auth')) toast.update('auth', { description: `Registered as @${data.username}.` })
			else toast({ id: 'auth', description: `Registered as @${data.username}.` })
		} catch (err) { dispatch({ type: 'AUTH_FAIL' }) }
	}

	const logout = (inputs, navigate) => async dispatch => {
		dispatch({ type: 'LOGOUT_START' })

		try {
			await Auth.logout(inputs)
			dispatch({ type: 'LOGOUT_SUCCESS' })
			socket.current.emit('logout')
			navigate('/login', { replace: true })

			if (toast.isActive('auth')) toast.update('auth', { description: 'Logged out.' })
			else toast({ id: 'auth', description: 'Logged out.' })
		} catch (err) { dispatch({ type: 'LOGOUT_FAIL' }) }
	}

	const one = id => async dispatch => {
		dispatch({ type: 'UPDATING_START' })
	
		try {
			const { data } = await User.one(id)
			dispatch({ type: 'UPDATING_SUCCESS', data })
		} catch (err) { dispatch({ type: 'UPDATING_FAIL' }) }
	}

	const update = (id, inputs) => async dispatch => {
		dispatch({ type: 'UPDATING_START' })

		try {
			const { data } = await User.update(id, inputs)
			dispatch({ type: 'UPDATING_SUCCESS', data })

			if (toast.isActive('auth')) toast.update('auth', { description: 'Profile updated.' })
			else toast({ id: 'auth', description: 'Profile updated.' })
		} catch (err) { dispatch({ type: 'UPDATING_FAIL' }) }
	}

	const remove = (id, inputs, navigate) => async dispatch => {
		dispatch({ type: 'UPDATING_START' })

		try {
			await User.remove(id, inputs)
			dispatch({ type: 'LOG_OUT' })

			if (toast.isActive('auth')) toast.update('auth', { description: 'Account removed.' })
			else toast({ id: 'auth', description: 'Account removed.' })

			logout(inputs, navigate)
		} catch (err) { dispatch({ type: 'UPDATING_FAIL' }) }
	}

	const follow = user => async dispatch => {
		dispatch({ type: 'UPDATING_START' })
	
		try {
			const { data } = await User.follow(currentUser._id, user)
			dispatch({ type: 'UPDATING_SUCCESS', data })

			if (onlineUsers.some(u => u._id === user._id)) socket.current.emit('add-user', user._id, true)

			if (toast.isActive('auth')) toast.update('auth', { description: `Followed ${user.firstName}.` })
			else toast({ id: 'auth', description: `Followed ${user.firstName}.` })
		} catch (err) { dispatch({ type: 'UPDATING_FAIL' }) }
	}

	const unfollow = user => async dispatch => {
		dispatch({ type: 'UPDATING_START' })

		try {
			const { data } = await User.unfollow(currentUser._id, user)
			dispatch({ type: 'UPDATING_SUCCESS', data })

			if (onlineUsers.some(u => u._id === user._id)) socket.current.emit('add-user', user._id, true)

			if (toast.isActive('auth')) toast.update('auth', { description: `Unfollowed ${user.firstName}.` })
			else toast({ id: 'auth', description: `Unfollowed ${user.firstName}.` })
		} catch (err) { dispatch({ type: 'UPDATING_FAIL' }) }
	}

	const join = (room, navigate) => async dispatch => {
		dispatch({ type: 'JOINING_START' })

		try {
			const { data } = await User.join(currentUser?._id, room)
			dispatch({ type: 'JOINING_SUCCESS', data })
			navigate(`/room/${room._id}`)

			if (toast.isActive('auth')) toast.update('auth', { description: `Joined room ${room.name}.` })
			else toast({ id: 'auth', description: `Joined room ${room.name}.` })
		} catch (err) { dispatch({ type: 'JOINING_FAIL' }) }
	}

	const leave = (room, navigate, location) => async dispatch => {
		dispatch({ type: 'LEAVING_START' })

		try {
			const { data } = await User.leave(currentUser?._id, room)
			dispatch({ type: 'LEAVING_SUCCESS', data })
			if (location.pathname.startsWith('/room/')) navigate(location.state?.from ?? '/', { replace: true })

			if (toast.isActive('auth')) toast.update('auth', { description: `Left room ${room.name}.` })
			else toast({ id: 'auth', description: `Left room ${room.name}.` })
		} catch (err) { dispatch({ type: 'LEAVING_FAIL' }) }
	}

	const value = {
		currentUser,
		onlineUsers,
		isAuthenticating,
		isUpdating,
		isJoining,
		isLeaving,
		isFailing,
		toast,
		login,
		register,
		logout,
		one,
		update,
		remove,
		follow,
		unfollow,
		join,
		leave
	}

	return (<AuthContext.Provider value={value}>{children}</AuthContext.Provider>)
}