import React, { createContext, useContext, useState, useEffect } from 'react';
import Api, { userApi } from '@/Api';

interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: 'STUDENT' | 'TUTOR' | 'ADMIN';
    avatarSeed: string;
}

interface UserContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    updateUser: (userData: Partial<User>) => Promise<void>;
    refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = sessionStorage.getItem('jwt');
            if (token) {
                const userData = await userApi.getCurrentUser();
                setUser(userData);
            }
        } catch (err) {
            console.error('Auth check failed:', err);
            sessionStorage.removeItem('jwt');
        } finally {
            setLoading(false);
        }
    };

    const refreshUser = async () => {
        try {
            setLoading(true);
            const token = sessionStorage.getItem('jwt');
            if (token) {
                const userData = await userApi.getCurrentUser();
                setUser(userData);
            }
        } catch (err) {
            console.error('User refresh failed:', err);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await Api.post('/auth/login', { email, password });
            const { token, user } = response.data;
            sessionStorage.setItem('jwt', token);
            setUser(user);
            // Refresh user data to ensure it's up-to-date
            await refreshUser();
        } catch (err) {
            setError('Login failed. Please check your credentials.');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        sessionStorage.removeItem('jwt');
        setUser(null);
    };

    const updateUser = async (userData: Partial<User>) => {
        try {
            setLoading(true);
            setError(null);
            const updatedUser = await userApi.updateProfile(userData);
            setUser(updatedUser);
        } catch (err) {
            setError('Failed to update user profile');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return (
        <UserContext.Provider value={{ user, loading, error, login, logout, updateUser, refreshUser }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
} 