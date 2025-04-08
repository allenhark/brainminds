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
    tutor: {
        id: number;
        firstName: string;
        lastName: string;
        avatar?: string;
    };
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
                    Api.get('/student/sessions/upcoming')
                ]);

                setFeaturedTutors(tutorsResponse.data);
                setUpcomingSessions(sessionsResponse.data);
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
            <h1 className="text-3xl font-bold">Student Dashboard</h1>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                            <i className="fas fa-calendar-alt text-blue-500 mr-2"></i>
                            Upcoming Sessions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{upcomingSessions.length}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                            <i className="fas fa-user text-purple-500 mr-2"></i>
                            My Tutors
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{featuredTutors.length}</p>
                    </CardContent>
                </Card>

                <div className="">
                    <SubscriptionCard />
                </div>
            </div>

            {/* Upcoming Sessions */}
            <Card>
                <CardHeader>
                    <CardTitle>Upcoming Sessions</CardTitle>
                    <CardDescription>Your scheduled learning sessions</CardDescription>
                </CardHeader>
                <CardContent>
                    {upcomingSessions.length === 0 ? (
                        <p className="text-center text-gray-500 py-4">No upcoming sessions scheduled</p>
                    ) : (
                        <div className="space-y-4">
                            {upcomingSessions.map((session) => (
                                <div key={session.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-lg">
                                    <div className="flex items-center mb-2 md:mb-0">
                                        <img
                                            src={session.tutor.avatar}
                                            alt={`${session.tutor.firstName} ${session.tutor.lastName}`}
                                            className="w-10 h-10 rounded-full mr-3"
                                        />
                                        <div>
                                            <p className="font-medium">{session.tutor.firstName} {session.tutor.lastName}</p>
                                            <p className="text-sm text-gray-500">{formatDate(session.startTime)}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 w-full md:w-auto">
                                        {session.classLink && (
                                            <a href={session.classLink} target="_blank" rel="noopener noreferrer" className="flex-1 md:flex-none">
                                                <Button variant="outline" className="w-full md:w-auto">
                                                    Join Session
                                                </Button>
                                            </a>
                                        )}
                                        <Link to={`/study/messages?tutor=${session.tutor.id}`} className="flex-1 md:flex-none">
                                            <Button variant="ghost" className="w-full md:w-auto">
                                                <i className="fas fa-comment mr-2"></i>
                                                Message
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mt-4 text-center">
                        <Link to="/study/schedule">
                            <Button variant="outline">View All Sessions</Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>

            {/* Featured Tutors */}
            <Card>
                <CardHeader>
                    <CardTitle>Available Tutors</CardTitle>
                    <CardDescription>Find a tutor to help with your studies</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {featuredTutors.map((tutor) => (
                            <Card key={tutor.id} className="overflow-hidden border">
                                <CardContent className="p-0">
                                    <div className="p-4">
                                        <div className="flex items-center mb-2">
                                            <img
                                                src={tutor.avatar ? `${url}/${tutor.avatar}` : `https://api.dicebear.com/7.x/avataaars/svg?seed=${tutor.firstName}`}
                                                alt={`${tutor.firstName} ${tutor.lastName}`}
                                                className="w-12 h-12 rounded-full mr-3"
                                            />
                                            <div>
                                                <p className="font-medium">{tutor.firstName} {tutor.lastName}</p>
                                                <p className="text-sm text-yellow-500 flex items-center">
                                                    {'★'.repeat(Math.floor(tutor.rating))}
                                                    {tutor.rating % 1 > 0 ? '☆' : ''}
                                                    <span className="ml-1 text-gray-500">{tutor.rating.toFixed(1)}</span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <p className="text-sm text-gray-500 mb-1">Subjects:</p>
                                            <div className="flex flex-wrap gap-1">
                                                {tutor.subjects.map((subject, idx) => (
                                                    <Badge key={idx} variant="secondary">{subject}</Badge>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <p className="text-sm text-gray-500 mb-1">Availability:</p>
                                            <ul className="text-xs text-gray-700 space-y-1">
                                                {Array.isArray(tutor.availability)
                                                    ? tutor.availability.slice(0, 3).map((slot, idx) => (
                                                        <li key={idx}>{slot}</li>
                                                    ))
                                                    : <li>No availability information</li>
                                                }
                                            </ul>
                                        </div>

                                        <div className="mt-4 flex gap-2">
                                            <Link to={`/study/tutors/${tutor.id}`} className="flex-1">
                                                <Button variant="default" className="w-full">View Profile</Button>
                                            </Link>
                                            <Link to={`/study/messages?tutor=${tutor.id}`} className="flex-1">
                                                <Button variant="outline" className="w-full">Message</Button>
                                            </Link>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
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