import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Api from '@/Api';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import LoadingSpinner from '@/components/ui/loading-spinner';

type Tutor = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    subjects?: string[];
    rate?: number;
    rating?: number;
    status: 'ACTIVE' | 'INACTIVE' | 'PENDING_VERIFICATION';
    createdAt: string;
    tutorProfile?: {
        id: number;
        educationLevel: string;
        teachingStyle: string;
        teachingMaterials: string;
        aboutMe: string;
        availability: string;
        timezone: string;
        lessonDuration: number;
        applicationStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
    };
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
            setActiveTutors(response.data);
        } catch (error) {
            console.error('Failed to fetch tutors:', error);
            toast({
                title: "Error",
                description: "Failed to load tutors. Please try again.",
                variant: "destructive",
            });
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
            toast({
                title: "Error",
                description: "Failed to load pending applications.",
                variant: "destructive",
            });
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
            toast({
                title: "Success",
                description: "Tutor application approved successfully.",
            });
            fetchPendingApplications();
            fetchTutors();
        } catch (error) {
            console.error('Failed to approve tutor:', error);
            toast({
                title: "Error",
                description: "Failed to approve tutor application.",
                variant: "destructive",
            });
        }
    };

    const handleRejectApplication = async (id: number) => {
        try {
            await Api.put(`/admin/tutors/${id}/reject`);
            toast({
                title: "Success",
                description: "Tutor application rejected.",
            });
            fetchPendingApplications();
        } catch (error) {
            console.error('Failed to reject tutor:', error);
            toast({
                title: "Error",
                description: "Failed to reject tutor application.",
                variant: "destructive",
            });
        }
    };

    const handleDeleteTutor = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this tutor?')) {
            try {
                await Api.delete(`/admin/tutors/${id}`);
                toast({
                    title: "Success",
                    description: "Tutor deleted successfully.",
                });
                fetchTutors();
            } catch (error) {
                console.error('Failed to delete tutor:', error);
                toast({
                    title: "Error",
                    description: "Failed to delete tutor.",
                    variant: "destructive",
                });
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Tutor Management</h2>
                <Button
                    onClick={handleCreateTutor}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                >
                    <i className="far fa-plus mr-2"></i> Add New Tutor
                </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="tutors">Active Tutors</TabsTrigger>
                    <TabsTrigger value="applications">Pending Applications</TabsTrigger>
                </TabsList>

                <TabsContent value="tutors">
                    {/* Filters and Search */}
                    <div className="bg-white rounded-lg p-5 shadow-sm mb-5">
                        <div className="flex flex-wrap gap-4">
                            <div className="flex-1 min-w-[200px]">
                                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i className="far fa-search text-gray-400"></i>
                                    </div>
                                    <input
                                        type="text"
                                        id="search"
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Search tutors..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    id="status"
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value as 'all' | 'ACTIVE' | 'INACTIVE')}
                                >
                                    <option value="all">All</option>
                                    <option value="ACTIVE">Active</option>
                                    <option value="INACTIVE">Inactive</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Tutors Table */}
                    <div className="bg-white rounded-lg p-5 shadow-sm overflow-hidden">
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
                                                Tutor
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Contact
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Subjects
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Rate ($/hr)
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
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
                                        {filteredTutors.map((tutor) => (
                                            <tr key={tutor.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                                                            {`${tutor.firstName.charAt(0)}${tutor.lastName.charAt(0)}`}
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
                                                    <div className="flex flex-wrap gap-1">
                                                        {tutor.subjects?.map((subject, index) => (
                                                            <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                {subject}
                                                            </span>
                                                        )) || 'Not specified'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    ${tutor.rate || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${tutor.status === 'ACTIVE'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {tutor.status.toLowerCase()}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(tutor.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        onClick={() => handleViewTutor(tutor.id)}
                                                        className="text-blue-600 hover:text-blue-900 mr-3"
                                                        title="View Details"
                                                    >
                                                        <i className="far fa-eye"></i>
                                                    </button>
                                                    <button
                                                        onClick={() => handleEditTutor(tutor.id)}
                                                        className="text-blue-600 hover:text-blue-900 mr-3"
                                                        title="Edit Profile"
                                                    >
                                                        <i className="far fa-edit"></i>
                                                    </button>
                                                    <button
                                                        onClick={() => handleViewSchedule(tutor.id)}
                                                        className="text-blue-600 hover:text-blue-900 mr-3"
                                                        title="View Schedule"
                                                    >
                                                        <i className="far fa-calendar"></i>
                                                    </button>
                                                    <button
                                                        onClick={() => handleViewStudents(tutor.id)}
                                                        className="text-blue-600 hover:text-blue-900 mr-3"
                                                        title="View Students"
                                                    >
                                                        <i className="far fa-users"></i>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteTutor(tutor.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                        title="Delete Tutor"
                                                    >
                                                        <i className="far fa-trash-alt"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {filteredTutors.length === 0 && (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500">No tutors found matching your search criteria</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Pagination */}
                        {filteredTutors.length > 0 && (
                            <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 mt-4">
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredTutors.length}</span> of <span className="font-medium">{filteredTutors.length}</span> results
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                            <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                                <span className="sr-only">Previous</span>
                                                <i className="far fa-chevron-left text-gray-400"></i>
                                            </button>
                                            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-blue-600 hover:bg-blue-50">
                                                1
                                            </button>
                                            <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                                <span className="sr-only">Next</span>
                                                <i className="far fa-chevron-right text-gray-400"></i>
                                            </button>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="applications">
                    <div className="bg-white rounded-lg p-5 shadow-sm overflow-hidden">
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
                                            <tr key={application.id}>
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
                                                    <button
                                                        onClick={() => handleViewTutor(application.id)}
                                                        className="text-blue-600 hover:text-blue-900 mr-3"
                                                        title="View Application"
                                                    >
                                                        <i className="far fa-eye"></i>
                                                    </button>
                                                    <button
                                                        onClick={() => handleApproveApplication(application.id)}
                                                        className="text-green-600 hover:text-green-900 mr-3"
                                                        title="Approve Application"
                                                    >
                                                        <i className="far fa-check"></i>
                                                    </button>
                                                    <button
                                                        onClick={() => handleRejectApplication(application.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                        title="Reject Application"
                                                    >
                                                        <i className="far fa-times"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {pendingApplications.length === 0 && (
                                    <div className="text-center py-8">
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