import axios from 'axios'

const API = axios.create({ baseURL: process.env.SERVER_HOST })

export const all = () => API.get('/room')
export const one = id => API.get(`/room/${id}`)
export const of = id => API.get(`/room/of/${id}`)
export const create = data => API.post('/chat/', data)
export const update = (id, data) => API.put(`/room/${id}`, data)
export const remove = (id, data) => API.delete(`/room/${id}`, data)