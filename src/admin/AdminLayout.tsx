import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { Button } from '../components/ui/button';

type SidebarItem = {
    title: string;
    icon: string;
    path: string;
    badge?: string | number;
};

const AdminLayout: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();

    const mainItems: SidebarItem[] = [
        { title: 'Dashboard', icon: 'far fa-home', path: '/admin' },
        { title: 'Tutors', icon: 'far fa-user', path: '/admin/tutors', badge: 24 },
        { title: 'Students', icon: 'far fa-users', path: '/admin/students', badge: 56 },
        { title: 'Schedule', icon: 'far fa-calendar', path: '/admin/schedule' },
        { title: 'Payments', icon: 'far fa-credit-card', path: '/admin/payments' },
        { title: 'Messaging', icon: 'far fa-comment', path: '/admin/messaging', badge: 3 },
    ];

    const bottomItems: SidebarItem[] = [
        { title: 'Settings', icon: 'far fa-cog', path: '/admin/settings' },
        { title: 'Logout', icon: 'far fa-sign-out-alt', path: '/logout' },
    ];

    const StatCard = ({
        title,
        value,
        icon,
        change,
        changeType = "positive"
    }: {
        title: string;
        value: string;
        icon: string;
        change?: string;
        changeType?: "positive" | "negative";
    }) => (
        <div className="bg-white rounded-lg p-5 shadow-sm">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-gray-500 text-sm">{title}</p>
                    <h3 className="text-2xl font-bold mt-1">{value}</h3>
                    {change && (
                        <p className={`text-xs mt-2 ${changeType === "positive" ? "text-green-500" : "text-red-500"}`}>
                            {changeType === "positive" ? "↑" : "↓"} {change}
                        </p>
                    )}
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                    <i className={`${icon} text-blue-500 text-xl`}></i>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside
                className={cn(
                    "bg-white border-r border-gray-200 flex flex-col transition-all duration-300",
                    collapsed ? "w-[70px]" : "w-[250px]"
                )}
            >
                {/* Logo */}
                <div className="h-16 border-b border-gray-200 flex items-center px-4">
                    <Link to="/admin" className="flex items-center">
                        <div className="h-8 w-8 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                            B
                        </div>
                        {!collapsed && (
                            <span className="ml-2 font-semibold text-gray-800">BrainMinds</span>
                        )}
                    </Link>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="ml-auto"
                        onClick={() => setCollapsed(!collapsed)}
                    >
                        <i className="far fa-th text-gray-500"></i>
                    </Button>
                </div>

                {/* Main menu items */}
                <div className="flex-1 py-4 overflow-y-auto">
                    <div className="px-3 mb-2">
                        {!collapsed && <p className="text-xs font-semibold text-gray-400 mb-2 px-3">MAIN</p>}
                        <ul className="space-y-1">
                            {mainItems.map((item) => (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        className={cn(
                                            "flex items-center px-3 py-2 rounded-md text-sm font-medium",
                                            location.pathname === item.path
                                                ? "bg-blue-50 text-blue-600"
                                                : "text-gray-700 hover:bg-gray-100"
                                        )}
                                    >
                                        <span className="flex-shrink-0">
                                            <i className={`${item.icon} ${location.pathname === item.path ? 'text-blue-600' : 'text-gray-400'}`}></i>
                                        </span>
                                        {!collapsed && (
                                            <>
                                                <span className="ml-3 flex-1">{item.title}</span>
                                                {item.badge && (
                                                    <span className="ml-auto bg-blue-100 text-blue-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                                                        {item.badge}
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom menu items */}
                <div className="py-4 border-t border-gray-200">
                    <div className="px-3">
                        <ul className="space-y-1">
                            {bottomItems.map((item) => (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        className={cn(
                                            "flex items-center px-3 py-2 rounded-md text-sm font-medium",
                                            location.pathname === item.path
                                                ? "bg-blue-50 text-blue-600"
                                                : "text-gray-700 hover:bg-gray-100"
                                        )}
                                    >
                                        <span className="flex-shrink-0">
                                            <i className={`${item.icon} ${location.pathname === item.path ? 'text-blue-600' : 'text-gray-400'}`}></i>
                                        </span>
                                        {!collapsed && <span className="ml-3">{item.title}</span>}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top navbar */}
                <header className="bg-white border-b border-gray-200 h-16 flex items-center px-6">
                    <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
                    <div className="ml-auto flex items-center space-x-4">
                        <Button variant="ghost" size="sm">
                            Help
                        </Button>
                        <Button variant="ghost" size="sm">
                            Settings
                        </Button>
                        <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                            A
                        </div>
                    </div>
                </header>

                {/* Content area with scrolling */}
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
