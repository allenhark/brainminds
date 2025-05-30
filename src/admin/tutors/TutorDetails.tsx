import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Api from '@/Api';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { url } from '@/config';

type TutorDetails = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    status: string;
    createdAt: string;
    avatar?: string;
    tutorProfile?: {
        educationLevel: string;
        teachingStyle: string;
        teachingMaterials: string;
        aboutMe: string;
        timezone: string;
        lessonDuration: number;
        lessonPrice: number;
        applicationStatus: string;
        documents?: { id: number; filename: string; path: string }[];
    };
};

const TutorDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [tutor, setTutor] = useState<TutorDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [showActionDialog, setShowActionDialog] = useState(false);
    const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');
    const [rejectionReason, setRejectionReason] = useState('');

    useEffect(() => {
        fetchTutorDetails();
    }, [id]);

    const fetchTutorDetails = async () => {
        try {
            setLoading(true);
            const response = await Api.get(`/admin/tutors/${id}`);
            setTutor(response.data);
        } catch (error) {
            console.error('Failed to fetch tutor details:', error);
            toast.error('Failed to load tutor details.');
        } finally {
            setLoading(false);
        }
    };

    const handleActionClick = (type: 'approve' | 'reject') => {
        setActionType(type);
        setShowActionDialog(true);
    };

    const handleActionConfirm = async () => {
        if (!tutor) return;

        try {
            setActionLoading(true);

            if (actionType === 'approve') {
                await Api.put(`/admin/tutors/${id}/activate`);
                toast.success('Tutor approved successfully');
            } else {
                await Api.put(`/admin/tutors/${id}/reject`, { reason: rejectionReason });
                toast.success('Tutor application rejected');
            }

            // Refresh tutor details
            await fetchTutorDetails();
            setShowActionDialog(false);
        } catch (error) {
            console.error(`Failed to ${actionType} tutor:`, error);
            toast.error(`Failed to ${actionType} tutor application`);
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!tutor) {
        return (
            <div className="bg-white rounded-lg p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Tutor Not Found</h2>
                <p className="text-gray-600 mb-6">
                    The tutor you're looking for doesn't exist or you don't have permission to view it.
                </p>
                <Link to="/admin/tutors">
                    <Button>Return to Tutor List</Button>
                </Link>
            </div>
        );
    }

    const isPending = tutor.tutorProfile?.applicationStatus === 'PENDING';
    const isApproved = tutor.tutorProfile?.applicationStatus === 'APPROVED';
    const isRejected = tutor.tutorProfile?.applicationStatus === 'REJECTED';

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">Tutor Details</h1>
                <div className="flex space-x-3">
                    {isPending && (
                        <>
                            <Button
                                variant="outline"
                                className="bg-green-50 text-green-600 hover:bg-green-100"
                                onClick={() => handleActionClick('approve')}
                            >
                                <i className="far fa-check-circle mr-2"></i> Approve
                            </Button>
                            <Button
                                variant="outline"
                                className="bg-red-50 text-red-600 hover:bg-red-100"
                                onClick={() => handleActionClick('reject')}
                            >
                                <i className="far fa-times-circle mr-2"></i> Reject
                            </Button>
                        </>
                    )}
                    <Link to={`/admin/tutors/${id}/edit`}>
                        <Button variant="outline">
                            <i className="far fa-edit mr-2"></i> Edit Profile
                        </Button>
                    </Link>
                    <Link to={`/admin/tutors/${id}/schedule`}>
                        <Button variant="outline">
                            <i className="far fa-calendar mr-2"></i> View Schedule
                        </Button>
                    </Link>
                    <Link to={`/admin/tutors/${id}/students`}>
                        <Button variant="outline">
                            <i className="far fa-users mr-2"></i> View Students
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-start mb-6">
                    <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl mr-6">
                        {tutor.avatar ? (
                            <img
                                src={`${url}/${tutor.avatar}`}
                                alt={`${tutor.firstName} ${tutor.lastName}`}
                                className="h-full w-full object-cover rounded-full"
                            />
                        ) : (
                            <img
                                src={`https://api.dicebear.com/7.x/micah/svg?seed=${tutor.email}`}
                                alt={`${tutor.firstName} ${tutor.lastName}`}
                                className="h-full w-full"
                            />
                        )}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">{tutor.firstName} {tutor.lastName}</h2>
                        <p className="text-gray-600">Joined {new Date(tutor.createdAt).toLocaleDateString()}</p>
                        <div className="mt-2 flex space-x-2">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${tutor.status === 'ACTIVE'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                                }`}>
                                {tutor.status}
                            </span>
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${isApproved ? 'bg-green-100 text-green-800' :
                                isRejected ? 'bg-red-100 text-red-800' :
                                    'bg-yellow-100 text-yellow-800'
                                }`}>
                                {tutor.tutorProfile?.applicationStatus || 'PENDING'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-lg font-medium text-gray-800 mb-3">Contact Information</h3>
                        <div className="bg-gray-50 p-4 rounded-md">
                            <div className="mb-3">
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="text-gray-800">{tutor.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Phone</p>
                                <p className="text-gray-800">{tutor.phone || 'Not provided'}</p>
                            </div>
                        </div>

                        <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3">Teaching Information</h3>
                        <div className="bg-gray-50 p-4 rounded-md">
                            <div className="mb-3">
                                <p className="text-sm text-gray-500">Subject</p>
                                <p className="text-gray-800">English</p>
                            </div>
                            <div className="mb-3">
                                <p className="text-sm text-gray-500">Education Level</p>
                                <p className="text-gray-800">{tutor.tutorProfile?.educationLevel || 'Not specified'}</p>
                            </div>

                            <div className="mb-3">
                                <p className="text-sm text-gray-500">Lesson Duration</p>
                                <p className="text-gray-800">{tutor.tutorProfile?.lessonDuration || 60} minutes</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Timezone</p>
                                <p className="text-gray-800">{tutor.tutorProfile?.timezone || 'Not specified'}</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-medium text-gray-800 mb-3">About</h3>
                        <div className="bg-gray-50 p-4 rounded-md mb-6">
                            <p className="text-gray-800 whitespace-pre-wrap">{tutor.tutorProfile?.aboutMe || 'No information provided.'}</p>
                        </div>

                        <h3 className="text-lg font-medium text-gray-800 mb-3">Teaching Style</h3>
                        <div className="bg-gray-50 p-4 rounded-md mb-6">
                            <p className="text-gray-800 whitespace-pre-wrap">{tutor.tutorProfile?.teachingStyle || 'No information provided.'}</p>
                        </div>

                        <h3 className="text-lg font-medium text-gray-800 mb-3">Teaching Materials</h3>
                        <div className="bg-gray-50 p-4 rounded-md">
                            <p className="text-gray-800 whitespace-pre-wrap">{tutor.tutorProfile?.teachingMaterials || 'No information provided.'}</p>
                        </div>
                    </div>
                </div>

                {tutor.tutorProfile?.documents && tutor.tutorProfile.documents.length > 0 && (
                    <div className="mt-6">
                        <h3 className="text-lg font-medium text-gray-800 mb-3">Documents</h3>
                        <div className="bg-gray-50 p-4 rounded-md">
                            <ul className="divide-y divide-gray-200">
                                {tutor.tutorProfile.documents.map(doc => (
                                    <li key={doc.id} className="py-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <i className="far fa-file-alt text-blue-500 mr-2"></i>
                                                <span className="text-gray-800">{doc.filename}</span>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => window.open(`${'http://localhost:3000/api'}${doc.path}`, '_blank')}
                                                className="text-blue-500 hover:text-blue-600"
                                            >
                                                <i className="far fa-download mr-2"></i>
                                                Download
                                            </Button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>

            {/* Action Dialog */}
            <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {actionType === 'approve' ? 'Approve Tutor Application' : 'Reject Tutor Application'}
                        </DialogTitle>
                        <DialogDescription>
                            {actionType === 'approve'
                                ? 'Are you sure you want to approve this tutor application? The tutor will be notified via email and can start teaching immediately.'
                                : 'Are you sure you want to reject this tutor application? The tutor will be notified via email with your reason.'}
                        </DialogDescription>
                    </DialogHeader>

                    {actionType === 'reject' && (
                        <div className="py-4">
                            <Label htmlFor="rejection-reason">Rejection Reason</Label>
                            <Textarea
                                id="rejection-reason"
                                placeholder="Please provide a reason for rejection..."
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                className="mt-2"
                                rows={4}
                            />
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowActionDialog(false)}
                            disabled={actionLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleActionConfirm}
                            disabled={actionLoading || (actionType === 'reject' && !rejectionReason.trim())}
                            className={actionType === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
                        >
                            {actionLoading ? (
                                <LoadingSpinner size="sm" />
                            ) : actionType === 'approve' ? (
                                'Approve Application'
                            ) : (
                                'Reject Application'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default TutorDetails; 