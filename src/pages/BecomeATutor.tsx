import { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Api from "@/Api";
import { toast } from "react-hot-toast";

type ApplicationStep = 'requirements' | 'personal-info' | 'education' | 'schedule' | 'avatar' | 'documents' | 'verification' | 'completed';

interface ScheduleSlot {
    day: string;
    startTime: string;
    endTime: string;
}

interface ApplicationStatus {
    userId: number;
    status: string;
    applicationStatus: string;
    completedSteps: {
        personalInfo: boolean;
        education: boolean;
        schedule: boolean;
        avatar: boolean;
        documents: boolean;
        verified: boolean;
    };
}

const APPLICATION_STEPS = [
    { id: 'requirements', title: '申请要求', titleEn: 'Requirements' },
    { id: 'personal-info', title: '个人信息', titleEn: 'Personal Information' },
    { id: 'education', title: '教育背景', titleEn: 'Education & Experience' },
    { id: 'schedule', title: '课程安排', titleEn: 'Teaching Schedule' },
    { id: 'avatar', title: '头像上传', titleEn: 'Profile Photo' },
    { id: 'documents', title: '文件上传', titleEn: 'Documents' },
    { id: 'verification', title: '邮箱验证', titleEn: 'Email Verification' },
    { id: 'completed', title: '申请完成', titleEn: 'Application Completed' }
];

const CHINESE_TIMEZONES = [
    { value: 'CST', label: '中国标准时间 (UTC+8)', labelEn: 'China Standard Time' },
    { value: 'XJT', label: '新疆时间 (UTC+6)', labelEn: 'Xinjiang Time' },
    { value: 'HKT', label: '香港时间 (UTC+8)', labelEn: 'Hong Kong Time' },
    { value: 'TWT', label: '台湾时间 (UTC+8)', labelEn: 'Taiwan Time' }
];

export default function BecomeATutor() {
    const [currentStep, setCurrentStep] = useState<ApplicationStep>('requirements');
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        wechatId: "",
        educationLevel: "",
        teachingStyle: "",
        teachingMaterials: "",
        aboutMe: "",
        timezone: "CST",
        lessonDuration: "60",
        schedule: [] as ScheduleSlot[]
    });
    const [documents, setDocuments] = useState<File[]>([]);
    const [avatar, setAvatar] = useState<File | null>(null);
    const [userId, setUserId] = useState<number | null>(null);
    const [otpCode, setOtpCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showRecoveryModal, setShowRecoveryModal] = useState(false);
    const [recoveryEmail, setRecoveryEmail] = useState("");
    const [applicationStatus, setApplicationStatus] = useState<ApplicationStatus | null>(null);

    // Check for saved application on component mount
    useEffect(() => {
        const savedUserId = localStorage.getItem('tutorApplicationUserId');
        if (savedUserId) {
            checkApplicationStatus(parseInt(savedUserId));
        }
    }, []);

    const checkApplicationStatus = async (id: number) => {
        try {
            const response = await Api.get(`/site/status/${id}`);
            setApplicationStatus(response.data);
            setUserId(id);

            // Determine which step to show based on completed steps
            if (!response.data.completedSteps.personalInfo) {
                setCurrentStep('personal-info');
            } else if (!response.data.completedSteps.education) {
                setCurrentStep('education');
            } else if (!response.data.completedSteps.schedule) {
                setCurrentStep('schedule');
            } else if (!response.data.completedSteps.avatar) {
                setCurrentStep('avatar');
            } else if (!response.data.completedSteps.documents) {
                setCurrentStep('documents');
            } else if (!response.data.completedSteps.verified) {
                setCurrentStep('verification');
            } else {
                // Application is complete
                toast.success("Your application is complete and under review!");
            }
        } catch (error) {
            console.error("Error checking application status:", error);
            // Clear invalid saved ID
            localStorage.removeItem('tutorApplicationUserId');
        }
    };

    const handleRecoverySubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await Api.post("/site/recover", { email: recoveryEmail });
            setUserId(response.data.userId);
            localStorage.setItem('tutorApplicationUserId', response.data.userId.toString());
            setShowRecoveryModal(false);
            toast.success("Recovery email sent. Please check your inbox.");
            setCurrentStep('verification');
        } catch (error) {
            console.error("Error recovering application:", error);
            toast.error("Failed to recover application. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>, type: 'document' | 'avatar') => {
        if (e.target.files) {
            if (type === 'document') {
                setDocuments(Array.from(e.target.files));
            } else {
                setAvatar(e.target.files[0]);
            }
        }
    };

    const handleScheduleChange = (day: string, field: 'startTime' | 'endTime', value: string) => {
        setFormData(prev => {
            const existingSlot = prev.schedule.find(slot => slot.day === day);
            if (existingSlot) {
                return {
                    ...prev,
                    schedule: prev.schedule.map(slot =>
                        slot.day === day ? { ...slot, [field]: value } : slot
                    )
                };
            } else {
                return {
                    ...prev,
                    schedule: [...prev.schedule, { day, startTime: '', endTime: '', [field]: value }]
                };
            }
        });
    };

    const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (currentStep === 'personal-info') {
                const response = await Api.post("/site/apply", {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    password: formData.password,
                    wechatId: formData.wechatId,
                    educationLevel: formData.educationLevel,
                    teachingStyle: formData.teachingStyle,
                    teachingMaterials: formData.teachingMaterials,
                    aboutMe: formData.aboutMe,
                    timezone: formData.timezone,
                    lessonDuration: formData.lessonDuration,
                    availability: JSON.stringify(formData.schedule)
                });

                if (response.data.userId) {
                    setUserId(response.data.userId);
                    localStorage.setItem('tutorApplicationUserId', response.data.userId.toString());
                    setCurrentStep('education');
                    toast.success("Personal information saved successfully! Please continue with your education details.");
                }
            } else if (currentStep === 'education') {
                await Api.put(`/site/${userId}/education`, {
                    educationLevel: formData.educationLevel,
                    teachingStyle: formData.teachingStyle,
                    teachingMaterials: formData.teachingMaterials,
                    aboutMe: formData.aboutMe
                });
                setCurrentStep('schedule');
                toast.success("Education information saved successfully! Please set your teaching schedule.");
            } else if (currentStep === 'schedule') {
                await Api.put(`/site/${userId}/schedule`, {
                    timezone: formData.timezone,
                    lessonDuration: formData.lessonDuration,
                    schedule: JSON.stringify(formData.schedule)
                });
                setCurrentStep('avatar');
                toast.success("Schedule saved successfully! Please upload your profile photo.");
            } else if (currentStep === 'avatar' && avatar) {
                const formData = new FormData();
                formData.append('avatar', avatar);
                await Api.post(`/site/${userId}/avatar`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setCurrentStep('documents');
                toast.success("Avatar uploaded successfully! Please upload your teaching documents.");
            } else if (currentStep === 'documents' && documents.length > 0) {
                const formData = new FormData();
                documents.forEach(doc => {
                    formData.append('documents', doc);
                });
                await Api.post(`/site/${userId}/documents`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setCurrentStep('verification');
                toast.success("Documents uploaded successfully! Please verify your email to complete your application.");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error("Failed to save information. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleNextStep = () => {
        const currentIndex = APPLICATION_STEPS.findIndex(step => step.id === currentStep);
        if (currentIndex < APPLICATION_STEPS.length - 1) {
            setCurrentStep(APPLICATION_STEPS[currentIndex + 1].id as ApplicationStep);
            // Scroll to the top of the page container
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePreviousStep = () => {
        const currentIndex = APPLICATION_STEPS.findIndex(step => step.id === currentStep);
        if (currentIndex > 0) {
            setCurrentStep(APPLICATION_STEPS[currentIndex - 1].id as ApplicationStep);
            // Scroll to the top of the page container
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleVerifyOtp = async () => {
        if (!userId || !otpCode) return;
        setIsLoading(true);
        try {
            await Api.post("/site/verify-email", { userId, otpCode });
            toast.success("Email verified successfully!");

            // After verification, check application status to determine next step
            const statusResponse = await Api.get(`/site/status/${userId}`);
            const status = statusResponse.data;

            // Show completion message
            setCurrentStep('completed');
            toast.success("Application completed. No need to resubmit application. An email will be sent with application status.");
        } catch (error) {
            console.error("Error verifying OTP:", error);
            toast.error("Invalid or expired OTP. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (!userId) return;
        setIsLoading(true);
        try {
            await Api.post("/site/resend-otp", { userId });
            toast.success("Verification code resent. Please check your inbox.");
        } catch (error) {
            console.error("Error resending OTP:", error);
            toast.error("Failed to resend verification code. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-red-50 via-red-50/50 to-white">
            <div className="container max-w-6xl mx-auto px-4 py-16">
                <div className="max-w-3xl mx-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-4xl md:text-5xl font-bold mb-2">
                            成为英语老师
                            <span className="block text-2xl mt-2 text-gray-600">Become an English Tutor</span>
                        </h1>
                        <Button
                            onClick={() => setShowRecoveryModal(true)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full py-2 px-4 text-sm"
                        >
                            恢复申请 Recover Application
                        </Button>
                    </div>

                    {/* Recovery Modal */}
                    {showRecoveryModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                                <h2 className="text-2xl font-bold mb-4">
                                    恢复申请
                                    <span className="block text-lg mt-1 text-gray-600">Recover Application</span>
                                </h2>
                                <p className="mb-4 text-gray-600">
                                    请输入您申请时使用的邮箱地址，我们将向您发送验证码以恢复您的申请。
                                    <br />
                                    Please enter the email address you used during your application. We will send you a verification code to recover your application.
                                </p>
                                <form onSubmit={handleRecoverySubmit}>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium mb-1">邮箱 Email</label>
                                        <Input
                                            type="email"
                                            value={recoveryEmail}
                                            onChange={(e) => setRecoveryEmail(e.target.value)}
                                            required
                                            className="w-full rounded-lg border border-gray-300 focus:border-red-500 focus:ring-red-500"
                                            placeholder="your.email@example.com"
                                        />
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            type="button"
                                            onClick={() => setShowRecoveryModal(false)}
                                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full py-2 px-4"
                                            disabled={isLoading}
                                        >
                                            取消 Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="bg-red-500 hover:bg-red-600 text-white rounded-full py-2 px-4"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? "发送中..." : "发送验证码 Send Code"}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Progress Steps */}
                    <div className="flex justify-between items-center mb-12 mt-8">
                        {APPLICATION_STEPS.map((step, index) => (
                            <div key={step.id} className="flex items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${APPLICATION_STEPS.findIndex(s => s.id === currentStep) > index
                                    ? 'bg-red-500 text-white'
                                    : APPLICATION_STEPS.findIndex(s => s.id === currentStep) === index
                                        ? 'bg-red-100 text-red-500 border-2 border-red-500'
                                        : 'bg-gray-100 text-gray-400'
                                    }`}>
                                    {index + 1}
                                </div>
                                {index < APPLICATION_STEPS.length - 1 && (
                                    <div className={`w-16 h-1 mx-2 ${APPLICATION_STEPS.findIndex(s => s.id === currentStep) > index
                                        ? 'bg-red-500'
                                        : 'bg-gray-200'
                                        }`} />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Step Content */}
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        {currentStep === 'requirements' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold mb-6">
                                    申请材料
                                    <span className="block text-lg mt-2 text-gray-600">Required Documents</span>
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl">
                                        <span className="text-red-500 text-xl">📝</span>
                                        <div>
                                            <h3 className="font-semibold">基本信息 Basic Information</h3>
                                            <p className="text-sm text-gray-600">姓名、邮箱、密码</p>
                                            <p className="text-xs text-gray-500">Name, email, and password</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl">
                                        <span className="text-red-500 text-xl">🎓</span>
                                        <div>
                                            <h3 className="font-semibold">教育背景 Education</h3>
                                            <p className="text-sm text-gray-600">学历证书、教学经验</p>
                                            <p className="text-xs text-gray-500">Degree certificate and teaching experience</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl">
                                        <span className="text-red-500 text-xl">⏰</span>
                                        <div>
                                            <h3 className="font-semibold">课程安排 Schedule</h3>
                                            <p className="text-sm text-gray-600">每周可授课时间</p>
                                            <p className="text-xs text-gray-500">Weekly teaching schedule</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl">
                                        <span className="text-red-500 text-xl">📸</span>
                                        <div>
                                            <h3 className="font-semibold">个人照片 Photo</h3>
                                            <p className="text-sm text-gray-600">清晰的个人头像</p>
                                            <p className="text-xs text-gray-500">Clear profile photo</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl">
                                        <span className="text-red-500 text-xl">📄</span>
                                        <div>
                                            <h3 className="font-semibold">教学文件 Documents</h3>
                                            <p className="text-sm text-gray-600">教学证书、学历证明等</p>
                                            <p className="text-xs text-gray-500">Teaching certificates, degree proof, etc.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl">
                                        <span className="text-red-500 text-xl">✉️</span>
                                        <div>
                                            <h3 className="font-semibold">邮箱验证 Email Verification</h3>
                                            <p className="text-sm text-gray-600">验证码确认</p>
                                            <p className="text-xs text-gray-500">Verification code confirmation</p>
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    onClick={() => {
                                        setCurrentStep('personal-info');
                                        // Scroll to the top of the page container
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className="w-full bg-red-500 hover:bg-red-600 text-white rounded-full py-3 text-lg mt-8"
                                >
                                    开始申请 Start Application
                                </Button>
                            </div>
                        )}

                        {currentStep === 'personal-info' && (
                            <form onSubmit={handleFormSubmit} className="space-y-8">
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold mb-6">
                                        个人信息
                                        <span className="block text-lg mt-2 text-gray-600">Personal Information</span>
                                    </h2>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">名字 First Name</label>
                                            <Input
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full rounded-lg border border-gray-300 focus:border-red-500 focus:ring-red-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">姓氏 Last Name</label>
                                            <Input
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full rounded-lg border border-gray-300 focus:border-red-500 focus:ring-red-500"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">邮箱 Email</label>
                                        <Input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full rounded-lg border border-gray-300 focus:border-red-500 focus:ring-red-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">微信号 WeChat ID</label>
                                        <Input
                                            name="wechatId"
                                            value={formData.wechatId}
                                            onChange={handleInputChange}
                                            placeholder="选填 Optional"
                                            className="w-full rounded-lg border border-gray-300 focus:border-red-500 focus:ring-red-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">密码 Password</label>
                                        <Input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full rounded-lg border border-gray-300 focus:border-red-500 focus:ring-red-500"
                                        />
                                    </div>
                                    <div className="flex justify-between mt-8">
                                        <Button
                                            type="button"
                                            onClick={handlePreviousStep}
                                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full py-2 px-4"
                                        >
                                            上一步 Previous
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="bg-red-500 hover:bg-red-600 text-white rounded-full py-2 px-4"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? "保存中..." : "保存并继续 Save & Continue"}
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        )}

                        {currentStep === 'education' && (
                            <form onSubmit={handleFormSubmit} className="space-y-6">
                                <h2 className="text-2xl font-bold mb-6">
                                    教育背景
                                    <span className="block text-lg mt-2 text-gray-600">Education & Experience</span>
                                </h2>
                                <div>
                                    <label className="block text-sm font-medium mb-1">教育程度 Education Level</label>
                                    <select
                                        name="educationLevel"
                                        value={formData.educationLevel}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full rounded-lg border border-gray-300 focus:border-red-500 focus:ring-red-500 p-2"
                                    >
                                        <option value="">请选择 Please select</option>
                                        <option value="bachelor">学士 Bachelor's Degree</option>
                                        <option value="master">硕士 Master's Degree</option>
                                        <option value="phd">博士 PhD</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">教学风格 Teaching Style</label>
                                    <textarea
                                        name="teachingStyle"
                                        value={formData.teachingStyle}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full rounded-lg border border-gray-300 focus:border-red-500 focus:ring-red-500 p-2"
                                        rows={3}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">教学材料 Teaching Materials</label>
                                    <textarea
                                        name="teachingMaterials"
                                        value={formData.teachingMaterials}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full rounded-lg border border-gray-300 focus:border-red-500 focus:ring-red-500 p-2"
                                        rows={3}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">自我介绍 About Me</label>
                                    <textarea
                                        name="aboutMe"
                                        value={formData.aboutMe}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full rounded-lg border border-gray-300 focus:border-red-500 focus:ring-red-500 p-2"
                                        rows={5}
                                    />
                                </div>
                                <div className="flex justify-between mt-8">
                                    <Button
                                        type="button"
                                        onClick={handlePreviousStep}
                                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full py-2 px-6"
                                        disabled={isLoading}
                                    >
                                        上一步 Previous
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="bg-red-500 hover:bg-red-600 text-white rounded-full py-2 px-6"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "提交中..." : "下一步 Next"}
                                    </Button>
                                </div>
                            </form>
                        )}

                        {currentStep === 'schedule' && (
                            <form onSubmit={handleFormSubmit} className="space-y-6">
                                <h2 className="text-2xl font-bold mb-6">
                                    课程安排
                                    <span className="block text-lg mt-2 text-gray-600">Teaching Schedule</span>
                                </h2>
                                <div>
                                    <label className="block text-sm font-medium mb-1">时区 Timezone</label>
                                    <select
                                        name="timezone"
                                        value={formData.timezone}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full rounded-lg border border-gray-300 focus:border-red-500 focus:ring-red-500 p-2"
                                    >
                                        {CHINESE_TIMEZONES.map(tz => (
                                            <option key={tz.value} value={tz.value}>
                                                {tz.label} ({tz.labelEn})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">课程时长 Lesson Duration (分钟/minutes)</label>
                                    <select
                                        name="lessonDuration"
                                        value={formData.lessonDuration}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full rounded-lg border border-gray-300 focus:border-red-500 focus:ring-red-500 p-2"
                                    >
                                        <option value="30">30分钟 30 minutes</option>
                                        <option value="45">45分钟 45 minutes</option>
                                        <option value="60">60分钟 60 minutes</option>
                                        <option value="90">90分钟 90 minutes</option>
                                    </select>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="font-medium">每周可授课时间 Weekly Availability</h3>
                                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                                        <div key={day} className="flex items-center gap-4">
                                            <span className="w-24">{day}</span>
                                            <Input
                                                type="time"
                                                value={formData.schedule.find(s => s.day === day)?.startTime || ''}
                                                onChange={(e) => handleScheduleChange(day, 'startTime', e.target.value)}
                                                className="w-32 border border-gray-300 rounded-lg p-2"
                                            />
                                            <span>至 to</span>
                                            <Input
                                                type="time"
                                                value={formData.schedule.find(s => s.day === day)?.endTime || ''}
                                                onChange={(e) => handleScheduleChange(day, 'endTime', e.target.value)}
                                                className="w-32 border border-gray-300 rounded-lg p-2"
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between mt-8">
                                    <Button
                                        type="button"
                                        onClick={handlePreviousStep}
                                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full py-2 px-6"
                                        disabled={isLoading}
                                    >
                                        上一步 Previous
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="bg-red-500 hover:bg-red-600 text-white rounded-full py-2 px-6"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "提交中..." : "下一步 Next"}
                                    </Button>
                                </div>
                            </form>
                        )}

                        {currentStep === 'avatar' && (
                            <form onSubmit={handleFormSubmit} className="space-y-6">
                                <h2 className="text-2xl font-bold mb-6">
                                    头像上传
                                    <span className="block text-lg mt-2 text-gray-600">Profile Photo</span>
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg relative">
                                        {avatar ? (
                                            <div className="relative">
                                                <img
                                                    src={URL.createObjectURL(avatar)}
                                                    alt="Profile preview"
                                                    className="w-32 h-32 object-cover rounded-full"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setAvatar(null)}
                                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="text-center">
                                                <span className="text-4xl mb-2">📸</span>
                                                <p className="text-sm text-gray-600">点击上传头像</p>
                                                <p className="text-xs text-gray-500">Click to upload photo</p>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, 'avatar')}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                    </div>
                                    <p className="text-sm text-gray-500 text-center">
                                        请上传清晰的个人照片，建议尺寸为 400x400 像素
                                        <br />
                                        Please upload a clear photo, recommended size 400x400 pixels
                                    </p>
                                </div>
                                <div className="flex justify-between mt-8">
                                    <Button
                                        type="button"
                                        onClick={handlePreviousStep}
                                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full py-2 px-6"
                                        disabled={isLoading}
                                    >
                                        上一步 Previous
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={!avatar || isLoading}
                                        className="bg-red-500 hover:bg-red-600 text-white rounded-full py-2 px-6 disabled:opacity-50"
                                    >
                                        {isLoading ? "上传中..." : "下一步 Next"}
                                    </Button>
                                </div>
                            </form>
                        )}

                        {currentStep === 'documents' && (
                            <form onSubmit={handleFormSubmit} className="space-y-6">
                                <h2 className="text-2xl font-bold mb-6">
                                    文件上传
                                    <span className="block text-lg mt-2 text-gray-600">Documents</span>
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg relative">
                                        {documents.length > 0 ? (
                                            <div className="w-full space-y-2">
                                                {documents.map((doc, index) => (
                                                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200">
                                                        <span className="text-sm truncate">{doc.name}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => setDocuments(docs => docs.filter((_, i) => i !== index))}
                                                            className="text-red-500"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ))}
                                                <button
                                                    type="button"
                                                    onClick={() => document.getElementById('document-upload')?.click()}
                                                    className="mt-4 text-sm text-blue-500 hover:text-blue-600"
                                                >
                                                    + 添加更多文件 Add more files
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="text-center">
                                                <span className="text-4xl mb-2">📄</span>
                                                <p className="text-sm text-gray-600">点击上传文件</p>
                                                <p className="text-xs text-gray-500">Click to upload documents</p>
                                            </div>
                                        )}
                                        <input
                                            id="document-upload"
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            multiple
                                            onChange={(e) => handleFileChange(e, 'document')}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            style={{ pointerEvents: documents.length > 0 ? 'none' : 'auto' }}
                                        />
                                    </div>
                                    <p className="text-sm text-gray-500 text-center">
                                        请上传教学证书、学历证明等相关文件（PDF、DOC、DOCX格式）
                                        <br />
                                        Please upload teaching certificates, degree proof, etc. (PDF, DOC, DOCX)
                                    </p>
                                </div>
                                <div className="flex justify-between mt-8">
                                    <Button
                                        type="button"
                                        onClick={handlePreviousStep}
                                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full py-2 px-6"
                                        disabled={isLoading}
                                    >
                                        上一步 Previous
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={documents.length === 0 || isLoading}
                                        className="bg-red-500 hover:bg-red-600 text-white rounded-full py-2 px-6 disabled:opacity-50"
                                    >
                                        {isLoading ? "上传中..." : "下一步 Next"}
                                    </Button>
                                </div>
                            </form>
                        )}

                        {currentStep === 'verification' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold mb-6">
                                    邮箱验证
                                    <span className="block text-lg mt-2 text-gray-600">Email Verification</span>
                                </h2>
                                <div className="space-y-4">
                                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                        <p className="text-blue-800 font-medium mb-2">
                                            验证码已发送 Verification Code Sent
                                        </p>
                                        <p className="text-gray-600">
                                            我们已向您的邮箱 <span className="font-medium">{formData.email}</span> 发送了验证码，请查收并输入下方。
                                            <br />
                                            We have sent a verification code to your email <span className="font-medium">{formData.email}</span>. Please check your inbox and enter the code below.
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">验证码 Verification Code</label>
                                        <Input
                                            type="text"
                                            value={otpCode}
                                            onChange={(e) => setOtpCode(e.target.value)}
                                            placeholder="请输入验证码 Enter verification code"
                                            className="w-full rounded-lg border border-gray-300 focus:border-red-500 focus:ring-red-500"
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            onClick={handleResendOtp}
                                            disabled={isLoading}
                                            className="text-sm text-blue-500 hover:text-blue-600 disabled:opacity-50"
                                        >
                                            {isLoading ? "发送中..." : "重新发送验证码 Resend Code"}
                                        </button>
                                    </div>
                                    <div className="flex justify-between mt-8">
                                        <Button
                                            type="button"
                                            onClick={handlePreviousStep}
                                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full py-2 px-6"
                                            disabled={isLoading}
                                        >
                                            上一步 Previous
                                        </Button>
                                        <Button
                                            onClick={handleVerifyOtp}
                                            disabled={!otpCode || isLoading}
                                            className="bg-red-500 hover:bg-red-600 text-white rounded-full py-2 px-6 disabled:opacity-50"
                                        >
                                            {isLoading ? "验证中..." : "验证 Verify"}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === 'completed' && (
                            <div className="space-y-6 text-center">
                                <div className="mb-8">
                                    <span className="text-6xl mb-4 block">✅</span>
                                    <h2 className="text-2xl font-bold mb-2">
                                        申请已完成
                                        <span className="block text-lg mt-2 text-gray-600">Application Completed</span>
                                    </h2>
                                </div>
                                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                                    <p className="text-green-800 mb-4">
                                        您的申请已成功提交并验证。我们已收到您的所有材料，将尽快审核您的申请。
                                    </p>
                                    <p className="text-green-700">
                                        Your application has been successfully submitted and verified. We have received all your materials and will review your application as soon as possible.
                                    </p>
                                </div>
                                <div className="mt-8">
                                    <p className="text-gray-600 mb-4">
                                        我们已将申请状态发送至您的邮箱。请查收邮件以获取更多信息。
                                        <br />
                                        We have sent the application status to your email. Please check your inbox for more information.
                                    </p>
                                    <Button
                                        onClick={() => window.location.href = '/'}
                                        className="bg-red-500 hover:bg-red-600 text-white rounded-full py-2 px-8"
                                    >
                                        返回首页 Return to Home
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 