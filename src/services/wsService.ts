import { io, Socket } from 'socket.io-client';

export class WebSocketService {
    private socket: Socket | null = null;
    private userId: string | null = null;
    private userRole: 'TUTOR' | 'STUDENT' | 'ADMIN' | null = null;
    private static instance: WebSocketService;

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

        this.socket = io(API_URL, {
            withCredentials: true,
            transports: ['websocket', 'polling'],
            autoConnect: true,
        });

        this.userId = userId;
        this.userRole = userRole;

        this.socket.on('connect', this.handleConnect.bind(this));
        this.socket.on('disconnect', this.handleDisconnect.bind(this));
        this.socket.on('connect_error', this.handleConnectError.bind(this));

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

        console.log('WebSocket connected');
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

        this.socket.emit('send_message', {
            to,
            chatRoomId,
            message,
            messageId,
            timestamp: new Date().toISOString()
        });

        return true;
    }

    sendTypingIndicator(to: string, chatRoomId: number, isTyping: boolean) {
        if (!this.socket || !this.socket.connected) return false;

        this.socket.emit('typing', {
            to,
            chatRoomId,
            isTyping
        });

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