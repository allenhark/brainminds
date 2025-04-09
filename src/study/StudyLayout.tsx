import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { userApi, generateDicebearAvatar } from '@/Api';
import toast from 'react-hot-toast';

const StudyLayout: React.FC = () => {
    const [user, setUser] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await userApi.getCurrentUser();
                setUser(userData);
            } catch (error) {
                console.error('Failed to fetch user data:', error);
                toast.error('Please log in to access your dashboard');
                navigate('/login');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('jwt');
        toast.success('Logged out successfully');
        navigate('/login');
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    const navItems = [
        { path: '/study/dashboard', icon: 'fas fa-home', label: '主页', englishLabel: 'Dashboard' },
        { path: '/study/tutors', icon: 'fas fa-users', label: '老师', englishLabel: 'Tutors' },
        { path: '/study/payments', icon: 'fas fa-credit-card', label: '支付', englishLabel: 'Payments' },
        { path: '/study/settings', icon: 'fas fa-cog', label: '设置', englishLabel: 'Settings' },
    ];

    const avatarUrl = user?.avatarSeed
        ? generateDicebearAvatar(user.avatarSeed)
        : generateDicebearAvatar(user?.email || 'default');

    return (
        <div className="flex h-screen bg-gradient-to-b from-red-50 via-red-50/50 to-white">
            {/* Sidebar */}
            <div
                className={`bg-white h-full shadow-lg rounded-r-2xl transition-all duration-300 flex flex-col ${isCollapsed ? 'w-20' : 'w-64'
                    }`}
            >
                <div className="p-4 border-b flex justify-between items-center">
                    <div className={`flex items-center gap-2 ${isCollapsed ? 'hidden' : 'block'}`}>
                        <img src="/smalllogo.png" alt="学习English" className="h-12" />
                    </div>
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-2 rounded-full hover:bg-red-50 text-red-500"
                    >
                        {isCollapsed ? (
                            <i className="fas fa-chevron-right"></i>
                        ) : (
                            <i className="fas fa-chevron-left"></i>
                        )}
                    </button>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 overflow-y-auto py-4">
                    <ul className="space-y-1 px-2">
                        {navItems.map((item) => (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className={`flex items-center px-4 py-3 rounded-xl transition-colors ${location.pathname === item.path
                                        ? 'bg-red-50 text-red-500'
                                        : 'text-gray-700 hover:bg-gray-50'
                                        } ${isCollapsed ? 'justify-center' : 'gap-3'}`}
                                >
                                    <i className={`${item.icon} ${isCollapsed ? 'text-xl' : ''}`}></i>
                                    {!isCollapsed && (
                                        <div className="flex flex-col">
                                            <span className="text-sm">{item.label}</span>
                                            <span className="text-xs text-gray-500">{item.englishLabel}</span>
                                        </div>
                                    )}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* User Profile */}
                <div className="border-t p-4">
                    <div className={`flex items-center gap-3 p-2 rounded-xl hover:bg-red-50 transition-colors ${!isCollapsed ? 'cursor-pointer' : ''
                        }`}>
                        <img
                            src={avatarUrl}
                            alt={user?.name || 'User'}
                            className="w-10 h-10 rounded-full border-2 border-red-100"
                        />
                        {!isCollapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {user?.firstName} {user?.lastName}
                                </p>
                                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleLogout}
                        className={`mt-4 flex items-center text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-xl w-full transition-colors ${isCollapsed ? 'justify-center' : 'gap-2'
                            }`}
                    >
                        <i className="fas fa-sign-out-alt"></i>
                        {!isCollapsed && (
                            <div className="flex flex-col items-start">
                                <span>退出登录</span>
                                <span className="text-xs text-gray-500">Log out</span>
                            </div>
                        )}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <div className="p-6 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default StudyLayout;
