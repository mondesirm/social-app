import React, { createContext, useContext, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useToast } from '@chakra-ui/react'

import * as Auth from '../api/AuthRequests'
import * as Chat from '../api/ChatRequests'
import * as User from '../api/UserRequests'
import * as Upload from '../api/UploadRequest'

const AuthContext = createContext({
	currentUser: null,
	rooms: [],
	isAuthenticating: false,
	isUpdating: false,
	isFailing: false,
	login: () => Promise,
	register: () => Promise,
	logout: () => Promise,
	update: () => Promise
})

export const useAuth = () => useContext(AuthContext)

export default function AuthContextProvider({ children }) {
	const { currentUser, rooms, isAuthenticating, isUpdating, isFailing } = useSelector(state => state.authReducer)
	const toast = useToast({ isClosable: true, status: 'success', duration: 2000 })
	// const toastRef = useRef(toast)

	/* useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, user => {
			if (user) setUserData({ user: currentUser, isOnline: currentUser && true })
			else setUserData({ user: currentUser, isOnline: false })
		})

		return () => unsubscribe()
	}, [currentUser]) */

	useEffect(() => {
		if (isAuthenticating) {
			if (toast.isActive('auth')) toast.update('auth', { description: 'Authenticating...', status: 'info' })
			else toast({ id: 'auth', description: 'Authenticating...', status: 'info' })
		}

		if (isUpdating) {
			if (toast.isActive('auth')) toast.update('auth', { description: 'One: Updating...', status: 'info' })
			else toast({ id: 'auth', description: 'Two: Updating...', status: 'info' })
		}

		if (isFailing) {
			if (toast.isActive('auth')) toast.update('auth', { description: 'Invalid email or password.', status: 'error' })
			else toast({ id: 'auth', description: 'Invalid email or password.', status: 'error' })
		}
	}, [isAuthenticating, isUpdating, isFailing, toast])

	const login = (formData, navigate, location) => async dispatch => {
		dispatch({ type: 'AUTH_START' })

		try {
			const { data } = await Auth.login(formData)
			dispatch({ type: 'AUTH_SUCCESS', data: data })
			navigate(location.state?.from ?? '/timeline', { replace: true })

			if (toast.isActive('auth')) toast.update('auth', { description: `Logged in as @${data.username}.`, status: 'success' })
			else toast({ id: 'auth', description: `Logged in as @${data.username}.`, status: 'success' })
		} catch (err) { dispatch({ type: 'AUTH_FAIL' }) }
	}

	const register = (formData, navigate, location) => async dispatch => {
		dispatch({ type: 'AUTH_START' })

		try {
			const { data } = await Auth.register(formData)
			dispatch({ type: 'AUTH_SUCCESS', data: data })
			navigate(location.state?.from ?? '/timeline', { replace: true })

			if (toast.isActive('auth')) toast.update('auth', { description: `Registered as @${data.username}.`, status: 'success' })
			else toast({ id: 'auth', description: `Registered as @${data.username}.`, status: 'success' })
		} catch (err) { dispatch({ type: 'AUTH_FAIL' }) }
	}

	const logout = (formData, navigate, location) => async dispatch => {
		try {
			await Auth.logout(formData)
			dispatch({ type: 'LOG_OUT' })
			navigate(location.state?.from ?? '/login', { replace: true })

			if (toast.isActive('auth')) toast.update('auth', { description: 'Logged out.', status: 'success' })
			else toast({ id: 'auth', description: 'Logged out.', status: 'success' })
		} catch (err) { console.log(err) }
	}

	const one = id => async dispatch => {
		dispatch({ type: 'UPDATING_START' })
	
		try {
			const { data } = await User.one(id)
			dispatch({ type: 'UPDATING_SUCCESS', data: data })
		} catch (err) { dispatch({ type: 'UPDATING_FAIL' }) }
	}

	const update = (id, formData) => async dispatch => {
		dispatch({ type: 'UPDATING_START' })

		try {
			const { data } = await User.update(id, formData)
			dispatch({ type: 'UPDATING_SUCCESS', data: data })

			if (toast.isActive('auth')) toast.update('auth', { description: 'Profile updated.', status: 'success' })
			else toast({ id: 'auth', description: 'Profile updated.', status: 'success' })
		} catch (err) { dispatch({ type: 'UPDATING_FAIL' }) }
	}

	const follow = (id, formData) => async dispatch => {
		dispatch({ type: 'UPDATING_START' })
	
		try {
			await User.follow(id, formData)
			await Chat.create({ senderId: id, receiverId: formData._id })
			dispatch({ type: 'FOLLOW_USER', data: id })
		} catch (err) { dispatch({ type: 'UPDATING_FAIL' }) }
	}
	
	const unfollow = (id, formData) => async dispatch => {
		dispatch({ type: 'UPDATING_START' })
	
		try {
			await User.unfollow(id, formData)
			await Chat.remove({ senderId: id, receiverId: formData._id })
			dispatch({ type: 'UNFOLLOW_USER', data: id })
		} catch (err) { dispatch({ type: 'UPDATING_FAIL' }) }
	}

	const image = data => async dispatch => {
		dispatch({ type: 'UPLOADING_START' })

		try {
			await Upload.image(data)
			dispatch({ type: 'UPLOADING_SUCCESS' })

			if (toast.isActive('upload')) toast.update('upload', { description: 'Image uploaded.' })
		} catch (err) { dispatch({ type: 'UPLOADING_FAIL' }) }
	}

	const value = {
		currentUser,
		isAuthenticating,
		isUpdating,
		isFailing,
		login,
		register,
		logout,
		update
	}

	return (<AuthContext.Provider value={value}>{children}</AuthContext.Provider>)
}