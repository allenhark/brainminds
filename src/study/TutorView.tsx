import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, parseISO, addDays, isBefore, isAfter, startOfWeek, addWeeks, startOfDay, addMinutes, differenceInDays } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Api from '@/Api';
import toast from 'react-hot-toast';
import { url } from '@/config';
import { Link } from 'react-router-dom';
import HelmetComponent from '@/components/HelmetComponent';

// Types
interface Tutor {
    id: number;
    firstName: string;
    lastName: string;
    avatar?: string;
    subjects: string[];
    educationLevel: string;
    yearsOfExperience: number;
    lessonPrice?: number;
    hourlyRate?: number;
    rating: number;
    availability: string | Array<{
        day: string;
        startTime: string;
        endTime: string;
    }>;
    timezone: string;
    bio: string;
    teachingStyle: string;
}

interface TimeSlot {
    day: string;
    date: Date;
    slots: {
        startTime: string;
        endTime: string;
        available: boolean;
    }[];
}

interface SubscriptionStatus {
    isSubscribed: boolean;
    expiryDate?: string;
}

interface Review {
    id: number;
    studentName: string;
    studentAvatar?: string;
    rating: number;
    comment: string;
    createdAt: string;
}

const TutorView: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [tutor, setTutor] = useState<Tutor | null>(null);
    const [loading, setLoading] = useState(true);
    const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>({
        isSubscribed: false,
    });
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
    const [bookingNotes, setBookingNotes] = useState('');
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
    const [currentView, setCurrentView] = useState<'calendar' | 'booking'>('calendar');
    const [selectedTab, setSelectedTab] = useState('profile');
    const [currentUser, setCurrentUser] = useState<any>(null);

    // New state for booking
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [recurringDuration, setRecurringDuration] = useState<number>(4); // 4 weeks by default
    const [sessionDuration, setSessionDuration] = useState<number>(60); // Default 60 minutes
    const [reviewText, setReviewText] = useState('');
    const [reviewRating, setReviewRating] = useState(5);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [bookedSlots, setBookedSlots] = useState<{ [key: string]: string[] }>({});
    const [remainingSubscriptionDays, setRemainingSubscriptionDays] = useState<number>(0);

    // Add loading states for buttons
    const [isBookingLoading, setIsBookingLoading] = useState(false);
    const [isReviewSubmitLoading, setIsReviewSubmitLoading] = useState(false);
    const [isSubscribeNavigating, setIsSubscribeNavigating] = useState(false);

    // Fetch tutor data, subscription status, and reviews
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const [tutorResponse, subscriptionResponse, userResponse, bookedSessionsResponse] = await Promise.all([
                    Api.get(`/student/tutors/${id}`),
                    Api.get('/student/subscription'),
                    Api.get('/auth/me'),
                    Api.get('/student/sessions')
                ]);

                // Parse availability if it's a string
                const tutorData = tutorResponse.data;
                if (typeof tutorData.availability === 'string') {
                    try {
                        tutorData.availability = JSON.parse(tutorData.availability);
                    } catch (e) {
                        console.error('Failed to parse availability:', e);
                        tutorData.availability = [];
                    }
                }

                setTutor(tutorData);

                // Calculate remaining subscription days
                const subscriptionData = subscriptionResponse.data;
                setSubscriptionStatus(subscriptionData);

                if (subscriptionData.isSubscribed && subscriptionData.expiryDate) {
                    const expiryDate = new Date(subscriptionData.expiryDate);
                    const today = new Date();
                    const daysRemaining = differenceInDays(expiryDate, today);
                    setRemainingSubscriptionDays(Math.max(0, daysRemaining));

                    // Adjust recurring duration based on subscription
                    const maxWeeks = Math.floor(daysRemaining / 7);
                    setRecurringDuration(Math.min(4, maxWeeks > 0 ? maxWeeks : 1));
                }

                setCurrentUser(userResponse.data);

                // Track booked time slots
                const bookedSessions = bookedSessionsResponse.data?.data || [];
                const bookedSlotsMap: { [key: string]: string[] } = {};

                bookedSessions.forEach((session: any) => {
                    const sessionDate = format(new Date(session.startTime), 'yyyy-MM-dd');
                    const timeSlot = format(new Date(session.startTime), 'HH:mm');

                    if (!bookedSlotsMap[sessionDate]) {
                        bookedSlotsMap[sessionDate] = [];
                    }

                    bookedSlotsMap[sessionDate].push(timeSlot);
                });

                setBookedSlots(bookedSlotsMap);

                // Generate time slots based on tutor availability
                if (tutorData && tutorData.availability) {
                    generateTimeSlots(tutorData.availability, bookedSlotsMap);
                }

                // Fetch reviews
                try {
                    const reviewsResponse = await Api.get(`/student/tutors/${id}/reviews`);
                    setReviews(reviewsResponse.data || []);
                } catch (error) {
                    console.error('Failed to fetch reviews:', error);
                    setReviews([]);
                }
            } catch (error) {
                console.error('Failed to fetch tutor data:', error);
                toast.error('获取老师数据失败 / Failed to load tutor data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const generateTimeSlots = (
        availability: string | Array<{ day: string; startTime: string; endTime: string }>,
        bookedSlots: { [key: string]: string[] } = {}
    ) => {
        // Convert string to array if needed
        const availArray = typeof availability === 'string'
            ? (JSON.parse(availability) as Array<{ day: string; startTime: string; endTime: string }>)
            : Array.isArray(availability) ? availability : []; // Ensure it's an array or empty array

        const today = startOfDay(new Date());
        const dayMap: { [key: string]: number } = {
            'monday': 1, 'tuesday': 2, 'wednesday': 3, 'thursday': 4,
            'friday': 5, 'saturday': 6, 'sunday': 0
        };

        const slots: TimeSlot[] = [];

        // Generate time slots for the next 2 weeks for context, even if UI doesn't show calendar
        for (let weekOffset = 0; weekOffset < 2; weekOffset++) {
            const weekStart = startOfWeek(addWeeks(today, weekOffset), { weekStartsOn: 1 }); // Start from Monday

            availArray.forEach(availSlot => {
                const dayNum = dayMap[availSlot.day.toLowerCase()];
                if (dayNum === undefined) return;

                const date = addDays(weekStart, dayNum - 1);

                // Skip dates in the past
                if (isBefore(date, today)) return;

                // Check if slots for this day/date already exist
                let existingDaySlot = slots.find(s => format(s.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'));

                if (!existingDaySlot) {
                    existingDaySlot = {
                        day: availSlot.day,
                        date: date,
                        slots: []
                    };
                    slots.push(existingDaySlot);
                }

                // Parse time strings
                const [startHour, startMinute] = availSlot.startTime.split(':').map(Number);
                const [endHour, endMinute] = availSlot.endTime.split(':').map(Number);

                // Generate slots based on session duration (30, 45, or 60 min)
                const startDate = new Date(date);
                startDate.setHours(startHour, startMinute, 0, 0);

                const endDate = new Date(date);
                endDate.setHours(endHour, endMinute, 0, 0);

                // Format date for checking booked slots
                const dateString = format(date, 'yyyy-MM-dd');
                const bookedTimesForDay = bookedSlots[dateString] || [];

                // Generate slots based on possible durations
                let currentTime = new Date(startDate);
                while (isBefore(currentTime, endDate)) {
                    const slotStartTime = format(currentTime, 'HH:mm');

                    // Check if this slot is already booked
                    const isBooked = bookedTimesForDay.includes(slotStartTime);

                    // Generate each duration option (30, 45, 60 min)
                    [30, 45, 60].forEach(minutes => {
                        const slotEndTime = format(addMinutes(currentTime, minutes), 'HH:mm');
                        const slotEndDate = addMinutes(currentTime, minutes);

                        // Only add if end time is within availability
                        if (!isAfter(slotEndDate, endDate)) {
                            existingDaySlot!.slots.push({
                                startTime: slotStartTime,
                                endTime: slotEndTime,
                                available: !isBooked
                            });
                        }
                    });

                    // Move to next 30-minute increment
                    currentTime = addMinutes(currentTime, 30);
                }
            });
        }

        // Sort slots by date
        slots.sort((a, b) => a.date.getTime() - b.date.getTime());
        setTimeSlots(slots);
    };

    const handleBookingSubmit = async () => {
        if (selectedDays.length === 0 || !tutor) {
            toast.error('请选择至少一天 / Please select at least one day');
            return;
        }

        if (!sessionDuration || ![30, 45, 60].includes(sessionDuration)) {
            toast.error('请选择有效的课程时长 / Please select a valid session duration');
            return;
        }

        // Check if booking exceeds subscription time
        const weeksToBook = Math.min(recurringDuration, Math.floor(remainingSubscriptionDays / 7));
        if (weeksToBook <= 0) {
            toast.error('您的订阅即将过期 / Your subscription is about to expire');
            return;
        }

        setIsBookingLoading(true);
        try {
            // Create recurring sessions for selected days for the specified duration
            const startOfBooking = startOfDay(new Date()); // Start from today
            const sessionsToBook = [];

            // Calculate the end date based on recurring duration (in weeks)
            const endDate = addWeeks(startOfBooking, weeksToBook);

            // Generate all dates for the selected days within the recurring period
            for (let day of selectedDays) {
                const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].indexOf(day.toLowerCase());

                if (dayOfWeek === -1) continue;

                // Find available time slot for this day from tutor's availability
                const availabilityForDay = Array.isArray(tutor.availability) ?
                    tutor.availability.find(slot => typeof slot === 'object' && slot.day && slot.day.toLowerCase() === day.toLowerCase()) : null;

                if (!availabilityForDay) continue;

                // Format times for API
                const [startHour, startMinute] = availabilityForDay.startTime.split(':').map(Number);

                // Clone the start date to avoid mutating it
                let currentDate = new Date(startOfBooking);

                // Adjust to the first occurrence of the selected day
                const currentDayOfWeek = currentDate.getDay();
                const daysToAdd = (dayOfWeek - currentDayOfWeek + 7) % 7;
                currentDate = addDays(currentDate, daysToAdd);

                // Add all occurrences until the end date
                while (isBefore(currentDate, endDate)) {
                    const sessionStartTime = new Date(currentDate);
                    sessionStartTime.setHours(startHour, startMinute);

                    const sessionEndTime = new Date(sessionStartTime);
                    sessionEndTime.setMinutes(sessionStartTime.getMinutes() + sessionDuration);

                    // Only add if start time is in the future
                    if (isAfter(sessionStartTime, new Date())) {
                        // Check if this time slot is available (not booked)
                        const dateString = format(sessionStartTime, 'yyyy-MM-dd');
                        const timeString = format(sessionStartTime, 'HH:mm');
                        const isBooked = (bookedSlots[dateString] || []).includes(timeString);

                        if (!isBooked) {
                            sessionsToBook.push({
                                startTime: sessionStartTime.toISOString(),
                                endTime: sessionEndTime.toISOString()
                            });
                        }
                    }

                    // Move to next week
                    currentDate = addDays(currentDate, 7);
                }
            }

            if (sessionsToBook.length === 0) {
                toast.error('没有可用的课程时间 / No valid session times available');
                return;
            }

            // Book all sessions using session routes
            for (const session of sessionsToBook) {
                await Api.post('/sessions', {
                    tutorId: tutor.id,
                    studentId: currentUser.id,
                    startTime: session.startTime,
                    endTime: session.endTime,
                    notes: bookingNotes
                });
            }

            toast.success(`成功预约了 ${sessionsToBook.length} 节课程 / Successfully booked ${sessionsToBook.length} sessions`);

            // Reset form
            setSelectedDays([]);
            setBookingNotes('');

            // Navigate to sessions page
            navigate('/study/sessions');
        } catch (error) {
            console.error('Booking failed:', error);
            toast.error('预约失败 / Booking failed');
        } finally {
            setIsBookingLoading(false);
        }
    };

    const handleSubmitReview = async () => {
        if (!subscriptionStatus.isSubscribed || !tutor) {
            toast.error('您需要订阅才能评价老师 / You need a subscription to review tutors');
            return;
        }

        if (reviewRating < 1 || reviewRating > 5) {
            toast.error('请提供1-5分的评分 / Please provide a rating between 1-5');
            return;
        }

        setIsReviewSubmitLoading(true);
        try {
            await Api.post(`/student/tutors/${tutor.id}/reviews`, {
                rating: reviewRating,
                comment: reviewText
            });

            // Add the new review to the local state
            const newReview: Review = {
                id: Date.now(),
                studentName: `${currentUser?.firstName} ${currentUser?.lastName}`,
                studentAvatar: currentUser?.avatar,
                rating: reviewRating,
                comment: reviewText,
                createdAt: new Date().toISOString()
            };

            setReviews([newReview, ...reviews]);
            setReviewText('');
            setReviewRating(5);

            toast.success('评价提交成功 / Review submitted successfully');
        } catch (error) {
            console.error('Failed to submit review:', error);
            toast.error('评价提交失败 / Failed to submit review');
        } finally {
            setIsReviewSubmitLoading(false);
        }
    };

    const handleDayToggle = (day: string) => {
        if (selectedDays.includes(day)) {
            setSelectedDays(selectedDays.filter(d => d !== day));
        } else {
            setSelectedDays([...selectedDays, day]);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-500"></div>
            </div>
        );
    }

    if (!tutor) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">未找到老师 / Tutor not found</p>
            </div>
        );
    }

    // Determine SEO tags based on tutor data
    const pageTitle = tutor ? `Tutor ${tutor.firstName} ${tutor.lastName} - 学习English` : 'Tutor Profile - 学习English';
    const pageDescription = tutor ? `Learn more about ${tutor.firstName} ${tutor.lastName}, an English tutor specializing in ${tutor.subjects.join(', ')}. View availability and book lessons.` : 'View tutor profile and book English lessons.';
    const ogImageUrl = tutor?.avatar ? `${url}/${tutor.avatar}` : undefined;
    const currentUrl = window.location.href;

    return (
        <div className="flex flex-col h-full">
            <HelmetComponent
                title={pageTitle}
                description={pageDescription}
                keywords={`english tutor, ${tutor?.firstName} ${tutor?.lastName}, ${tutor?.subjects.join(', ')}, book english lesson`}
                ogTitle={pageTitle}
                ogDescription={pageDescription}
                ogImage={ogImageUrl}
                ogUrl={currentUrl}
            />
            {/* Main Content */}
            <div className="container max-w-6xl mx-auto px-4 py-6 flex-1 overflow-y-auto space-y-6">
                {/* Tutor Header */}
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Tutor Profile Card */}
                    <div className="md:w-1/3">
                        <Card className="overflow-hidden bg-white rounded-2xl shadow-md">
                            <div className="bg-gradient-to-b from-red-50 to-white p-6 flex flex-col items-center">
                                <img
                                    src={tutor?.avatar ? `${url}/${tutor.avatar}` : `https://api.dicebear.com/6.x/bottts/svg?seed=${tutor?.firstName}`}
                                    alt={`${tutor?.firstName} ${tutor?.lastName}`}
                                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg mb-4 object-cover"
                                />
                                <h2 className="text-2xl font-bold text-center">
                                    {tutor?.firstName} {tutor?.lastName}
                                </h2>
                                <div className="flex items-center mt-2 text-yellow-400">
                                    <i className="fas fa-star"></i>
                                    <span className="ml-1 text-gray-700">{tutor?.rating.toFixed(1)}</span>
                                    <span className="text-gray-500 text-sm ml-1">
                                        {reviews.length > 0 ? `(${reviews.length} reviews)` : '(No reviews yet)'}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-3 justify-center">
                                    {tutor?.subjects.map((subject, idx) => (
                                        <Badge key={idx} variant="secondary" className="bg-red-50 text-red-600 hover:bg-red-100">
                                            {subject}
                                        </Badge>
                                    ))}
                                </div>
                                <div className="w-full border-t my-4"></div>
                                <div className="w-full space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">学历 / Education:</span>
                                        <span className="font-medium">{tutor?.educationLevel}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">经验 / Experience:</span>
                                        <span className="font-medium">{tutor?.yearsOfExperience} years</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">时区 / Timezone:</span>
                                        <span className="font-medium">{tutor?.timezone}</span>
                                    </div>
                                </div>

                                {!subscriptionStatus.isSubscribed && (
                                    <div className="mt-4 w-full">
                                        <Link to="/study/payments">
                                            <Button
                                                className="bg-red-500 hover:bg-red-600 text-white w-full rounded-full"
                                                disabled={isSubscribeNavigating}
                                                onClick={() => setIsSubscribeNavigating(true)}
                                            >
                                                {isSubscribeNavigating ? (
                                                    <span className="flex items-center">
                                                        <i className="fas fa-spinner fa-spin mr-2"></i>
                                                        处理中 / Processing...
                                                    </span>
                                                ) : (
                                                    '订阅 / Subscribe'
                                                )}
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1">
                        <Tabs defaultValue="profile" onValueChange={(value) => setSelectedTab(value)} className="w-full">
                            <TabsList className="grid w-full grid-cols-3 rounded-full bg-gray-100 p-1">
                                <TabsTrigger value="profile" className="rounded-full data-[state=active]:bg-white data-[state=active]:text-red-500 data-[state=active]:shadow">
                                    <i className="fas fa-user mr-2"></i>
                                    个人档案 / Profile
                                </TabsTrigger>
                                <TabsTrigger value="schedule" className="rounded-full data-[state=active]:bg-white data-[state=active]:text-red-500 data-[state=active]:shadow">
                                    <i className="fas fa-calendar mr-2"></i>
                                    预约课程 / Book
                                </TabsTrigger>
                                <TabsTrigger value="reviews" className="rounded-full data-[state=active]:bg-white data-[state=active]:text-red-500 data-[state=active]:shadow">
                                    <i className="fas fa-star mr-2"></i>
                                    评价 / Reviews
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="profile" className="mt-6">
                                <Card className="rounded-2xl shadow-sm overflow-hidden border-0">
                                    <CardContent className="p-6">
                                        <h3 className="text-xl font-bold mb-4 flex items-center">
                                            <i className="fas fa-info-circle text-red-500 mr-2"></i>
                                            关于我 / About Me
                                        </h3>
                                        <p className="text-gray-600 mb-6 leading-relaxed">{tutor?.bio}</p>

                                        <h3 className="text-xl font-bold mb-4 flex items-center">
                                            <i className="fas fa-chalkboard-teacher text-red-500 mr-2"></i>
                                            教学风格 / Teaching Style
                                        </h3>
                                        <p className="text-gray-600 mb-6 leading-relaxed">{tutor?.teachingStyle}</p>

                                        <h3 className="text-xl font-bold mb-4 flex items-center">
                                            <i className="fas fa-clock text-red-500 mr-2"></i>
                                            可用时间 / Availability
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                            {Array.isArray(tutor?.availability) ? (
                                                tutor.availability.map((slot, idx) => (
                                                    <div key={idx} className="bg-gray-50 p-3 rounded-xl flex justify-between items-center">
                                                        <div className="flex items-center">
                                                            <i className="fas fa-calendar-day text-blue-500 mr-2"></i>
                                                            <span className="font-medium">{slot.day}</span>
                                                        </div>
                                                        <span className="text-gray-600">{slot.startTime} - {slot.endTime}</span>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="col-span-3 text-gray-500 py-4 text-center">No availability information</div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="schedule" className="mt-6">
                                <Card className="rounded-2xl shadow-sm overflow-hidden border-0">
                                    <CardContent className="p-6">
                                        <h3 className="text-xl font-bold mb-4 flex items-center">
                                            <i className="fas fa-calendar-check text-red-500 mr-2"></i>
                                            安排课程 / Schedule a Lesson
                                        </h3>

                                        {subscriptionStatus.isSubscribed ? (
                                            <div className="bg-gray-50 p-6 rounded-xl mb-6 space-y-6">
                                                {remainingSubscriptionDays > 0 ? (
                                                    <div className="bg-blue-50 p-3 rounded-xl text-blue-700 flex items-center mb-4">
                                                        <i className="fas fa-info-circle mr-2"></i>
                                                        <span>您的订阅还剩 {remainingSubscriptionDays} 天 / Your subscription expires in {remainingSubscriptionDays} days</span>
                                                    </div>
                                                ) : (
                                                    <div className="bg-yellow-50 p-3 rounded-xl text-yellow-700 flex items-center mb-4">
                                                        <i className="fas fa-exclamation-triangle mr-2"></i>
                                                        <span>您的订阅即将到期 / Your subscription is about to expire</span>
                                                    </div>
                                                )}

                                                <div>
                                                    <h4 className="font-medium mb-3 flex items-center text-red-500">
                                                        <i className="fas fa-calendar-day mr-2"></i>
                                                        选择每周上课日 / Select Weekly Class Days
                                                    </h4>
                                                    <div className="grid grid-cols-2 md:grid-cols-7 gap-2 mb-4">
                                                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                                                            <Button
                                                                key={day}
                                                                variant={selectedDays.includes(day) ? "default" : "outline"}
                                                                onClick={() => handleDayToggle(day)}
                                                                className={`rounded-full ${selectedDays.includes(day) ? 'bg-red-500 hover:bg-red-600' : ''}`}
                                                            >
                                                                {day.substring(0, 3)}
                                                            </Button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div>
                                                    <h4 className="font-medium mb-3 flex items-center text-red-500">
                                                        <i className="fas fa-clock mr-2"></i>
                                                        课程时长 / Session Duration
                                                    </h4>
                                                    <div className="grid grid-cols-3 gap-2">
                                                        {[30, 45, 60].map((minutes) => (
                                                            <Button
                                                                key={minutes}
                                                                variant={sessionDuration === minutes ? "default" : "outline"}
                                                                onClick={() => setSessionDuration(minutes)}
                                                                className={`rounded-full ${sessionDuration === minutes ? 'bg-red-500 hover:bg-red-600' : ''}`}
                                                            >
                                                                {minutes} 分钟 / min
                                                            </Button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div>
                                                    <h4 className="font-medium mb-3 flex items-center text-red-500">
                                                        <i className="fas fa-clock mr-2"></i>
                                                        课程持续周数 / Duration in Weeks
                                                    </h4>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="outline"
                                                            onClick={() => setRecurringDuration(Math.max(1, recurringDuration - 1))}
                                                            className="px-3 rounded-full"
                                                        >
                                                            <i className="fas fa-minus"></i>
                                                        </Button>
                                                        <span className="text-lg font-medium w-8 text-center">{recurringDuration}</span>
                                                        <Button
                                                            variant="outline"
                                                            onClick={() => setRecurringDuration(Math.min(4, Math.min(Math.floor(remainingSubscriptionDays / 7), recurringDuration + 1)))}
                                                            className="px-3 rounded-full"
                                                        >
                                                            <i className="fas fa-plus"></i>
                                                        </Button>
                                                        <span className="ml-2 text-gray-600">周 / weeks</span>

                                                        {recurringDuration >= Math.floor(remainingSubscriptionDays / 7) && (
                                                            <span className="text-yellow-600 text-sm ml-2">
                                                                <i className="fas fa-exclamation-circle mr-1"></i>
                                                                最大可预约周数 / Max weeks
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div>
                                                    <h4 className="font-medium mb-3 flex items-center text-red-500">
                                                        <i className="fas fa-list-alt mr-2"></i>
                                                        可用时间段 / Available Time Slots
                                                    </h4>
                                                    <div className="space-y-2">
                                                        {Array.isArray(tutor?.availability) ? (
                                                            selectedDays.map(selectedDay => {
                                                                // Ensure we are finding within an array of objects
                                                                const availSlot = Array.isArray(tutor.availability)
                                                                    ? tutor.availability.find(
                                                                        (slot): slot is { day: string; startTime: string; endTime: string } =>
                                                                            typeof slot === 'object' && slot.day?.toLowerCase() === selectedDay.toLowerCase()
                                                                    )
                                                                    : undefined;

                                                                return availSlot ? (
                                                                    <div key={selectedDay} className="flex justify-between p-3 bg-white rounded-xl shadow-sm">
                                                                        <span className="font-medium flex items-center">
                                                                            <i className="fas fa-check-circle text-green-500 mr-2"></i>
                                                                            {selectedDay}
                                                                        </span>
                                                                        <span>
                                                                            {availSlot.startTime} - {availSlot.endTime}
                                                                            <span className="ml-2 text-sm text-green-600">({sessionDuration} min)</span>
                                                                        </span>
                                                                    </div>
                                                                ) : (
                                                                    <div key={selectedDay} className="flex justify-between p-3 bg-white rounded-xl shadow-sm opacity-50">
                                                                        <span className="flex items-center">
                                                                            <i className="fas fa-times-circle text-red-400 mr-2"></i>
                                                                            {selectedDay}
                                                                        </span>
                                                                        <span>No availability</span>
                                                                    </div>
                                                                );
                                                            })
                                                        ) : (
                                                            <p className="text-gray-500 p-4 text-center bg-white rounded-xl">无可用时间 / No available time slots</p>
                                                        )}

                                                        {selectedDays.length === 0 && (
                                                            <p className="text-gray-500 p-4 text-center bg-white rounded-xl">请选择至少一天 / Please select at least one day</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="bg-gray-50 rounded-xl p-8 text-center">
                                                <div className="inline-flex justify-center items-center w-16 h-16 bg-red-100 rounded-full mb-4">
                                                    <i className="fas fa-lock text-red-500 text-xl"></i>
                                                </div>
                                                <p className="text-gray-600 mb-4">
                                                    您需要订阅才能与老师预约课程 / You need a subscription to book lessons
                                                </p>
                                                <Button
                                                    onClick={() => navigate('/study/payments')}
                                                    className="bg-red-500 hover:bg-red-600 text-white rounded-full px-8"
                                                    disabled={isSubscribeNavigating}
                                                >
                                                    {isSubscribeNavigating ? (
                                                        <span className="flex items-center">
                                                            <i className="fas fa-spinner fa-spin mr-2"></i>
                                                            处理中 / Processing...
                                                        </span>
                                                    ) : (
                                                        '订阅 / Subscribe'
                                                    )}
                                                </Button>
                                            </div>
                                        )}

                                        {subscriptionStatus.isSubscribed && selectedDays.length > 0 && (
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        备注 / Notes (可选 / Optional)
                                                    </label>
                                                    <Textarea
                                                        placeholder="您有什么特别的学习需求吗？/ Do you have any specific learning needs?"
                                                        value={bookingNotes}
                                                        onChange={(e) => setBookingNotes(e.target.value)}
                                                        className="w-full rounded-xl"
                                                    />
                                                </div>

                                                <Button
                                                    onClick={handleBookingSubmit}
                                                    className="w-full bg-red-500 hover:bg-red-600 text-white rounded-full h-12"
                                                    disabled={remainingSubscriptionDays <= 0 || isBookingLoading}
                                                >
                                                    {isBookingLoading ? (
                                                        <span className="flex items-center justify-center">
                                                            <i className="fas fa-spinner fa-spin mr-2"></i>
                                                            处理中 / Processing...
                                                        </span>
                                                    ) : (
                                                        '确认预约 / Confirm Booking'
                                                    )}
                                                </Button>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="reviews" className="mt-6">
                                <Card className="rounded-2xl shadow-sm overflow-hidden border-0">
                                    <CardContent className="p-6">
                                        <h3 className="text-xl font-bold mb-4 flex items-center">
                                            <i className="fas fa-star text-red-500 mr-2"></i>
                                            学生评价 / Student Reviews
                                        </h3>

                                        {/* Add review form for subscribed users */}
                                        {subscriptionStatus.isSubscribed && (
                                            <div className="mb-6 p-6 bg-gray-50 rounded-xl">
                                                <h4 className="font-medium mb-4 flex items-center">
                                                    <i className="fas fa-pen text-blue-500 mr-2"></i>
                                                    添加您的评价 / Add Your Review
                                                </h4>
                                                <div className="mb-4">
                                                    <label className="block text-sm font-medium mb-2">评分 / Rating</label>
                                                    <div className="flex gap-2">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <button
                                                                key={star}
                                                                type="button"
                                                                onClick={() => setReviewRating(star)}
                                                                className="text-2xl focus:outline-none transition-all transform hover:scale-110"
                                                            >
                                                                <i className={`fas fa-star ${star <= reviewRating ? 'text-yellow-400' : 'text-gray-300'}`}></i>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="mb-4">
                                                    <label className="block text-sm font-medium mb-2">评论 / Comment</label>
                                                    <Textarea
                                                        placeholder="分享您的学习体验 / Share your learning experience"
                                                        value={reviewText}
                                                        onChange={(e) => setReviewText(e.target.value)}
                                                        className="w-full rounded-xl"
                                                    />
                                                </div>
                                                <Button
                                                    onClick={handleSubmitReview}
                                                    className="bg-red-500 hover:bg-red-600 text-white rounded-full"
                                                    disabled={isReviewSubmitLoading}
                                                >
                                                    {isReviewSubmitLoading ? (
                                                        <span className="flex items-center">
                                                            <i className="fas fa-spinner fa-spin mr-2"></i>
                                                            处理中 / Processing...
                                                        </span>
                                                    ) : (
                                                        '提交评价 / Submit Review'
                                                    )}
                                                </Button>
                                            </div>
                                        )}

                                        {/* Display reviews */}
                                        {reviews.length > 0 ? (
                                            <div className="space-y-4">
                                                {reviews.map((review) => (
                                                    <div key={review.id} className="border-b pb-4 last:border-0">
                                                        <div className="flex items-start">
                                                            <div className="flex-shrink-0 mr-3">
                                                                <img
                                                                    src={review.studentAvatar || `https://api.dicebear.com/6.x/initials/svg?seed=${review.studentName}`}
                                                                    alt={review.studentName}
                                                                    className="w-12 h-12 rounded-full border-2 border-white shadow"
                                                                />
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="flex justify-between">
                                                                    <h5 className="font-medium">{review.studentName}</h5>
                                                                    <span className="text-sm text-gray-500">
                                                                        {new Date(review.createdAt).toLocaleDateString()}
                                                                    </span>
                                                                </div>
                                                                <div className="flex text-yellow-400 my-1">
                                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                                        <i
                                                                            key={star}
                                                                            className={`fas fa-star ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                                                        ></i>
                                                                    ))}
                                                                </div>
                                                                <p className="text-gray-700 mt-1">{review.comment}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="bg-gray-50 p-8 rounded-xl text-center">
                                                <div className="inline-flex justify-center items-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
                                                    <i className="fas fa-star text-yellow-500 text-xl"></i>
                                                </div>
                                                <p className="text-gray-500">暂无评价 / No reviews yet</p>
                                                {subscriptionStatus.isSubscribed && (
                                                    <p className="text-gray-500 mt-2">成为第一个评价此老师的学生！ / Be the first to review this tutor!</p>
                                                )}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TutorView;
