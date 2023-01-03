import axios from 'axios'

const API = axios.create({ baseURL: process.env.SERVER_HOST })

export const create = data => API.post('/message/', data)
export const of = id => API.get(`/message/${id}`)
// export const remove = data => API.post('/message/remove', data)
// export const find = (id, data) => API.get(`/chat/${id}/find/`, data)