import { io, Socket } from 'socket.io-client';
import { API_BASE_URL } from '@/config';

export class WebSocketService {
    private socket: Socket | null = null;
    private userId: string | null = null;
    private userRole: 'TUTOR' | 'STUDENT' | 'ADMIN' | null = null;
    private static instance: WebSocketService;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectDelay = 1000;

    // Event listeners
    private eventListeners: Record<string, ((data: any) => void)[]> = {
        'receive_message': [],
        'typing_indicator': [],
        'messages_read': [],
        'user_status': [],
        'notification': []
    };

    private constructor() {
        // Initialize but don't connect yet
    }

    public static getInstance(): WebSocketService {
        if (!WebSocketService.instance) {
            WebSocketService.instance = new WebSocketService();
        }
        return WebSocketService.instance;
    }

    connect(userId: string, userRole: 'TUTOR' | 'STUDENT' | 'ADMIN') {
        if (this.socket) {
            this.disconnect();
        }

        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

        // Don't use namespaces for now as they're causing issues
        this.socket = io(API_URL, {
            withCredentials: true,
            transports: ['websocket', 'polling'],
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: this.maxReconnectAttempts,
            reconnectionDelay: this.reconnectDelay,
            timeout: 10000,
            auth: {
                token: localStorage.getItem('token') || '',
                userId,
                role: userRole
            }
        });

        this.userId = userId;
        this.userRole = userRole;

        this.socket.on('connect', this.handleConnect.bind(this));
        this.socket.on('disconnect', this.handleDisconnect.bind(this));
        this.socket.on('connect_error', this.handleConnectError.bind(this));
        this.socket.on('reconnect', this.handleReconnect.bind(this));
        this.socket.on('reconnect_error', this.handleReconnectError.bind(this));

        // Register event handlers
        Object.keys(this.eventListeners).forEach(event => {
            this.socket?.on(event, (data: any) => {
                this.triggerEvent(event, data);
            });
        });
    }

    private handleConnect() {
        if (!this.socket || !this.userId || !this.userRole) return;

        // Authenticate the connection
        this.socket.emit('authenticate', {
            userId: this.userId,
            role: this.userRole
        });

        this.reconnectAttempts = 0;
        console.log('WebSocket connected');
    }

    private handleDisconnect() {
        console.log('WebSocket disconnected');
        this.triggerEvent('disconnect', {});
    }

    private handleConnectError(error: Error) {
        console.error('WebSocket connection error:', error);
        this.triggerEvent('connect_error', { error: error.message });
    }

    private handleReconnect(attemptNumber: number) {
        console.log('WebSocket reconnecting, attempt:', attemptNumber);
        this.reconnectAttempts = attemptNumber;
        this.triggerEvent('reconnect', { attemptNumber });
    }

    private handleReconnectError(error: Error) {
        console.error('WebSocket reconnection error:', error);
        this.triggerEvent('reconnect_error', { error: error.message });
    }

    private triggerEvent(event: string, data: any) {
        const listeners = this.eventListeners[event] || [];
        listeners.forEach(listener => listener(data));
    }

    // Public methods for sending messages
    sendMessage(to: string, chatRoomId: number, message: string, messageId?: number) {
        if (!this.socket || !this.socket.connected) {
            console.error('Cannot send message: Socket not connected');
            return false;
        }

        const messageData = {
            chatId: chatRoomId,
            content: message,
            type: 'text',
            messageId,
            timestamp: new Date().toISOString()
        };

        // Use the correct event name based on user role
        const eventName = this.userRole === 'ADMIN' ? 'adminMessage' : 'send_message';
        this.socket.emit(eventName, messageData);

        // Trigger local message event for immediate UI update
        this.triggerEvent('receive_message', {
            chatId: chatRoomId,
            message: {
                id: messageId,
                content: message,
                senderId: this.userId,
                createdAt: messageData.timestamp,
                isRead: false
            }
        });

        return true;
    }

    sendTypingIndicator(to: string, chatRoomId: number, isTyping: boolean) {
        if (!this.socket || !this.socket.connected) return false;

        const typingData = {
            chatId: chatRoomId,
            isTyping,
            userId: this.userId
        };

        // Use the correct event name based on user role
        const eventName = this.userRole === 'ADMIN' ? 'adminTyping' : 'typing';
        this.socket.emit(eventName, typingData);

        // Trigger local typing event for immediate UI update
        this.triggerEvent('typing_indicator', {
            chatId: chatRoomId,
            isTyping,
            userId: this.userId
        });

        return true;
    }

    // Join a chat room
    joinChatRoom(chatRoomId: number) {
        if (!this.socket || !this.socket.connected) {
            console.error('Cannot join chat room: Socket not connected');
            return false;
        }

        this.socket.emit('joinAdminChat', chatRoomId);
        return true;
    }

    // Leave a chat room
    leaveChatRoom(chatRoomId: number) {
        if (!this.socket || !this.socket.connected) {
            console.error('Cannot leave chat room: Socket not connected');
            return false;
        }

        this.socket.emit('leaveAdminChat', chatRoomId);
        return true;
    }

    markMessagesAsRead(from: string, chatRoomId: number, messageIds: number[]) {
        if (!this.socket || !this.socket.connected) return false;

        this.socket.emit('mark_read', {
            from,
            chatRoomId,
            messageIds
        });

        return true;
    }

    // Subscribe to events with generic handler
    on(event: string, callback: (data: any) => void): () => void {
        if (!this.eventListeners[event]) {
            this.eventListeners[event] = [];
        }

        console.log('Subscribed to event:', event);

        this.eventListeners[event].push(callback);

        return () => {
            this.eventListeners[event] = this.eventListeners[event].filter(
                cb => cb !== callback
            );
        };
    }

    // Disconnect
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
        this.userId = null;
        this.userRole = null;
    }

    // Check connection status
    isConnected(): boolean {
        return !!(this.socket && this.socket.connected);
    }
}

// Create a singleton instance
const wsService = WebSocketService.getInstance();

export default wsService; 