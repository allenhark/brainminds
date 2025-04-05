import Api from '@/Api';

interface TutorStats {
    totalStudents: number;
    completedSessions: number;
    totalHours: number;
    responseRate: number;
    averageResponseTime: number;
}

interface Session {
    id: number;
    startTime: string;
    endTime: string;
    status: string;
    classLink?: string;
    student: {
        id: number;
        firstName: string;
        lastName: string;
    };
}

class TutorService {
    async getTutorStats(): Promise<TutorStats> {
        const response = await Api.get('/tutor/stats');
        return response.data;
    }

    async getUpcomingSessions(): Promise<Session[]> {
        const response = await Api.get('/tutor/sessions/upcoming');
        return response.data;
    }
}

export const tutorService = new TutorService(); 