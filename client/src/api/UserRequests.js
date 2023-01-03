import axios from 'axios'

const API = axios.create({ baseURL: process.env.SERVER_HOST })


// TODO useAuth
API.interceptors.request.use(req => {
	if (localStorage.getItem('store')) {
		const token = JSON.parse(localStorage.getItem('store'))?.authReducer?.currentUser?.token
		req.headers.authorization = `Bearer ${token}`
	}

	return req
})

export const all = () => API.get('/user')
export const one = id => API.get(`/user/${id}`)
export const update = (id, formData) => API.put(`/user/${id}`, formData)
export const remove = (id, formData) => API.delete(`/user/${id}`, formData)
export const friends = userId => API.get(`/user/${userId}/friends`)
export const follow = (id, user) => API.put(`/user/${id}/follow`, user)
export const unfollow = (id, user) => API.put(`/user/${id}/unfollow`, user)
export const join = (id, room) => API.put(`/user/${id}/join`, room)
export const leave = (id, room) => API.put(`/user/${id}/leave`, room)
export const getFriendRequest = id => API.get(`/user/${id}/friendRequest`)