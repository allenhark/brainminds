import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow, format } from 'date-fns';
import Api from '@/Api';
import toast from 'react-hot-toast';
import HelmetComponent from '@/components/HelmetComponent';
interface Student {
    id: string;
    firstName: string;
    lastName: string;
    avatar: string;
}

interface Session {
    id: string;
    student: Student;
    startTime: string;
    endTime: string;
    status: 'scheduled' | 'completed' | 'cancelled';
    classLink: string;
    notes: string;
}

interface ChatRoom {
    id: string;
    student: Student;
    lastMessagePreview: string | null;
    lastMessageAt: string | null;
    createdAt: string;
    unreadCount: number;
}

interface TutorStats {
    totalStudents: number;
    totalSessions: number;
    completedSessions: number;
    cancelledSessions: number;
    totalHoursTaught: number;
    averageRating: number;
    responseRate: number;
    responseTime: number;
}

interface SessionInfo {
    id: string;
    studentName: string;
    studentAvatar: string;
    date: string;
    time: string;
    startTime: string;
    endTime: string;
    status: 'scheduled' | 'completed' | 'cancelled';
    link: string;
    notes: string;
}

interface MessageInfo {
    id: string;
    studentName: string;
    studentAvatar: string;
    preview: string;
    time: string;
    unread: boolean;
}

// API service for tutor-related operations
const tutorService = {
    getTutorStats: async (): Promise<TutorStats> => {
        try {
            const response = await Api.get('/tutor/stats');
            return response.data;
        } catch (error) {
            console.error('Error fetching tutor stats:', error);
            throw error;
        }
    },

    getUpcomingSessions: async (): Promise<Session[]> => {
        try {
            const response = await Api.get('/tutor/sessions/upcoming');
            return response.data;
        } catch (error) {
            console.error('Error fetching upcoming sessions:', error);
            // Return empty array on error to avoid breaking the UI
            return [];
        }
    },

    getRecentSessions: async (): Promise<Session[]> => {
        try {
            const response = await Api.get('/tutor/sessions/recent');
            return response.data;
        } catch (error) {
            console.error('Error fetching recent sessions:', error);
            return [];
        }
    }
};

// API service for messaging-related operations
const messageService = {
    getChatRooms: async (): Promise<ChatRoom[]> => {
        try {
            const response = await Api.get('/tutor/chats');
            return response.data;
        } catch (error) {
            console.error('Error fetching chat rooms:', error);
            return [];
        }
    },

    getUnreadMessagesCount: async (): Promise<number> => {
        try {
            const response = await Api.get('/tutor/messages/unread/count');
            return response.data.count;
        } catch (error) {
            console.error('Error fetching unread messages count:', error);
            return 0;
        }
    }
};

const TutorDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<TutorStats>({
        totalStudents: 0,
        totalSessions: 0,
        completedSessions: 0,
        cancelledSessions: 0,
        totalHoursTaught: 0,
        averageRating: 0,
        responseRate: 0,
        responseTime: 0
    });

    const [upcomingSessions, setUpcomingSessions] = useState<SessionInfo[]>([]);
    const [recentMessages, setRecentMessages] = useState<MessageInfo[]>([]);
    const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);

                // Fetch tutor stats
                try {
                    const tutorStats = await tutorService.getTutorStats();
                    setStats(tutorStats);
                } catch (error) {
                    toast.error('无法加载统计数据 | Failed to load statistics');
                    console.error('Error fetching tutor stats:', error);
                }

                // Fetch upcoming sessions
                try {
                    const sessions = await tutorService.getUpcomingSessions();

                    // Format upcoming sessions
                    if (sessions && sessions.length > 0) {
                        const formattedSessions: SessionInfo[] = sessions.map((session: Session): SessionInfo => ({
                            id: session.id,
                            studentName: `${session.student.firstName} ${session.student.lastName}`,
                            studentAvatar: session.student.avatar,
                            date: formatSessionDate(session.startTime),
                            time: formatSessionTime(session.startTime),
                            startTime: session.startTime,
                            endTime: session.endTime,
                            status: session.status,
                            link: session.classLink,
                            notes: session.notes
                        }));

                        setUpcomingSessions(formattedSessions);
                    }
                } catch (error) {
                    toast.error('无法加载课程数据 | Failed to load sessions');
                    console.error('Error fetching upcoming sessions:', error);
                }

                // Fetch recent messages/chat rooms
                try {
                    const chatRooms = await messageService.getChatRooms();
                    const unreadCount = await messageService.getUnreadMessagesCount();
                    setUnreadMessagesCount(unreadCount);

                    // Format recent messages from chat rooms
                    if (chatRooms && chatRooms.length > 0) {
                        const formattedMessages: MessageInfo[] = chatRooms
                            .filter(chat => chat.lastMessageAt) // Only include chats with messages
                            .sort((a, b) => {
                                // Sort by last message time (most recent first)
                                if (!a.lastMessageAt) return 1;
                                if (!b.lastMessageAt) return -1;
                                return new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime();
                            })
                            .slice(0, 5) // Get only the 5 most recent chats
                            .map(chat => ({
                                id: chat.id,
                                studentName: `${chat.student.firstName} ${chat.student.lastName}`,
                                studentAvatar: chat.student.avatar,
                                preview: chat.lastMessagePreview || '...',
                                time: chat.lastMessageAt ? formatDistanceToNow(new Date(chat.lastMessageAt), { addSuffix: true }) : '',
                                unread: chat.unreadCount > 0
                            }));

                        setRecentMessages(formattedMessages);
                    }
                } catch (error) {
                    console.error('Error fetching messages data:', error);
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                toast.error('加载数据出错 | Error loading dashboard data');
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
            return format(date, 'MMM d, yyyy');
        }
    };

    const formatSessionTime = (dateString: string) => {
        return format(new Date(dateString), 'h:mm a');
    };

    const navigateToMessages = (messageId: string) => {
        navigate(`/tutor/messages/${messageId}`);
    };

    const navigateToSession = (sessionId: string) => {
        navigate(`/tutor/sessions/${sessionId}`);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            <HelmetComponent title="Tutor Dashboard" />
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">
                    欢迎回来！
                    <span className="block text-base text-gray-500">Welcome Back!</span>
                </h1>
                <Button
                    onClick={() => navigate('/my-tutor/profile')}
                    variant="outline"
                    className="flex items-center gap-2"
                >
                    <i className="fas fa-user-edit"></i>
                    编辑资料
                    <span className="text-sm text-gray-500">Edit Profile</span>
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-red-50 to-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                            学生人数
                            <span className="block text-xs text-gray-500">Active Students</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-red-600">
                            <i className="fas fa-users mr-2 text-red-400"></i>
                            {stats.totalStudents}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-red-50 to-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                            即将开始的课程
                            <span className="block text-xs text-gray-500">Upcoming Sessions</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-red-600">
                            <i className="fas fa-calendar-alt mr-2 text-red-400"></i>
                            {upcomingSessions.length}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-red-50 to-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                            总课时
                            <span className="block text-xs text-gray-500">Hours Taught</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-red-600">
                            <i className="fas fa-clock mr-2 text-red-400"></i>
                            {stats.totalHoursTaught}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-red-50 to-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                            未读消息
                            <span className="block text-xs text-gray-500">Unread Messages</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-red-600">
                            <i className="fas fa-envelope mr-2 text-red-400"></i>
                            {unreadMessagesCount}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Performance Stats */}
            <Card className="bg-gradient-to-br from-red-50 to-white">
                <CardHeader>
                    <CardTitle>
                        教学表现
                        <span className="block text-sm font-normal text-gray-500">Teaching Performance</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">
                            {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '-'}
                        </div>
                        <div className="text-sm text-gray-500">
                            <i className="fas fa-star text-yellow-400 mr-1"></i>
                            评分 | Rating
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">
                            {stats.responseRate}%
                        </div>
                        <div className="text-sm text-gray-500">
                            <i className="fas fa-reply text-red-400 mr-1"></i>
                            回复率 | Response Rate
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">
                            {stats.completedSessions}
                        </div>
                        <div className="text-sm text-gray-500">
                            <i className="fas fa-check-circle text-green-400 mr-1"></i>
                            已完成课程 | Completed
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">
                            {stats.responseTime > 0 ? `${stats.responseTime}分钟` : '-'}
                        </div>
                        <div className="text-sm text-gray-500">
                            <i className="fas fa-clock text-blue-400 mr-1"></i>
                            平均回复时间 | Response Time
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Upcoming Sessions */}
            <Card>
                <CardHeader>
                    <CardTitle>
                        即将开始的课程
                        <span className="block text-sm font-normal text-gray-500">Upcoming Sessions</span>
                    </CardTitle>
                    <CardDescription>未来7天内的课程安排 | Your scheduled sessions for the next 7 days</CardDescription>
                </CardHeader>
                <CardContent>
                    {upcomingSessions.length > 0 ? (
                        <div className="space-y-4">
                            {upcomingSessions.map(session => (
                                <div
                                    key={session.id}
                                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-red-50 cursor-pointer transition-colors"
                                    onClick={() => navigateToSession(session.id)}
                                >
                                    <div className="flex items-center gap-4">
                                        {session.studentAvatar ? (
                                            <img
                                                src={session.studentAvatar}
                                                alt={session.studentName}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                                <i className="fas fa-user text-red-400"></i>
                                            </div>
                                        )}
                                        <div>
                                            <div className="font-medium">{session.studentName}</div>
                                            <div className="text-sm text-gray-500">
                                                <i className="far fa-calendar mr-1"></i>
                                                {session.date} at {session.time}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {session.link && (
                                            <a
                                                href={session.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-red-600 hover:text-red-800 px-3 py-1 rounded-full bg-red-50"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <i className="fas fa-video mr-1"></i>
                                                加入课程 | Join
                                            </a>
                                        )}
                                        <Badge variant="outline" className={`
                                            ${session.date === 'Today' ? 'bg-green-50 text-green-600' :
                                                session.date === 'Tomorrow' ? 'bg-blue-50 text-blue-600' :
                                                    'bg-gray-50 text-gray-600'}
                                        `}>
                                            {session.date === 'Today' ? '今天 | Today' :
                                                session.date === 'Tomorrow' ? '明天 | Tomorrow' :
                                                    session.date}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <i className="far fa-calendar-check text-4xl mb-2"></i>
                            <p>
                                暂无课程安排
                                <span className="block text-sm">No upcoming sessions scheduled</span>
                            </p>
                        </div>
                    )}
                </CardContent>
                <CardFooter>
                    <Button
                        variant="outline"
                        onClick={() => navigate('/my-tutor/sessions')}
                        className="w-full"
                    >
                        查看所有课程
                        <span className="ml-2 text-sm text-gray-500">View All Sessions</span>
                    </Button>
                </CardFooter>
            </Card>

            {/* Recent Messages */}
            <Card>
                <CardHeader>
                    <CardTitle>
                        最近消息
                        <span className="block text-sm font-normal text-gray-500">Recent Messages</span>
                    </CardTitle>
                    <CardDescription>学生的最新消息 | Latest messages from your students</CardDescription>
                </CardHeader>
                <CardContent>
                    {recentMessages.length > 0 ? (
                        <div className="space-y-4">
                            {recentMessages.map(message => (
                                <div
                                    key={message.id}
                                    className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${message.unread ? 'bg-red-50 border-red-100' : 'hover:bg-gray-50'
                                        }`}
                                    onClick={() => navigateToMessages(message.id)}
                                >
                                    <div className="flex items-center gap-4">
                                        {message.studentAvatar ? (
                                            <img
                                                src={message.studentAvatar}
                                                alt={message.studentName}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                                <i className="fas fa-user text-red-400"></i>
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium flex items-center gap-2">
                                                {message.studentName}
                                                {message.unread && (
                                                    <span className="w-2 h-2 bg-red-500 rounded-full inline-block"></span>
                                                )}
                                            </div>
                                            <div className="text-sm text-gray-500 truncate">
                                                {message.preview}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        {message.time}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <i className="far fa-comments text-4xl mb-2"></i>
                            <p>
                                暂无消息
                                <span className="block text-sm">No messages yet</span>
                            </p>
                        </div>
                    )}
                </CardContent>
                <CardFooter>
                    {/* <Button
                        variant="outline"
                        onClick={() => navigate('/tutor/messages')}
                        className="w-full"
                    >
                        查看所有消息
                        <span className="ml-2 text-sm text-gray-500">View All Messages</span>
                    </Button> */}
                </CardFooter>
            </Card>
        </div>
    );
};

export default TutorDashboard; 