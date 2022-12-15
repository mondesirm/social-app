import axios from 'axios'

const API = axios.create({ baseURL: process.env.SERVER_HOST })

API.interceptors.request.use(req => {
	if (localStorage.getItem('profile')) {
		req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`
	}

	return req
})

export const all = () => API.get('/user')
export const one = id => API.get(`/user/${id}`)
export const update = (id, formData) => API.put(`/user/${id}`, formData)
export const friends = userId => API.get(`/user/${userId}/friends`)
export const follow = (id, formData) => API.put(`/user/${id}/follow`, formData)
export const unfollow = (id, formData) => API.put(`/user/${id}/unfollow`, formData)
export const getFriendRequest = id => API.get(`/user/${id}/friendRequest`)