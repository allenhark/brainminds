import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Api from '@/Api';
import { url } from '@/config';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import toast from 'react-hot-toast';
import wsService from '@/services/wsService';
import HelmetComponent from '@/components/HelmetComponent';

// Types
interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    avatar?: string;
}

interface AdminChat {
    id: number;
    userId: number;
    adminId: number;
    user: User;
    admin: User;
    lastMessage?: string;
    lastMessageTime?: string;
    unreadCount: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

interface Message {
    id: number;
    chatId: number;
    senderId: number;
    content: string;
    type: 'text' | 'image' | 'file';
    fileUrl?: string;
    fileName?: string;
    isRead: boolean;
    sender: User;
    createdAt: string;
    updatedAt: string;
    relativeTime?: string;
}

const AdminSupport: React.FC = () => {
    // State for chats and messages
    const [chats, setChats] = useState<AdminChat[]>([]);
    const [filteredChats, setFilteredChats] = useState<AdminChat[]>([]);
    const [selectedChat, setSelectedChat] = useState<number | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [pageSize] = useState<number>(25);
    const [userId, setUserId] = useState<number | null>(null);
    const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting');
    const [retryCount, setRetryCount] = useState<number>(0);
    const [fileInput, setFileInput] = useState<File | null>(null);
    const [activeTab, setActiveTab] = useState<string>('all');

    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // Initialize WebSocket connection and fetch user data
    useEffect(() => {
        const initializeUser = async () => {
            try {
                const response = await Api.get('/auth/me');
                const userData = response.data;
                setUserId(userData.id);

                // Initialize WebSocket
                connectWebSocket(userData.id, userData.role);
            } catch (error) {
                console.error('Failed to fetch user data:', error);
                toast.error('Failed to authenticate. Please refresh the page.');
            }
        };

        initializeUser();

        return () => {
            wsService.disconnect();
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

            // Set up WebSocket event listeners
            setupWebSocketListeners();
        } catch (error) {
            console.error('WebSocket connection error:', error);
            setConnectionStatus('disconnected');

            // Implement exponential backoff for reconnection
            const timeout = Math.min(1000 * Math.pow(2, retryCount), 30000);
            setRetryCount(prev => prev + 1);

            setTimeout(() => {
                connectWebSocket(userId, role);
            }, timeout);
        }
    };

    // Set up WebSocket event listeners
    const setupWebSocketListeners = () => {
        wsService.on('connect', () => {
            setConnectionStatus('connected');
            setRetryCount(0);
            fetchChats();
        });

        wsService.on('disconnect', () => {
            setConnectionStatus('disconnected');
        });

        wsService.on('adminMessage', (data) => {
            handleIncomingMessage(data);
        });

        wsService.on('adminTyping', (data) => {
            if (data.chatId === selectedChat) {
                setIsTyping(data.isTyping);
            }
        });
    };

    // Handle incoming messages from WebSocket
    const handleIncomingMessage = (data: any) => {
        if (data.chatId === selectedChat && data.message) {
            setMessages(prevMessages => {
                const newMessages = [...prevMessages];
                const insertIndex = newMessages.findIndex(msg =>
                    new Date(msg.createdAt) > new Date(data.message.createdAt)
                );
                if (insertIndex === -1) {
                    newMessages.push(data.message);
                } else {
                    newMessages.splice(insertIndex, 0, data.message);
                }
                return newMessages;
            });
            scrollToBottom();
        }

        // Update chat list with new message
        setChats(prevChats => {
            return prevChats.map(chat => {
                if (chat.id === data.chatId && data.message) {
                    return {
                        ...chat,
                        lastMessage: data.message.content || '',
                        lastMessageTime: data.message.createdAt || new Date().toISOString(),
                        unreadCount: chat.id === selectedChat ? 0 : chat.unreadCount + 1
                    };
                }
                return chat;
            });
        });
    };

    // Fetch all chats
    useEffect(() => {
        if (userId) {
            fetchChats();
        }
    }, [userId, page, pageSize, activeTab]);

    const fetchChats = async () => {
        try {
            setLoading(true);
            const response = await Api.get('/admin-chat/chats', {
                params: {
                    page,
                    pageSize,
                    status: activeTab === 'all' ? '' : activeTab
                }
            });
            setChats(response.data.chats);
            setTotalPages(response.data.totalPages || 1);
        } catch (error) {
            console.error('Failed to fetch chats:', error);
            toast.error('Failed to load chats');
        } finally {
            setLoading(false);
        }
    };

    // Filter chats based on search query
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredChats(chats);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = chats.filter(chat =>
                chat.user.firstName.toLowerCase().includes(query) ||
                chat.user.lastName.toLowerCase().includes(query) ||
                chat.user.email.toLowerCase().includes(query) ||
                (chat.lastMessage && chat.lastMessage.toLowerCase().includes(query))
            );
            setFilteredChats(filtered);
        }
    }, [chats, searchQuery]);

    // Fetch messages when a chat is selected
    useEffect(() => {
        if (selectedChat) {
            fetchMessages(selectedChat);
        }
    }, [selectedChat]);

    const fetchMessages = async (chatId: number) => {
        try {
            setLoadingMessages(true);
            const response = await Api.get(`/admin-chat/chats/${chatId}/messages`);
            setMessages(response.data);
            scrollToBottom();

            // Mark messages as read
            markMessagesAsRead(chatId);

            // Update unread count in chat list
            setChats(prevChats =>
                prevChats.map(chat =>
                    chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
                )
            );
        } catch (error) {
            console.error('Failed to fetch messages:', error);
            toast.error('Failed to load messages');
        } finally {
            setLoadingMessages(false);
        }
    };

    const markMessagesAsRead = (chatId: number) => {
        const unreadMessages = messages
            .filter(msg => msg.senderId !== userId && !msg.isRead)
            .map(msg => msg.id);

        if (unreadMessages.length > 0 && wsService.isConnected()) {
            wsService.markMessagesAsRead(
                userId?.toString() || '',
                chatId,
                unreadMessages
            );
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Send a message
    const handleSendMessage = async () => {
        if (!message.trim() && !fileInput) return;
        if (!selectedChat || !userId) return;

        try {
            let formData = new FormData();
            formData.append('content', message);

            let messageType = 'text';

            if (fileInput) {
                formData.append('file', fileInput);
                messageType = fileInput.type.startsWith('image/') ? 'image' : 'file';
                formData.append('type', messageType);
            }

            const response = await Api.post(`/admin-chat/chats/${selectedChat}/messages`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Send message via WebSocket
            if (wsService.isConnected()) {
                wsService.sendMessage(
                    '', // No need to specify recipient for admin messages
                    selectedChat,
                    message,
                    response.data.id
                );
            }

            // Add the new message to the chat
            setMessages(prev => [...prev, response.data]);
            scrollToBottom();

            // Reset input
            setMessage('');
            setFileInput(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

            // Send typing indicator to stop typing
            if (wsService.isConnected()) {
                wsService.sendTypingIndicator(
                    '', // No need to specify recipient for admin messages
                    selectedChat,
                    false
                );
            }
        } catch (error) {
            console.error('Failed to send message:', error);
            toast.error('Failed to send message');
        }
    };

    // Handle typing indicator
    const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);

        if (!selectedChat || !wsService.isConnected()) return;

        const isTyping = e.target.value.trim().length > 0;
        if (isTyping !== isTyping) {
            wsService.sendTypingIndicator(
                selectedChat.toString(),
                selectedChat,
                isTyping
            );
            setIsTyping(isTyping);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFileInput(e.target.files[0]);
        }
    };

    const removeFile = () => {
        setFileInput(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Format date for display
    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
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

    // Update the selectedChat state handler to join the chat room
    const handleChatSelect = (chatId: number) => {
        // Leave previous chat room if any
        if (selectedChat) {
            wsService.leaveChatRoom(selectedChat);
        }

        // Join new chat room
        wsService.joinChatRoom(chatId);

        setSelectedChat(chatId);
        setMessage(''); // Reset message input when selecting a chat
        setFileInput(null); // Also reset any file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="container p-4 mx-auto">
            <HelmetComponent
                title="Support Dashboard"
                description="Support dashboard for the admin"
            />

            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Support Dashboard</h1>
                <Badge
                    variant={connectionStatus === 'connected' ? 'default' :
                        connectionStatus === 'connecting' ? 'secondary' : 'destructive'}
                    className="px-3 py-1"
                >
                    <div className={`w-2 h-2 mr-2 rounded-full ${connectionStatus === 'connected' ? 'bg-green-500' :
                        connectionStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                    {connectionStatus === 'connected' ? 'Connected' :
                        connectionStatus === 'connecting' ? 'Connecting...' : 'Disconnected'}
                </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-10rem)]">
                {/* Chat List */}
                <div className="bg-white rounded-lg shadow md:col-span-1 flex flex-col">
                    <div className="p-4 border-b">
                        <Input
                            type="text"
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="mb-3"
                        />
                        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                            <TabsList className="w-full">
                                <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                                <TabsTrigger value="active" className="flex-1">Active</TabsTrigger>
                                <TabsTrigger value="closed" className="flex-1">Closed</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    <ScrollArea className="flex-1 p-2">
                        {loading ? (
                            <div className="flex justify-center items-center h-40">
                                <i className="fas fa-spinner fa-spin text-gray-500 text-xl"></i>
                            </div>
                        ) : (!filteredChats || filteredChats.length === 0) ? (
                            <div className="text-center py-4 text-gray-500">
                                No chats found
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {filteredChats.map((chat) => (
                                    <div
                                        key={chat.id}
                                        className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedChat === chat.id
                                            ? 'bg-red-50 border-red-200 border'
                                            : 'hover:bg-gray-100 border border-transparent'
                                            }`}
                                        onClick={() => handleChatSelect(chat.id)}
                                    >
                                        <div className="flex items-center mb-1">
                                            <Avatar className="h-10 w-10 mr-3">
                                                <AvatarImage
                                                    src={chat.user.avatar ? `${url}/${chat.user.avatar}` : undefined}
                                                    alt={`${chat.user.firstName} ${chat.user.lastName}`}
                                                />
                                                <AvatarFallback>
                                                    {chat.user.firstName.charAt(0)}{chat.user.lastName.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-center">
                                                    <p className="font-medium truncate">
                                                        {chat.user.firstName} {chat.user.lastName}
                                                    </p>
                                                    {chat.lastMessageTime && (
                                                        <span className="text-xs text-gray-500">
                                                            {formatDate(chat.lastMessageTime)}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center">
                                                    <Badge variant="outline" className="mr-2 px-1.5 py-0 text-xs">
                                                        {chat.user.role}
                                                    </Badge>
                                                    {chat.unreadCount > 0 && (
                                                        <Badge className="bg-red-500 text-white px-1.5 py-0 text-xs">
                                                            {chat.unreadCount}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        {chat.lastMessage && (
                                            <p className="text-sm text-gray-600 truncate">
                                                {chat.lastMessage}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </ScrollArea>

                    <div className="p-3 border-t">
                        <div className="flex justify-center items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(prev => Math.max(1, prev - 1))}
                                disabled={page === 1}
                            >
                                <i className="fas fa-chevron-left"></i>
                            </Button>
                            <span className="text-sm">
                                Page {page} of {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={page === totalPages}
                            >
                                <i className="fas fa-chevron-right"></i>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="bg-white rounded-lg shadow md:col-span-2 flex flex-col h-full">
                    {!selectedChat ? (
                        <div className="flex items-center justify-center h-full text-center p-4">
                            <div>
                                <i className="fas fa-comments text-gray-300 text-6xl mb-4"></i>
                                <h3 className="text-xl font-medium text-gray-700">Select a chat to start messaging</h3>
                                <p className="text-gray-500 mt-2">
                                    Choose a conversation from the list to view messages
                                </p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 border-b">
                                {chats.find(c => c.id === selectedChat) && (
                                    <div className="flex items-center">
                                        <Avatar className="h-10 w-10 mr-3">
                                            <AvatarImage
                                                src={chats.find(c => c.id === selectedChat)?.user.avatar
                                                    ? `${url}/${chats.find(c => c.id === selectedChat)?.user.avatar}`
                                                    : undefined}
                                                alt={`${chats.find(c => c.id === selectedChat)?.user.firstName} ${chats.find(c => c.id === selectedChat)?.user.lastName}`}
                                            />
                                            <AvatarFallback>
                                                {chats.find(c => c.id === selectedChat)?.user.firstName.charAt(0)}
                                                {chats.find(c => c.id === selectedChat)?.user.lastName.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="flex items-center">
                                                <h2 className="text-lg font-medium">
                                                    {chats.find(c => c.id === selectedChat)?.user.firstName} {chats.find(c => c.id === selectedChat)?.user.lastName}
                                                </h2>
                                                <Badge variant="outline" className="ml-2 px-2 py-0 text-xs">
                                                    {chats.find(c => c.id === selectedChat)?.user.role}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-gray-500">
                                                {chats.find(c => c.id === selectedChat)?.user.email}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Messages */}
                            <div
                                ref={chatContainerRef}
                                className="flex-1 overflow-y-auto p-4"
                                style={{ maxHeight: 'calc(100vh - 20rem)' }}
                            >
                                {loadingMessages ? (
                                    <div className="flex justify-center items-center h-40">
                                        <i className="fas fa-spinner fa-spin text-gray-500 text-xl"></i>
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className="text-center py-4 text-gray-500">
                                        No messages yet
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {messages.map((msg) => (
                                            <div
                                                key={msg.id}
                                                className={`flex ${msg.senderId === userId ? 'justify-end' : 'justify-start'}`}
                                            >
                                                {msg.senderId !== userId && (
                                                    <Avatar className="h-8 w-8 mr-2 self-end mb-1">
                                                        <AvatarImage
                                                            src={msg.sender.avatar ? `${url}/${msg.sender.avatar}` : undefined}
                                                            alt={`${msg.sender.firstName} ${msg.sender.lastName}`}
                                                        />
                                                        <AvatarFallback className="text-xs">
                                                            {msg.sender.firstName.charAt(0)}{msg.sender.lastName.charAt(0)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                )}
                                                <div className={`max-w-[70%] ${msg.senderId === userId ? 'bg-blue-500 text-white' : 'bg-gray-100'} rounded-lg p-3`}>
                                                    {msg.type === 'text' && (
                                                        <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                                                    )}

                                                    {msg.type === 'image' && msg.fileUrl && (
                                                        <div>
                                                            {msg.content && <p className="mb-2">{msg.content}</p>}
                                                            <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer">
                                                                <img
                                                                    src={msg.fileUrl}
                                                                    alt="Image"
                                                                    className="max-w-full rounded-md mb-1"
                                                                />
                                                            </a>
                                                        </div>
                                                    )}

                                                    {msg.type === 'file' && msg.fileUrl && (
                                                        <div>
                                                            {msg.content && <p className="mb-2">{msg.content}</p>}
                                                            <a
                                                                href={msg.fileUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center p-2 bg-white rounded border"
                                                            >
                                                                <i className="fas fa-file mr-2 text-blue-500"></i>
                                                                <span className="text-sm text-blue-500 truncate">{msg.fileName || 'Download file'}</span>
                                                            </a>
                                                        </div>
                                                    )}

                                                    <div className="text-xs mt-1 opacity-70 text-right">
                                                        {msg.relativeTime || formatTimestamp(msg.createdAt)}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {isTyping && (
                                            <div className="flex">
                                                <Avatar className="h-8 w-8 mr-2 self-end mb-1">
                                                    <AvatarFallback className="text-xs">
                                                        {chats.find(c => c.id === selectedChat)?.user.firstName.charAt(0)}
                                                        {chats.find(c => c.id === selectedChat)?.user.lastName.charAt(0)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="bg-gray-100 rounded-lg p-3">
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
                                )}
                            </div>

                            {/* File Preview */}
                            {fileInput && (
                                <div className="p-2 border-t border-b bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <i className={`fas ${fileInput.type.startsWith('image/') ? 'fa-image text-green-500' : 'fa-file text-blue-500'} mr-2`}></i>
                                            <span className="text-sm truncate max-w-xs">{fileInput.name}</span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={removeFile}
                                            className="text-gray-500 hover:text-red-500"
                                        >
                                            <i className="fas fa-times"></i>
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Input Area */}
                            <div className="p-3 border-t">
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="shrink-0"
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
                                        value={message}
                                        onChange={handleTyping}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                        placeholder="Type a message..."
                                        className="flex-1"
                                    />
                                    <Button
                                        type="button"
                                        onClick={handleSendMessage}
                                        disabled={(!message.trim() && !fileInput) || !selectedChat}
                                        className="shrink-0"
                                    >
                                        <i className="fas fa-paper-plane mr-2"></i>
                                        Send
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminSupport;
