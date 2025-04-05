import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Api from '@/Api';
import { wsService } from '@/Api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

// Types
interface Tutor {
    id: number;
    firstName: string;
    lastName: string;
    avatar?: string;
    subjects: string[];
    lastSeen: string;
}

interface Message {
    id: number;
    senderId: number;
    text: string;
    timestamp: string;
    isRead: boolean;
}

interface SubscriptionStatus {
    isSubscribed: boolean;
    expiryDate?: string;
}

const Messages: React.FC = () => {
    const [tutors, setTutors] = useState<Tutor[]>([]);
    const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [messageText, setMessageText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>({
        isSubscribed: false
    });

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const location = useLocation();
    const navigate = useNavigate();

    // Check if a tutor was selected from another page
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tutorId = params.get('tutor');

        if (tutorId && tutors.length > 0) {
            const tutor = tutors.find(t => t.id === parseInt(tutorId));
            if (tutor) {
                setSelectedTutor(tutor);
            }
        }
    }, [location.search, tutors]);

    // Scroll to bottom of messages when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Fetch tutors and subscription status
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);

                // In a real app, make API calls to get tutors and subscription status
                const [tutorsResponse, subscriptionResponse] = await Promise.all([
                    Api.get('/student/tutors'),
                    Api.get('/student/subscription')
                ]);

                setTutors(tutorsResponse.data);
                setSubscriptionStatus(subscriptionResponse.data);
            } catch (error) {
                console.error('Failed to load data:', error);
                toast.error('Failed to load tutors');

                // Mock data for development
                setTutors([
                    {
                        id: 1,
                        firstName: 'John',
                        lastName: 'Smith',
                        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
                        subjects: ['Mathematics', 'Physics'],
                        lastSeen: 'Online'
                    },
                    {
                        id: 2,
                        firstName: 'Emily',
                        lastName: 'Chen',
                        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily',
                        subjects: ['Chemistry', 'Biology'],
                        lastSeen: '5 minutes ago'
                    },
                    {
                        id: 3,
                        firstName: 'Michael',
                        lastName: 'Wong',
                        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael',
                        subjects: ['English', 'Literature'],
                        lastSeen: '1 hour ago'
                    }
                ]);

                setSubscriptionStatus({ isSubscribed: false });
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();

        // Initialize WebSocket connection
        const initWebSocket = () => {
            if (subscriptionStatus.isSubscribed) {
                const userId = '123'; // This would come from auth context
                wsService.connect(userId, 'STUDENT');

                // Subscribe to message events
                const unsubscribeMessage = wsService.on('receive_message', (data) => {
                    console.log('Received message:', data);

                    // Add message to chat if from selected tutor
                    if (selectedTutor && data.from === selectedTutor.id.toString()) {
                        const newMessage = {
                            id: messages.length + 1,
                            senderId: parseInt(data.from),
                            text: data.message,
                            timestamp: data.timestamp,
                            isRead: false
                        };
                        setMessages(prev => [...prev, newMessage]);

                        // Mark message as read
                        wsService.markMessagesAsRead(data.from, data.chatRoomId, [data.messageId]);
                    }
                });

                return unsubscribeMessage;
            }
            return () => { };
        };

        const unsubscribe = initWebSocket();

        // Cleanup on component unmount
        return () => {
            unsubscribe();
            wsService.disconnect();
        };
    }, [subscriptionStatus.isSubscribed]);

    // Load messages when selecting a tutor
    useEffect(() => {
        if (selectedTutor) {
            const fetchMessages = async () => {
                try {
                    const response = await Api.get(`/student/messages/${selectedTutor.id}`);
                    setMessages(response.data);
                } catch (error) {
                    console.error('Failed to load messages:', error);

                    // Mock data for development
                    setMessages([
                        {
                            id: 1,
                            senderId: selectedTutor.id,
                            text: 'Hello! How can I help you with your studies today?',
                            timestamp: new Date(new Date().getTime() - 2 * 60 * 60 * 1000).toISOString(),
                            isRead: true
                        },
                        {
                            id: 2,
                            senderId: 123, // Student ID
                            text: 'Hi! I\'m having trouble with calculus derivatives. Could you help explain them?',
                            timestamp: new Date(new Date().getTime() - 1.5 * 60 * 60 * 1000).toISOString(),
                            isRead: true
                        },
                        {
                            id: 3,
                            senderId: selectedTutor.id,
                            text: 'Of course! Derivatives measure the rate of change of a function. Would you like me to explain the power rule first?',
                            timestamp: new Date(new Date().getTime() - 1 * 60 * 60 * 1000).toISOString(),
                            isRead: true
                        }
                    ]);
                }
            };

            if (subscriptionStatus.isSubscribed) {
                fetchMessages();
            }
        } else {
            setMessages([]);
        }
    }, [selectedTutor, subscriptionStatus.isSubscribed]);

    const handleSendMessage = () => {
        if (!messageText.trim() || !selectedTutor || !subscriptionStatus.isSubscribed) return;

        const newMessage = {
            id: messages.length + 1,
            senderId: 123, // Student ID, would come from auth context
            text: messageText,
            timestamp: new Date().toISOString(),
            isRead: false
        };

        setMessages([...messages, newMessage]);

        // Send via WebSocket
        if (subscriptionStatus.isSubscribed) {
            wsService.sendMessage(
                selectedTutor.id.toString(),
                1, // chatRoomId - this should be a real chat room ID
                messageText
            );
        }

        setMessageText('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return format(date, 'h:mm a');
    };

    const formatDate = (timestamp: string) => {
        const date = new Date(timestamp);
        return format(date, 'MMM d, yyyy');
    };

    // Filter tutors based on search
    const filteredTutors = tutors.filter(tutor => {
        const fullName = `${tutor.firstName} ${tutor.lastName}`.toLowerCase();
        return fullName.includes(searchQuery.toLowerCase()) ||
            tutor.subjects.some(subject => subject.toLowerCase().includes(searchQuery.toLowerCase()));
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-8rem)]">
            <h1 className="text-2xl font-bold mb-4">Messages</h1>

            {!subscriptionStatus.isSubscribed && (
                <Alert className="mb-4 bg-amber-50 border-amber-200">
                    <i className="fas fa-exclamation-triangle text-amber-500 mr-2"></i>
                    <AlertTitle className="text-amber-800">Subscription Required</AlertTitle>
                    <AlertDescription className="text-amber-700">
                        You need an active subscription to message tutors.
                        <div className="mt-2">
                            <Button onClick={() => navigate('/study/payments')} variant="outline" className="bg-white">
                                Subscribe Now
                            </Button>
                        </div>
                    </AlertDescription>
                </Alert>
            )}

            <div className="flex flex-col md:flex-row h-full gap-4 bg-white rounded-lg shadow overflow-hidden">
                {/* Tutors List */}
                <div className="w-full md:w-80 flex flex-col border-r">
                    <div className="p-3 border-b">
                        <div className="relative">
                            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                            <Input
                                type="text"
                                placeholder="Search tutors..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {filteredTutors.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                                No tutors found
                            </div>
                        ) : (
                            <ul className="divide-y">
                                {filteredTutors.map(tutor => (
                                    <li
                                        key={tutor.id}
                                        className={`p-3 flex items-center hover:bg-gray-50 cursor-pointer ${selectedTutor?.id === tutor.id ? 'bg-blue-50' : ''
                                            }`}
                                        onClick={() => setSelectedTutor(tutor)}
                                    >
                                        <div className="relative mr-3">
                                            <img
                                                src={tutor.avatar}
                                                alt={`${tutor.firstName} ${tutor.lastName}`}
                                                className="w-12 h-12 rounded-full"
                                            />
                                            {tutor.lastSeen === 'Online' && (
                                                <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <p className="font-medium truncate">
                                                    {tutor.firstName} {tutor.lastName}
                                                </p>
                                                <span className="text-xs text-gray-500">
                                                    {tutor.lastSeen}
                                                </span>
                                            </div>
                                            <div className="mt-1 flex flex-wrap gap-1">
                                                {tutor.subjects.slice(0, 2).map((subject, idx) => (
                                                    <Badge key={idx} variant="secondary" className="text-xs">
                                                        {subject}
                                                    </Badge>
                                                ))}
                                                {tutor.subjects.length > 2 && (
                                                    <span className="text-xs text-gray-500">+{tutor.subjects.length - 2}</span>
                                                )}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 flex flex-col">
                    {selectedTutor ? (
                        <>
                            {/* Tutor Header */}
                            <div className="p-3 border-b flex items-center">
                                <img
                                    src={selectedTutor.avatar}
                                    alt={`${selectedTutor.firstName} ${selectedTutor.lastName}`}
                                    className="w-10 h-10 rounded-full mr-3"
                                />
                                <div className="flex-1">
                                    <p className="font-medium">
                                        {selectedTutor.firstName} {selectedTutor.lastName}
                                        {selectedTutor.lastSeen === 'Online' && (
                                            <Badge className="ml-2 bg-green-100 text-green-800 border-0">Online</Badge>
                                        )}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {selectedTutor.subjects.join(', ')}
                                    </p>
                                </div>
                            </div>

                            {/* Messages List */}
                            <div className="flex-1 overflow-y-auto p-4">
                                {subscriptionStatus.isSubscribed ? (
                                    <>
                                        {messages.length === 0 ? (
                                            <div className="h-full flex flex-col items-center justify-center text-gray-500">
                                                <i className="fas fa-comment-dots text-5xl mb-2 text-gray-300"></i>
                                                <p>No messages yet. Start a conversation!</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {messages.map((message, index) => {
                                                    const isCurrentUser = message.senderId !== selectedTutor.id;

                                                    // Check if we should show date
                                                    const showDate = index === 0 || (
                                                        new Date(message.timestamp).toDateString() !==
                                                        new Date(messages[index - 1].timestamp).toDateString()
                                                    );

                                                    return (
                                                        <React.Fragment key={message.id}>
                                                            {showDate && (
                                                                <div className="text-center my-4">
                                                                    <div className="inline-block px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-500">
                                                                        {formatDate(message.timestamp)}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                                                                <div className={`max-w-[75%] rounded-lg px-4 py-2 ${isCurrentUser
                                                                    ? 'bg-blue-500 text-white rounded-br-none'
                                                                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
                                                                    }`}>
                                                                    <p>{message.text}</p>
                                                                    <div className={`text-xs mt-1 ${isCurrentUser ? 'text-blue-100' : 'text-gray-500'}`}>
                                                                        {formatTime(message.timestamp)}
                                                                        {isCurrentUser && (
                                                                            <span className="ml-2">
                                                                                {message.isRead ? (
                                                                                    <i className="fas fa-check-double"></i>
                                                                                ) : (
                                                                                    <i className="fas fa-check"></i>
                                                                                )}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </React.Fragment>
                                                    );
                                                })}
                                                <div ref={messagesEndRef} />
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center">
                                        <div className="text-center max-w-md">
                                            <i className="fas fa-lock text-5xl mb-4 text-gray-300"></i>
                                            <h3 className="text-xl font-semibold mb-2">Subscription Required</h3>
                                            <p className="text-gray-600 mb-4">
                                                You need an active subscription to message tutors. Subscribe to unlock messaging and connect with our expert tutors.
                                            </p>
                                            <Button onClick={() => navigate('/study/payments')}>
                                                Subscribe Now
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Message Input */}
                            {subscriptionStatus.isSubscribed && (
                                <div className="p-3 border-t">
                                    <div className="flex items-end gap-2">
                                        <Textarea
                                            placeholder={`Message ${selectedTutor.firstName}...`}
                                            value={messageText}
                                            onChange={(e) => setMessageText(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            className="flex-1 resize-none"
                                            rows={2}
                                        />
                                        <Button
                                            onClick={handleSendMessage}
                                            disabled={!messageText.trim() || !subscriptionStatus.isSubscribed}
                                        >
                                            <i className="fas fa-paper-plane mr-2"></i>
                                            Send
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-500">
                            <i className="fas fa-comments text-6xl mb-4 text-gray-300"></i>
                            <p className="text-lg">Select a tutor to start messaging</p>
                            <p className="text-sm mt-2">
                                {subscriptionStatus.isSubscribed
                                    ? 'Choose a tutor from the list to begin a conversation'
                                    : 'Subscribe to unlock messaging with our tutors'
                                }
                            </p>
                            {!subscriptionStatus.isSubscribed && (
                                <Button onClick={() => navigate('/study/payments')} className="mt-4">
                                    Subscribe Now
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Messages; 