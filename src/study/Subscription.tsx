import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Api from '@/Api';
import toast from 'react-hot-toast';
import wsService from '@/services/wsService';
import { Badge } from '@/components/ui/badge';
import HelmetComponent from '@/components/HelmetComponent';
import { QRCodeSVG } from "qrcode.react";

// Types
interface Message {
    id: number;
    content: string;
    senderId: number;
    receiverId: number;
    type: 'text' | 'image' | 'file';
    fileUrl?: string;
    fileName?: string;
    createdAt: string;
    isRead?: boolean;
    relativeTime?: string;
}

interface Chat {
    id: number;
    adminId: number;
    adminName: string;
    adminAvatar?: string;
    lastMessage?: string;
    lastMessageTime?: string;
    unreadCount: number;
}

interface SubscriptionData {
    isSubscribed: boolean;
    subscription: {
        id: number;
        status: string;
        startDate: string;
        endDate: string;
        amount: number;
        paymentMethod: string | null;
        createdAt: string;
    } | null;
}

const Subscription: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('Hello, I would like help subscribing/你好，我想帮助订阅');
    const [chats, setChats] = useState<Chat[]>([]);
    const [selectedChat, setSelectedChat] = useState<number | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const [fileInput, setFileInput] = useState<File | null>(null);
    const [userId, setUserId] = useState<number | null>(null);
    const [isInitialMessage, setIsInitialMessage] = useState<boolean>(true);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>({
        isSubscribed: false,
        subscription: null
    });
    const [subscriptionLoading, setSubscriptionLoading] = useState<boolean>(true);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { mode } = useParams<{ mode: string }>();
    const [retryCount, setRetryCount] = useState<number>(0);
    const [maxRetryAttempts] = useState<number>(5);
    const [retryDelay, setRetryDelay] = useState<number>(1000);
    const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting');
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const wechatId = "https://u.wechat.com/kDAHPYlSKR_Ae9fr_iygEOY?s=2";
    const isRenew = mode === 'renew';
    const price = 13000; // ¥13,000

    useEffect(() => {
        // Check if user is logged in
        const checkUser = async () => {
            try {
                const response = await Api.get('/auth/me');
                const userData = response.data;
                setUserId(userData.id);

                // Connect to WebSocket
                connectWebSocket(userData.id, userData.role);
            } catch (error) {
                console.error('Failed to fetch user data:', error);
                toast.error('Unable to check login status');
            }
        };

        checkUser();

        // Cleanup WebSocket connection on component unmount
        return () => {
            wsService.disconnect();
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
        };
    }, []);

    // Connect to WebSocket with exponential backoff
    const connectWebSocket = (userId: number, role: string) => {
        setConnectionStatus('connecting');

        try {
            // Cast role to the expected type
            wsService.connect(userId.toString(), role as "TUTOR" | "STUDENT" | "ADMIN");
            setConnectionStatus('connected');
            setRetryCount(0);
            setRetryDelay(1000);

            // Set up WebSocket event listeners
            setupWebSocketListeners();
        } catch (error) {
            console.error('WebSocket connection error:', error);
            setConnectionStatus('disconnected');

            // Implement exponential backoff for reconnection
            if (retryCount < maxRetryAttempts) {
                const timeout = Math.min(retryDelay * Math.pow(2, retryCount), 30000);
                setRetryCount(prev => prev + 1);

                reconnectTimeoutRef.current = setTimeout(() => {
                    connectWebSocket(userId, role);
                }, timeout);
            } else {
                toast.error('Failed to connect to chat server. Please refresh the page.');
            }
        }
    };

    const setupWebSocketListeners = () => {
        // Listen for new messages
        wsService.on('receive_message', (data) => {
            if (data.chatId === selectedChat) {
                // Insert message in the correct position based on timestamp
                setMessages(prevMessages => {
                    const newMessages = [...prevMessages];
                    const messageTimestamp = new Date(data.message.createdAt).getTime();

                    // Find the correct position to insert the message
                    let insertIndex = 0;
                    while (
                        insertIndex < newMessages.length &&
                        new Date(newMessages[insertIndex].createdAt).getTime() < messageTimestamp
                    ) {
                        insertIndex++;
                    }

                    // Insert the message at the correct position
                    newMessages.splice(insertIndex, 0, data.message);
                    return newMessages;
                });
                scrollToBottom();
            }

            // Update chat list with new message
            setChats(prevChats => {
                return prevChats.map(chat => {
                    if (chat.id === data.chatId) {
                        return {
                            ...chat,
                            lastMessage: data.message.content,
                            lastMessageTime: data.message.createdAt,
                            unreadCount: chat.id === selectedChat ? 0 : chat.unreadCount + 1
                        };
                    }
                    return chat;
                });
            });
        });

        // Listen for typing indicators
        wsService.on('typing_indicator', (data) => {
            if (data.chatId === selectedChat) {
                setIsTyping(data.isTyping);
            }
        });

        // Listen for connection status
        wsService.on('connect', () => {
            setIsConnected(true);
            setConnectionStatus('connected');
            setRetryCount(0);
            setRetryDelay(1000);
        });

        wsService.on('disconnect', () => {
            setIsConnected(false);
            setConnectionStatus('disconnected');

            // Attempt to reconnect if we have user data
            if (userId) {
                const timeout = Math.min(retryDelay * Math.pow(2, retryCount), 30000);
                setRetryCount(prev => prev + 1);

                reconnectTimeoutRef.current = setTimeout(() => {
                    connectWebSocket(userId, 'STUDENT');
                }, timeout);
            }
        });

        wsService.on('connect_error', (error) => {
            console.error('WebSocket connection error:', error);
            setConnectionStatus('disconnected');

            // Attempt to reconnect if we have user data
            if (userId && retryCount < maxRetryAttempts) {
                const timeout = Math.min(retryDelay * Math.pow(2, retryCount), 30000);
                setRetryCount(prev => prev + 1);

                reconnectTimeoutRef.current = setTimeout(() => {
                    connectWebSocket(userId, 'STUDENT');
                }, timeout);
            }
        });

        wsService.on('reconnect', (attemptNumber) => {
            console.log('WebSocket reconnected after', attemptNumber, 'attempts');
            setConnectionStatus('connected');
            setRetryCount(0);
            setRetryDelay(1000);
        });
    };

    const fetchSubscriptionData = async () => {
        try {
            setSubscriptionLoading(true);
            const response = await Api.get('/subscriptions');
            setSubscriptionData(response.data);
        } catch (error) {
            console.error('Failed to fetch subscription data:', error);
            // Default to non-subscribed state if can't fetch data
            setSubscriptionData({
                isSubscribed: false,
                subscription: null
            });
        } finally {
            setSubscriptionLoading(false);
        }
    };

    useEffect(() => {
        // Fetch user chats
        const fetchChats = async () => {
            try {
                const response = await Api.get('/chats');
                setChats(response.data);

                // Select the first chat by default if available
                if (response.data.length > 0 && !selectedChat) {
                    setSelectedChat(response.data[0].id);
                    // Reset message if a chat is already started
                    setMessage('');
                    setIsInitialMessage(false);
                }
            } catch (error) {
                console.error('Failed to fetch chats:', error);
            }
        };

        if (userId) {
            fetchChats();
        }
    }, [userId]);

    useEffect(() => {
        // Fetch messages when a chat is selected
        if (selectedChat) {
            const fetchMessages = async () => {
                try {
                    setLoading(true);
                    const response = await Api.get(`/chats/${selectedChat}/messages`);

                    // Sort messages by timestamp in ascending order (oldest first)
                    const sortedMessages = [...response.data].sort((a: Message, b: Message) =>
                        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                    );

                    setMessages(sortedMessages);
                    scrollToBottom();

                    // Mark messages as read
                    if (isConnected) {
                        const unreadMessageIds = sortedMessages
                            .filter((msg: Message) => msg.senderId !== userId && !msg.isRead)
                            .map((msg: Message) => msg.id);

                        if (unreadMessageIds.length > 0) {
                            wsService.markMessagesAsRead(
                                userId?.toString() || '',
                                selectedChat,
                                unreadMessageIds
                            );
                        }
                    }
                } catch (error) {
                    console.error('Failed to fetch messages:', error);
                    toast.error('Failed to load messages');
                } finally {
                    setLoading(false);
                }
            };

            fetchMessages();
        }
    }, [selectedChat, userId, isConnected]);

    // Fetch subscription data when component mounts
    useEffect(() => {
        fetchSubscriptionData();
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async () => {
        if (!message.trim() && !fileInput) return;

        try {
            setLoading(true);

            if (isInitialMessage) {
                // Create new chat with initial message
                const response = await Api.post('/chats', {
                    message: message
                });

                const newChat = response.data;
                setChats([...chats, newChat]);
                setSelectedChat(newChat.id);
                setMessages([newChat.newMessage]);
                setIsInitialMessage(false);
                // Reset message after sending initial message
                setMessage('');

                // Send message via WebSocket
                if (isConnected) {
                    wsService.sendMessage(
                        'admin', // Send to admin role
                        newChat.id,
                        message
                    );
                }

                toast.success('Message sent! An admin will respond shortly. / 消息已发送！管理员将尽快回复。');
            } else if (selectedChat) {
                let messageId = null;
                let fileUrl = null;
                let fileName = null;

                // If there's a file, upload it first
                if (fileInput) {
                    const formData = new FormData();
                    formData.append('file', fileInput);

                    const uploadResponse = await Api.post('/upload', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });

                    fileUrl = uploadResponse.data.url;
                    fileName = fileInput.name;
                }

                // Create message in database
                const formData = new FormData();
                formData.append('content', message);
                if (fileUrl) {
                    formData.append('fileUrl', fileUrl);
                    formData.append('fileName', fileName || '');
                    formData.append('type', fileInput?.type.startsWith('image/') ? 'image' : 'file');
                }

                const response = await Api.post(`/chats/${selectedChat}/messages`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                const newMessage = response.data;
                messageId = newMessage.id;

                // Update UI - insert message in the correct position based on timestamp
                setMessages(prevMessages => {
                    const newMessages = [...prevMessages];
                    const messageTimestamp = new Date(newMessage.createdAt).getTime();

                    // Find the correct position to insert the message
                    let insertIndex = 0;
                    while (
                        insertIndex < newMessages.length &&
                        new Date(newMessages[insertIndex].createdAt).getTime() < messageTimestamp
                    ) {
                        insertIndex++;
                    }

                    // Insert the message at the correct position
                    newMessages.splice(insertIndex, 0, newMessage);
                    return newMessages;
                });

                setMessage('');
                setFileInput(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                scrollToBottom();

                // Send message via WebSocket
                if (isConnected) {
                    wsService.sendMessage(
                        'admin', // Send to admin role
                        selectedChat,
                        message,
                        messageId
                    );
                }
            }
        } catch (error) {
            console.error('Failed to send message:', error);
            toast.error('Failed to send message');
        } finally {
            setLoading(false);
        }
    };

    const handleSubscribe = () => {
        navigate('/payment', { state: { amount: price, purpose: 'subscription' } });
    };

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('ja-JP', {
            style: 'currency',
            currency: 'JPY',
            minimumFractionDigits: 0
        }).format(amount);
    };

    // Format timestamp to local time
    const formatTimestamp = (timestamp: string) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return date.toLocaleString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleTypingIndicator = (isTyping: boolean) => {
        if (selectedChat && isConnected) {
            wsService.sendTypingIndicator(
                selectedChat.toString(), // Send to specific chat room
                selectedChat,
                isTyping
            );
        }
    };

    if (subscriptionLoading) {
        return (
            <div className="flex justify-center items-center h-full py-20">
                <div className="text-center">
                    <i className="fas fa-spinner fa-spin text-red-500 text-3xl mb-4"></i>
                    <p className="text-gray-600">加载中... Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container max-w-6xl mx-auto px-4 py-8">
            <HelmetComponent
                title="订阅管理 | Subscription Management"
                description="管理您的订阅和支付信息"
                keywords="订阅, 支付, 管理"
                ogTitle="订阅管理 | Subscription Management"
                ogDescription="管理您的订阅和支付信息"
                ogUrl={window.location.href}
            />

            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-4">
                        订阅管理
                        <span className="block text-xl mt-2 text-gray-600">Subscription Management</span>
                    </h1>
                    {connectionStatus !== 'connected' && (
                        <div className="mb-4">
                            <Badge
                                variant={connectionStatus === 'connecting' ? 'secondary' : 'destructive'}
                                className="px-3 py-1"
                            >
                                <div className={`w-2 h-2 mr-2 rounded-full ${connectionStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                                {connectionStatus === 'connecting' ? 'Connecting...' : 'Disconnected'}
                            </Badge>
                        </div>
                    )}
                </div>

                {/* Subscription Status Card */}
                <Card className="bg-gradient-to-b from-red-50 via-red-50/50 to-white mb-8">
                    <CardHeader>
                        <CardTitle className="text-2xl">
                            订阅状态
                            <span className="block text-lg mt-1 text-gray-600">Subscription Status</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {subscriptionData.isSubscribed ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                                    <div>
                                        <h3 className="font-bold text-green-700 mb-1">
                                            已订阅
                                            <span className="block text-sm mt-1">Active Subscription</span>
                                        </h3>
                                        <p className="text-sm text-gray-700">
                                            到期日: {formatDate(subscriptionData.subscription?.endDate)}
                                            <span className="block">Expires: {formatDate(subscriptionData.subscription?.endDate)}</span>
                                        </p>
                                    </div>
                                    <Badge className="bg-green-500 text-white py-1 px-3 text-sm">
                                        <i className="fas fa-check-circle mr-1"></i> 有效
                                    </Badge>
                                </div>

                                <div className="bg-white p-4 rounded-lg border">
                                    <h4 className="font-semibold mb-2">
                                        订阅详情
                                        <span className="block text-sm text-gray-600">Subscription Details</span>
                                    </h4>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div>
                                            <p className="text-gray-500">开始日期 / Start Date</p>
                                            <p>{formatDate(subscriptionData.subscription?.startDate)}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">金额 / Amount</p>
                                            <p>{formatCurrency(subscriptionData.subscription?.amount || 0)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-center mt-4">
                                    <Button
                                        variant="outline"
                                        className="bg-white hover:bg-red-50 text-red-500 border-red-200"
                                        onClick={() => navigate('/study/subscription/renew')}
                                    >
                                        <i className="fas fa-sync-alt mr-2"></i>
                                        续订会员
                                        <span className="block text-xs mt-0.5">Renew Subscription</span>
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                                    <div>
                                        <h3 className="font-bold text-yellow-700 mb-1">
                                            未订阅
                                            <span className="block text-sm mt-1">No Active Subscription</span>
                                        </h3>
                                        <p className="text-sm text-gray-700">
                                            订阅后解锁全部功能
                                            <span className="block">Subscribe to unlock all features</span>
                                        </p>
                                    </div>
                                    <Badge className="bg-yellow-500 text-white py-1 px-3 text-sm">
                                        <i className="fas fa-exclamation-circle mr-1"></i> 未激活
                                    </Badge>
                                </div>

                                <div className="bg-white p-6 rounded-lg border text-center">
                                    <h4 className="font-semibold text-lg mb-4">
                                        会员套餐
                                        <span className="block text-base text-gray-600 mt-1">Subscription Plan</span>
                                    </h4>
                                    <div className="mb-4">
                                        <p className="text-4xl font-bold text-red-500">{formatCurrency(price)}</p>
                                        <p className="text-sm text-gray-500">每月 / per month</p>
                                    </div>
                                    <ul className="text-left mb-6 space-y-2">
                                        <li className="flex items-start">
                                            <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                                            <span>一对一个人辅导 / 1-on-1 personal tutoring</span>
                                        </li>
                                        <li className="flex items-start">
                                            <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                                            <span>无限次聊天支持 / Unlimited chat support</span>
                                        </li>
                                        <li className="flex items-start">
                                            <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                                            <span>学习资料库访问 / Access to learning materials</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </CardContent>

                    <CardHeader>
                        <CardTitle className="text-2xl">
                            订阅帮助
                            <span className="block text-lg mt-1 text-gray-600">Subscription Support</span>
                        </CardTitle>
                        <CardDescription>
                            需要帮助订阅？我们的客服团队随时为您服务
                            <span className="block text-sm mt-1">
                                Need help with subscription? Our support team is here to help
                            </span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">或者通过微信联系 / Or contact via WeChat</span>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg border text-center">
                            <h4 className="font-semibold text-lg mb-4">
                                微信联系
                                <span className="block text-base text-gray-600 mt-1">WeChat Contact</span>
                            </h4>
                            <p className="text-gray-600 mb-4">
                                扫描二维码添加客服微信，了解更多课程详情和支付方式
                                <span className="block mt-1">Scan QR code to add our customer service on WeChat for more course details and payment options</span>
                            </p>
                            <div className="bg-gray-100 p-4 rounded-lg flex justify-center">
                                <div className="w-48 h-48 bg-white p-2 rounded">
                                    <QRCodeSVG
                                        value={wechatId}
                                        size={200}
                                        level="H"
                                        includeMargin={true}
                                    />
                                </div>
                            </div>
                            <p className="text-center text-sm text-gray-500 mt-2">
                                扫描二维码添加客服微信
                                <span className="block">Scan QR code to add customer service on WeChat</span>
                            </p>
                        </div>
                    </CardContent>

                    <CardContent>
                        {!selectedChat ? (
                            <div className="space-y-4">
                                <Textarea
                                    placeholder="请输入您的消息 / Enter your message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="min-h-[100px] resize-none"
                                />
                                <Button
                                    onClick={handleSendMessage}
                                    disabled={loading || !message.trim()}
                                    className="w-full bg-red-500 hover:bg-red-600"
                                >
                                    {loading ? (
                                        <>
                                            <i className="fas fa-spinner fa-spin mr-2"></i>
                                            发送中... Sending...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-paper-plane mr-2"></i>
                                            发送消息 Send Message
                                        </>
                                    )}
                                </Button>


                            </div>
                        ) : (
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="font-semibold">
                                            客服对话
                                            <span className="block text-sm text-gray-600">Support Chat</span>
                                        </h3>
                                        <p className="text-xs text-gray-500">
                                            我们会尽快回复您的消息
                                            <span className="block">We'll respond to your message as soon as possible</span>
                                        </p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setSelectedChat(null)}
                                        className="rounded-full"
                                    >
                                        <i className="fas fa-times"></i>
                                    </Button>
                                </div>

                                <div className="h-[400px] overflow-y-auto p-4 bg-white rounded-lg border mb-4">
                                    {messages.length === 0 && !loading ? (
                                        <div className="flex justify-center items-center h-full text-gray-500">
                                            <p>No messages yet / 还没有消息</p>
                                        </div>
                                    ) : (
                                        messages.map((message) => (
                                            <div
                                                key={message.id}
                                                className={`mb-4 ${message.senderId === userId ? 'text-right' : 'text-left'
                                                    }`}
                                            >
                                                <div
                                                    className={`inline-block p-3 rounded-lg ${message.senderId === userId
                                                        ? 'bg-red-500 text-white'
                                                        : 'bg-gray-100'
                                                        }`}
                                                >
                                                    <p className="text-sm">{message.content}</p>
                                                    <p className="text-xs mt-1 opacity-70">
                                                        {message.relativeTime || formatTimestamp(message.createdAt)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                    {loading && (
                                        <div className="flex justify-center">
                                            <i className="fas fa-spinner fa-spin text-red-500 text-xl"></i>
                                        </div>
                                    )}
                                    {isTyping && (
                                        <div className="text-left mb-4">
                                            <div className="inline-block p-2 px-4 rounded-lg bg-gray-100">
                                                <div className="flex space-x-1">
                                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                <div className="flex gap-2">
                                    <Input
                                        value={message}
                                        onChange={(e) => {
                                            setMessage(e.target.value);
                                            // Handle typing indicators
                                            if (selectedChat && isConnected) {
                                                if (!isTyping && e.target.value.trim()) {
                                                    setIsTyping(true);
                                                    handleTypingIndicator(true);
                                                } else if (isTyping && !e.target.value.trim()) {
                                                    setIsTyping(false);
                                                    handleTypingIndicator(false);
                                                }
                                            }
                                        }}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                        placeholder="输入消息... Type a message..."
                                        className="flex-1"
                                    />
                                    <Button
                                        onClick={handleSendMessage}
                                        disabled={loading || !message.trim()}
                                        className="bg-red-500 hover:bg-red-600"
                                    >
                                        <i className="fas fa-paper-plane"></i>
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* WeChat Contact Card - Always visible */}
                <Card className="bg-gradient-to-b from-green-50 via-green-50/50 to-white mb-8">
                    <CardHeader>
                        <CardTitle className="text-2xl">
                            微信联系
                            <span className="block text-lg mt-1 text-gray-600">WeChat Contact</span>
                        </CardTitle>
                        <CardDescription>
                            扫描二维码添加客服微信，了解更多课程详情和支付方式
                            <span className="block text-sm mt-1">
                                Scan QR code to add our customer service on WeChat for more course details and payment options
                            </span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-white p-6 rounded-lg border text-center">
                            <div className="bg-gray-100 p-4 rounded-lg flex justify-center">
                                <div className="w-48 h-48 bg-white p-2 rounded">
                                    <QRCodeSVG
                                        value={wechatId}
                                        size={200}
                                        level="H"
                                        includeMargin={true}
                                    />
                                </div>
                            </div>
                            <p className="text-center text-sm text-gray-500 mt-4">
                                扫描二维码添加客服微信
                                <span className="block">Scan QR code to add customer service on WeChat</span>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Subscription;