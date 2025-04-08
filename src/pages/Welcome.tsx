import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';

const Welcome = () => {
    const navigate = useNavigate();
    const { user } = useUser();

    useEffect(() => {
        // Check user role and redirect accordingly
        if (user) {
            if (user.role === 'ADMIN') {
                navigate('/admin/dashboard');
            } else if (user.role === 'TUTOR') {
                navigate('/my-tutor/dashboard');
            } else {
                navigate('/study/dashboard');
            }
        }
    }, [user, navigate]);

    // Return a loading state while redirecting
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-red-50 via-red-50/50 to-white">
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-2">欢迎 / Welcome</h1>
                <p className="text-gray-600">正在跳转... / Redirecting...</p>
            </div>
        </div>
    );
};

export default Welcome;
