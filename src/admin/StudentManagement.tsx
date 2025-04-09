import React, { useState, useEffect } from 'react';
import Api from '@/Api';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

type Student = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    status: 'ACTIVE' | 'INACTIVE';
    createdAt: string;
    subscription: {
        id: number;
        userId: number;
        status: 'ACTIVE' | 'EXPIRED' | 'CANCELED' | 'PENDING';
        startDate: string;
        endDate: string;
        amount: number;
        paymentMethod: string | null;
        paymentId: string | null;
        notes: string | null;
        createdBy: number | null;
        canceledAt: string | null;
        cancelReason: string | null;
        createdAt: string;
        updatedAt: string;
    } | null;
};

type Pagination = {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
};

const StudentManagement: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'ACTIVE' | 'INACTIVE'>('all');
    const [students, setStudents] = useState<Student[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isSubscriptionDialogOpen, setIsSubscriptionDialogOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [subscriptionMonths, setSubscriptionMonths] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        fetchStudents();
    }, [currentPage]);

    const fetchStudents = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await Api.get(`/admin/students?page=${currentPage}&limit=10`);
            setStudents(response.data.data);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error('Failed to fetch students:', error);
            setError('Failed to load students. Please try again later.');
            toast.error('Failed to load students');
        } finally {
            setIsLoading(false);
        }
    };

    // Filter students based on search query and status
    const filteredStudents = students.filter(student => {
        const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
        const matchesSearch =
            fullName.includes(searchQuery.toLowerCase()) ||
            student.email.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = filterStatus === 'all' || student.status === filterStatus;

        return matchesSearch && matchesStatus;
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
            await fetchStudents(); // Refresh the data
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

            toast.success(`Subscription activated for ${selectedStudent.firstName} ${selectedStudent.lastName}`);
            setIsSubscriptionDialogOpen(false);
            await fetchStudents(); // Refresh the data
        } catch (error) {
            console.error('Failed to update subscription:', error);
            toast.error('Failed to update subscription');
        }
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <div className="text-red-500 mb-4">{error}</div>
                <Button onClick={fetchStudents}>Retry</Button>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                                <SelectItem value="ACTIVE">Active</SelectItem>
                                <SelectItem value="INACTIVE">Inactive</SelectItem>
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
                                                    alt={`${student.firstName} ${student.lastName}`}
                                                />
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {student.firstName} {student.lastName}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{student.email}</div>
                                            <div className="text-sm text-gray-500">{student.phone || 'No phone'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${student.status === 'ACTIVE'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}>
                                                {student.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {student.subscription ? (
                                                <div>
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${student.subscription.status === 'ACTIVE'
                                                        ? 'bg-green-100 text-green-800'
                                                        : student.subscription.status === 'EXPIRED'
                                                            ? 'bg-red-100 text-red-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {student.subscription.status}
                                                    </span>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        Expires: {new Date(student.subscription.endDate).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                                    No Subscription
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(student.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end items-center space-x-2">
                                                <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/students/${student.id}`)}>
                                                    <i className="fas fa-eye text-blue-500"></i>
                                                </Button>
                                                <Button variant="ghost" size="sm" onClick={() => handleEditStudent(student.id)}>
                                                    <i className="fas fa-edit text-blue-500"></i>
                                                </Button>
                                                {student.subscription?.status === 'ACTIVE' ? (
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

                {/* Pagination Controls */}
                {pagination && (
                    <div className="flex items-center justify-between mt-4">
                        <div className="text-sm text-gray-700">
                            Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to {Math.min(pagination.currentPage * pagination.limit, pagination.total)} of {pagination.total} students
                        </div>
                        <div className="flex space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(pagination.currentPage - 1)}
                                disabled={!pagination.hasPreviousPage}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(pagination.currentPage + 1)}
                                disabled={!pagination.hasNextPage}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
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
                                <p>{selectedStudent.firstName} {selectedStudent.lastName}</p>
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