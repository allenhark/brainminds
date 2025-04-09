import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Api from '@/Api';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import toast from 'react-hot-toast';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { url } from '@/config';

type Tutor = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    rate?: number;
    status: 'ACTIVE' | 'INACTIVE';
    createdAt: string;
    avatar?: string;
};

type TutorApplication = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    status: string;
    createdAt: string;
    tutorProfile: {
        educationLevel: string;
        applicationStatus: string;
    };
};

const TutorManagement: React.FC = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'ACTIVE' | 'INACTIVE'>('all');
    const [activeTutors, setActiveTutors] = useState<Tutor[]>([]);
    const [pendingApplications, setPendingApplications] = useState<TutorApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('tutors');

    useEffect(() => {
        fetchTutors();
        fetchPendingApplications();
    }, []);

    const fetchTutors = async () => {
        try {
            setLoading(true);
            const response = await Api.get('/admin/tutors');
            // console.log(response.data);
            setActiveTutors(response.data);
        } catch (error) {
            console.error('Failed to fetch tutors:', error);
            toast.error("Failed to load tutors. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const fetchPendingApplications = async () => {
        try {
            const response = await Api.get('/admin/tutors/pending');
            setPendingApplications(response.data);
        } catch (error) {
            console.error('Failed to fetch pending applications:', error);
            toast.error("Failed to load pending applications.");
        }
    };

    // Filter tutors based on search query and status
    const filteredTutors = activeTutors.filter(tutor => {
        const fullName = `${tutor.firstName} ${tutor.lastName}`.toLowerCase();
        const matchesSearch =
            fullName.includes(searchQuery.toLowerCase()) ||
            tutor.email.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = filterStatus === 'all' || tutor.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    const handleViewTutor = (id: number) => {
        navigate(`/admin/tutors/${id}`);
    };

    const handleEditTutor = (id: number) => {
        navigate(`/admin/tutors/${id}/edit`);
    };

    const handleViewSchedule = (id: number) => {
        navigate(`/admin/tutors/${id}/schedule`);
    };

    const handleViewStudents = (id: number) => {
        navigate(`/admin/tutors/${id}/students`);
    };

    const handleCreateTutor = () => {
        navigate('/admin/tutors/create');
    };

    const handleApproveApplication = async (id: number) => {
        try {
            await Api.put(`/admin/tutors/${id}/activate`);
            toast.success("Tutor application approved successfully.");
            fetchPendingApplications();
            fetchTutors();
        } catch (error) {
            console.error('Failed to approve tutor:', error);
            toast.error("Failed to approve tutor application.");
        }
    };

    const handleRejectApplication = async (id: number) => {
        try {
            await Api.put(`/admin/tutors/${id}/reject`);
            toast.success("Tutor application rejected.");
            fetchPendingApplications();
        } catch (error) {
            console.error('Failed to reject tutor:', error);
            toast.error("Failed to reject tutor application.");
        }
    };

    const handleDeleteTutor = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this tutor?')) {
            try {
                await Api.delete(`/admin/tutors/${id}`);
                toast.success("Tutor deleted successfully.");
                fetchTutors();
            } catch (error) {
                console.error('Failed to delete tutor:', error);
                toast.error("Failed to delete tutor.");
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Tutor Management</h2>
                    <p className="text-gray-500">老师管理</p>
                </div>
                <Button
                    onClick={handleCreateTutor}
                    className="bg-red-500 hover:bg-red-600 text-white rounded-full px-6"
                >
                    <i className="far fa-plus mr-2"></i>
                    Add New Tutor
                </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-4 bg-white p-1 rounded-xl">
                    <TabsTrigger value="tutors" className="rounded-lg data-[state=active]:bg-red-50 data-[state=active]:text-red-600">
                        Active Tutors
                    </TabsTrigger>
                    <TabsTrigger value="applications" className="rounded-lg data-[state=active]:bg-red-50 data-[state=active]:text-red-600">
                        Pending Applications
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="tutors">
                    {/* Filters and Search */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                        <div className="flex flex-wrap gap-4">
                            <div className="flex-1 min-w-[200px]">
                                <div className="relative">
                                    <i className="far fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                                    <input
                                        type="text"
                                        placeholder="Search tutors..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="relative">
                                    <i className="far fa-filter absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value as 'all' | 'ACTIVE' | 'INACTIVE')}
                                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none bg-white"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="ACTIVE">Active</option>
                                        <option value="INACTIVE">Inactive</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tutors Table */}
                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                        {loading ? (
                            <div className="flex justify-center items-center py-12">
                                <LoadingSpinner />
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tutor</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredTutors.map((tutor) => (
                                            <tr key={tutor.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 rounded-full overflow-hidden">
                                                            {tutor.avatar ? (
                                                                <img
                                                                    src={`${url}/${tutor.avatar}`}
                                                                    alt={`${tutor.firstName} ${tutor.lastName}`}
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            ) : (
                                                                <img
                                                                    src={`https://api.dicebear.com/7.x/micah/svg?seed=${tutor.email}`}
                                                                    alt={`${tutor.firstName} ${tutor.lastName}`}
                                                                    className="h-full w-full"
                                                                />
                                                            )}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">{`${tutor.firstName} ${tutor.lastName}`}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{tutor.email}</div>
                                                    <div className="text-sm text-gray-500">{tutor.phone || 'N/A'}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${tutor.status === 'ACTIVE'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {tutor.status.toLowerCase()}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center space-x-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleViewTutor(tutor.id)}
                                                            className="text-gray-600 hover:text-red-600"
                                                        >
                                                            <i className="far fa-eye mr-1"></i>
                                                            View
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleEditTutor(tutor.id)}
                                                            className="text-gray-600 hover:text-red-600"
                                                        >
                                                            <i className="far fa-edit mr-1"></i>
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleViewSchedule(tutor.id)}
                                                            className="text-gray-600 hover:text-red-600"
                                                        >
                                                            <i className="far fa-calendar-alt mr-1"></i>
                                                            Schedule
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleViewStudents(tutor.id)}
                                                            className="text-gray-600 hover:text-red-600"
                                                        >
                                                            <i className="far fa-user-graduate mr-1"></i>
                                                            Students
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDeleteTutor(tutor.id)}
                                                            className="text-red-600 hover:text-red-700"
                                                        >
                                                            <i className="far fa-trash-alt mr-1"></i>
                                                            Delete
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {filteredTutors.length === 0 && (
                                    <div className="text-center py-12">
                                        <p className="text-gray-500">No tutors found matching your search criteria</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="applications">
                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                        {loading ? (
                            <div className="flex justify-center items-center py-12">
                                <LoadingSpinner />
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Applicant
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Email
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Education
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Applied On
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {pendingApplications.map((application) => (
                                            <tr key={application.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 font-medium">
                                                            {`${application.firstName.charAt(0)}${application.lastName.charAt(0)}`}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">{`${application.firstName} ${application.lastName}`}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{application.email}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{application.tutorProfile?.educationLevel || 'Not specified'}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(application.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center justify-end space-x-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleViewTutor(application.id)}
                                                            className="text-gray-600 hover:text-red-600"
                                                        >
                                                            <i className="far fa-eye mr-1"></i>
                                                            View
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleApproveApplication(application.id)}
                                                            className="text-green-600 hover:text-green-700"
                                                        >
                                                            <i className="far fa-check mr-1"></i>
                                                            Approve
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleRejectApplication(application.id)}
                                                            className="text-red-600 hover:text-red-700"
                                                        >
                                                            <i className="far fa-times mr-1"></i>
                                                            Reject
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {pendingApplications.length === 0 && (
                                    <div className="text-center py-12">
                                        <p className="text-gray-500">No pending applications</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default TutorManagement; 