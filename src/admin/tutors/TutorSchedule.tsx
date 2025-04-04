import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Api from '@/Api';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import LoadingSpinner from '@/components/ui/loading-spinner';

type Tutor = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
};

type Student = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
};

type Session = {
    id: number;
    startTime: string;
    endTime: string;
    status: string;
    notes?: string;
    student: Student;
};

type ScheduleData = {
    tutor: Tutor;
    timezone: string;
    availability: any[];
    sessions: Session[];
};

const TutorSchedule: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { toast } = useToast();
    const [scheduleData, setScheduleData] = useState<ScheduleData | null>(null);
    const [loading, setLoading] = useState(true);
    const [students, setStudents] = useState<Student[]>([]);
    const [showAddSessionForm, setShowAddSessionForm] = useState(false);
    const [newSession, setNewSession] = useState({
        studentId: '',
        startTime: '',
        endTime: '',
        notes: ''
    });

    useEffect(() => {
        fetchScheduleData();
        fetchStudents();
    }, [id]);

    const fetchScheduleData = async () => {
        try {
            setLoading(true);
            const response = await Api.get(`/admin/tutors/${id}/schedule`);
            setScheduleData(response.data);
        } catch (error) {
            console.error('Failed to fetch schedule data:', error);
            toast({
                title: 'Error',
                description: 'Failed to load schedule data.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchStudents = async () => {
        try {
            const response = await Api.get('/admin/students');
            setStudents(response.data);
        } catch (error) {
            console.error('Failed to fetch students:', error);
        }
    };

    const handleCancelSession = async (sessionId: number) => {
        const reason = prompt('Please enter a reason for cancellation:');
        if (reason === null) return; // User clicked cancel

        try {
            await Api.put(`/admin/sessions/${sessionId}/cancel`, { reason });
            toast({
                title: 'Success',
                description: 'Session cancelled successfully.',
                variant: 'default',
            });
            fetchScheduleData();
        } catch (error) {
            console.error('Failed to cancel session:', error);
            toast({
                title: 'Error',
                description: 'Failed to cancel session.',
                variant: 'destructive',
            });
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewSession(prev => ({ ...prev, [name]: value }));
    };

    const handleAddSession = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await Api.post(`/admin/tutors/${id}/sessions`, newSession);
            toast({
                title: 'Success',
                description: 'Session added successfully.',
                variant: 'default',
            });
            setShowAddSessionForm(false);
            setNewSession({
                studentId: '',
                startTime: '',
                endTime: '',
                notes: ''
            });
            fetchScheduleData();
        } catch (error) {
            console.error('Failed to add session:', error);
            toast({
                title: 'Error',
                description: 'Failed to add session.',
                variant: 'destructive',
            });
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!scheduleData) {
        return (
            <div className="bg-white rounded-lg p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Schedule Not Found</h2>
                <p className="text-gray-600 mb-6">
                    The tutor schedule data couldn't be loaded.
                </p>
                <Link to="/admin/tutors">
                    <Button>Return to Tutor List</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Tutor Schedule</h1>
                    <p className="text-gray-600">
                        {scheduleData.tutor.firstName} {scheduleData.tutor.lastName} • Timezone: {scheduleData.timezone || 'Not set'}
                    </p>
                </div>
                <div className="flex space-x-3">
                    <Button onClick={() => setShowAddSessionForm(!showAddSessionForm)}>
                        {showAddSessionForm ? 'Cancel' : 'Add Session'}
                    </Button>
                    <Link to={`/admin/tutors/${id}`}>
                        <Button variant="outline">Back to Details</Button>
                    </Link>
                </div>
            </div>

            {showAddSessionForm && (
                <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Session</h2>
                    <form onSubmit={handleAddSession} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-1">Student</label>
                                <select
                                    id="studentId"
                                    name="studentId"
                                    required
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    value={newSession.studentId}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select a student</option>
                                    {students.map(student => (
                                        <option key={student.id} value={student.id}>
                                            {student.firstName} {student.lastName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                                <input
                                    type="datetime-local"
                                    id="startTime"
                                    name="startTime"
                                    required
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    value={newSession.startTime}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                            <input
                                type="datetime-local"
                                id="endTime"
                                name="endTime"
                                required
                                className="w-full p-2 border border-gray-300 rounded-md"
                                value={newSession.endTime}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                            <textarea
                                id="notes"
                                name="notes"
                                rows={3}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                value={newSession.notes}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit">Add Session</Button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Sessions</h2>
                {scheduleData.sessions.length === 0 ? (
                    <p className="text-gray-500 text-center py-6">No upcoming sessions scheduled.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {scheduleData.sessions.map(session => (
                                    <tr key={session.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {session.student.firstName} {session.student.lastName}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {new Date(session.startTime).toLocaleDateString()}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {new Date(session.startTime).toLocaleTimeString()} - {new Date(session.endTime).toLocaleTimeString()}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${session.status === 'SCHEDULED'
                                                ? 'bg-blue-100 text-blue-800'
                                                : session.status === 'COMPLETED'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                }`}>
                                                {session.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {session.status === 'SCHEDULED' && (
                                                <button
                                                    onClick={() => handleCancelSession(session.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Weekly Availability</h2>
                {scheduleData.availability.length === 0 ? (
                    <p className="text-gray-500 text-center py-6">No availability set.</p>
                ) : (
                    <div className="grid grid-cols-7 gap-4">
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, idx) => (
                            <div key={day} className="border rounded-md p-3">
                                <h3 className="text-sm font-medium text-gray-700 mb-2">{day}</h3>
                                <div className="space-y-1">
                                    {scheduleData.availability
                                        .filter(slot => slot.day === idx)
                                        .map((slot, slotIdx) => (
                                            <div key={slotIdx} className="text-xs bg-blue-50 text-blue-700 p-1 rounded">
                                                {slot.start} - {slot.end}
                                            </div>
                                        ))}
                                    {!scheduleData.availability.some(slot => slot.day === idx) && (
                                        <p className="text-xs text-gray-500">Not available</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TutorSchedule; 