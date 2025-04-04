import axios from 'axios';

// Define user data interface
interface UserData {
    name?: string;
    email?: string;
    avatarSeed?: string;
    [key: string]: string | undefined; // More specific type for index signature
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const Api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor
Api.interceptors.request.use(
    (config) => {
        // Get token from localStorage
        const token = localStorage.getItem('token');

        // If token exists, add it to the headers
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
Api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle 401 Unauthorized errors
        if (error.response && error.response.status === 401) {
            // Clear token and redirect to login
            localStorage.removeItem('token');
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

// User API methods
export const userApi = {
    // Get current user information
    getCurrentUser: async () => {
        try {
            const response = await Api.get('/auth/me');
            return response.data;
        } catch (error) {
            console.error('Failed to fetch user data:', error);
            throw error;
        }
    },

    // Update user profile
    updateProfile: async (userData: UserData) => {
        try {
            const response = await Api.put('/user/profile', userData);
            return response.data;
        } catch (error) {
            console.error('Failed to update user profile:', error);
            throw error;
        }
    }
};

export default Api;