import { useState, useRef } from 'react';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Api from '@/Api';
import { useUser } from '@/contexts/UserContext';
import { useNavigate } from 'react-router-dom';

// Define error type for API responses
interface ApiError {
    response?: {
        status: number;
        data: {
            message: string;
        };
    };
}

// Validation schemas
const loginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

const signupSchema = z.object({
    firstName: z.string().min(2, 'First name is required'),
    lastName: z.string().min(2, 'Last name is required'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

const verificationSchema = z.object({
    code: z.string().length(6, 'Verification code must be 6 digits'),
});

type FormState = 'login' | 'signup' | 'resetPassword' | 'verifyEmail' | 'newPassword';

const OTPInput = ({ value, onChange }: { value: string, onChange: (value: string) => void }) => {
    const [otp, setOtp] = useState(value.split(''));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (index: number, value: string) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        onChange(newOtp.join(''));

        // Move to next input if value is entered
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        // Move to previous input on backspace if current input is empty
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6);
        const newOtp = [...otp];
        pastedData.split('').forEach((char, index) => {
            if (index < 6) newOtp[index] = char;
        });
        setOtp(newOtp);
        onChange(newOtp.join(''));
    };

    return (
        <div className="flex gap-3 justify-center">
            {[0, 1, 2, 3, 4, 5].map((index) => (
                <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength={1}
                    value={otp[index] || ''}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-12 h-12 text-xl text-center bg-white border-2 border-gray-200 rounded-lg focus:border-red-500 focus:ring-red-500"
                />
            ))}
        </div>
    );
};

// Add this new component for password strength
const PasswordStrengthMeter = ({ password }: { password: string }) => {
    const calculateStrength = (): { strength: number; label: string } => {
        if (!password) return { strength: 0, label: '密码强度 / Password Strength' };

        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        const labels = [
            '弱 / Weak',
            '一般 / Fair',
            '良好 / Good',
            '强 / Strong'
        ];

        return { strength, label: labels[strength - 1] || labels[0] };
    };

    const { strength, label } = calculateStrength();
    const bars = [1, 2, 3, 4];

    return (
        <div className="mt-2">
            <div className="flex gap-1 mb-1">
                {bars.map((bar) => (
                    <div
                        key={bar}
                        className={`h-1 flex-1 rounded-full ${bar <= strength
                            ? strength === 1 ? 'bg-red-500'
                                : strength === 2 ? 'bg-orange-500'
                                    : strength === 3 ? 'bg-yellow-500'
                                        : 'bg-green-500'
                            : 'bg-gray-200'
                            }`}
                    />
                ))}
            </div>
            <p className="text-xs text-gray-600">{label}</p>
        </div>
    );
};

const LoginSignup = () => {
    const [formState, setFormState] = useState<FormState>('login');
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        verificationCode: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const { login, refreshUser } = useUser();
    const navigate = useNavigate();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const validatedData = loginSchema.parse({
                email: formData.email,
                password: formData.password,
            });

            // Use the UserContext login method instead of direct API call
            const { success, user } = await login(validatedData.email, validatedData.password);

            // Ensure user data is refreshed
            //await refreshUser();

            console.log('login success', success, user);

            // Redirect based on user role using React Router's navigate
            navigate('/welcome');

        } catch (error) {
            if (error instanceof z.ZodError) {
                const newErrors: Record<string, string> = {};
                error.errors.forEach(err => {
                    if (err.path[0]) {
                        newErrors[err.path[0].toString()] = err.message;
                    }
                });
                setErrors(newErrors);
            } else {
                // Handle API errors
                setErrors({
                    email: 'Invalid credentials',
                    password: 'Invalid credentials'
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const validatedData = signupSchema.parse(formData);

            const response = await Api.post('/auth/signup', {
                firstName: validatedData.firstName,
                lastName: validatedData.lastName,
                email: validatedData.email,
                password: validatedData.password
            });

            // Check for requiresVerification flag from backend
            if (response.data.requiresVerification) {
                // Store email for verification
                setFormData(prev => ({ ...prev, email: validatedData.email }));
                setFormState('verifyEmail');
            } else {
                // If no verification required, redirect to login
                setFormState('login');
            }
        } catch (error: unknown) {
            if (error instanceof z.ZodError) {
                const newErrors: Record<string, string> = {};
                error.errors.forEach(err => {
                    if (err.path[0]) {
                        newErrors[err.path[0].toString()] = err.message;
                    }
                });
                setErrors(newErrors);
            } else if ((error as ApiError).response?.status === 400) {
                // Handle API errors with specific messages
                setErrors({ email: (error as ApiError).response?.data.message || 'Email already exists' });
            } else {
                // Handle other API errors
                setErrors({ email: 'An error occurred. Please try again.' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const validatedEmail = z.string().email().parse(formData.email);

            const response = await Api.post('/auth/reset-password', {
                email: validatedEmail
            });

            // Server always returns 200 for security reasons, even if email doesn't exist
            if (response.status === 200) {
                // Show success message regardless of whether email exists
                setErrors({});
                setFormState('verifyEmail');
            }
        } catch (error: unknown) {
            if (error instanceof z.ZodError) {
                const newErrors: Record<string, string> = {};
                error.errors.forEach(err => {
                    if (err.path[0]) {
                        newErrors[err.path[0].toString()] = err.message;
                    }
                });
                setErrors(newErrors);
            } else if ((error as ApiError).response?.status === 400) {
                // Handle API errors with specific messages
                setErrors({ email: (error as ApiError).response?.data.message || 'An error occurred. Please try again.' });
            } else {
                // Handle other API errors
                setErrors({ email: 'An error occurred. Please try again.' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const validatedCode = verificationSchema.parse({ code: formData.verificationCode });

            const response = await Api.post('/auth/verify-email', {
                code: validatedCode.code,
                email: formData.email
            });

            // Check if token is returned (auto-login after verification)
            if (response.data.token) {
                // Store token and user data
                sessionStorage.setItem('jwt', response.data.token);

                // If we have user data, update the user context
                if (response.data.user) {
                    // Redirect to home page
                    window.location.href = '/';
                } else {
                    // If no user data, go to login
                    setFormState('login');
                }
            } else {
                // If no token, just go to login
                setFormState('login');
            }
        } catch (error: unknown) {
            if (error instanceof z.ZodError) {
                const newErrors: Record<string, string> = {};
                error.errors.forEach(err => {
                    if (err.path[0]) {
                        newErrors[err.path[0].toString()] = err.message;
                    }
                });
                setErrors(newErrors);
            } else if ((error as ApiError).response?.status === 400) {
                // Handle API errors with specific messages
                setErrors({ verificationCode: (error as ApiError).response?.data.message || 'Invalid verification code' });
            } else {
                // Handle other API errors
                setErrors({ verificationCode: 'An error occurred. Please try again.' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSetNewPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const validatedData = z.object({
                password: z.string().min(8, 'Password must be at least 8 characters'),
                confirmPassword: z.string()
            }).refine((data) => data.password === data.confirmPassword, {
                message: "Passwords don't match",
                path: ["confirmPassword"],
            }).parse({
                password: formData.password,
                confirmPassword: formData.confirmPassword
            });

            const response = await Api.post('/auth/new-password', {
                email: formData.email,
                password: validatedData.password,
                code: formData.verificationCode
            });

            // Check if token is returned (auto-login after password reset)
            if (response.data.token) {
                // Store token and user data
                sessionStorage.setItem('jwt', response.data.token);

                // If we have user data, update the user context
                if (response.data.user) {
                    // Redirect to home page
                    window.location.href = '/';
                } else {
                    // If no user data, go to login
                    setFormState('login');
                }
            } else {
                // If no token, just go to login
                setFormState('login');
            }
        } catch (error: unknown) {
            if (error instanceof z.ZodError) {
                const newErrors: Record<string, string> = {};
                error.errors.forEach(err => {
                    if (err.path[0]) {
                        newErrors[err.path[0].toString()] = err.message;
                    }
                });
                setErrors(newErrors);
            } else if ((error as ApiError).response?.status === 400) {
                // Handle API errors with specific messages
                setErrors({ password: (error as ApiError).response?.data.message || 'Failed to set new password. Please check your verification code.' });
            } else {
                // Handle other API errors
                setErrors({ password: 'An error occurred. Please try again.' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const renderLoginForm = () => (
        <div className="space-y-8">
            <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                    <label className="block text-lg mb-1">
                        <span className="block font-medium">邮箱</span>
                        <span className="block text-gray-600 text-sm">Email Address</span>
                    </label>
                    <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full h-12 text-base rounded-xl bg-white border-gray-200 focus:border-red-500 focus:ring-red-500"
                    />
                    {errors.email && <p className="text-red-500 mt-1 text-sm">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                    <label className="block text-lg mb-1">
                        <span className="block font-medium">密码</span>
                        <span className="block text-gray-600 text-sm">Password</span>
                    </label>
                    <Input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full h-12 text-base rounded-xl bg-white border-gray-200 focus:border-red-500 focus:ring-red-500"
                    />
                    <PasswordStrengthMeter password={formData.password} />
                    {errors.password && <p className="text-red-500 mt-1 text-sm">{errors.password}</p>}
                </div>
                <div className="pt-2">
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-red-500 hover:bg-red-600 text-white h-12 text-lg rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? '登录中... / Logging in...' : '登录 / Login'}
                    </Button>
                </div>
                <div className="text-center">
                    <Button
                        type="button"
                        onClick={() => setFormState('resetPassword')}
                        disabled={isLoading}
                        variant="ghost"
                        className="text-red-500 hover:text-red-600 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        忘记密码？/ Forgot Password?
                    </Button>
                </div>
            </form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-4 text-gray-500 bg-gradient-to-b from-red-50 via-red-50/50 to-white">
                        或 / OR
                    </span>
                </div>
            </div>

            <div className="text-center">
                <Button
                    type="button"
                    onClick={() => setFormState('signup')}
                    disabled={isLoading}
                    className="w-full border-2 border-red-50 text-red-600 bg-red-200 hover:bg-red-400 h-12 text-lg rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    注册新账号 / Sign Up
                </Button>
            </div>
        </div>
    );

    const renderSignupForm = () => (
        <form onSubmit={handleSignup} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="block text-lg mb-1">
                        <span className="block font-medium">名字</span>
                        <span className="block text-gray-600 text-sm">First Name</span>
                    </label>
                    <Input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full h-12 text-base rounded-xl bg-white border-gray-200 focus:border-red-500 focus:ring-red-500"
                    />
                    {errors.firstName && <p className="text-red-500 mt-1 text-sm">{errors.firstName}</p>}
                </div>
                <div className="space-y-2">
                    <label className="block text-lg mb-1">
                        <span className="block font-medium">姓氏</span>
                        <span className="block text-gray-600 text-sm">Last Name</span>
                    </label>
                    <Input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full h-12 text-base rounded-xl bg-white border-gray-200 focus:border-red-500 focus:ring-red-500"
                    />
                    {errors.lastName && <p className="text-red-500 mt-1 text-sm">{errors.lastName}</p>}
                </div>
            </div>
            <div className="space-y-2">
                <label className="block text-lg mb-1">
                    <span className="block font-medium">邮箱</span>
                    <span className="block text-gray-600 text-sm">Email Address</span>
                </label>
                <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full h-12 text-base rounded-xl bg-white border-gray-200 focus:border-red-500 focus:ring-red-500"
                />
                {errors.email && <p className="text-red-500 mt-1 text-sm">{errors.email}</p>}
            </div>
            <div className="space-y-2">
                <label className="block text-lg mb-1">
                    <span className="block font-medium">密码</span>
                    <span className="block text-gray-600 text-sm">Password</span>
                </label>
                <Input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full h-12 text-base rounded-xl bg-white border-gray-200 focus:border-red-500 focus:ring-red-500"
                />
                <PasswordStrengthMeter password={formData.password} />
                {errors.password && <p className="text-red-500 mt-1 text-sm">{errors.password}</p>}
            </div>
            <div className="space-y-2">
                <label className="block text-lg mb-1">
                    <span className="block font-medium">确认密码</span>
                    <span className="block text-gray-600 text-sm">Confirm Password</span>
                </label>
                <Input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full h-12 text-base rounded-xl bg-white border-gray-200 focus:border-red-500 focus:ring-red-500"
                />
                {errors.confirmPassword && <p className="text-red-500 mt-1 text-sm">{errors.confirmPassword}</p>}
            </div>
            <div className="pt-2">
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-red-500 hover:bg-red-600 text-white h-12 text-lg rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? '注册中... / Signing up...' : '注册 / Sign Up'}
                </Button>
            </div>
            <div className="text-center pt-4">
                <Button
                    type="button"
                    onClick={() => setFormState('login')}
                    disabled={isLoading}
                    variant="ghost"
                    className="text-red-500 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    返回登录 / Back to Login
                </Button>
            </div>
        </form>
    );

    const renderResetPasswordForm = () => (
        <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="space-y-2">
                <label className="block text-lg mb-1">
                    <span className="block font-medium">邮箱</span>
                    <span className="block text-gray-600 text-sm">Email Address</span>
                </label>
                <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full h-12 text-base rounded-xl bg-white border-gray-200 focus:border-red-500 focus:ring-red-500"
                />
                {errors.email && <p className="text-red-500 mt-1 text-sm">{errors.email}</p>}
            </div>
            <div className="pt-2">
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-red-500 hover:bg-red-600 text-white h-12 text-lg rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? '发送中... / Sending...' : '发送验证码 / Send Reset Code'}
                </Button>
            </div>
            <div className="text-center pt-4">
                <Button
                    type="button"
                    onClick={() => setFormState('login')}
                    disabled={isLoading}
                    variant="ghost"
                    className="text-red-500 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    返回登录 / Back to Login
                </Button>
            </div>
        </form>
    );

    const renderVerificationForm = () => (
        <form onSubmit={handleVerifyCode} className="space-y-8">
            <div className="space-y-6">
                <label className="block text-xl text-center">
                    <span className="block font-medium">输入验证码</span>
                    <span className="block text-gray-600 mt-1">Enter verification code</span>
                </label>
                <OTPInput
                    value={formData.verificationCode}
                    onChange={(value) => handleInputChange({
                        target: { name: 'verificationCode', value }
                    } as React.ChangeEvent<HTMLInputElement>)}
                />
                {errors.verificationCode && (
                    <p className="text-red-500 text-center mt-4">{errors.verificationCode}</p>
                )}
            </div>
            <div className="pt-4">
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-red-500 hover:bg-red-600 text-white h-14 text-xl rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? '验证中... / Verifying...' : '验证 / Verify Code'}
                </Button>
            </div>
        </form>
    );

    const renderNewPasswordForm = () => (
        <form onSubmit={handleSetNewPassword} className="space-y-8">
            <div className="space-y-2">
                <label className="block text-xl mb-2">
                    <span className="block font-medium">新密码</span>
                    <span className="block text-gray-600">New Password</span>
                </label>
                <Input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full h-12 text-base rounded-xl bg-white border-gray-200 focus:border-red-500 focus:ring-red-500"
                />
                <PasswordStrengthMeter password={formData.password} />
                {errors.password && <p className="text-red-500 mt-1 text-sm">{errors.password}</p>}
            </div>
            <div className="space-y-2">
                <label className="block text-xl mb-2">
                    <span className="block font-medium">确认新密码</span>
                    <span className="block text-gray-600">Confirm New Password</span>
                </label>
                <Input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full h-14 text-lg rounded-xl"
                />
                {errors.confirmPassword && <p className="text-red-500 mt-1">{errors.confirmPassword}</p>}
            </div>
            <div className="pt-4">
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-red-500 hover:bg-red-600 text-white h-14 text-xl rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? '设置中... / Setting...' : '设置新密码 / Set New Password'}
                </Button>
            </div>
        </form>
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-red-50 via-red-50/50 to-white px-4 -mt-20 pb-40 pt-20">
            <div className="max-w-md w-full py-12">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold">
                        {formState === 'login' && '登录'}
                        {formState === 'signup' && '注册'}
                        {formState === 'resetPassword' && '重置密码'}
                        {formState === 'verifyEmail' && '验证邮箱'}
                        {formState === 'newPassword' && '设置新密码'}
                    </h2>
                    <h3 className="text-xl text-gray-600 mt-1">
                        {formState === 'login' && 'Login'}
                        {formState === 'signup' && 'Sign Up'}
                        {formState === 'resetPassword' && 'Reset Password'}
                        {formState === 'verifyEmail' && 'Verify Email'}
                        {formState === 'newPassword' && 'Set New Password'}
                    </h3>
                </div>
                {formState === 'login' && renderLoginForm()}
                {formState === 'signup' && renderSignupForm()}
                {formState === 'resetPassword' && renderResetPasswordForm()}
                {formState === 'verifyEmail' && renderVerificationForm()}
                {formState === 'newPassword' && renderNewPasswordForm()}
            </div>
        </div>
    );
};

export default LoginSignup;
