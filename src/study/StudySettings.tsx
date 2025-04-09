import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { userApi } from '@/Api';
import toast from 'react-hot-toast';
import HelmetComponent from '@/components/HelmetComponent';

interface UserProfile {
    firstName: string;
    lastName: string;
    email: string;
}

interface PasswordChange {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

const StudySettings: React.FC = () => {
    const [profile, setProfile] = useState<UserProfile>({
        firstName: '',
        lastName: '',
        email: ''
    });

    const [passwords, setPasswords] = useState<PasswordChange>({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordLoading, setIsPasswordLoading] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userData = await userApi.getCurrentUser();
                setProfile({
                    firstName: userData.firstName || '',
                    lastName: userData.lastName || '',
                    email: userData.email || ''
                });
            } catch (error) {
                toast.error('Failed to load profile');
            }
        };

        fetchProfile();
    }, []);

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfile(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswords(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await userApi.updateProfile(profile);
            toast.success('个人资料已更新 Profile updated successfully');
        } catch (error) {
            toast.error('更新失败 Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            toast.error('新密码不匹配 New passwords do not match');
            return;
        }
        setIsPasswordLoading(true);
        try {
            await userApi.updatePassword(passwords);
            toast.success('密码已更新 Password updated successfully');
            setPasswords({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error) {
            toast.error('密码更新失败 Failed to update password');
        } finally {
            setIsPasswordLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <HelmetComponent
                title="设置 | Settings"
                description="管理您的账户设置"
                keywords="设置, 账户, 管理"
                ogTitle="设置 | Settings"
                ogDescription="管理您的账户设置"
                ogUrl={window.location.href}
            />

            <h1 className="text-3xl font-bold">
                设置
                <span className="block mt-2">Settings</span>
            </h1>

            {/* Profile Settings */}
            <Card className="rounded-2xl">
                <CardHeader>
                    <CardTitle>
                        个人资料
                        <span className="block text-lg mt-1">Profile Information</span>
                    </CardTitle>
                    <CardDescription>更新您的个人信息 Update your personal information</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleProfileSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>
                                    名字
                                    <span className="block text-xs text-gray-500">First Name</span>
                                </Label>
                                <Input
                                    name="firstName"
                                    value={profile.firstName}
                                    onChange={handleProfileChange}
                                    className="rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>
                                    姓氏
                                    <span className="block text-xs text-gray-500">Last Name</span>
                                </Label>
                                <Input
                                    name="lastName"
                                    value={profile.lastName}
                                    onChange={handleProfileChange}
                                    className="rounded-xl"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>
                                电子邮件
                                <span className="block text-xs text-gray-500">Email</span>
                            </Label>
                            <Input
                                name="email"
                                type="email"
                                value={profile.email}
                                onChange={handleProfileChange}
                                className="rounded-xl"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="rounded-full bg-red-500 hover:bg-red-600"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    更新中... Updating...
                                </span>
                            ) : (
                                <>
                                    保存更改
                                    <span className="block text-sm">Save Changes</span>
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Password Settings */}
            <Card className="rounded-2xl">
                <CardHeader>
                    <CardTitle>
                        更改密码
                        <span className="block text-lg mt-1">Change Password</span>
                    </CardTitle>
                    <CardDescription>确保您的账户安全 Ensure your account is secure</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label>
                                当前密码
                                <span className="block text-xs text-gray-500">Current Password</span>
                            </Label>
                            <Input
                                name="currentPassword"
                                type="password"
                                value={passwords.currentPassword}
                                onChange={handlePasswordChange}
                                className="rounded-xl"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>
                                新密码
                                <span className="block text-xs text-gray-500">New Password</span>
                            </Label>
                            <Input
                                name="newPassword"
                                type="password"
                                value={passwords.newPassword}
                                onChange={handlePasswordChange}
                                className="rounded-xl"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>
                                确认新密码
                                <span className="block text-xs text-gray-500">Confirm New Password</span>
                            </Label>
                            <Input
                                name="confirmPassword"
                                type="password"
                                value={passwords.confirmPassword}
                                onChange={handlePasswordChange}
                                className="rounded-xl"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="rounded-full bg-red-500 hover:bg-red-600"
                            disabled={isPasswordLoading}
                        >
                            {isPasswordLoading ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    更新中... Updating...
                                </span>
                            ) : (
                                <>
                                    更改密码
                                    <span className="block text-sm">Change Password</span>
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default StudySettings;
