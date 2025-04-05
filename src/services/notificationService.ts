import Api from '../Api';
import wsService from './wsService';

export interface Notification {
    id: number;
    type: string;
    status: 'READ' | 'UNREAD';
    title: string;
    content: string;
    linkUrl?: string;
    createdAt: string;
}

class NotificationService {
    private static instance: NotificationService;

    private constructor() {
        this.setupSocketListeners();
    }

    public static getInstance(): NotificationService {
        if (!NotificationService.instance) {
            NotificationService.instance = new NotificationService();
        }
        return NotificationService.instance;
    }

    private setupSocketListeners() {
        // The actual listeners will be set up by the app component
    }

    /**
     * Get all notifications for the current user
     */
    public async getNotifications(
        limit = 20,
        offset = 0,
        includeRead = false
    ): Promise<{
        notifications: Notification[];
        unreadCount: number;
        hasMore: boolean;
    }> {
        try {
            const response = await Api.get('/notifications', {
                params: { limit, offset, includeRead }
            });
            return {
                notifications: response.data.notifications || [],
                unreadCount: response.data.unreadCount || 0,
                hasMore: response.data.hasMore || false
            };
        } catch (error) {
            console.error('Error fetching notifications:', error);
            throw error;
        }
    }

    /**
     * Get the count of unread notifications
     */
    public async getUnreadCount(): Promise<number> {
        try {
            const response = await Api.get('/notifications/unread-count');
            return response.data.count || 0;
        } catch (error) {
            console.error('Error fetching unread notification count:', error);
            throw error;
        }
    }

    /**
     * Mark a notification as read
     */
    public async markAsRead(notificationId: number): Promise<void> {
        try {
            await Api.put(`/notifications/${notificationId}/read`);
        } catch (error) {
            console.error('Error marking notification as read:', error);
            throw error;
        }
    }

    /**
     * Mark all notifications as read
     */
    public async markAllAsRead(): Promise<void> {
        try {
            await Api.put('/notifications/read-all');
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
            throw error;
        }
    }

    /**
     * Register a callback for new notifications
     */
    public onNewNotification(callback: (notification: Notification) => void): () => void {
        return wsService.on('notification', callback);
    }
}

export default NotificationService.getInstance(); 