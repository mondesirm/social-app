import axios from 'axios'

const API = axios.create({ baseURL: process.env.SERVER_HOST })

export const create = data => API.post('/message/', data)
export const of = id => API.get(`/message/${id}`)