import axios from 'axios';

export const deviceApi = axios.create({
  baseURL: import.meta.env.VITE_DEVICE_URL || 'https://biotime.cloud:8005/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

deviceApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.ApiToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsImV4cCI6MTc1OTk5Mzg1NDIxNCwiaWF0IjoxNzU5OTA3NDU0fQ.5RE7CVi_kxvli5B2U99Q7Way4BdnaovuEqB-dSF59RI`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
