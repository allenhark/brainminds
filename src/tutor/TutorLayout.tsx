import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

const TutorLayout: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [pageTitle, setPageTitle] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    const isExactPath = (itemPath: string) => {
        // Remove trailing slashes for consistent comparison
        const currentPath = location.pathname.replace(/\/$/, '');
        const targetPath = itemPath.replace(/\/$/, '');

        // For root tutor path
        if (targetPath === '/my-tutor') {
            return currentPath === '/my-tutor';
        }

        // For other paths, ensure exact match
        return currentPath === targetPath;
    };

    useEffect(() => {
        // Set page title based on current route
        const path = location.pathname;
        if (path.includes('/my-tutor/profile')) {
            setPageTitle('Profile Management');
        } else if (path.includes('/my-tutor/students')) {
            setPageTitle('My Students');
        } else if (path.includes('/my-tutor/sessions')) {
            setPageTitle('Session Management');
        } else if (path.includes('/my-tutor/messages')) {
            setPageTitle('Messages');
        } else if (path.includes('/my-tutor/availability')) {
            setPageTitle('Availability');
        } else if (path.includes('/my-tutor/payments')) {
            setPageTitle('Payments');
        } else {
            setPageTitle('Dashboard');
        }
    }, [location]);

    const mainItems = [
        {
            category: 'Teaching',
            items: [
                { icon: 'far fa-calendar-alt', label: 'Sessions', path: '/my-tutor/sessions' },
                // { icon: 'far fa-video', label: 'Class Links', path: '/my-tutor/class-links' }
            ]
        },
        {
            category: 'Communication',
            items: [
                // { icon: 'far fa-comment-dots', label: 'Messages', path: '/my-tutor/messages' },
                { icon: 'far fa-bell', label: 'Notifications', path: '/my-tutor/notifications' }
            ]
        },
        {
            category: 'Account',
            items: [
                { icon: 'far fa-user-circle', label: 'Profile', path: '/my-tutor/profile' },
                { icon: 'far fa-clock', label: 'Availability', path: '/my-tutor/availability' }
            ]
        }
    ];

    const handleLogout = () => {
        // Implement logout logic
        toast.success('Logged out successfully');
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-md transform transition-transform duration-200 ease-in-out ${collapsed ? '-translate-x-full md:translate-x-0 md:w-20' : 'translate-x-0'
                    } ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between h-16 px-4 border-b">
                        {!collapsed && (
                            <Link to="/my-tutor" className="flex items-center">
                                <img src="/smalllogo.png" alt="学习English" className="h-14" />
                            </Link>
                        )}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <i className="far fa-times h-5 w-5"></i>
                        </Button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-4 space-y-6 overflow-y-auto flex flex-col gap-y-2">
                        <div className="space-y-2 mt-5 ">
                            <Button
                                variant="ghost"
                                className={`w-full flex outline-none shadow-none align-middle justify-start items-center py-2  ${isExactPath('/my-tutor/dashboard')
                                    ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                onClick={() => navigate('/my-tutor/dashboard')}
                            >
                                <i className={`far fa-home mr-3`}></i>
                                {!collapsed && (
                                    <div className="flex justify-between items-center flex-1">
                                        <span>Dashboard</span>
                                    </div>
                                )}
                            </Button>
                        </div>

                        {mainItems.map((section, idx) => (
                            <div key={idx} className="space-y-2">
                                {!collapsed && (
                                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        {section.category}
                                    </h3>
                                )}
                                {section.items.map((item) => (
                                    <Button
                                        key={item.path}
                                        variant={isExactPath(item.path) ? 'default' : 'ghost'}
                                        className={`w-full outline-none shadow-none justify-start items-center py-2 mb-1 ${isExactPath(item.path)
                                            ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                            : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                        onClick={() => navigate(item.path)}
                                    >
                                        <i className={`${item.icon} mr-3`}></i>
                                        {!collapsed && (
                                            <div className="flex justify-between items-center flex-1">
                                                <span>{item.label}</span>
                                            </div>
                                        )}
                                    </Button>
                                ))}
                            </div>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className={`flex-1 flex flex-col ${collapsed ? 'md:ml-20' : 'md:ml-64'}`}>
                {/* Header */}
                <header className="bg-white shadow-sm z-10">
                    <div className="flex items-center justify-between h-16 px-4">
                        <div className="flex items-center">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="mr-4 md:hidden"
                                onClick={() => setMobileMenuOpen(true)}
                            >
                                <i className="far fa-bars h-5 w-5"></i>
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="hidden md:flex mr-4"
                                onClick={() => setCollapsed(!collapsed)}
                            >
                                <i className={`far fa-chevron-${collapsed ? 'right' : 'left'} h-5 w-5`}></i>
                            </Button>
                            <h2 className="text-xl font-semibold text-gray-800">{pageTitle}</h2>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Button variant="ghost" size="icon" className="relative" onClick={() => navigate('/my-tutor/notifications')}>
                                <i className="far fa-bell h-5 w-5"></i>
                                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
                            </Button>
                            {/* <Button variant="ghost" size="icon" className="relative" onClick={() => navigate('/tutor/messages')}>
                                <i className="far fa-envelope h-5 w-5"></i>
                                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
                            </Button> */}
                            <Button variant="ghost" onClick={handleLogout}>
                                Logout
                            </Button>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default TutorLayout;
