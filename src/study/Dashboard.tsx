import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Api from '@/Api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import toast from 'react-hot-toast';
import SubscriptionCard from './components/SubscriptionCard';
import { url } from '@/config';

// Types
interface Tutor {
    id: number;
    firstName: string;
    lastName: string;
    avatar?: string;
    subjects: string[];
    rating: number;
    availability: string[];
}

interface Session {
    id: number;
    tutor: any;
    startTime: string;
    endTime: string;
    status: 'scheduled' | 'completed' | 'cancelled';
    classLink?: string;
}

interface SubscriptionStatus {
    isSubscribed: boolean;
    expiryDate?: string;
    amount: number;
}

const Dashboard: React.FC = () => {
    const [featuredTutors, setFeaturedTutors] = useState<Tutor[]>([]);
    const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([]);
    const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>({
        isSubscribed: false,
        amount: 13000
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setIsLoading(true);

                // In a real app, these would be separate API calls
                const [tutorsResponse, sessionsResponse] = await Promise.all([
                    Api.get('/student/tutors/featured'),
                    Api.get('/student/sessions')
                ]);

                setFeaturedTutors(tutorsResponse.data);
                setUpcomingSessions(sessionsResponse.data);
                //console.log(sessionsResponse.data);
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
                toast.error('Failed to load dashboard data');

            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">
                学生仪表板
                <span className="block mt-2">Student Dashboard</span>
            </h1>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="rounded-2xl bg-red-50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                            <i className="fas fa-calendar-alt text-red-500 mr-2"></i>
                            即将到来的课程
                            <span className="block text-sm mt-1">Upcoming Sessions</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-red-500">{upcomingSessions.length}</p>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl bg-blue-50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                            <i className="fas fa-user text-blue-500 mr-2"></i>
                            我的老师
                            <span className="block text-sm mt-1">My Tutors</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-blue-500">{featuredTutors.length}</p>
                    </CardContent>
                </Card>

                <div className="rounded-2xl">
                    <SubscriptionCard />
                </div>
            </div>

            {/* Upcoming Sessions */}
            <Card className="rounded-2xl overflow-hidden">
                <CardHeader>
                    <CardTitle>
                        即将到来的课程
                        <span className="block text-lg mt-1">Upcoming Sessions</span>
                    </CardTitle>
                    <CardDescription>您预定的学习课程 Your scheduled learning sessions</CardDescription>
                </CardHeader>
                <CardContent>
                    {upcomingSessions.length === 0 ? (
                        <p className="text-center text-gray-500 py-4">
                            暂无预定课程
                            <span className="block">No upcoming sessions scheduled</span>
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {upcomingSessions.map((session: any) => (
                                <div key={session.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-xl bg-gray-50 hover:bg-red-50 transition-colors">
                                    <div className="flex items-center mb-2 md:mb-0">
                                        <img
                                            src={`${url}/${session?.tutorAvatar}`}
                                            alt={`${session?.tutorName}`}
                                            className="w-12 h-12 rounded-full mr-3"
                                        />
                                        <div>
                                            <p className="font-medium">{session?.tutorName}</p>
                                            <p className="text-sm text-gray-500">{formatDate(session.startTime)}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 w-full md:w-auto">
                                        {session.classLink && (
                                            <a href={session.classLink} target="_blank" rel="noopener noreferrer" className="flex-1 md:flex-none">
                                                <Button variant="outline" className="w-full md:w-auto rounded-full bg-red-500 text-white hover:bg-red-600">
                                                    加入课程
                                                    <span className="block text-sm">Join Session</span>
                                                </Button>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* <div className="mt-4 text-center">
                        <Link to="/study/schedule">
                            <Button variant="outline" className="rounded-full hover:bg-red-50">
                                查看所有课程
                                <span className="block text-sm">View All Sessions</span>
                            </Button>
                        </Link>
                    </div> */}
                </CardContent>
            </Card>

            {/* Featured Tutors */}
            <Card className="rounded-2xl overflow-hidden">
                <CardHeader>
                    <CardTitle>
                        可预约的老师
                        <span className="block text-lg mt-1">Available Tutors</span>
                    </CardTitle>
                    <CardDescription>寻找适合您的英语老师 Find a tutor to help with your studies</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {featuredTutors.map((tutor: any) => {
                            // Parse the availability JSON string
                            const availabilitySlots = tutor.availability ? JSON.parse(tutor.availability) : [];

                            return (
                                <Card key={tutor.id} className="overflow-hidden border rounded-2xl hover:shadow-md transition-all">
                                    <CardContent className="p-0">
                                        <div className="p-4">
                                            <div className="flex items-center mb-4">
                                                <img
                                                    src={tutor.avatar ? `${url}/${tutor.avatar}` : `https://api.dicebear.com/7.x/avataaars/svg?seed=${tutor.firstName}`}
                                                    alt={`${tutor.firstName} ${tutor.lastName}`}
                                                    className="w-16 h-16 rounded-full mr-3 object-cover"
                                                />
                                                <div>
                                                    <p className="font-medium text-lg">{tutor.firstName} {tutor.lastName}</p>
                                                    <p className="text-sm text-yellow-500 flex items-center">
                                                        {tutor.rating > 0 ? (
                                                            <>
                                                                {'★'.repeat(Math.floor(tutor.rating))}
                                                                {tutor.rating % 1 > 0 ? '☆' : ''}
                                                                <span className="ml-1 text-gray-500">{tutor.rating.toFixed(1)}</span>
                                                            </>
                                                        ) : (
                                                            <span className="text-gray-500">新老师 New Tutor</span>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <p className="text-sm font-medium mb-2">
                                                    可预约时间
                                                    <span className="block text-gray-500">Available Time Slots</span>
                                                </p>
                                                <div className="space-y-2">
                                                    {availabilitySlots.length > 0 ? (
                                                        availabilitySlots.map((slot: { day: string; startTime: string; endTime: string }, idx: number) => (
                                                            <div
                                                                key={idx}
                                                                className="flex items-center p-2 bg-red-50 rounded-lg text-sm"
                                                            >
                                                                <i className="fas fa-clock text-red-500 mr-2"></i>
                                                                <span>
                                                                    {slot.day} {slot.startTime} - {slot.endTime}
                                                                </span>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="text-gray-500 text-sm">
                                                            暂无可预约时间
                                                            <span className="block">No available time slots</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="mt-4 flex gap-2">
                                                <Link to={`/study/tutors/${tutor.id}`} className="flex-1">
                                                    <Button
                                                        variant="default"
                                                        className="w-full rounded-full bg-red-500 hover:bg-red-600 text-white"
                                                    >
                                                        预约课程
                                                        <span className="block text-sm">Book a Lesson</span>
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    <div className="mt-6 text-center">
                        <Link to="/study/tutors">
                            <Button>View All Tutors</Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Dashboard; 