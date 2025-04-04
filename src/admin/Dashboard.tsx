import React from 'react';

const Dashboard: React.FC = () => {
    // Sample data for dashboard stats
    const stats = [
        {
            title: 'Total Tutors',
            value: '24',
            icon: 'far fa-user',
            change: '12% this month',
            changeType: 'positive'
        },
        {
            title: 'Total Students',
            value: '56',
            icon: 'far fa-users',
            change: '8% this month',
            changeType: 'positive'
        },
        {
            title: 'Active Sessions',
            value: '15',
            icon: 'far fa-video',
            change: '5% this week',
            changeType: 'positive'
        },
        {
            title: 'Revenue',
            value: '$12,845',
            icon: 'far fa-dollar-sign',
            change: '10% this month',
            changeType: 'positive'
        }
    ];

    // Sample data for recent tutoring sessions
    const recentSessions = [
        {
            id: 1,
            tutor: 'John Smith',
            student: 'Emily Johnson',
            subject: 'Mathematics',
            date: '2023-05-15',
            duration: '1 hour',
            status: 'completed'
        },
        {
            id: 2,
            tutor: 'Sarah Parker',
            student: 'Michael Brown',
            subject: 'Physics',
            date: '2023-05-14',
            duration: '2 hours',
            status: 'completed'
        },
        {
            id: 3,
            tutor: 'David Wilson',
            student: 'Emma Davis',
            subject: 'Chemistry',
            date: '2023-05-14',
            duration: '1.5 hours',
            status: 'completed'
        },
        {
            id: 4,
            tutor: 'Jessica Lee',
            student: 'William Taylor',
            subject: 'Biology',
            date: '2023-05-13',
            duration: '1 hour',
            status: 'completed'
        },
        {
            id: 5,
            tutor: 'Robert Miller',
            student: 'Olivia Wilson',
            subject: 'English Literature',
            date: '2023-05-12',
            duration: '2 hours',
            status: 'completed'
        }
    ];

    // Sample data for upcoming sessions
    const upcomingSessions = [
        {
            id: 6,
            tutor: 'John Smith',
            student: 'James Anderson',
            subject: 'Mathematics',
            date: '2023-05-16',
            time: '10:00 AM',
            duration: '1 hour'
        },
        {
            id: 7,
            tutor: 'Sarah Parker',
            student: 'Sophia Martin',
            subject: 'Physics',
            date: '2023-05-16',
            time: '2:00 PM',
            duration: '1.5 hours'
        },
        {
            id: 8,
            tutor: 'David Wilson',
            student: 'Noah Thompson',
            subject: 'Chemistry',
            date: '2023-05-17',
            time: '11:00 AM',
            duration: '1 hour'
        }
    ];

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
                {stats.map((stat, index) => (
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
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                        <p className="text-gray-400">Revenue chart will be displayed here</p>
                    </div>
                </div>
                <div className="bg-white rounded-lg p-5 shadow-sm">
                    <h3 className="font-semibold text-gray-700 mb-4">Session Statistics</h3>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                        <p className="text-gray-400">Session statistics chart will be displayed here</p>
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
                            {recentSessions.map((session) => (
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
                                            {session.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
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
                    {upcomingSessions.map((session) => (
                        <div key={session.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                            <div className="flex items-center space-x-4">
                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                    <i className="far fa-user text-blue-500"></i>
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
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 