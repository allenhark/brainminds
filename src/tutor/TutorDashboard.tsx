import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SessionInfo {
    id: number;
    studentName: string;
    date: string;
    time: string;
    status: 'upcoming' | 'completed' | 'cancelled';
    link?: string;
}

interface MessageInfo {
    id: number;
    studentName: string;
    preview: string;
    time: string;
    unread: boolean;
}

const TutorDashboard: React.FC = () => {
    // Normally these would come from API calls
    const [metrics, setMetrics] = useState({
        activeStudents: 0,
        upcomingSessions: 0,
        unreadMessages: 0,
        completedSessions: 0
    });

    const [upcomingSessions, setUpcomingSessions] = useState<SessionInfo[]>([]);
    const [recentMessages, setRecentMessages] = useState<MessageInfo[]>([]);

    // Simulate fetching data
    useEffect(() => {
        // This would be replaced with actual API calls
        setTimeout(() => {
            setMetrics({
                activeStudents: 12,
                upcomingSessions: 5,
                unreadMessages: 3,
                completedSessions: 48
            });

            setUpcomingSessions([
                {
                    id: 1,
                    studentName: 'Emma Johnson',
                    date: 'Today',
                    time: '3:00 PM',
                    status: 'upcoming',
                    link: 'https://zoom.us/j/123456789'
                },
                {
                    id: 2,
                    studentName: 'Michael Chen',
                    date: 'Tomorrow',
                    time: '10:00 AM',
                    status: 'upcoming',
                    link: 'https://meet.google.com/abc-defg-hij'
                },
                {
                    id: 3,
                    studentName: 'Sofia Rodriguez',
                    date: 'Apr 12, 2023',
                    time: '5:30 PM',
                    status: 'upcoming'
                }
            ]);

            setRecentMessages([
                {
                    id: 1,
                    studentName: 'Emma Johnson',
                    preview: 'Hi, I wanted to ask about the homework assignment...',
                    time: '10 min ago',
                    unread: true
                },
                {
                    id: 2,
                    studentName: 'Michael Chen',
                    preview: 'Thank you for the session today! I learned a lot...',
                    time: '2 hours ago',
                    unread: true
                },
                {
                    id: 3,
                    studentName: 'Sofia Rodriguez',
                    preview: "Can we reschedule tomorrow's session to 6 PM instead?",
                    time: 'Yesterday',
                    unread: false
                }
            ]);
        }, 500);
    }, []);

    const navigateToMessages = (messageId: number) => {
        // Navigate to the specific message conversation
        console.log(`Navigate to message ${messageId}`);
        // This would use react-router-dom's navigate function in a real implementation
    };

    const navigateToSession = (sessionId: number) => {
        // Navigate to the session details
        console.log(`Navigate to session ${sessionId}`);
        // This would use react-router-dom's navigate function in a real implementation
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Welcome Back, Tutor!</h1>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Active Students</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{metrics.activeStudents}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Upcoming Sessions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{metrics.upcomingSessions}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Unread Messages</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{metrics.unreadMessages}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Completed Sessions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{metrics.completedSessions}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Upcoming Sessions */}
            <Card>
                <CardHeader>
                    <CardTitle>Upcoming Sessions</CardTitle>
                    <CardDescription>Your scheduled sessions for the next 7 days</CardDescription>
                </CardHeader>
                <CardContent>
                    {upcomingSessions.length > 0 ? (
                        <div className="space-y-4">
                            {upcomingSessions.map(session => (
                                <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => navigateToSession(session.id)}>
                                    <div>
                                        <div className="font-medium">{session.studentName}</div>
                                        <div className="text-sm text-gray-500">{session.date} at {session.time}</div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {session.link && (
                                            <a
                                                href={session.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <i className="far fa-video mr-1"></i>
                                                Join
                                            </a>
                                        )}
                                        <Badge variant="outline" className="bg-blue-50 text-blue-600">
                                            {session.date === 'Today' ? 'Today' : session.date === 'Tomorrow' ? 'Tomorrow' : session.date}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <i className="far fa-calendar-check text-4xl mb-2"></i>
                            <p>No upcoming sessions scheduled</p>
                        </div>
                    )}
                </CardContent>
                <CardFooter>
                    <Button variant="outline" onClick={() => window.location.href = '/tutor/sessions'}>
                        View All Sessions
                    </Button>
                </CardFooter>
            </Card>

            {/* Recent Messages */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Messages</CardTitle>
                    <CardDescription>Latest conversations with your students</CardDescription>
                </CardHeader>
                <CardContent>
                    {recentMessages.length > 0 ? (
                        <div className="space-y-4">
                            {recentMessages.map(message => (
                                <div
                                    key={message.id}
                                    className={`flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer ${message.unread ? 'bg-blue-50' : ''}`}
                                    onClick={() => navigateToMessages(message.id)}
                                >
                                    <div className="flex-1">
                                        <div className="font-medium flex items-center">
                                            {message.studentName}
                                            {message.unread && (
                                                <span className="ml-2 w-2 h-2 bg-blue-600 rounded-full"></span>
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-500 truncate">{message.preview}</div>
                                    </div>
                                    <div className="text-xs text-gray-500 whitespace-nowrap ml-4">
                                        {message.time}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <i className="far fa-comment-dots text-4xl mb-2"></i>
                            <p>No recent messages</p>
                        </div>
                    )}
                </CardContent>
                <CardFooter>
                    <Button variant="outline" onClick={() => window.location.href = '/tutor/messages'}>
                        View All Messages
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default TutorDashboard; 