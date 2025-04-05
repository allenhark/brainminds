import { io, Socket } from 'socket.io-client';

class WebSocketService {
    private socket: Socket | null = null;
    private userId: string | null = null;
    private userRole: 'tutor' | 'student' | 'admin' | null = null;

    // Event listeners
    private messageListeners: ((data: any) => void)[] = [];
    private typingListeners: ((data: any) => void)[] = [];
    private readReceiptListeners: ((data: any) => void)[] = [];
    private userStatusListeners: ((data: any) => void)[] = [];

    constructor() {
        // Initialize but don't connect yet
    }

    connect(userId: string, userRole: 'tutor' | 'student' | 'admin') {
        if (this.socket) {
            this.disconnect();
        }

        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

        this.socket = io(API_URL, {
            withCredentials: true,
            transports: ['websocket', 'polling'],
            autoConnect: true,
        });

        this.userId = userId;
        this.userRole = userRole;

        this.socket.on('connect', this.handleConnect.bind(this));
        this.socket.on('receive_message', this.handleReceiveMessage.bind(this));
        this.socket.on('typing_indicator', this.handleTypingIndicator.bind(this));
        this.socket.on('messages_read', this.handleMessagesRead.bind(this));
        this.socket.on('user_status', this.handleUserStatus.bind(this));
        this.socket.on('disconnect', this.handleDisconnect.bind(this));
        this.socket.on('connect_error', this.handleConnectError.bind(this));
    }

    private handleConnect() {
        if (!this.socket || !this.userId || !this.userRole) return;

        // Authenticate the connection
        this.socket.emit('authenticate', {
            userId: this.userId,
            role: this.userRole
        });

        console.log('WebSocket connected');
    }

    private handleReceiveMessage(data: any) {
        this.messageListeners.forEach(listener => listener(data));
    }

    private handleTypingIndicator(data: any) {
        this.typingListeners.forEach(listener => listener(data));
    }

    private handleMessagesRead(data: any) {
        this.readReceiptListeners.forEach(listener => listener(data));
    }

    private handleUserStatus(data: any) {
        this.userStatusListeners.forEach(listener => listener(data));
    }

    private handleDisconnect() {
        console.log('WebSocket disconnected');
    }

    private handleConnectError(error: Error) {
        console.error('WebSocket connection error:', error);
        // Attempt to reconnect after delay
        setTimeout(() => {
            if (this.socket && this.userId && this.userRole) {
                this.socket.connect();
            }
        }, 5000);
    }

    // Public methods for sending messages
    sendMessage(recipientId: string, message: string) {
        if (!this.socket || !this.socket.connected) {
            console.error('Cannot send message: Socket not connected');
            return false;
        }

        this.socket.emit('send_message', {
            to: recipientId,
            message,
            timestamp: new Date().toISOString()
        });

        return true;
    }

    sendTypingIndicator(recipientId: string, isTyping: boolean) {
        if (!this.socket || !this.socket.connected) return false;

        this.socket.emit('typing', {
            to: recipientId,
            isTyping
        });

        return true;
    }

    markMessagesAsRead(messageIds: string[], fromUserId: string) {
        if (!this.socket || !this.socket.connected) return false;

        this.socket.emit('mark_read', {
            messageIds,
            from: fromUserId
        });

        return true;
    }

    // Subscribe to events
    onMessage(callback: (data: any) => void) {
        this.messageListeners.push(callback);
        return () => {
            this.messageListeners = this.messageListeners.filter(cb => cb !== callback);
        };
    }

    onTyping(callback: (data: any) => void) {
        this.typingListeners.push(callback);
        return () => {
            this.typingListeners = this.typingListeners.filter(cb => cb !== callback);
        };
    }

    onReadReceipt(callback: (data: any) => void) {
        this.readReceiptListeners.push(callback);
        return () => {
            this.readReceiptListeners = this.readReceiptListeners.filter(cb => cb !== callback);
        };
    }

    onUserStatus(callback: (data: any) => void) {
        this.userStatusListeners.push(callback);
        return () => {
            this.userStatusListeners = this.userStatusListeners.filter(cb => cb !== callback);
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
const wsService = new WebSocketService();

export default wsService; 