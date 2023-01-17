import { createContext, useContext, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { useSelector } from 'react-redux'
import { useToast } from '@chakra-ui/react'

import * as Auth from '../api/AuthRequests'
import * as Chat from '../api/ChatRequests'
import * as User from '../api/UserRequests'
import * as Room from '../api/RoomRequests'
import * as Upload from '../api/UploadRequest'
import * as Message from '../api/MessageRequests'

const DatabaseContext = createContext({
	db: {},
	isFetching: false,
	isCreating: false,
	isUpdating: false,
	isDeleting: false,
	isUploading: false,
	isFailing: false,
	toast: null,
	all: () => Promise,
	of: () => Promise,
	one: () => Promise,
	create: () => Promise,
	update: () => Promise,
	remove: () => Promise,
	upload: () => Promise
})

export const useDatabase = () => useContext(DatabaseContext)

export default function DatabaseContextProvider({ children }) {
	const { onlineUsers } = useSelector(state => state.authReducer)
	const { db, isFetching, isCreating, isUpdating, isDeleting, isUploading, isFailing } = useSelector(state => state.databaseReducer)
	const socket = useRef(null)
	const models = { Auth, Chat, User, Room, Upload, Message }
	const toast = useToast({ isClosable: true, status: 'success', duration: 2000 })

	// TODO differentiate same name keys from different contexts
	useEffect(() => {
		if (isFetching) {
			if (toast.isActive('database')) toast.update('database', { description: 'Fetching...', status: 'info' })
			else toast({ id: 'database', description: 'Fetching...', status: 'info' })
		}

		if (isUpdating) {
			if (toast.isActive('database')) toast.update('database', { description: 'Updating...', status: 'info' })
			else toast({ id: 'database', description: 'Updating...', status: 'info' })
		}

		if (isDeleting) {
			if (toast.isActive('database')) toast.update('database', { description: 'Deleting...', status: 'info' })
			else toast({ id: 'database', description: 'Deleting...', status: 'info' })
		}

		if (isUploading) {
			if (toast.isActive('database')) toast.update('database', { description: 'Uploading...', status: 'info' })
			else toast({ id: 'database', description: 'Uploading...', status: 'info' })
		}

		if (isFailing) {
			if (toast.isActive('database')) toast.update('database', { description: 'Error fetching data.', status: 'error' })
			else toast({ id: 'database', description: 'Error fetching data.', status: 'error' })
		}
	}, [isFetching, isCreating, isUpdating, isDeleting, isUploading, isFailing, toast])

	const all = model => async dispatch => {
		dispatch({ type: 'FETCHING_START' })

		try {
			const { data } = await models[model].all()
			dispatch({ type: 'FETCHING_SUCCESS', data, model })
		} catch (err) { console.log(err); dispatch({ type: 'FETCHING_FAIL' }) }
	}

	const of = (model, id) => async dispatch => {
		dispatch({ type: 'FETCHING_START' })

		try {
			const { data } = await models[model].of(id)
			dispatch({ type: 'FETCHING_SUCCESS', data, model })
		} catch (err) { dispatch({ type: 'FETCHING_FAIL' }) }
	}

	const one = (model, id) => async dispatch => {
		dispatch({ type: 'FETCHING_START' })

		try {
			const { data } = await models[model].one(id)
			dispatch({ type: 'FETCHING_SUCCESS', data, model })
		} catch (err) { dispatch({ type: 'FETCHING_FAIL' }) }
	}

	const create = (model, formData) => async dispatch => {
		dispatch({ type: 'CREATING_START' })

		if (model !== 'Message') {
			if (toast.isActive('database')) toast.update('database', { description: 'Creating...', status: 'info' })
			else toast({ id: 'database', description: 'Creating...', status: 'info' })
		}

		try {
			const { data } = await models[model].create(formData)
			dispatch({ type: 'CREATING_SUCCESS', data, model })

			if (['Chat', 'Message'].includes(model)) {
				socket.current = io(process.env.REACT_APP_SOCKET_HOST)

				if (model === 'Chat') {
					socket.current.emit('add-user', formData.self, true)
					if (onlineUsers?.find(u => u._id === formData.other)) socket.current.emit('add-user', formData.other, true)
				}

				if (model === 'Message') {
					socket.current.emit('add-user', formData.sender.id, true)
					if (onlineUsers?.find(u => u._id === formData.receiver)) socket.current.emit('add-user', formData.receiver, true)
				}
			}

			if (model !== 'Message') {
				if (toast.isActive('database')) toast.update('database', { description: model + ' created.' })
				else toast({ id: 'database', description: model + ' created.' })
			}
		} catch (err) { console.log(err.message); dispatch({ type: 'CREATING_FAIL' }) }
	}

	const update = (model, id, formData) => async dispatch => {
		dispatch({ type: 'UPDATING_START' })

		try {
			const { data } = await models[model].update(id, formData)
			dispatch({ type: 'UPDATING_SUCCESS', data, model })

			if (toast.isActive('database')) toast.update('database', { description: model + ' updated.' })
			else toast({ id: 'database', description: model + ' updated.' })
		} catch (err) { dispatch({ type: 'UPDATING_FAIL' }) }
	}

	const remove = (model, id, formData) => async dispatch => {
		dispatch({ type: 'DELETING_START' })

		try {
			const { data } = await models[model].remove(id, formData)
			dispatch({ type: 'DELETING_SUCCESS', data, model })

			if (toast.isActive('database')) toast.update('database', { description: model + ' deleted.' })
			else toast({ id: 'database', description: model + ' deleted.' })
		} catch (err) { dispatch({ type: 'DELETING_FAIL' }) }
	}

	const upload = data => async dispatch => {
		dispatch({ type: 'UPLOADING_START' })

		try {
			await Upload.image(data)
			dispatch({ type: 'UPLOADING_SUCCESS' })

			if (toast.isActive('upload')) toast.update('upload', { description: 'Image uploaded.' })
			else toast({ id: 'upload', description: 'Image uploaded.' })
		} catch (err) { dispatch({ type: 'UPLOADING_FAIL' }) }
	}

	const value = {
		db,
		isFetching,
		isCreating,
		isUpdating,
		isDeleting,
		isUploading,
		isFailing,
		all,
		of,
		one,
		create,
		update,
		remove,
		upload
	}

	return (<DatabaseContext.Provider value={value}>{children}</DatabaseContext.Provider>)
}