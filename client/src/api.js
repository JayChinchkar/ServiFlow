import axios from 'axios';

// Replace localhost with your production Render URL
const API = axios.create({ baseURL: 'https://serviflow-backend.onrender.com' });

// This adds the JWT token to the header of every request automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;