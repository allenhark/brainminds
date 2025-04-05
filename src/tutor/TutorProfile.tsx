import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import toast from 'react-hot-toast';
import { tutorApi, generateDicebearAvatar } from '@/Api';
import { useParams } from 'react-router-dom';
const url = 'http://localhost:3000/';

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
    availability: string;
    timezone: string;
    lessonDuration: number;
}

interface AvailabilitySchedule {
    day: string;
    slots: {
        start: string;
        end: string;
    }[];
}

const TutorProfile: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const [originalData, setOriginalData] = useState<any>(null);
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
        availability: '',
        timezone: '',
        lessonDuration: 60,
    });

    const [isLoading, setIsLoading] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState('');
    const [availabilitySchedule, setAvailabilitySchedule] = useState<AvailabilitySchedule[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [dataFetched, setDataFetched] = useState(false);

    // Fetch tutor profile data
    useEffect(() => {
        const fetchTutorProfile = async () => {
            if (!userId) return;

            setIsLoading(true);
            try {
                const response = await tutorApi.getTutorProfile(parseInt(userId));
                console.log('Fetched tutor profile:', response);

                // Store original data for comparison
                setOriginalData(response);

                // Parse the availability data
                let parsedAvailability: AvailabilitySchedule[] = [];
                try {
                    if (response.availability) {
                        parsedAvailability = JSON.parse(response.availability);
                    }
                } catch (error) {
                    console.error('Error parsing availability:', error);
                }

                setAvailabilitySchedule(parsedAvailability);

                // Set profile data
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
                    availability: response.availability || '',
                    timezone: response.timezone || '',
                    lessonDuration: response.lessonDuration || 60,
                });

                // Set avatar preview - handle different types of paths and use dicebear as fallback
                if (response.user?.avatar) {
                    const avatarUrl = response.user.avatar.startsWith('http')
                        ? response.user.avatar
                        : `${url}${response.user.avatar}`;
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
    }, [userId]);

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
        if (!file || !userId) return;

        try {
            setIsSaving(true);

            // Create a preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);

            // Upload the file to the server
            const response = await tutorApi.uploadTutorAvatar(parseInt(userId), file);

            // Update the avatar in the profile data
            setProfileData(prev => ({
                ...prev,
                avatar: response.avatar
            }));

            // Update avatar preview with the server response
            const avatarUrl = response.avatar.startsWith('http')
                ? response.avatar
                : `${url}${response.avatar}`;
            setAvatarPreview(avatarUrl);

            toast.success('Avatar updated successfully');
        } catch (error) {
            console.error('Error uploading avatar:', error);
            toast.error('Failed to upload avatar');

            // Revert to original avatar or dicebear fallback
            if (profileData.avatar) {
                const avatarUrl = profileData.avatar.startsWith('http')
                    ? profileData.avatar
                    : `${url}${profileData.avatar}`;
                setAvatarPreview(avatarUrl);
            } else {
                const seed = `${profileData.firstName}-${profileData.lastName}-${profileData.email}`;
                setAvatarPreview(generateDicebearAvatar(seed));
            }
        } finally {
            setIsSaving(false);
        }
    };

    const handleAvailabilityChange = (day: string, index: number, field: 'start' | 'end', value: string) => {
        setAvailabilitySchedule(prev => {
            const newSchedule = [...prev];
            const dayIndex = newSchedule.findIndex(d => d.day === day);

            if (dayIndex === -1) {
                // Day not found, add it
                newSchedule.push({
                    day,
                    slots: [{ start: '', end: '' }]
                });
                return newSchedule;
            }

            // Update the slot
            if (!newSchedule[dayIndex].slots[index]) {
                newSchedule[dayIndex].slots[index] = { start: '', end: '' };
            }

            newSchedule[dayIndex].slots[index][field] = value;
            return newSchedule;
        });
    };

    const addTimeSlot = (day: string) => {
        setAvailabilitySchedule(prev => {
            const newSchedule = [...prev];
            const dayIndex = newSchedule.findIndex(d => d.day === day);

            if (dayIndex === -1) {
                // Day not found, add it
                newSchedule.push({
                    day,
                    slots: [{ start: '', end: '' }]
                });
            } else {
                // Add a new slot to the day
                newSchedule[dayIndex].slots.push({ start: '', end: '' });
            }

            return newSchedule;
        });
    };

    const removeTimeSlot = (day: string, index: number) => {
        setAvailabilitySchedule(prev => {
            const newSchedule = [...prev];
            const dayIndex = newSchedule.findIndex(d => d.day === day);

            if (dayIndex !== -1) {
                // Remove the slot
                newSchedule[dayIndex].slots.splice(index, 1);

                // If no slots left, remove the day
                if (newSchedule[dayIndex].slots.length === 0) {
                    newSchedule.splice(dayIndex, 1);
                }
            }

            return newSchedule;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) return;

        setIsSaving(true);

        try {
            // Update education information
            await tutorApi.updateTutorEducation(parseInt(userId), {
                educationLevel: profileData.educationLevel,
                teachingStyle: profileData.teachingStyle,
                teachingMaterials: profileData.teachingMaterials,
                aboutMe: profileData.aboutMe,
                teachingCredentials: profileData.teachingCredentials
            });

            // Update schedule
            await tutorApi.updateTutorSchedule(parseInt(userId), {
                timezone: profileData.timezone,
                lessonDuration: parseInt(String(profileData.lessonDuration)),
                schedule: availabilitySchedule
            });

            toast.success('Profile updated successfully');

            // Refresh data after update
            const response = await tutorApi.getTutorProfile(parseInt(userId));
            setOriginalData(response);
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
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Profile Management</h1>
            </div>

            {dataFetched && originalData && (
                <div className="bg-blue-50 p-4 rounded-md mb-6">
                    <h2 className="font-semibold text-blue-700 mb-2">Current Profile Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p><strong>Name:</strong> {originalData.user?.firstName} {originalData.user?.lastName}</p>
                            <p><strong>Email:</strong> {originalData.user?.email}</p>
                            <p><strong>Phone:</strong> {originalData.user?.phone || 'Not set'}</p>
                            <p><strong>Education Level:</strong> {originalData.educationLevel || 'Not set'}</p>
                            <p><strong>Teaching Credentials:</strong> {originalData.teachingCredentials || 'Not set'}</p>
                        </div>
                        <div>
                            <p><strong>Teaching Style:</strong> {originalData.teachingStyle || 'Not set'}</p>
                            <p><strong>Materials:</strong> {originalData.teachingMaterials || 'Not set'}</p>
                            <p><strong>Timezone:</strong> {originalData.timezone || 'Not set'}</p>
                            <p><strong>Lesson Duration:</strong> {originalData.lessonDuration ? `${originalData.lessonDuration} minutes` : 'Not set'}</p>
                        </div>
                    </div>
                    {originalData.aboutMe && (
                        <div className="mt-2">
                            <p><strong>About Me:</strong> {originalData.aboutMe}</p>
                        </div>
                    )}
                </div>
            )}

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
                                {avatarPreview ? (
                                    <img
                                        src={avatarPreview}
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
                                    <Input
                                        id="phone"
                                        name="phone"
                                        value={profileData.phone}
                                        onChange={handleInputChange}
                                        placeholder="Phone Number"
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

                    {/* Availability & Schedule */}
                    <Card className="md:col-span-3">
                        <CardHeader>
                            <CardTitle>Availability & Schedule</CardTitle>
                            <CardDescription>Set your teaching schedule</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                            <SelectItem value="UTC-12">UTC-12</SelectItem>
                                            <SelectItem value="UTC-11">UTC-11</SelectItem>
                                            <SelectItem value="UTC-10">UTC-10</SelectItem>
                                            <SelectItem value="UTC-9">UTC-9</SelectItem>
                                            <SelectItem value="UTC-8">UTC-8 (PST)</SelectItem>
                                            <SelectItem value="UTC-7">UTC-7 (MST)</SelectItem>
                                            <SelectItem value="UTC-6">UTC-6 (CST)</SelectItem>
                                            <SelectItem value="UTC-5">UTC-5 (EST)</SelectItem>
                                            <SelectItem value="UTC-4">UTC-4</SelectItem>
                                            <SelectItem value="UTC-3">UTC-3</SelectItem>
                                            <SelectItem value="UTC-2">UTC-2</SelectItem>
                                            <SelectItem value="UTC-1">UTC-1</SelectItem>
                                            <SelectItem value="UTC+0">UTC+0</SelectItem>
                                            <SelectItem value="UTC+1">UTC+1 (CET)</SelectItem>
                                            <SelectItem value="UTC+2">UTC+2</SelectItem>
                                            <SelectItem value="UTC+3">UTC+3</SelectItem>
                                            <SelectItem value="UTC+4">UTC+4</SelectItem>
                                            <SelectItem value="UTC+5">UTC+5</SelectItem>
                                            <SelectItem value="UTC+6">UTC+6</SelectItem>
                                            <SelectItem value="UTC+7">UTC+7</SelectItem>
                                            <SelectItem value="UTC+8">UTC+8 (CST)</SelectItem>
                                            <SelectItem value="UTC+9">UTC+9 (JST)</SelectItem>
                                            <SelectItem value="UTC+10">UTC+10</SelectItem>
                                            <SelectItem value="UTC+11">UTC+11</SelectItem>
                                            <SelectItem value="UTC+12">UTC+12</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="lessonDuration">Default Lesson Duration (minutes)</Label>
                                    <Select
                                        value={String(profileData.lessonDuration)}
                                        onValueChange={(value) => handleSelectChange('lessonDuration', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select lesson duration" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="30">30 minutes</SelectItem>
                                            <SelectItem value="45">45 minutes</SelectItem>
                                            <SelectItem value="60">60 minutes</SelectItem>
                                            <SelectItem value="90">90 minutes</SelectItem>
                                            <SelectItem value="120">120 minutes</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Label>Weekly Schedule</Label>
                                <div className="space-y-4">
                                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
                                        const daySchedule = availabilitySchedule.find(d => d.day === day);
                                        return (
                                            <div key={day} className="border rounded-md p-4">
                                                <h3 className="font-medium mb-2">{day}</h3>
                                                {daySchedule?.slots.map((slot, index) => (
                                                    <div key={index} className="flex items-center gap-2 mb-2">
                                                        <Input
                                                            type="time"
                                                            value={slot.start}
                                                            onChange={(e) => handleAvailabilityChange(day, index, 'start', e.target.value)}
                                                            className="w-32"
                                                        />
                                                        <span>to</span>
                                                        <Input
                                                            type="time"
                                                            value={slot.end}
                                                            onChange={(e) => handleAvailabilityChange(day, index, 'end', e.target.value)}
                                                            className="w-32"
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => removeTimeSlot(day, index)}
                                                        >
                                                            <i className="far fa-trash-alt"></i>
                                                        </Button>
                                                    </div>
                                                ))}
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => addTimeSlot(day)}
                                                    className="mt-2"
                                                >
                                                    <i className="far fa-plus mr-2"></i>
                                                    Add Time Slot
                                                </Button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" disabled={isSaving}>
                                {isSaving ? (
                                    <>
                                        <i className="far fa-spinner-third fa-spin mr-2"></i>
                                        Saving...
                                    </>
                                ) : 'Save Changes'}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </form>
        </div>
    );
};

export default TutorProfile; 