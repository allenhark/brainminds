import { Button } from "~/ui/button";
import { Input } from "~/ui/input";

export default function BecomeATutor() {
    return (
        <div className="flex flex-col justify-center items-center">
            {/* Hero Section */}
            <section className="bg-gradient-to-b from-red-50 via-red-50/50 to-white w-full -mt-[70px]">
                <div className="container max-w-6xl mx-auto px-4 pb-24 relative pt-[120px]">
                    <div className="text-center max-w-3xl mx-auto">
                        <span className="bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-semibold mb-6 inline-block">
                            Join Our Teaching Community
                        </span>
                        <h1 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                            成为英语老师
                            <span className="block mt-3">Become an English Tutor</span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            加入我们的教师团队，开启您的教学之旅
                            <span className="block mt-2">Join our teaching community and start your tutoring journey</span>
                        </p>
                    </div>
                </div>
            </section>

            {/* How it Works */}
            <section className="py-16 w-full">
                <div className="container max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-12">
                        如何成为老师
                        <span className="block text-xl mt-2 text-gray-600">How to Become a Tutor</span>
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Step 1 */}
                        <div>
                            <div className="bg-red-50 rounded-3xl p-12 mb-6 flex items-center justify-center">
                                <div className="bg-red-500 rounded-full p-6">
                                    <i className="fas fa-user-plus text-2xl text-white"></i>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold mb-3">1. 提交申请<br />Submit Application</h3>
                            <p className="text-gray-600">填写您的个人信息和教学经验</p>
                            <p className="text-sm text-gray-500 mt-1">Complete your profile with personal information and teaching experience</p>
                        </div>

                        {/* Step 2 */}
                        <div>
                            <div className="bg-blue-50 rounded-3xl p-12 mb-6 flex items-center justify-center">
                                <div className="bg-blue-500 rounded-full p-6">
                                    <i className="fas fa-check-circle text-2xl text-white"></i>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold mb-3">2. 资格审核<br />Verification Process</h3>
                            <p className="text-gray-600">我们会审核您的资质和教学经验</p>
                            <p className="text-sm text-gray-500 mt-1">We'll review your qualifications and teaching experience</p>
                        </div>

                        {/* Step 3 */}
                        <div>
                            <div className="bg-green-50 rounded-3xl p-12 mb-6 flex items-center justify-center">
                                <div className="bg-green-500 rounded-full p-6">
                                    <i className="fas fa-graduation-cap text-2xl text-white"></i>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold mb-3">3. 开始教学<br />Start Teaching</h3>
                            <p className="text-gray-600">创建您的课程表并开始接收学生</p>
                            <p className="text-sm text-gray-500 mt-1">Create your schedule and start accepting students</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Application Form */}
            <section className="py-16 w-full bg-gray-50">
                <div className="container max-w-3xl mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-8 text-center">
                        申请表
                        <span className="block text-xl mt-2 text-gray-600">Application Form</span>
                    </h2>

                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <form className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Name Field */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        名字 First Name
                                    </label>
                                    <Input
                                        type="text"
                                        placeholder="Enter your full name"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                {/* Email Field */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        姓氏 Last Name
                                    </label>
                                    <Input
                                        type="text"
                                        placeholder="Enter your last name"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email Field */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    电子邮件 Email
                                </label>
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    密码 Password
                                </label>
                                <Input
                                    type="password"
                                    placeholder="Create a password"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    required
                                />
                                <p className="text-sm text-gray-500">
                                    账户审核通过后将使用此密码登录 This password will be used once your account is approved
                                </p>
                            </div>

                            {/* Education Level Field */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    教育程度 Education Level
                                </label>
                                <select
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
                                    required
                                >
                                    <option value="">Select education level</option>
                                    <option value="bachelors">学士 Bachelor's Degree</option>
                                    <option value="masters">硕士 Master's Degree</option>
                                    <option value="phd">博士 PhD</option>
                                    <option value="other">其他 Other</option>
                                </select>
                            </div>

                            {/* Document Upload Field */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    教学资质证明 Teaching Credentials
                                </label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-red-500 transition-colors">
                                    <div className="space-y-1 text-center">
                                        <i className="fas fa-cloud-upload-alt text-4xl text-gray-400"></i>
                                        <div className="flex text-sm text-gray-600">
                                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-red-600 hover:text-red-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-red-500">
                                                <span>Upload a file</span>
                                                <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".pdf,.doc,.docx" required />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            PDF, DOC up to 10MB
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-lg py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                提交申请 Submit Application
                            </Button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
} 