import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000" });

API.interceptors.request.use((req) => {
    if (localStorage.getItem('profile')) {
      req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
    }
  
    return req;
  });

export const getAllUser = ()=> API.get('/user')
export const getUser = (userId) => API.get(`/user/${userId}`);
export const getUserFriends = (userId) => API.get(`/user/${userId}/friends`);
export const updateUser = (id, formData) =>  API.put(`/user/${id}`, formData);
export const followUser = (id, formData)=> API.put(`/user/${id}/follow`, formData)
export const unfollowUser = (id, formData)=> API.put(`/user/${id}/unfollow`, formData)
export const getFriendRequest = (id)=> API.get(`/user/${id}/friendRequest`);