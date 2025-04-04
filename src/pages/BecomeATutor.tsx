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

                            {/* Specialized Options */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4 pb-2 border-b">Specialized Options</h3>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm text-gray-700">
                                            课程时长 Duration
                                        </label>
                                        <select
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
                                        >
                                            <option value="60">60 minutes</option>
                                            <option value="90">90 minutes</option>
                                            <option value="120">120 minutes</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2 col-span-1">
                                        <label className="block text-sm text-gray-700">
                                            价格 Price (USD)
                                        </label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-600">$</span>
                                            <Input
                                                type="number"
                                                min="10"
                                                placeholder="45"
                                                className="w-full pl-8 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Availability */}
                            <div>
                                <h4 className="font-medium mb-3">可用时间 Availability*</h4>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm text-gray-700">
                                            工作时间 Schedule
                                        </label>
                                        <Input
                                            type="text"
                                            placeholder="E.g., Mon-Fri: 9AM-6PM"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm text-gray-700">
                                            时区 Timezone
                                        </label>
                                        <select
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
                                            required
                                        >
                                            <option value="">Select your timezone</option>
                                            <option value="EST">Eastern Time (EST/EDT)</option>
                                            <option value="CST">Central Time (CST/CDT)</option>
                                            <option value="MST">Mountain Time (MST/MDT)</option>
                                            <option value="PST">Pacific Time (PST/PDT)</option>
                                            <option value="GMT">Greenwich Mean Time (GMT)</option>
                                            <option value="CET">Central European Time (CET)</option>
                                            <option value="CST-Asia">China Standard Time (CST)</option>
                                            <option value="JST">Japan Standard Time (JST)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* About You Section */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4 pb-2 border-b">关于你 About You</h3>

                                <div className="space-y-2 mb-6">
                                    <label className="block text-sm font-medium text-gray-700">
                                        个人介绍 About Me*
                                    </label>
                                    <textarea
                                        rows={6}
                                        placeholder="Describe your teaching experience, approach, and what students can expect from your lessons..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                                        required
                                    ></textarea>
                                    <p className="text-sm text-gray-500">
                                        写一段有吸引力的个人介绍，描述您的教学风格和专长 (200-300字)
                                        <span className="block mt-1">Write an engaging introduction about your teaching style and expertise (200-300 words)</span>
                                    </p>
                                </div>

                                <div className="space-y-2 mb-6">
                                    <label className="block text-sm font-medium text-gray-700">
                                        教学风格 Teaching Style*
                                    </label>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {["Conversational", "Interactive", "Student-centered", "Grammar-focused",
                                            "Visual learning", "Task-based", "Project-based", "Structured curriculum",
                                            "Flexible approach", "Immersive"].map((style) => (
                                                <label key={style} className="relative flex items-center bg-gray-50 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100">
                                                    <input type="checkbox" className="sr-only peer" />
                                                    <span className="peer-checked:text-red-600 peer-checked:font-medium text-sm">{style}</span>
                                                    <span className="absolute inset-0 border-2 border-transparent peer-checked:border-red-500 rounded-lg pointer-events-none"></span>
                                                </label>
                                            ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        教学资料 Teaching Materials
                                    </label>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {["Custom PDF worksheets", "Interactive exercises", "Audio materials",
                                            "Video lessons", "Textbooks", "Online platforms", "Authentic materials",
                                            "Practice tests", "Flashcards", "Games"].map((material) => (
                                                <label key={material} className="relative flex items-center bg-gray-50 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100">
                                                    <input type="checkbox" className="sr-only peer" />
                                                    <span className="peer-checked:text-red-600 peer-checked:font-medium text-sm">{material}</span>
                                                    <span className="absolute inset-0 border-2 border-transparent peer-checked:border-red-500 rounded-lg pointer-events-none"></span>
                                                </label>
                                            ))}
                                    </div>
                                </div>
                            </div>

                            {/* Terms and Submission */}
                            <div className="pt-6 border-t border-gray-200">
                                <div className="flex items-start mb-6">
                                    <div className="flex items-center h-5">
                                        <input
                                            id="terms"
                                            type="checkbox"
                                            className="w-4 h-4 border border-gray-300 rounded bg-white focus:ring-3 focus:ring-red-500"
                                            required
                                        />
                                    </div>
                                    <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                                        我已阅读并同意<a href="#" className="text-red-600 hover:underline">服务条款</a>和<a href="#" className="text-red-600 hover:underline">隐私政策</a>
                                        <span className="block mt-1">I have read and agree to the <a href="#" className="text-red-600 hover:underline">Terms of Service</a> and <a href="#" className="text-red-600 hover:underline">Privacy Policy</a></span>
                                    </label>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-lg py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    提交申请 Submit Application
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>

            {/* Tutor Success Stories - New Section */}
            <section className="py-16 w-full bg-white">
                <div className="container max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-12 text-center">
                        教师成功故事
                        <span className="block text-xl mt-2 text-gray-600">Tutor Success Stories</span>
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                name: "David Chen",
                                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
                                story: "从加入平台到现在已经一年了，已经积累了超过300名学生，每月收入稳定。",
                                translation: "I've been on the platform for a year and have taught over 300 students with a steady monthly income.",
                                students: 300,
                                rating: 4.9
                            },
                            {
                                name: "Emily Wang",
                                image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
                                story: "作为一名兼职教师，我每周花10小时教学，额外增加了30%的收入。",
                                translation: "As a part-time tutor, I spend 10 hours a week teaching and have increased my income by 30%.",
                                students: 180,
                                rating: 4.8
                            },
                            {
                                name: "Michael Liu",
                                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
                                story: "教学不仅是一份工作，更是我与世界各地学生建立联系的方式。",
                                translation: "Teaching is not just a job but a way for me to connect with students from around the world.",
                                students: 250,
                                rating: 4.9
                            }
                        ].map((story, index) => (
                            <div key={index} className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-4 mb-4">
                                    <img
                                        src={story.image}
                                        alt={story.name}
                                        className="w-16 h-16 rounded-full object-cover"
                                    />
                                    <div>
                                        <h3 className="font-semibold text-lg">{story.name}</h3>
                                        <div className="flex items-center">
                                            <i className="fas fa-star text-yellow-400 mr-1 text-sm"></i>
                                            <span className="text-sm text-gray-600">{story.rating} Rating</span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-gray-700 mb-2">{story.story}</p>
                                <p className="text-sm text-gray-600 mb-4">{story.translation}</p>
                                <div className="flex items-center text-sm text-gray-600">
                                    <i className="fas fa-user-graduate mr-2"></i>
                                    <span>{story.students}+ Students Taught</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section - New */}
            <section className="py-16 w-full bg-gray-50">
                <div className="container max-w-4xl mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-12 text-center">
                        常见问题
                        <span className="block text-xl mt-2 text-gray-600">Frequently Asked Questions</span>
                    </h2>

                    <div className="space-y-6">
                        {[
                            {
                                question: "成为老师需要哪些资格？",
                                questionEn: "What qualifications do I need to become a tutor?",
                                answer: "您需要拥有相关的教学资质（如TEFL, TESOL等），或相关领域的学位，以及至少1年的教学经验。",
                                answerEn: "You need relevant teaching qualifications (such as TEFL, TESOL), or a degree in a related field, and at least 1 year of teaching experience."
                            },
                            {
                                question: "我如何获得第一批学生？",
                                questionEn: "How do I get my first students?",
                                answer: "完成您的个人资料后，您将出现在学生的搜索结果中。提供试课和有竞争力的价格可以帮助您获得初始评价。",
                                answerEn: "After completing your profile, you'll appear in student search results. Offering trial lessons and competitive rates can help you get initial reviews."
                            },
                            {
                                question: "我可以设置我自己的时间表和价格吗？",
                                questionEn: "Can I set my own schedule and rates?",
                                answer: "是的，您可以完全控制您的可用时间和课程费率。您也可以随时调整这些设置。",
                                answerEn: "Yes, you have complete control over your availability and lesson rates. You can adjust these settings at any time."
                            },
                            {
                                question: "平台收取多少佣金？",
                                questionEn: "How much commission does the platform take?",
                                answer: "我们收取15%的服务费，用于平台维护、支付处理和营销，帮助您获得更多学生。",
                                answerEn: "We charge a 15% service fee for platform maintenance, payment processing, and marketing to help you get more students."
                            }
                        ].map((faq, index) => (
                            <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                                <h3 className="font-semibold text-lg mb-2">
                                    {faq.question}
                                    <span className="block text-sm font-normal mt-1 text-gray-600">{faq.questionEn}</span>
                                </h3>
                                <p className="text-gray-700">
                                    {faq.answer}
                                    <span className="block text-sm mt-1 text-gray-600">{faq.answerEn}</span>
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
} 