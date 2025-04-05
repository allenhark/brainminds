import Api from '@/Api';

export interface ChatRoom {
    id: number;
    student: {
        firstName: string;
        lastName: string;
    };
    lastMessagePreview?: string;
    lastMessageAt?: string;
    createdAt: string;
    unreadCount?: number;
}

export class MessageService {
    public async getChatRooms(): Promise<ChatRoom[]> {
        const response = await Api.get('/chat/rooms');
        return response.data;
    }
}

// Export singleton instance
export const messageService = new MessageService(); 