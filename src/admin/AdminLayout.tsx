import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from 'react-hot-toast';

const AdminLayout: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [pageTitle, setPageTitle] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        // Set page title based on current route
        const path = location.pathname;
        if (path.includes('/tutors')) {
            setPageTitle('Tutor Management');
        } else if (path.includes('/students')) {
            setPageTitle('Student Management');
        } else if (path.includes('/sessions')) {
            setPageTitle('Session Management');
        } else if (path.includes('/payments')) {
            setPageTitle('Payment Management');
        } else if (path.includes('/settings')) {
            setPageTitle('Settings');
        } else {
            setPageTitle('Dashboard');
        }
    }, [location]);

    const mainItems = [
        { icon: 'far fa-chalkboard-teacher', label: 'Tutors', path: '/admin/tutors', badge: '12' },
        { icon: 'far fa-calendar-alt', label: 'Sessions', path: '/admin/sessions', badge: '5' },
        { icon: 'far fa-comment-alt', label: 'Messages', path: '/admin/messages', badge: '3' },
        { icon: 'far fa-credit-card', label: 'Payments', path: '/admin/payments' },
    ];

    const bottomItems = [
        { icon: 'far fa-cog', label: 'Settings', path: '/admin/settings' },
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
                            <h1 className="text-xl font-bold text-red-600">BrainMinds</h1>
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
                    <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                        {mainItems.map((item) => (
                            <Button
                                key={item.path}
                                variant={location.pathname.includes(item.path) ? 'default' : 'ghost'}
                                className={`w-full justify-start mb-1 ${location.pathname.includes(item.path)
                                        ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                onClick={() => navigate(item.path)}
                            >
                                <i className={`${item.icon} mr-3 h-5 w-5`}></i>
                                {!collapsed && (
                                    <>
                                        <span className="flex-1">{item.label}</span>
                                        {item.badge && (
                                            <span className="ml-2 bg-red-100 text-red-600 text-xs font-medium px-2 py-0.5 rounded-full">
                                                {item.badge}
                                            </span>
                                        )}
                                    </>
                                )}
                            </Button>
                        ))}
                    </nav>

                    {/* Bottom Navigation */}
                    <div className="px-2 py-4 border-t">
                        {bottomItems.map((item) => (
                            <Button
                                key={item.path}
                                variant={location.pathname.includes(item.path) ? 'default' : 'ghost'}
                                className={`w-full justify-start mb-1 ${location.pathname.includes(item.path)
                                        ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                onClick={() => navigate(item.path)}
                            >
                                <i className={`${item.icon} mr-3 h-5 w-5`}></i>
                                {!collapsed && <span>{item.label}</span>}
                            </Button>
                        ))}
                    </div>
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
                            <Button variant="ghost" size="icon" className="relative">
                                <i className="far fa-bell h-5 w-5"></i>
                                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
                            </Button>
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

export default AdminLayout;
