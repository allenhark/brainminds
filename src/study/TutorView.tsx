import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, parseISO, addDays, isBefore, isAfter, startOfWeek, addWeeks, startOfDay } from 'date-fns';
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
import wsService from '@/services/wsService';
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

interface Message {
    id: number;
    content: string;
    senderId: number;
    type: string;
    fileUrl?: string;
    fileName?: string;
    createdAt: string;
    isRead: boolean;
}

interface ChatRoom {
    id: number;
    tutorId: number;
    lastMessageAt: string;
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

    // Chat state
    const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isTutorTyping, setIsTutorTyping] = useState(false);
    const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // New state for booking
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [recurringDuration, setRecurringDuration] = useState<number>(4); // 4 weeks by default
    const [reviewText, setReviewText] = useState('');
    const [reviewRating, setReviewRating] = useState(5);
    const [reviews, setReviews] = useState<Review[]>([]);

    // Fetch tutor data, subscription status, and reviews
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const [tutorResponse, subscriptionResponse, userResponse] = await Promise.all([
                    Api.get(`/student/tutors/${id}`),
                    Api.get('/student/subscription'),
                    Api.get('/auth/me')
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
                setSubscriptionStatus(subscriptionResponse.data);
                setCurrentUser(userResponse.data);

                // Generate time slots based on tutor availability
                if (tutorData && tutorData.availability) {
                    generateTimeSlots(tutorData.availability);
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

    // Initialize chat if subscribed
    useEffect(() => {
        if (subscriptionStatus.isSubscribed && tutor && currentUser) {
            initializeChat();
        }
    }, [subscriptionStatus.isSubscribed, tutor, currentUser]);

    // Scroll to bottom of messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Set up WebSocket listeners for chat
    useEffect(() => {
        if (!subscriptionStatus.isSubscribed || !chatRoom || !currentUser) return;

        // Connect to WebSocket
        if (!wsService.isConnected()) {
            wsService.connect(currentUser.id.toString(), 'STUDENT');
        }

        // Set up message listener
        const messageHandler = wsService.on('receive_message', (data: any) => {
            if (data.chatId === chatRoom.id) {
                setMessages(prev => [...prev, data.message]);

                // Mark message as read if from tutor
                if (data.message.senderId !== currentUser.id) {
                    markMessageAsRead(data.message.id);
                }
            }
        });

        // Set up typing indicator listener
        const typingHandler = wsService.on('typing_indicator', (data: any) => {
            if (data.chatId === chatRoom.id && data.userId !== currentUser.id) {
                setIsTutorTyping(data.isTyping);
            }
        });

        // Clean up listeners
        return () => {
            messageHandler();
            typingHandler();
        };
    }, [subscriptionStatus.isSubscribed, chatRoom, currentUser]);

    const initializeChat = async () => {
        try {
            // Check if chat room exists or create one
            const response = await Api.get(`/student/chats?tutorId=${tutor?.id}`);

            if (response.data && response.data.length > 0) {
                setChatRoom(response.data[0]);

                // Fetch messages for this chat room
                const messagesResponse = await Api.get(`/student/chats/${response.data[0].id}/messages`);
                setMessages(messagesResponse.data);
            } else {
                // Create new chat room
                const newChatResponse = await Api.post('/student/chats', {
                    tutorId: tutor?.id
                });

                setChatRoom(newChatResponse.data);
                setMessages([]);
            }
        } catch (error) {
            console.error('Failed to initialize chat:', error);
            toast.error('初始化聊天失败 / Failed to initialize chat');
        }
    };

    const markMessageAsRead = async (messageId: number) => {
        if (!chatRoom) return;

        try {
            await Api.post(`/student/chats/${chatRoom.id}/messages/${messageId}/read`);
        } catch (error) {
            console.error('Failed to mark message as read:', error);
        }
    };

    const handleSendMessage = async () => {
        if ((!newMessage.trim() && !file) || !chatRoom || !currentUser) return;

        try {
            if (file) {
                // Handle file upload
                const formData = new FormData();
                formData.append('file', file);

                if (newMessage.trim()) {
                    formData.append('content', newMessage.trim());
                } else {
                    formData.append('content', 'Sent a file');
                }

                formData.append('type', file.type.startsWith('image/') ? 'image' : 'file');

                const response = await Api.post(`/student/chats/${chatRoom.id}/messages`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                // Check if response contains error
                if (response.data && response.data.error) {
                    throw new Error(response.data.error);
                }

                setFile(null);
            } else {
                // Send text message
                const response = await Api.post(`/student/chats/${chatRoom.id}/messages`, {
                    content: newMessage,
                    type: 'text'
                });

                // Check if response contains error
                if (response.data && response.data.error) {
                    throw new Error(response.data.error);
                }
            }

            setNewMessage('');

            // Send via WebSocket for real-time update
            wsService.sendMessage(
                tutor?.id.toString() || '',
                chatRoom.id,
                newMessage
            );

        } catch (error) {
            console.error('Failed to send message:', error);
            toast.error('发送消息失败 / Failed to send message');
        }
    };

    const handleTyping = () => {
        if (!chatRoom) return;

        if (!isTyping) {
            setIsTyping(true);
            wsService.sendTypingIndicator(tutor?.id.toString() || '', chatRoom.id, true);
        }

        // Clear existing timeout
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }

        // Set new timeout to stop typing indicator after 2 seconds
        const timeout = setTimeout(() => {
            setIsTyping(false);
            wsService.sendTypingIndicator(tutor?.id.toString() || '', chatRoom.id, false);
        }, 2000);

        setTypingTimeout(timeout);
    };

    const handleFileUpload = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const generateTimeSlots = (availability: string | Array<{ day: string; startTime: string; endTime: string }>) => {
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

                // Generate 1-hour time slots for this availability entry
                const [startHour, startMinute] = availSlot.startTime.split(':').map(Number);
                const [endHour, endMinute] = availSlot.endTime.split(':').map(Number);

                let currentHour = startHour;
                let currentMinute = startMinute;

                while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
                    const nextHour = currentMinute + 60 >= 60 ? currentHour + 1 : currentHour;
                    const nextMinute = (currentMinute + 60) % 60;

                    if (nextHour > endHour || (nextHour === endHour && nextMinute > endMinute)) {
                        break;
                    }

                    existingDaySlot.slots.push({
                        startTime: `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`,
                        endTime: `${nextHour.toString().padStart(2, '0')}:${nextMinute.toString().padStart(2, '0')}`,
                        available: true // Assuming available for now
                    });

                    currentHour = nextHour;
                    currentMinute = nextMinute;
                }
            });
        }

        // Sort slots by date
        slots.sort((a, b) => a.date.getTime() - b.date.getTime());

        setTimeSlots(slots);
    };

    const handleDateSelect = (date: Date | undefined) => {
        setSelectedDate(date);
        setSelectedTimeSlot(null);
        setCurrentView('booking');
    };

    const handleTimeSlotSelect = (time: string) => {
        setSelectedTimeSlot(time);
    };

    const getAvailableTimeSlotsForDate = () => {
        if (!selectedDate) return [];

        const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');

        return timeSlots
            .filter(slot => format(slot.date, 'yyyy-MM-dd') === selectedDateStr)
            .flatMap(slot => slot.slots);
    };

    const handleBookingSubmit = async () => {
        if (selectedDays.length === 0 || !tutor) {
            toast.error('请选择至少一天 / Please select at least one day');
            return;
        }

        try {
            // Create recurring sessions for selected days for the specified duration
            const startOfBooking = startOfDay(new Date()); // Start from today
            const sessionsToBook = [];

            // Calculate the end date based on recurring duration (in weeks)
            const endDate = addWeeks(startOfBooking, recurringDuration);

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
                const [endHour, endMinute] = availabilityForDay.endTime.split(':').map(Number);

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

                    const sessionEndTime = new Date(currentDate);
                    sessionEndTime.setHours(endHour, endMinute);

                    // Only add if start time is in the future
                    if (isAfter(sessionStartTime, new Date())) {
                        sessionsToBook.push({
                            startTime: sessionStartTime.toISOString(),
                            endTime: sessionEndTime.toISOString()
                        });
                    }

                    // Move to next week
                    currentDate = addDays(currentDate, 7);
                }
            }

            if (sessionsToBook.length === 0) {
                toast.error('没有可用的课程时间 / No valid session times available');
                return;
            }

            // Book all sessions
            for (const session of sessionsToBook) {
                await Api.post('/student/sessions', {
                    tutorId: tutor.id,
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

        try {
            await Api.post(`/student/tutors/${tutor.id}/reviews`, {
                rating: reviewRating,
                comment: reviewText
            });

            // Add the new review to the local state
            const newReview: Review = {
                id: Date.now(), // Temporary ID until we refresh
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
                                            <Button className="bg-red-500 hover:bg-red-600 text-white w-full rounded-full">
                                                订阅 / Subscribe
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
                                                            onClick={() => setRecurringDuration(Math.min(12, recurringDuration + 1))}
                                                            className="px-3 rounded-full"
                                                        >
                                                            <i className="fas fa-plus"></i>
                                                        </Button>
                                                        <span className="ml-2 text-gray-600">周 / weeks</span>
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
                                                                        <span>{availSlot.startTime} - {availSlot.endTime}</span>
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
                                                >
                                                    订阅 / Subscribe
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
                                                >
                                                    确认预约 / Confirm Booking
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
                                                >
                                                    提交评价 / Submit Review
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

                {/* Chat Container - only shown if subscribed */}
                {subscriptionStatus.isSubscribed && (
                    <div className="mt-8">
                        <Card className="rounded-2xl shadow overflow-hidden border-0">
                            <div className="bg-red-500 p-4">
                                <h3 className="font-semibold text-white flex items-center">
                                    <i className="fas fa-comment-dots mr-2"></i>
                                    与老师沟通 / Chat with Tutor
                                </h3>
                            </div>

                            <div className="h-80 flex flex-col">
                                {/* Messages Container */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                                    {messages.length === 0 ? (
                                        <div className="h-full flex items-center justify-center">
                                            <div className="text-center p-6">
                                                <div className="inline-flex justify-center items-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                                                    <i className="fas fa-comments text-blue-500"></i>
                                                </div>
                                                <p className="text-gray-500">开始与老师沟通 / Start chatting with the tutor</p>
                                            </div>
                                        </div>
                                    ) : (
                                        messages.map((message) => {
                                            const isCurrentUser = message.senderId === currentUser?.id;
                                            return (
                                                <div
                                                    key={message.id}
                                                    className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                                                >
                                                    {!isCurrentUser && (
                                                        <div className="flex-shrink-0 mr-2">
                                                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                                                <i className="fas fa-user text-gray-500"></i>
                                                            </div>
                                                        </div>
                                                    )}
                                                    <div
                                                        className={`max-w-[80%] rounded-2xl p-3 ${isCurrentUser
                                                            ? 'bg-red-500 text-white rounded-tr-none'
                                                            : 'bg-white shadow-sm text-gray-800 rounded-tl-none'
                                                            }`}
                                                    >
                                                        {message.type === 'text' && <p>{message.content}</p>}

                                                        {message.type === 'image' && message.fileUrl && (
                                                            <div>
                                                                <img
                                                                    src={`${url}/${message.fileUrl}`}
                                                                    alt="Shared"
                                                                    className="max-w-full rounded mb-1"
                                                                />
                                                                <p className="text-xs opacity-75">{message.content}</p>
                                                            </div>
                                                        )}

                                                        {message.type === 'file' && message.fileUrl && (
                                                            <div className="flex items-center">
                                                                <i className="fas fa-file mr-2"></i>
                                                                <a
                                                                    href={`${url}/${message.fileUrl}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="underline"
                                                                >
                                                                    {message.fileName || 'Download file'}
                                                                </a>
                                                            </div>
                                                        )}

                                                        <div className="text-xs opacity-75 mt-1">
                                                            {format(new Date(message.createdAt), 'HH:mm')}
                                                        </div>
                                                    </div>
                                                    {isCurrentUser && (
                                                        <div className="flex-shrink-0 ml-2">
                                                            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                                                                <i className="fas fa-user text-red-500"></i>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })
                                    )}

                                    {isTutorTyping && (
                                        <div className="flex justify-start">
                                            <div className="flex-shrink-0 mr-2">
                                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                                    <i className="fas fa-user text-gray-500"></i>
                                                </div>
                                            </div>
                                            <div className="bg-white shadow-sm text-gray-800 rounded-2xl rounded-tl-none p-3">
                                                <div className="flex space-x-1">
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input Area */}
                                <div className="p-4 border-t bg-white">
                                    {file && (
                                        <div className="mb-2 p-2 bg-gray-100 rounded-lg flex justify-between items-center">
                                            <div className="truncate">
                                                <i className={`mr-2 ${file.type.startsWith('image/') ? 'fas fa-image text-green-500' : 'fas fa-file text-blue-500'}`}></i>
                                                {file.name}
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setFile(null)}
                                                className="text-gray-500 hover:text-gray-700 rounded-full"
                                            >
                                                <i className="fas fa-times"></i>
                                            </Button>
                                        </div>
                                    )}

                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={handleFileUpload}
                                            className="flex-shrink-0 rounded-full"
                                        >
                                            <i className="fas fa-paperclip"></i>
                                        </Button>

                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />

                                        <Input
                                            placeholder="输入消息 / Type a message"
                                            value={newMessage}
                                            onChange={(e) => {
                                                setNewMessage(e.target.value);
                                                handleTyping();
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSendMessage();
                                                }
                                            }}
                                            className="flex-1 rounded-full"
                                        />

                                        <Button
                                            onClick={handleSendMessage}
                                            className="flex-shrink-0 bg-red-500 hover:bg-red-600 text-white rounded-full"
                                        >
                                            <i className="fas fa-paper-plane"></i>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TutorView;
