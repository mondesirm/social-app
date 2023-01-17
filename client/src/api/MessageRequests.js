import axios from 'axios'

const API = axios.create({ baseURL: process.env.SERVER_HOST })

export const create = data => API.post('/message/', data)
// export const one = id => API.get(`/message/${id}`)
export const of = (model, id) => API.get(`/message/of/${model}/${id}`)
// export const remove = data => API.post('/message/remove', data)
// export const find = (id, data) => API.get(`/chat/${id}/find/`, data)