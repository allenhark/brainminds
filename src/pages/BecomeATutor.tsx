import { useState, FormEvent, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Api from "@/Api";
import { toast } from "react-hot-toast";

type ApplicationStep = 'requirements' | 'personal-info' | 'education' | 'schedule' | 'avatar' | 'documents' | 'verification';

interface ScheduleSlot {
    day: string;
    startTime: string;
    endTime: string;
}

const APPLICATION_STEPS = [
    { id: 'requirements', title: '申请要求', titleEn: 'Requirements' },
    { id: 'personal-info', title: '个人信息', titleEn: 'Personal Information' },
    { id: 'education', title: '教育背景', titleEn: 'Education & Experience' },
    { id: 'schedule', title: '课程安排', titleEn: 'Teaching Schedule' },
    { id: 'avatar', title: '头像上传', titleEn: 'Profile Photo' },
    { id: 'documents', title: '文件上传', titleEn: 'Documents' },
    { id: 'verification', title: '邮箱验证', titleEn: 'Email Verification' }
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
        try {
            const formDataToSubmit = new FormData();

            // Handle form data
            Object.entries(formData).forEach(([key, value]) => {
                if (key === 'schedule') {
                    formDataToSubmit.append(key, JSON.stringify(value));
                } else if (typeof value === 'string') {
                    formDataToSubmit.append(key, value);
                }
            });

            // Handle files
            if (avatar) {
                formDataToSubmit.append('avatar', avatar);
            }
            documents.forEach(doc => {
                formDataToSubmit.append('documents', doc);
            });

            const response = await Api.post("/tutor/apply", formDataToSubmit, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.userId) {
                setUserId(response.data.userId);
                setCurrentStep('verification');
                toast.success("Application submitted successfully! Please check your email for verification code.");
            }
        } catch (error) {
            console.error("Error submitting application:", error);
            toast.error("Failed to submit application. Please try again.");
        }
    };

    const handleVerifyOtp = async () => {
        if (!userId || !otpCode) return;
        try {
            await Api.post("/tutor/verify-email", { userId, otpCode });
            toast.success("Email verified successfully!");
            setCurrentStep('documents');
        } catch (error) {
            console.error("Error verifying OTP:", error);
            toast.error("Invalid or expired OTP. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-red-50 via-red-50/50 to-white">
            <div className="container max-w-6xl mx-auto px-4 py-16">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold mb-2">
                        成为英语老师
                        <span className="block text-2xl mt-2 text-gray-600">Become an English Tutor</span>
                    </h1>

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
                                    onClick={() => setCurrentStep('personal-info')}
                                    className="w-full bg-red-500 hover:bg-red-600 text-white rounded-full py-3 text-lg mt-8"
                                >
                                    开始申请 Start Application
                                </Button>
                            </div>
                        )}

                        {currentStep === 'personal-info' && (
                            <form onSubmit={handleFormSubmit} className="space-y-6">
                                <h2 className="text-2xl font-bold mb-6">
                                    个人信息
                                    <span className="block text-lg mt-2 text-gray-600">Personal Information</span>
                                </h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">名字 First Name</label>
                                        <Input
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full rounded-lg border-gray-300 focus:border-red-500 focus:ring-red-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">姓氏 Last Name</label>
                                        <Input
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full rounded-lg border-gray-300 focus:border-red-500 focus:ring-red-500"
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
                                        className="w-full rounded-lg border-gray-300 focus:border-red-500 focus:ring-red-500"
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
                                        className="w-full rounded-lg border-gray-300 focus:border-red-500 focus:ring-red-500"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full bg-red-500 hover:bg-red-600 text-white rounded-full py-3 text-lg mt-8"
                                >
                                    下一步 Next Step
                                </Button>
                            </form>
                        )}

                        {currentStep === 'education' && (
                            <form onSubmit={handleFormSubmit} className="space-y-6">
                                <h2 className="text-2xl font-bold mb-6">
                                    教育背景
                                    <span className="block text-lg mt-2 text-gray-600">Education & Experience</span>
                                </h2>
                                <div>
                                    <label className="block text-sm font-medium mb-1">学历 Education Level</label>
                                    <select
                                        name="educationLevel"
                                        value={formData.educationLevel}
                                        onChange={handleInputChange}
                                        className="w-full rounded-lg border-gray-300 focus:border-red-500 focus:ring-red-500"
                                        required
                                    >
                                        <option value="">请选择 Select education level</option>
                                        <option value="bachelors">本科 Bachelor's Degree</option>
                                        <option value="masters">硕士 Master's Degree</option>
                                        <option value="phd">博士 PhD</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">教学风格 Teaching Style</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {["对话式 Conversational", "互动式 Interactive", "以学生为中心 Student-centered", "语法重点 Grammar-focused"].map((style) => (
                                            <label key={style} className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    name="teachingStyle"
                                                    value={style}
                                                    onChange={(e) => {
                                                        const currentStyles = formData.teachingStyle ? formData.teachingStyle.split(',') : [];
                                                        if (e.target.checked) {
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                teachingStyle: [...currentStyles, style].join(',')
                                                            }));
                                                        } else {
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                teachingStyle: currentStyles.filter(s => s !== style).join(',')
                                                            }));
                                                        }
                                                    }}
                                                    className="rounded border-gray-300 text-red-500 focus:ring-red-500"
                                                />
                                                <span>{style}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">自我介绍 About Me</label>
                                    <textarea
                                        name="aboutMe"
                                        value={formData.aboutMe}
                                        onChange={handleInputChange}
                                        className="w-full rounded-lg border-gray-300 focus:border-red-500 focus:ring-red-500"
                                        rows={4}
                                        required
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full bg-red-500 hover:bg-red-600 text-white rounded-full py-3 text-lg mt-8"
                                >
                                    下一步 Next Step
                                </Button>
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
                                        className="w-full rounded-lg border-gray-300 focus:border-red-500 focus:ring-red-500"
                                        required
                                    >
                                        {CHINESE_TIMEZONES.map((timezone) => (
                                            <option key={timezone.value} value={timezone.value}>
                                                {timezone.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">课程时长 Lesson Duration</label>
                                    <select
                                        name="lessonDuration"
                                        value={formData.lessonDuration}
                                        onChange={handleInputChange}
                                        className="w-full rounded-lg border-gray-300 focus:border-red-500 focus:ring-red-500"
                                        required
                                    >
                                        <option value="30">30分钟 30 minutes</option>
                                        <option value="45">45分钟 45 minutes</option>
                                        <option value="60">60分钟 60 minutes</option>
                                        <option value="90">90分钟 90 minutes</option>
                                    </select>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="font-semibold">每周课程安排 Weekly Schedule</h3>
                                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                                        <div key={day} className="grid grid-cols-3 gap-2 items-center">
                                            <span className="font-medium">{day}</span>
                                            <Input
                                                type="time"
                                                value={formData.schedule.find(s => s.day === day)?.startTime || ''}
                                                onChange={(e) => handleScheduleChange(day, 'startTime', e.target.value)}
                                                className="w-full rounded-lg border-gray-300 focus:border-red-500 focus:ring-red-500"
                                            />
                                            <Input
                                                type="time"
                                                value={formData.schedule.find(s => s.day === day)?.endTime || ''}
                                                onChange={(e) => handleScheduleChange(day, 'endTime', e.target.value)}
                                                className="w-full rounded-lg border-gray-300 focus:border-red-500 focus:ring-red-500"
                                            />
                                        </div>
                                    ))}
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full bg-red-500 hover:bg-red-600 text-white rounded-full py-3 text-lg mt-8"
                                >
                                    下一步 Next Step
                                </Button>
                            </form>
                        )}

                        {currentStep === 'avatar' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold mb-6">
                                    头像上传
                                    <span className="block text-lg mt-2 text-gray-600">Profile Photo</span>
                                </h2>
                                <div className="space-y-4">
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, 'avatar')}
                                            className="hidden"
                                            id="avatar-upload"
                                        />
                                        <label htmlFor="avatar-upload" className="cursor-pointer">
                                            {avatar ? (
                                                <img
                                                    src={URL.createObjectURL(avatar)}
                                                    alt="Preview"
                                                    className="mx-auto h-32 w-32 object-cover rounded-full"
                                                />
                                            ) : (
                                                <div className="text-gray-500">
                                                    点击上传头像 Click to upload profile photo
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                    <Button
                                        onClick={() => setCurrentStep('documents')}
                                        className="w-full bg-red-500 hover:bg-red-600 text-white rounded-full py-3 text-lg mt-8"
                                    >
                                        下一步 Next Step
                                    </Button>
                                </div>
                            </div>
                        )}

                        {currentStep === 'documents' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold mb-6">
                                    文件上传
                                    <span className="block text-lg mt-2 text-gray-600">Documents</span>
                                </h2>
                                <div className="space-y-4">
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center">
                                        <input
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            onChange={(e) => handleFileChange(e, 'document')}
                                            className="hidden"
                                            id="document-upload"
                                            multiple
                                        />
                                        <label htmlFor="document-upload" className="cursor-pointer">
                                            <div className="text-gray-500">
                                                点击上传教学文件 Click to upload teaching documents
                                            </div>
                                        </label>
                                    </div>
                                    {documents.length > 0 && (
                                        <div className="space-y-2">
                                            <h3 className="font-medium">已选文件 Selected Files:</h3>
                                            <ul className="list-disc pl-5">
                                                {documents.map((doc, index) => (
                                                    <li key={index}>{doc.name}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    <Button
                                        onClick={() => setCurrentStep('verification')}
                                        className="w-full bg-red-500 hover:bg-red-600 text-white rounded-full py-3 text-lg mt-8"
                                    >
                                        下一步 Next Step
                                    </Button>
                                </div>
                            </div>
                        )}

                        {currentStep === 'verification' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold mb-6">
                                    邮箱验证
                                    <span className="block text-lg mt-2 text-gray-600">Email Verification</span>
                                </h2>
                                <p className="text-gray-600">
                                    我们已向您的邮箱发送了验证码。请输入验证码以完成申请。
                                    <span className="block text-sm mt-1">
                                        We've sent a verification code to your email. Please enter it below to complete your application.
                                    </span>
                                </p>
                                <div className="space-y-4">
                                    <Input
                                        type="text"
                                        value={otpCode}
                                        onChange={(e) => setOtpCode(e.target.value)}
                                        placeholder="请输入6位验证码 Enter 6-digit code"
                                        maxLength={6}
                                        className="w-full rounded-lg border-gray-300 focus:border-red-500 focus:ring-red-500"
                                    />
                                    <Button
                                        onClick={handleVerifyOtp}
                                        disabled={!otpCode || otpCode.length !== 6}
                                        className="w-full bg-red-500 hover:bg-red-600 text-white rounded-full py-3 text-lg mt-8"
                                    >
                                        验证邮箱 Verify Email
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