import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import Api from '@/Api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const AdminLayout: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [pageTitle, setPageTitle] = useState('');
    const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const isExactPath = (itemPath: string) => {
        // Remove trailing slashes for consistent comparison
        const currentPath = location.pathname.replace(/\/$/, '');
        const targetPath = itemPath.replace(/\/$/, '');

        // For root admin path
        if (targetPath === '/admin') {
            return currentPath === '/admin';
        }

        // For other paths, ensure exact match
        return currentPath === targetPath;
    };

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
        {
            category: 'Tutor',
            items: [
                { icon: 'far fa-user', label: 'Tutors Management', path: '/admin/tutors' },
                { icon: 'far fa-user-circle', label: 'Add Tutor', path: '/admin/tutors/create' },
                // { icon: 'far fa-users', label: 'Payment', path: '/admin/tutors/payments' }
            ]
        },
        {
            category: 'Student',
            items: [
                { icon: 'far fa-users-cog', label: 'Student Management', path: '/admin/students', soon: true },
            ]
        },
        // {
        //     category: 'Messages',
        //     items: [
        //         { icon: 'far fa-envelope', label: 'Tutors', path: '/admin/messages/tutors', soon: true },
        //         { icon: 'far fa-envelope', label: 'Students', path: '/admin/messages/students', soon: true },
        //     ]
        // },
        // {
        //     category: 'Payment',
        //     items: [
        //         { icon: 'far fa-window-maximize', label: 'Modals', path: '/admin/modals', soon: true },
        //         { icon: 'far fa-hat-wizard', label: 'Wizards', path: '/admin/wizards', soon: true }
        //     ]
        // }
        {
            category: 'Settings',
            items: [
                { icon: 'far fa-cog', label: 'Admins', path: '/admin/admins' },
            ]
        }
    ];

    const handleLogout = () => {
        // Implement logout logic
        toast.success('Logged out successfully');
        navigate('/login');
    };

    const openPasswordDialog = () => {
        setPasswordDialogOpen(true);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    const handleUpdatePassword = async () => {
        // Validate passwords
        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error('All fields are required');
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        try {
            setIsUpdating(true);
            // Get admin ID from localStorage or context
            const adminId = localStorage.getItem('userId') || '1'; // Default to 1 if not found

            const response = await Api.put(`/admin/update-password`, {
                currentPassword,
                newPassword
            });

            if (response.data.success) {
                toast.success('Password updated successfully');
                setPasswordDialogOpen(false);
            } else {
                toast.error(response.data.message || 'Failed to update password');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update password');
        } finally {
            setIsUpdating(false);
        }
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
                            <Link to="/admin/dashboard" className="flex items-center">
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
                                className={`w-full flex outline-none shadow-none align-middle justify-start items-center py-2  ${isExactPath('/admin')
                                    ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                onClick={() => navigate('/admin')}
                            >
                                <i className={`far fa-home mr-3`}></i>
                                {!collapsed && (
                                    <div className="flex justify-between items-center flex-1">
                                        <span>Dashboard</span>
                                    </div>
                                )}
                            </Button>
                        </div>

                        <div className="space-y-2">
                            <Button
                                variant="ghost"
                                className={`w-full flex outline-none shadow-none align-middle justify-start items-center py-2  ${isExactPath('/admin/support')
                                    ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                onClick={() => navigate('/admin/support')}
                            >
                                <i className={`far fa-comments mr-3`}></i>
                                {!collapsed && (
                                    <div className="flex justify-between items-center flex-1">
                                        <span>Support</span>
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
                            <Button variant="ghost" size="icon" className="relative">
                                <i className="far fa-bell h-5 w-5"></i>
                                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={openPasswordDialog}>
                                <i className="far fa-key h-5 w-5"></i>
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

            {/* Password Update Dialog */}
            <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Update Password</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="current-password" className="text-right">
                                Current Password
                            </Label>
                            <Input
                                id="current-password"
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="new-password" className="text-right">
                                New Password
                            </Label>
                            <Input
                                id="new-password"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="confirm-password" className="text-right">
                                Confirm Password
                            </Label>
                            <Input
                                id="confirm-password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setPasswordDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUpdatePassword}
                            disabled={isUpdating}
                        >
                            {isUpdating ? 'Updating...' : 'Update Password'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminLayout;
