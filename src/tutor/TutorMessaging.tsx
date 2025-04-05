import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { TimePickerDemo } from '@/components/ui/time-picker';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { wsService } from '@/Api';
import Api from '@/Api';

interface Student {
    id: number;
    name: string;
    avatar: string;
    lastSeen: string;
    unreadCount: number;
}

interface Message {
    id: number;
    senderId: number;
    text: string;
    timestamp: string;
    isRead: boolean;
}

const TutorMessaging: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [messageText, setMessageText] = useState('');
    const [schedulingOpen, setSchedulingOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [sessionDate, setSessionDate] = useState<Date | undefined>(undefined);
    const [sessionTime, setSessionTime] = useState<string>('');
    const [sessionLink, setSessionLink] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const tutorId = 1; // This would come from authentication context

    useEffect(() => {
        // Initialize websocket connection when component mounts
        const userId = '1'; // This would come from authentication context
        wsService.connect(userId, 'TUTOR');

        // Load mock data for demonstration
        setTimeout(() => {
            setStudents([
                { id: 101, name: 'Emma Johnson', avatar: 'https://randomuser.me/api/portraits/women/1.jpg', lastSeen: 'Online', unreadCount: 2 },
                { id: 102, name: 'Michael Chen', avatar: 'https://randomuser.me/api/portraits/men/2.jpg', lastSeen: '5 minutes ago', unreadCount: 0 },
                { id: 103, name: 'Sofia Rodriguez', avatar: 'https://randomuser.me/api/portraits/women/3.jpg', lastSeen: '1 hour ago', unreadCount: 1 },
                { id: 104, name: 'Alex Kim', avatar: 'https://randomuser.me/api/portraits/men/4.jpg', lastSeen: 'Yesterday', unreadCount: 0 },
                { id: 105, name: 'Jessica Lee', avatar: 'https://randomuser.me/api/portraits/women/5.jpg', lastSeen: '2 days ago', unreadCount: 0 },
            ]);
        }, 500);

        // Subscribe to message events
        const unsubscribeMessage = wsService.on('receive_message', (data) => {
            // Add message to the chat if it's from the currently selected student
            if (selectedStudent && data.from === selectedStudent.id.toString()) {
                const newMessage = {
                    id: messages.length + 1,
                    senderId: parseInt(data.from),
                    text: data.message,
                    timestamp: data.timestamp,
                    isRead: false
                };
                setMessages(prev => [...prev, newMessage]);

                // Mark message as read since we're viewing this conversation
                wsService.markMessagesAsRead(data.from, data.chatRoomId, [data.messageId]);
            } else {
                // Update unread count for the student
                setStudents(prevStudents =>
                    prevStudents.map(student =>
                        student.id.toString() === data.from
                            ? { ...student, unreadCount: student.unreadCount + 1 }
                            : student
                    )
                );
            }
        });

        // Subscribe to typing indicator
        const unsubscribeTyping = wsService.on('typing_indicator', (data) => {
            // Update typing indicator for selected student
            if (selectedStudent && data.from === selectedStudent.id.toString()) {
                // You could add a typing indicator state here
                console.log('Student is typing:', data.isTyping);
            }
        });

        // Cleanup subscriptions on component unmount
        return () => {
            unsubscribeMessage();
            unsubscribeTyping();
            wsService.disconnect();
        };
    }, []);

    useEffect(() => {
        // Scroll to bottom of messages when messages change
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (selectedStudent) {
            // Fetch messages for selected student (still using the mock data)
            setMessages([]);

            // Load mock messages for demonstration
            setTimeout(() => {
                setMessages([
                    { id: 1, senderId: selectedStudent.id, text: 'Hello! I have a question about my homework.', timestamp: '2023-04-05T14:30:00', isRead: true },
                    { id: 2, senderId: tutorId, text: 'Hi there! I\'d be happy to help. What\'s your question?', timestamp: '2023-04-05T14:31:00', isRead: true },
                    { id: 3, senderId: selectedStudent.id, text: 'I\'m confused about the assignment on page 42. Could we go over it in our next session?', timestamp: '2023-04-05T14:32:00', isRead: true },
                    { id: 4, senderId: tutorId, text: 'Of course! When would you like to schedule our next session?', timestamp: '2023-04-05T14:33:00', isRead: true },
                    { id: 5, senderId: selectedStudent.id, text: 'How about tomorrow at 4 PM?', timestamp: '2023-04-05T14:34:00', isRead: false },
                ]);
            }, 300);

            // Mark any unread messages as read when selecting this student
            if (selectedStudent.unreadCount > 0) {
                // In a real app, you'd have messageIds to mark as read
                // For now, just update the UI
                setStudents(prevStudents =>
                    prevStudents.map(student =>
                        student.id === selectedStudent.id
                            ? { ...student, unreadCount: 0 }
                            : student
                    )
                );
            }
        }
    }, [selectedStudent]);

    const handleSendMessage = () => {
        if (!messageText.trim() || !selectedStudent) return;

        const newMessage = {
            id: messages.length + 1,
            senderId: tutorId,
            text: messageText,
            timestamp: new Date().toISOString(),
            isRead: false
        };

        setMessages([...messages, newMessage]);

        // Send via WebSocket
        wsService.sendMessage(
            selectedStudent.id.toString(),
            1, // chatRoomId - this should be a real chat room ID
            messageText
        );

        setMessageText('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        } else {
            // Send typing indicator
            if (selectedStudent) {
                wsService.sendTypingIndicator(selectedStudent.id.toString(), 1, true);

                // Clear typing indicator after delay
                if (typingTimeout.current) clearTimeout(typingTimeout.current);
                typingTimeout.current = setTimeout(() => {
                    if (selectedStudent) {
                        wsService.sendTypingIndicator(selectedStudent.id.toString(), 1, false);
                    }
                }, 2000);
            }
        }
    };

    // Add typing timeout ref
    const typingTimeout = useRef<NodeJS.Timeout | null>(null);

    const handleScheduleSession = () => {
        if (!sessionDate || !sessionTime || !selectedStudent) {
            toast.error('Please select both date and time for the session');
            return;
        }

        setIsLoading(true);

        // Format date and time for the API
        const formattedDate = format(sessionDate, 'yyyy-MM-dd');

        // Create session data object
        const sessionData = {
            studentId: selectedStudent.id,
            tutorId: tutorId,
            date: formattedDate,
            startTime: sessionTime,
            endTime: calculateEndTime(sessionTime), // Helper function to add 1 hour
            notes: 'Scheduled via messaging',
            classLink: sessionLink || undefined
        };

        // Call the API to create the session
        Api.post('/sessions', sessionData)
            .then(response => {
                // Create confirmation message in the chat
                const newMessage = {
                    id: messages.length + 1,
                    senderId: tutorId,
                    text: `I've scheduled our session for ${format(sessionDate, 'MMMM d, yyyy')} at ${sessionTime}${sessionLink ? `. Here's the link to join: ${sessionLink}` : ''}`,
                    timestamp: new Date().toISOString(),
                    isRead: false
                };

                setMessages([...messages, newMessage]);
                toast.success('Session scheduled and email notification sent!');

                // Reset form
                setSchedulingOpen(false);
                setSessionDate(undefined);
                setSessionTime('');
                setSessionLink('');
            })
            .catch(error => {
                console.error('Failed to schedule session:', error);
                toast.error('Failed to schedule session. Please try again.');
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    // Helper function to calculate end time (1 hour after start time)
    const calculateEndTime = (startTime: string): string => {
        const [hours, minutes] = startTime.split(':').map(Number);
        const endHour = (hours + 1) % 24;
        return `${endHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    };

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="h-[calc(100vh-8rem)]">
            <Tabs defaultValue="messages" className="h-full flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Messaging</h1>
                    <TabsList>
                        <TabsTrigger value="messages">All Messages</TabsTrigger>
                        <TabsTrigger value="unread">Unread</TabsTrigger>
                    </TabsList>
                </div>

                <div className="flex-1 flex h-full">
                    {/* Students List */}
                    <Card className="w-1/3 mr-4 overflow-hidden flex flex-col h-full">
                        <CardHeader className="pb-2">
                            <div className="relative">
                                <Input
                                    placeholder="Search students..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-8"
                                />
                                <i className="far fa-search absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-y-auto px-0 py-0">
                            <TabsContent value="messages" className="m-0 h-full">
                                {filteredStudents.length > 0 ? (
                                    <ul className="divide-y">
                                        {filteredStudents.map(student => (
                                            <li
                                                key={student.id}
                                                className={`flex items-center p-3 cursor-pointer hover:bg-gray-50 ${selectedStudent?.id === student.id ? 'bg-blue-50' : ''}`}
                                                onClick={() => setSelectedStudent(student)}
                                            >
                                                <div className="relative">
                                                    <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full" />
                                                    {student.lastSeen === 'Online' && (
                                                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                                                    )}
                                                </div>
                                                <div className="ml-3 flex-1">
                                                    <div className="flex justify-between">
                                                        <p className="font-medium">{student.name}</p>
                                                        {student.unreadCount > 0 && (
                                                            <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                                                {student.unreadCount}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-500">{student.lastSeen}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-500">
                                        No students found
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="unread" className="m-0 h-full">
                                {filteredStudents.filter(s => s.unreadCount > 0).length > 0 ? (
                                    <ul className="divide-y">
                                        {filteredStudents
                                            .filter(student => student.unreadCount > 0)
                                            .map(student => (
                                                <li
                                                    key={student.id}
                                                    className={`flex items-center p-3 cursor-pointer hover:bg-gray-50 ${selectedStudent?.id === student.id ? 'bg-blue-50' : ''}`}
                                                    onClick={() => setSelectedStudent(student)}
                                                >
                                                    <div className="relative">
                                                        <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full" />
                                                        {student.lastSeen === 'Online' && (
                                                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                                                        )}
                                                    </div>
                                                    <div className="ml-3 flex-1">
                                                        <div className="flex justify-between">
                                                            <p className="font-medium">{student.name}</p>
                                                            <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                                                {student.unreadCount}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-500">{student.lastSeen}</p>
                                                    </div>
                                                </li>
                                            ))}
                                    </ul>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-500">
                                        No unread messages
                                    </div>
                                )}
                            </TabsContent>
                        </CardContent>
                    </Card>

                    {/* Chat Area */}
                    <Card className="flex-1 flex flex-col h-full">
                        {selectedStudent ? (
                            <>
                                <CardHeader className="pb-2 border-b flex-shrink-0">
                                    <div className="flex items-center">
                                        <img src={selectedStudent.avatar} alt={selectedStudent.name} className="w-10 h-10 rounded-full mr-3" />
                                        <div>
                                            <CardTitle>{selectedStudent.name}</CardTitle>
                                            <p className="text-sm text-gray-500">{selectedStudent.lastSeen}</p>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="flex-1 overflow-y-auto p-4">
                                    <div className="space-y-4">
                                        {messages.map(message => (
                                            <div
                                                key={message.id}
                                                className={`flex ${message.senderId === tutorId ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div
                                                    className={`max-w-[70%] rounded-lg p-3 ${message.senderId === tutorId
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-gray-100 text-gray-800'
                                                        }`}
                                                >
                                                    <p>{message.text}</p>
                                                    <p className={`text-xs mt-1 ${message.senderId === tutorId ? 'text-blue-100' : 'text-gray-500'}`}>
                                                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                        <div ref={messagesEndRef} />
                                    </div>
                                </CardContent>

                                <CardFooter className="border-t p-4 flex-shrink-0">
                                    <div className="flex items-end w-full gap-2">
                                        <Textarea
                                            placeholder="Type your message..."
                                            className="flex-1 resize-none"
                                            value={messageText}
                                            onChange={(e) => setMessageText(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            rows={2}
                                        />
                                        <div className="flex flex-col gap-2">
                                            <Button size="icon" variant="ghost" onClick={() => setSchedulingOpen(true)}>
                                                <i className="far fa-calendar-plus text-gray-600"></i>
                                            </Button>
                                            <Button onClick={handleSendMessage} disabled={!messageText.trim()}>
                                                <i className="far fa-paper-plane mr-2"></i>
                                                Send
                                            </Button>
                                        </div>
                                    </div>
                                </CardFooter>
                            </>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                <div className="text-center">
                                    <i className="far fa-comments text-5xl mb-4 text-gray-300"></i>
                                    <p>Select a student to start messaging</p>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>
            </Tabs>

            {/* Session Scheduling Dialog */}
            <Dialog open={schedulingOpen} onOpenChange={setSchedulingOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Schedule a Session</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Select Date</label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start text-left">
                                        {sessionDate ? format(sessionDate, 'PPP') : (
                                            <span className="text-gray-500">Pick a date</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={sessionDate}
                                        onSelect={setSessionDate}
                                        initialFocus
                                        disabled={(date) => date < new Date()}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Select Time</label>
                            <TimePickerDemo value={sessionTime} onChange={setSessionTime} />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Online Class Link (Optional)</label>
                            <Input
                                placeholder="e.g., https://zoom.us/j/123456789"
                                value={sessionLink}
                                onChange={(e) => setSessionLink(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setSchedulingOpen(false)}>Cancel</Button>
                        <Button onClick={handleScheduleSession} disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <i className="far fa-spinner-third fa-spin mr-2"></i>
                                    Scheduling...
                                </>
                            ) : 'Schedule & Notify'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default TutorMessaging; 