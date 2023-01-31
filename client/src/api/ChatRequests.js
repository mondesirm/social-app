import axios from 'axios'

const API = axios.create({ baseURL: process.env.SERVER_HOST })

export const bot = data => API.post('/chat/bot', data)
export const create = data => API.post('/chat/', data)
export const one = id => API.get(`/chat/${id}`)
export const of = id => API.get(`/chat/of/${id}`)
export const remove = (id, data) => API.delete(`/chat/${id}`, data)
export const find = (self, other) => API.get(`/chat/find/${self}/${other}`)