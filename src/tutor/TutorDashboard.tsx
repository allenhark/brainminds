import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { tutorService } from '@/services/tutorService';
import { messageService, type ChatRoom } from '@/services/messageService';
import { formatDistanceToNow } from 'date-fns';

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
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [metrics, setMetrics] = useState({
        activeStudents: 0,
        upcomingSessions: 0,
        unreadMessages: 0,
        completedSessions: 0
    });

    const [upcomingSessions, setUpcomingSessions] = useState<SessionInfo[]>([]);
    const [recentMessages, setRecentMessages] = useState<MessageInfo[]>([]);

    // Fetch real data from API
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);

                // Fetch tutor stats
                const stats = await tutorService.getTutorStats();

                // Fetch upcoming sessions
                const sessions = await tutorService.getUpcomingSessions();

                // Fetch recent messages
                const messages: ChatRoom[] = await messageService.getChatRooms();

                // Update metrics
                setMetrics({
                    activeStudents: stats.totalStudents || 0,
                    upcomingSessions: sessions.length,
                    unreadMessages: messages.reduce((count: number, msg: ChatRoom) => count + (msg.unreadCount || 0), 0),
                    completedSessions: stats.completedSessions || 0
                });

                // Format upcoming sessions
                const formattedSessions = sessions.map(session => ({
                    id: session.id,
                    studentName: `${session.student.firstName} ${session.student.lastName}`,
                    date: formatSessionDate(session.startTime),
                    time: formatSessionTime(session.startTime),
                    status: session.status.toLowerCase() as 'upcoming' | 'completed' | 'cancelled',
                    link: session.classLink
                }));

                setUpcomingSessions(formattedSessions);

                // Format recent messages
                const formattedMessages = messages.map(msg => ({
                    id: msg.id,
                    studentName: `${msg.student.firstName} ${msg.student.lastName}`,
                    preview: msg.lastMessagePreview || 'No messages yet',
                    time: formatDistanceToNow(new Date(msg.lastMessageAt || msg.createdAt), { addSuffix: true }),
                    unread: (msg.unreadCount || 0) > 0
                }));

                setRecentMessages(formattedMessages);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                // You might want to show an error notification here
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const formatSessionDate = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return 'Tomorrow';
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }
    };

    const formatSessionTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    const navigateToMessages = (messageId: number) => {
        navigate(`/tutor/messages/${messageId}`);
    };

    const navigateToSession = (sessionId: number) => {
        navigate(`/tutor/sessions/${sessionId}`);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

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
                    <Button variant="outline" onClick={() => navigate('/tutor/sessions')}>
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
                    <Button variant="outline" onClick={() => navigate('/tutor/messages')}>
                        View All Messages
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default TutorDashboard; 