import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import toast from 'react-hot-toast';

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
    lessonPrice: number;
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
        availability: '',
        timezone: '',
        lessonDuration: 60,
        lessonPrice: 0,
    });

    const [isLoading, setIsLoading] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState('');

    // Simulate fetch profile data
    useEffect(() => {
        // This would be an API call in a real implementation
        setTimeout(() => {
            setProfileData({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                phone: '+1 234 567 8901',
                avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
                educationLevel: 'Master\'s Degree',
                teachingCredentials: 'TEFL Certified',
                teachingStyle: 'Conversational',
                teachingMaterials: 'Custom materials and textbooks',
                aboutMe: 'Experienced English tutor with 5+ years of teaching students of all levels.',
                availability: 'Weekdays 9 AM - 5 PM, Weekends 10 AM - 2 PM',
                timezone: 'UTC-5',
                lessonDuration: 60,
                lessonPrice: 25,
            });
            setAvatarPreview('https://randomuser.me/api/portraits/men/1.jpg');
        }, 500);
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

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Here we would normally upload the file to a server
            // For now, just create a preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // This would be replaced with an actual API call
            console.log('Profile data to be submitted:', profileData);

            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error('Failed to update profile');
            console.error('Error updating profile:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Profile Management</h1>
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
                                {avatarPreview ? (
                                    <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                        <i className="far fa-user text-4xl text-gray-400"></i>
                                    </div>
                                )}
                            </div>
                            <Label htmlFor="avatar" className="cursor-pointer">
                                <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-100 transition-colors">
                                    <i className="far fa-upload mr-2"></i>
                                    Upload Photo
                                </div>
                                <Input id="avatar" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
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

                    {/* Availability & Pricing */}
                    <Card className="md:col-span-3">
                        <CardHeader>
                            <CardTitle>Availability & Pricing</CardTitle>
                            <CardDescription>Set your schedule and rates</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="availability">Availability Schedule</Label>
                                    <Textarea
                                        id="availability"
                                        name="availability"
                                        value={profileData.availability}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Weekdays 9 AM - 5 PM, Weekends 10 AM - 2 PM"
                                        rows={2}
                                    />
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
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                                <div className="space-y-2">
                                    <Label htmlFor="lessonPrice">Hourly Rate ($)</Label>
                                    <Input
                                        id="lessonPrice"
                                        name="lessonPrice"
                                        type="number"
                                        value={profileData.lessonPrice}
                                        onChange={handleInputChange}
                                        placeholder="e.g., 25"
                                    />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
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