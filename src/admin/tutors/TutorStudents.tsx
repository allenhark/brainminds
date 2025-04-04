import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Api from '@/Api';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import LoadingSpinner from '@/components/ui/loading-spinner';

type Student = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    createdAt: string;
};

const TutorStudents: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { toast } = useToast();
    const [students, setStudents] = useState<Student[]>([]);
    const [tutor, setTutor] = useState<{ firstName: string; lastName: string } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTutorStudents();
        fetchTutorInfo();
    }, [id]);

    const fetchTutorStudents = async () => {
        try {
            setLoading(true);
            const response = await Api.get(`/admin/tutors/${id}/students`);
            setStudents(response.data);
        } catch (error) {
            console.error('Failed to fetch tutor students:', error);
            toast({
                title: 'Error',
                description: 'Failed to load tutor students.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchTutorInfo = async () => {
        try {
            const response = await Api.get(`/admin/tutors/${id}`);
            setTutor({
                firstName: response.data.firstName,
                lastName: response.data.lastName
            });
        } catch (error) {
            console.error('Failed to fetch tutor info:', error);
        }
    };

    const handleScheduleSession = (studentId: number) => {
        // Navigate to the schedule view with student pre-selected
        window.location.href = `/admin/tutors/${id}/schedule?studentId=${studentId}`;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Tutor's Students</h1>
                    {tutor && (
                        <p className="text-gray-600">
                            {tutor.firstName} {tutor.lastName}
                        </p>
                    )}
                </div>
                <div className="flex space-x-3">
                    <Link to={`/admin/tutors/${id}/schedule`}>
                        <Button>
                            <i className="far fa-calendar mr-2"></i> Schedule Sessions
                        </Button>
                    </Link>
                    <Link to={`/admin/tutors/${id}`}>
                        <Button variant="outline">Back to Details</Button>
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Students</h2>
                {students.length === 0 ? (
                    <p className="text-gray-500 text-center py-6">This tutor has no students yet.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {students.map(student => (
                                    <tr key={student.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-medium">
                                                    {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{student.firstName} {student.lastName}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{student.email}</div>
                                            <div className="text-sm text-gray-500">{student.phone || 'No phone'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(student.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleScheduleSession(student.id)}
                                                className="text-blue-600 hover:text-blue-900 mr-4"
                                            >
                                                Schedule Session
                                            </button>
                                            <Link
                                                to={`/admin/students/${student.id}`}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                View Profile
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TutorStudents; 