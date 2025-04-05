import React, { useState, useEffect } from 'react';
import Api from '@/Api';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';

type Student = {
    id: number;
    name: string;
    email: string;
    phone: string;
    grade: string;
    subjects: string[];
    totalSessions: number;
    status: 'active' | 'inactive';
    joinDate: string;
    subscriptionStatus: 'subscribed' | 'not_subscribed';
    subscriptionExpiry?: string;
};

const StudentManagement: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
    const [filterGrade, setFilterGrade] = useState('all');
    const [filterSubscription, setFilterSubscription] = useState<'all' | 'subscribed' | 'not_subscribed'>('all');
    const [students, setStudents] = useState<Student[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Dialogs state
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isSubscriptionDialogOpen, setIsSubscriptionDialogOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [subscriptionMonths, setSubscriptionMonths] = useState(1);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                setIsLoading(true);
                const response = await Api.get('/admin/students');
                setStudents(response.data);
            } catch (error) {
                console.error('Failed to fetch students:', error);
                toast.error('Failed to load students');

                // Sample student data for development
                setStudents([
                    {
                        id: 1,
                        name: 'Emily Johnson',
                        email: 'emily.johnson@example.com',
                        phone: '(123) 456-7890',
                        grade: '10th Grade',
                        subjects: ['Mathematics', 'Physics'],
                        totalSessions: 15,
                        status: 'active',
                        joinDate: '2022-03-15',
                        subscriptionStatus: 'subscribed',
                        subscriptionExpiry: '2023-05-15'
                    },
                    {
                        id: 2,
                        name: 'Michael Brown',
                        email: 'michael.brown@example.com',
                        phone: '(234) 567-8901',
                        grade: '11th Grade',
                        subjects: ['Physics', 'Chemistry'],
                        totalSessions: 8,
                        status: 'active',
                        joinDate: '2022-04-22',
                        subscriptionStatus: 'not_subscribed'
                    },
                    {
                        id: 3,
                        name: 'Emma Davis',
                        email: 'emma.davis@example.com',
                        phone: '(345) 678-9012',
                        grade: '9th Grade',
                        subjects: ['Chemistry', 'Biology'],
                        totalSessions: 12,
                        status: 'active',
                        joinDate: '2022-05-10',
                        subscriptionStatus: 'subscribed',
                        subscriptionExpiry: '2023-06-10'
                    },
                    {
                        id: 4,
                        name: 'William Taylor',
                        email: 'william.taylor@example.com',
                        phone: '(456) 789-0123',
                        grade: '12th Grade',
                        subjects: ['Biology', 'English'],
                        totalSessions: 20,
                        status: 'inactive',
                        joinDate: '2022-02-18',
                        subscriptionStatus: 'not_subscribed'
                    },
                    {
                        id: 5,
                        name: 'Olivia Wilson',
                        email: 'olivia.wilson@example.com',
                        phone: '(567) 890-1234',
                        grade: '10th Grade',
                        subjects: ['English Literature', 'History'],
                        totalSessions: 10,
                        status: 'active',
                        joinDate: '2022-06-01',
                        subscriptionStatus: 'not_subscribed'
                    },
                    {
                        id: 6,
                        name: 'James Anderson',
                        email: 'james.anderson@example.com',
                        phone: '(678) 901-2345',
                        grade: '8th Grade',
                        subjects: ['Mathematics', 'Science'],
                        totalSessions: 5,
                        status: 'active',
                        joinDate: '2022-06-15',
                        subscriptionStatus: 'not_subscribed'
                    },
                ]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStudents();
    }, []);

    // Get unique grades for filter
    const grades = ['all', ...Array.from(new Set(students.map(student => student.grade)))];

    // Filter students based on search query, status, grade, and subscription
    const filteredStudents = students.filter(student => {
        const matchesSearch =
            student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.subjects.some(subject => subject.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesStatus = filterStatus === 'all' || student.status === filterStatus;
        const matchesGrade = filterGrade === 'all' || student.grade === filterGrade;
        const matchesSubscription = filterSubscription === 'all' || student.subscriptionStatus === filterSubscription;

        return matchesSearch && matchesStatus && matchesGrade && matchesSubscription;
    });

    const handleAddStudent = () => {
        setIsAddDialogOpen(true);
    };

    const handleEditStudent = (id: number) => {
        const student = students.find(s => s.id === id);
        if (student) {
            setSelectedStudent(student);
            setIsEditDialogOpen(true);
        }
    };

    const handleOpenSubscriptionDialog = (id: number) => {
        const student = students.find(s => s.id === id);
        if (student) {
            setSelectedStudent(student);
            setSubscriptionMonths(1);
            setIsSubscriptionDialogOpen(true);
        }
    };

    const handleCancelSubscription = async (id: number) => {
        try {
            await Api.delete(`/admin/students/${id}/subscription`);
            toast.success('Subscription cancelled successfully');

            // Update local state
            setStudents(prevStudents =>
                prevStudents.map(student =>
                    student.id === id
                        ? { ...student, subscriptionStatus: 'not_subscribed', subscriptionExpiry: undefined }
                        : student
                )
            );
        } catch (error) {
            console.error('Failed to cancel subscription:', error);
            toast.error('Failed to cancel subscription');
        }
    };

    const handleSubmitSubscription = async () => {
        if (!selectedStudent) return;

        try {
            // Calculate expiry date
            const expiryDate = new Date();
            expiryDate.setMonth(expiryDate.getMonth() + subscriptionMonths);

            // Make API call
            await Api.post(`/admin/students/${selectedStudent.id}/subscription`, {
                expiryDate: expiryDate.toISOString()
            });

            toast.success(`Subscription activated for ${selectedStudent.name}`);

            // Update local state
            setStudents(prevStudents =>
                prevStudents.map(student =>
                    student.id === selectedStudent.id
                        ? {
                            ...student,
                            subscriptionStatus: 'subscribed',
                            subscriptionExpiry: expiryDate.toISOString().split('T')[0]
                        }
                        : student
                )
            );

            setIsSubscriptionDialogOpen(false);
        } catch (error) {
            console.error('Failed to update subscription:', error);
            toast.error('Failed to update subscription');
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Student Management</h1>
                <Button onClick={handleAddStudent}>
                    <i className="fas fa-plus mr-2"></i>
                    Add Student
                </Button>
            </div>

            <div className="bg-white rounded-lg p-5 shadow-sm mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                        <div className="relative">
                            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                            <Input
                                type="text"
                                placeholder="Search students..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                    <div>
                        <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Select value={filterGrade} onValueChange={setFilterGrade}>
                            <SelectTrigger>
                                <SelectValue placeholder="Grade" />
                            </SelectTrigger>
                            <SelectContent>
                                {grades.map((grade) => (
                                    <SelectItem key={grade} value={grade}>
                                        {grade === 'all' ? 'All Grades' : grade}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Select
                            value={filterSubscription}
                            onValueChange={(value: any) => setFilterSubscription(value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Subscription" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Subscriptions</SelectItem>
                                <SelectItem value="subscribed">Subscribed</SelectItem>
                                <SelectItem value="not_subscribed">Not Subscribed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <div className="max-h-[70vh] overflow-y-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 sticky top-0">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Student
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Contact
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Grade
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Subjects
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Sessions
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Subscription
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Join Date
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredStudents.map((student) => (
                                    <tr key={student.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <img
                                                    className="h-10 w-10 rounded-full"
                                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.email}`}
                                                    alt={student.name}
                                                />
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{student.email}</div>
                                            <div className="text-sm text-gray-500">{student.phone}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {student.grade}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-wrap gap-1">
                                                {student.subjects.map((subject, index) => (
                                                    <Badge key={index} variant="secondary">
                                                        {subject}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {student.totalSessions}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${student.status === 'active'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}>
                                                {student.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {student.subscriptionStatus === 'subscribed' ? (
                                                <div>
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                        Subscribed
                                                    </span>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        Expires: {student.subscriptionExpiry}
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                                    Not Subscribed
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(student.joinDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end items-center space-x-2">
                                                <Button variant="ghost" size="sm" onClick={() => handleEditStudent(student.id)}>
                                                    <i className="fas fa-edit text-blue-500"></i>
                                                </Button>
                                                {student.subscriptionStatus === 'subscribed' ? (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleCancelSubscription(student.id)}
                                                    >
                                                        <i className="fas fa-ban text-red-500"></i>
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleOpenSubscriptionDialog(student.id)}
                                                    >
                                                        <i className="fas fa-credit-card text-green-500"></i>
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Subscription Dialog */}
            <Dialog open={isSubscriptionDialogOpen} onOpenChange={setIsSubscriptionDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Subscription</DialogTitle>
                    </DialogHeader>

                    {selectedStudent && (
                        <div className="py-4">
                            <div className="mb-4">
                                <p className="text-sm font-medium text-gray-700">Student</p>
                                <p>{selectedStudent.name}</p>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Subscription Period (Months)
                                </label>
                                <Select
                                    value={subscriptionMonths.toString()}
                                    onValueChange={(value) => setSubscriptionMonths(parseInt(value))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select months" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">1 Month (¥13,000)</SelectItem>
                                        <SelectItem value="3">3 Months (¥39,000)</SelectItem>
                                        <SelectItem value="6">6 Months (¥78,000)</SelectItem>
                                        <SelectItem value="12">12 Months (¥156,000)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="mb-4">
                                <p className="text-sm font-medium text-gray-700">Total Amount</p>
                                <p className="text-xl font-bold">¥{(subscriptionMonths * 13000).toLocaleString()}</p>
                            </div>

                            <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-600 mb-4">
                                <i className="fas fa-info-circle mr-2"></i>
                                This will activate the student's subscription immediately.
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsSubscriptionDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleSubmitSubscription}>
                            Activate Subscription
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default StudentManagement; 