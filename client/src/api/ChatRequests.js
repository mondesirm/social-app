import axios from 'axios'

const API = axios.create({ baseURL: process.env.SERVER_HOST })

export const create = data => API.post('/chat/', data)
export const of = id => API.get(`/chat/${id}`)
export const remove = data => API.post('/chat/remove', data)
export const find = (self, other) => API.get(`/chat/find/${self}/${other}`)