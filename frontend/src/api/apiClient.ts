import axios from 'axios';

// Set your backend URL here. You may want to use an environment variable (VITE_API_BASE_URL)
const API_BASE_URL = 'https://bookit-etlw.onrender.com';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    // Optionally, enable cookies/credentials for sessions/auth
    withCredentials: true,
});

export default apiClient;