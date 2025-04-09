import React, { useState, useEffect } from 'react';
import Api from '@/Api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

// Types for our API responses
type DashboardStat = {
    value: number | string;
    change: string;
    changeType: 'positive' | 'negative';
};

type DashboardStats = {
    totalTutors: DashboardStat;
    totalStudents: DashboardStat;
    activeSessions: DashboardStat;
    revenue: DashboardStat;
};

type Session = {
    id: number;
    tutor: string;
    student: string;
    subject: string;
    date: string;
    time?: string;
    duration: string;
    status?: string;
};

type RevenueData = {
    month: string;
    revenue: number;
};

type SessionData = {
    month: string;
    completed: number;
    cancelled: number;
};

const Dashboard: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentSessions, setRecentSessions] = useState<Session[]>([]);
    const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([]);
    const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
    const [sessionData, setSessionData] = useState<SessionData[]>([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Fetch all dashboard data in parallel
                const [statsRes, recentRes, upcomingRes, revenueRes, sessionStatsRes] = await Promise.all([
                    Api.get('/admin/dashboard/stats'),
                    Api.get('/admin/dashboard/recent-sessions'),
                    Api.get('/admin/dashboard/upcoming-sessions'),
                    Api.get('/admin/dashboard/monthly-revenue'),
                    Api.get('/admin/dashboard/session-stats')
                ]);

                // Set state with fetched data
                setStats(statsRes.data.data);
                setRecentSessions(recentRes.data.data);
                setUpcomingSessions(upcomingRes.data.data);
                setRevenueData(revenueRes.data.data);
                setSessionData(sessionStatsRes.data.data);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError('Failed to load dashboard data. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Format the dashboard statistics for display
    const formattedStats = stats ? [
        {
            title: 'Total Tutors',
            value: stats.totalTutors.value.toString(),
            icon: 'fas fa-chalkboard-teacher',
            change: stats.totalTutors.change,
            changeType: stats.totalTutors.changeType
        },
        {
            title: 'Total Students',
            value: stats.totalStudents.value.toString(),
            icon: 'fas fa-user-graduate',
            change: stats.totalStudents.change,
            changeType: stats.totalStudents.changeType
        },
        {
            title: 'Active Sessions',
            value: stats.activeSessions.value.toString(),
            icon: 'fas fa-video',
            change: stats.activeSessions.change,
            changeType: stats.activeSessions.changeType
        },
        {
            title: 'Revenue',
            value: `$${parseFloat(stats.revenue.value.toString()).toLocaleString()}`,
            icon: 'fas fa-dollar-sign',
            change: stats.revenue.change,
            changeType: stats.revenue.changeType
        }
    ] : [];

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
                <div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
                        Generate Report
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {formattedStats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-lg p-5 shadow-sm">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 text-sm">{stat.title}</p>
                                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                                {stat.change && (
                                    <p className={`text-xs mt-2 ${stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`}>
                                        {stat.changeType === 'positive' ? '↑' : '↓'} {stat.change}
                                    </p>
                                )}
                            </div>
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <i className={`${stat.icon} text-blue-500 text-xl`}></i>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-5 shadow-sm">
                    <h3 className="font-semibold text-gray-700 mb-4">Monthly Revenue</h3>
                    <div className="h-64">
                        {revenueData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={revenueData}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                                    <Legend />
                                    <Line type="monotone" dataKey="revenue" stroke="#3B82F6" activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center bg-gray-50 rounded">
                                <p className="text-gray-400">No revenue data available</p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="bg-white rounded-lg p-5 shadow-sm">
                    <h3 className="font-semibold text-gray-700 mb-4">Session Statistics</h3>
                    <div className="h-64">
                        {sessionData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={sessionData}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="completed" fill="#4ADE80" name="Completed" />
                                    <Bar dataKey="cancelled" fill="#F87171" name="Cancelled" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center bg-gray-50 rounded">
                                <p className="text-gray-400">No session data available</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Sessions */}
            <div className="bg-white rounded-lg p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-700">Recent Sessions</h3>
                    <button className="text-blue-600 text-sm font-medium hover:underline">
                        View All
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tutor
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Student
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Subject
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Duration
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {recentSessions.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                                        No recent sessions found
                                    </td>
                                </tr>
                            ) : (
                                recentSessions.map((session) => (
                                    <tr key={session.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {session.tutor}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {session.student}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {session.subject}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {session.date}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {session.duration}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                {session.status || 'completed'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Upcoming Sessions */}
            <div className="bg-white rounded-lg p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-700">Upcoming Sessions</h3>
                    <button className="text-blue-600 text-sm font-medium hover:underline">
                        Schedule New
                    </button>
                </div>
                <div className="space-y-4">
                    {upcomingSessions.length === 0 ? (
                        <div className="p-4 text-center text-sm text-gray-500">
                            No upcoming sessions found
                        </div>
                    ) : (
                        upcomingSessions.map((session) => (
                            <div key={session.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                                <div className="flex items-center space-x-4">
                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                        <i className="fas fa-user text-blue-500"></i>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">{session.subject}</p>
                                        <p className="text-sm text-gray-500">
                                            {session.tutor} with {session.student}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-800">{session.date}</p>
                                    <p className="text-sm text-gray-500">{session.time} ({session.duration})</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 