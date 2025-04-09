import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import toast from 'react-hot-toast';
import Api, { tutorApi, generateDicebearAvatar } from '@/Api';
import { useParams } from 'react-router-dom';
import { url } from '@/config';
import HelmetComponent from '@/components/HelmetComponent';
const CHINESE_TIMEZONES = [
    { value: 'CST', label: '中国标准时间 (UTC+8)', labelEn: 'China Standard Time' },
    { value: 'XJT', label: '新疆时间 (UTC+6)', labelEn: 'Xinjiang Time' },
    { value: 'HKT', label: '香港时间 (UTC+8)', labelEn: 'Hong Kong Time' },
    { value: 'TWT', label: '台湾时间 (UTC+8)', labelEn: 'Taiwan Time' }
];
interface TutorProfileData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    avatar: string;
    educationLevel: string;
    teachingCredentials: string;
    teachingStyle: string;
    teachingMaterials: string;
    aboutMe: string;
    timezone: string;
    lessonDuration: number;
    schedule?: any[];
}

const TutorProfile: React.FC = () => {
    const [profileData, setProfileData] = useState<TutorProfileData>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        avatar: '',
        educationLevel: '',
        teachingCredentials: '',
        teachingStyle: '',
        teachingMaterials: '',
        aboutMe: '',
        timezone: '',
        lessonDuration: 60,
    });

    const [isLoading, setIsLoading] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [dataFetched, setDataFetched] = useState(false);

    // Fetch tutor profile data
    useEffect(() => {
        const fetchTutorProfile = async () => {
            setIsLoading(true);
            try {
                // Get current user ID from the auth endpoint
                const { data: user } = await Api.get('/auth/me');

                if (!user?.id) {
                    toast.error('Unable to retrieve user information');
                    return;
                }

                // Fetch tutor profile using the user ID
                const response = await tutorApi.getTutorProfile(user.id);

                setProfileData({
                    firstName: response.user?.firstName || '',
                    lastName: response.user?.lastName || '',
                    email: response.user?.email || '',
                    phone: response.user?.phone || '',
                    avatar: response.user?.avatar || '',
                    educationLevel: response.educationLevel || '',
                    teachingCredentials: response.teachingCredentials || '',
                    teachingStyle: response.teachingStyle || '',
                    teachingMaterials: response.teachingMaterials || '',
                    aboutMe: response.aboutMe || '',
                    timezone: response.timezone || '',
                    lessonDuration: response.lessonDuration || 60,
                    schedule: response.schedule || [],
                });

                // Set avatar preview - handle different types of paths and use dicebear as fallback
                if (response.user?.avatar) {
                    const avatarUrl = response.user.avatar.startsWith('http')
                        ? response.user.avatar
                        : `${url}/${response.user.avatar}`;
                    setAvatarPreview(avatarUrl);
                } else {
                    // Use dicebear for fallback avatar
                    const seed = `${response.user?.firstName || ''}-${response.user?.lastName || ''}-${response.user?.email || ''}`;
                    setAvatarPreview(generateDicebearAvatar(seed));
                }

                setDataFetched(true);
            } catch (error) {
                console.error('Error fetching tutor profile:', error);
                toast.error('Failed to load tutor profile');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTutorProfile();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsSaving(true);

            // Create a preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);

            // Get current user ID
            const { data: user } = await Api.get('/auth/me');
            if (!user?.id) {
                throw new Error('Unable to retrieve user information');
            }

            // Upload the file to the server
            const response = await tutorApi.uploadTutorAvatar(user.id, file);

            // Update the avatar in the profile data
            setProfileData(prev => ({
                ...prev,
                avatar: response.avatar
            }));

            // Update avatar preview with the server response
            const avatarUrl = response.avatar.startsWith('http')
                ? response.avatar
                : `${url}/${response.avatar}`;
            setAvatarPreview(avatarUrl);

            toast.success('Avatar updated successfully');
        } catch (error) {
            console.error('Error uploading avatar:', error);
            toast.error('Failed to upload avatar');

            // Revert to original avatar or dicebear fallback
            if (profileData.avatar) {
                const avatarUrl = profileData.avatar.startsWith('http')
                    ? profileData.avatar
                    : `${url}/${profileData.avatar}`;
                setAvatarPreview(avatarUrl);
            } else {
                const seed = `${profileData.firstName}-${profileData.lastName}-${profileData.email}`;
                setAvatarPreview(generateDicebearAvatar(seed));
            }
        } finally {
            setIsSaving(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            // Get current user ID
            const { data: user } = await Api.get('/auth/me');
            if (!user?.id) {
                throw new Error('Unable to retrieve user information');
            }

            // Update basic profile data
            await Api.put('/user/profile', {
                firstName: profileData.firstName,
                lastName: profileData.lastName,
                phone: profileData.phone
            });

            // Update education information
            await tutorApi.updateTutorEducation(user.id, {
                educationLevel: profileData.educationLevel,
                teachingStyle: profileData.teachingStyle,
                teachingMaterials: profileData.teachingMaterials,
                aboutMe: profileData.aboutMe,
                teachingCredentials: profileData.teachingCredentials
            });

            // Update schedule information (timezone and lesson duration)
            const scheduleData: any = {
                timezone: profileData.timezone,
                lessonDuration: profileData.lessonDuration
            };

            // Only include schedule if it's available and not empty
            if (profileData.schedule && profileData.schedule.length > 0) {
                scheduleData.schedule = profileData.schedule;
            }

            await tutorApi.updateTutorSchedule(user.id, scheduleData);

            toast.success('Profile updated successfully');

            // Refresh the profile data but keep the avatar unchanged
            const updatedProfile = await tutorApi.getTutorProfile(user.id);
            setProfileData(prev => ({
                firstName: updatedProfile.user?.firstName || '',
                lastName: updatedProfile.user?.lastName || '',
                email: updatedProfile.user?.email || '',
                phone: updatedProfile.user?.phone || '',
                avatar: prev.avatar, // Keep the current avatar
                educationLevel: updatedProfile.educationLevel || '',
                teachingCredentials: updatedProfile.teachingCredentials || '',
                teachingStyle: updatedProfile.teachingStyle || '',
                teachingMaterials: updatedProfile.teachingMaterials || '',
                aboutMe: updatedProfile.aboutMe || '',
                timezone: updatedProfile.timezone || '',
                lessonDuration: updatedProfile.lessonDuration || 60,
                schedule: updatedProfile.schedule || [],
            }));

        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <HelmetComponent
                title="Tutor Profile Management"
                description="Manage your profile information"
            />
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Profile Management</h1>
                <Button type="submit" onClick={handleSubmit} disabled={isSaving}>
                    {isSaving ? (
                        <>
                            <i className="far fa-spinner-third fa-spin mr-2"></i>
                            Saving...
                        </>
                    ) : 'Save Changes'}
                </Button>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Profile Card */}
                    <Card className="md:col-span-1">
                        <CardHeader>
                            <CardTitle>Profile Picture</CardTitle>
                            <CardDescription>Your profile picture will be visible to students</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center">
                            <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border">
                                {profileData.avatar ? (
                                    <img
                                        src={`${url}/${profileData.avatar}`}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            // Fallback if image fails to load
                                            const target = e.target as HTMLImageElement;
                                            const seed = `${profileData.firstName}-${profileData.lastName}-${profileData.email}`;
                                            target.src = generateDicebearAvatar(seed);
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                        <i className="far fa-user text-4xl text-gray-400"></i>
                                    </div>
                                )}
                            </div>
                            <Label htmlFor="avatar" className="cursor-pointer">
                                <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-100 transition-colors">
                                    <i className="far fa-upload mr-2"></i>
                                    {isSaving ? 'Uploading...' : 'Upload Photo'}
                                </div>
                                <Input
                                    id="avatar"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleAvatarChange}
                                    disabled={isSaving}
                                />
                            </Label>
                        </CardContent>
                    </Card>

                    {/* Personal Information */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                            <CardDescription>Update your personal details</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input
                                        id="firstName"
                                        name="firstName"
                                        value={profileData.firstName}
                                        onChange={handleInputChange}
                                        placeholder="First Name"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input
                                        id="lastName"
                                        name="lastName"
                                        value={profileData.lastName}
                                        onChange={handleInputChange}
                                        placeholder="Last Name"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={profileData.email}
                                        onChange={handleInputChange}
                                        placeholder="Email"
                                        disabled
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <PhoneInput
                                        country={'cn'}
                                        value={profileData.phone}
                                        onChange={(phone) => handleInputChange({ target: { name: 'phone', value: phone } } as any)}
                                        inputProps={{
                                            id: 'phone',
                                            name: 'phone',
                                            placeholder: 'Phone Number'
                                        }}
                                        containerClass="w-full"
                                        inputClass="w-full h-10 px-3 py-2 border rounded-md"
                                        buttonClass="h-10 border rounded-l-md"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Teaching Profile */}
                    <Card className="md:col-span-3">
                        <CardHeader>
                            <CardTitle>Teaching Profile</CardTitle>
                            <CardDescription>Information visible to students</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="educationLevel">Education Level</Label>
                                    <Select
                                        value={profileData.educationLevel}
                                        onValueChange={(value) => handleSelectChange('educationLevel', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select education level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Bachelor's Degree">Bachelor's Degree</SelectItem>
                                            <SelectItem value="Master's Degree">Master's Degree</SelectItem>
                                            <SelectItem value="PhD">PhD</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="teachingCredentials">Teaching Credentials</Label>
                                    <Input
                                        id="teachingCredentials"
                                        name="teachingCredentials"
                                        value={profileData.teachingCredentials}
                                        onChange={handleInputChange}
                                        placeholder="e.g., TEFL Certified"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="teachingStyle">Teaching Style</Label>
                                    <Input
                                        id="teachingStyle"
                                        name="teachingStyle"
                                        value={profileData.teachingStyle}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Conversational, Academic, etc."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="teachingMaterials">Teaching Materials</Label>
                                    <Input
                                        id="teachingMaterials"
                                        name="teachingMaterials"
                                        value={profileData.teachingMaterials}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Textbooks, custom materials, etc."
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="lessonDuration">Lesson Duration</Label>
                                    <Select
                                        value={profileData.lessonDuration.toString()}
                                        onValueChange={(value) => handleSelectChange('lessonDuration', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select lesson duration" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="30">30 minutes</SelectItem>
                                            <SelectItem value="45">45 minutes</SelectItem>
                                            <SelectItem value="60">60 minutes</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="timezone">Timezone</Label>
                                    <Select
                                        value={profileData.timezone}
                                        onValueChange={(value) => handleSelectChange('timezone', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select your timezone" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {CHINESE_TIMEZONES.map((tz) => (
                                                <SelectItem key={tz.value} value={tz.value}>
                                                    {tz.label} ({tz.labelEn})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="aboutMe">About Me</Label>
                                <Textarea
                                    id="aboutMe"
                                    name="aboutMe"
                                    value={profileData.aboutMe}
                                    onChange={handleInputChange}
                                    placeholder="Tell students about yourself, your experience, and teaching approach"
                                    rows={5}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </form>
        </div>
    );
};

export default TutorProfile; 