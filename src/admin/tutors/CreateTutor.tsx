import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Api from '@/Api';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import LoadingSpinner from '@/components/ui/loading-spinner';

const CreateTutor: React.FC = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        rate: '',
        educationLevel: '',
        teachingStyle: '',
        teachingMaterials: '',
        aboutMe: '',
        timezone: '',
        lessonDuration: '60'
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await Api.post('/admin/tutors', formData);

            toast({
                title: 'Success',
                description: 'Tutor created successfully.',
                variant: 'default',
            });

            // Redirect to the new tutor's details page
            navigate(`/admin/tutors/${response.data.userId}`);
        } catch (error) {
            console.error('Failed to create tutor:', error);
            toast({
                title: 'Error',
                description: 'Failed to create tutor.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">Create New Tutor</h1>
                <Link to="/admin/tutors">
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
                        <div>
                            <label htmlFor="rate" className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate ($)</label>
                            <input
                                type="number"
                                id="rate"
                                name="rate"
                                className="w-full p-2 border border-gray-300 rounded-md"
                                value={formData.rate}
                                onChange={handleInputChange}
                                min="0"
                                step="1"
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
                                placeholder="Enter a brief biography for the tutor"
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
                                placeholder="Describe the tutor's teaching style"
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
                                placeholder="Describe the materials the tutor uses"
                            ></textarea>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end space-x-3">
                    <Link to="/admin/tutors">
                        <Button variant="outline" type="button">Cancel</Button>
                    </Link>
                    <Button type="submit" disabled={loading}>
                        {loading ? (
                            <>
                                <LoadingSpinner size="sm" className="mr-2" />
                                Creating...
                            </>
                        ) : 'Create Tutor'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CreateTutor; 