import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Api from '@/Api';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import LoadingSpinner from '@/components/ui/loading-spinner';

type TutorDetails = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    status: string;
    tutorProfile?: {
        educationLevel: string;
        teachingStyle: string;
        teachingMaterials: string;
        aboutMe: string;
        timezone: string;
        lessonDuration: number;
        lessonPrice: number;
    };
};

const TutorEdit: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        status: '',
        educationLevel: '',
        teachingStyle: '',
        teachingMaterials: '',
        aboutMe: '',
        timezone: '',
        lessonDuration: ''
    });

    useEffect(() => {
        fetchTutorDetails();
    }, [id]);

    const fetchTutorDetails = async () => {
        try {
            const response = await Api.get(`/admin/tutors/${id}`);
            setFormData({
                firstName: response.data.firstName || '',
                lastName: response.data.lastName || '',
                email: response.data.email || '',
                phone: response.data.phone || '',
                status: response.data.status || '',
                educationLevel: response.data.tutorProfile?.educationLevel || '',
                teachingStyle: response.data.tutorProfile?.teachingStyle || '',
                teachingMaterials: response.data.tutorProfile?.teachingMaterials || '',
                aboutMe: response.data.tutorProfile?.aboutMe || '',
                timezone: response.data.tutorProfile?.timezone || '',
                lessonDuration: response.data.tutorProfile?.lessonDuration?.toString() || '60',
            });
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch tutor details:', error);
            toast({
                title: 'Error',
                description: 'Failed to load tutor details.',
                variant: 'destructive',
            });
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            await Api.put(`/admin/tutors/${id}`, {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                status: formData.status,
                educationLevel: formData.educationLevel,
                teachingStyle: formData.teachingStyle,
                teachingMaterials: formData.teachingMaterials,
                aboutMe: formData.aboutMe,
                timezone: formData.timezone,
                lessonDuration: formData.lessonDuration,
            });

            toast({
                title: 'Success',
                description: 'Tutor updated successfully.',
                variant: 'default',
            });

            navigate(`/admin/tutors/${id}`);
        } catch (error) {
            console.error('Failed to update tutor:', error);
            toast({
                title: 'Error',
                description: 'Failed to update tutor.',
                variant: 'destructive',
            });
        } finally {
            setSaving(false);
        }
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
                <h1 className="text-2xl font-bold text-gray-800">Edit Tutor Profile</h1>
                <Link to={`/admin/tutors/${id}`}>
                    <Button variant="outline">Cancel</Button>
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                className="w-full p-2 border border-gray-300 rounded-md"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                className="w-full p-2 border border-gray-300 rounded-md"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="w-full p-2 border border-gray-300 rounded-md"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                className="w-full p-2 border border-gray-300 rounded-md"
                                value={formData.phone}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                id="status"
                                name="status"
                                className="w-full p-2 border border-gray-300 rounded-md"
                                value={formData.status}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="ACTIVE">Active</option>
                                <option value="INACTIVE">Inactive</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Teaching Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="educationLevel" className="block text-sm font-medium text-gray-700 mb-1">Education Level</label>
                            <select
                                id="educationLevel"
                                name="educationLevel"
                                className="w-full p-2 border border-gray-300 rounded-md"
                                value={formData.educationLevel}
                                onChange={handleInputChange}
                            >
                                <option value="">Select Education Level</option>
                                <option value="High School">High School</option>
                                <option value="Bachelor's Degree">Bachelor's Degree</option>
                                <option value="Master's Degree">Master's Degree</option>
                                <option value="PhD">PhD</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                            <select
                                id="timezone"
                                name="timezone"
                                className="w-full p-2 border border-gray-300 rounded-md"
                                value={formData.timezone}
                                onChange={handleInputChange}
                            >
                                <option value="">Select Timezone</option>
                                <option value="UTC-12">UTC-12</option>
                                <option value="UTC-11">UTC-11</option>
                                <option value="UTC-10">UTC-10</option>
                                <option value="UTC-9">UTC-9</option>
                                <option value="UTC-8">UTC-8 (PST)</option>
                                <option value="UTC-7">UTC-7 (MST)</option>
                                <option value="UTC-6">UTC-6 (CST)</option>
                                <option value="UTC-5">UTC-5 (EST)</option>
                                <option value="UTC-4">UTC-4</option>
                                <option value="UTC-3">UTC-3</option>
                                <option value="UTC-2">UTC-2</option>
                                <option value="UTC-1">UTC-1</option>
                                <option value="UTC+0">UTC+0</option>
                                <option value="UTC+1">UTC+1 (CET)</option>
                                <option value="UTC+2">UTC+2</option>
                                <option value="UTC+3">UTC+3</option>
                                <option value="UTC+4">UTC+4</option>
                                <option value="UTC+5">UTC+5</option>
                                <option value="UTC+6">UTC+6</option>
                                <option value="UTC+7">UTC+7</option>
                                <option value="UTC+8">UTC+8</option>
                                <option value="UTC+9">UTC+9 (JST)</option>
                                <option value="UTC+10">UTC+10</option>
                                <option value="UTC+11">UTC+11</option>
                                <option value="UTC+12">UTC+12</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="lessonDuration" className="block text-sm font-medium text-gray-700 mb-1">Lesson Duration (minutes)</label>
                            <input
                                type="number"
                                id="lessonDuration"
                                name="lessonDuration"
                                className="w-full p-2 border border-gray-300 rounded-md"
                                value={formData.lessonDuration}
                                onChange={handleInputChange}
                                min="15"
                                step="15"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">About & Teaching Style</h2>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="aboutMe" className="block text-sm font-medium text-gray-700 mb-1">About Me</label>
                            <textarea
                                id="aboutMe"
                                name="aboutMe"
                                rows={4}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                value={formData.aboutMe}
                                onChange={handleInputChange}
                            ></textarea>
                        </div>
                        <div>
                            <label htmlFor="teachingStyle" className="block text-sm font-medium text-gray-700 mb-1">Teaching Style</label>
                            <textarea
                                id="teachingStyle"
                                name="teachingStyle"
                                rows={4}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                value={formData.teachingStyle}
                                onChange={handleInputChange}
                            ></textarea>
                        </div>
                        <div>
                            <label htmlFor="teachingMaterials" className="block text-sm font-medium text-gray-700 mb-1">Teaching Materials</label>
                            <textarea
                                id="teachingMaterials"
                                name="teachingMaterials"
                                rows={4}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                value={formData.teachingMaterials}
                                onChange={handleInputChange}
                            ></textarea>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end space-x-3">
                    <Link to={`/admin/tutors/${id}`}>
                        <Button variant="outline" type="button">Cancel</Button>
                    </Link>
                    <Button type="submit" disabled={saving}>
                        {saving ? (
                            <>
                                <LoadingSpinner size="sm" className="mr-2" />
                                Saving...
                            </>
                        ) : 'Save Changes'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default TutorEdit; 