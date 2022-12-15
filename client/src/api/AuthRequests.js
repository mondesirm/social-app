import axios from 'axios'

const API = axios.create({ baseURL: process.env.SERVER_HOST })

export const login = data => API.post('/auth/login', data)
export const register = data => API.post('/auth/register', data)
export const logout = data => API.post('/auth/logout', data)