import axios from 'axios';
import wsService from './services/wsService';
import { url } from "@/config";

// Define user data interface
interface UserData {
    name?: string;
    email?: string;
    avatarSeed?: string;
    [key: string]: string | undefined; // More specific type for index signature
}

const API_URL = `${url}/api`;

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
        const token = localStorage.getItem('jwt');

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
            // localStorage.removeItem('jwt');
            //window.location.href = '/login';
            console.log('401 Unauthorized error');
            throw error;
        }

        return Promise.reject(error);
    }
);

// Export websocket service
export { wsService };

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
    },

    updatePassword: async (passwordData: {
        currentPassword: string;
        newPassword: string;
        confirmPassword: string;
    }) => {
        try {
            const response = await Api.put('/student/password', passwordData);
            return response.data;
        } catch (error) {
            console.error('Failed to update password:', error);
            throw error;
        }
    }
};

// Generate dicebear avatar URL
export const generateDicebearAvatar = (seed: string) => {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;
};

// Tutor API methods
export const tutorApi = {
    // Get tutor profile
    getTutorProfile: async (userId: number) => {
        try {
            const response = await Api.get(`/tutor/${userId}/profile`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch tutor profile:', error);
            throw error;
        }
    },

    // Update tutor education information
    updateTutorEducation: async (userId: number, educationData: {
        educationLevel: string;
        teachingStyle: string;
        teachingMaterials: string;
        aboutMe: string;
        teachingCredentials: string;
    }) => {
        try {
            const response = await Api.put(`/tutor/${userId}/education`, educationData);
            return response.data;
        } catch (error) {
            console.error('Failed to update tutor education:', error);
            throw error;
        }
    },

    // Update tutor schedule
    updateTutorSchedule: async (userId: number, scheduleData: {
        timezone: string;
        lessonDuration: number;
        schedule: any;
    }) => {
        try {
            const response = await Api.put(`/tutor/${userId}/schedule`, scheduleData);
            return response.data;
        } catch (error) {
            console.error('Failed to update tutor schedule:', error);
            throw error;
        }
    },

    // Upload tutor avatar
    uploadTutorAvatar: async (userId: number, avatarFile: File) => {
        try {
            const formData = new FormData();
            formData.append('avatar', avatarFile);

            const response = await Api.post(`/tutor/${userId}/avatar`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Failed to upload tutor avatar:', error);
            throw error;
        }
    }
};

export default Api;