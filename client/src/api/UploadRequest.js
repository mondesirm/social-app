import axios from 'axios';

const API = axios.create({ baseURL: process.env.SERVER_HOST });

API.interceptors.request.use(req => {
	if (localStorage.getItem('profile')) {
		req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
	}

	return req;
});

export const image = data => API.post('/upload/', data);
