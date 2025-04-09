import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import HelmetComponent from "../../components/HelmetComponent";

export default function BusinessEnglishPage() {
    return (
        <div className="flex flex-col justify-center items-center">
            <HelmetComponent
                title="商务英语课程 - Business English Courses | 学习English"
                description="探索我们的商务英语课程，提升职场英语沟通能力。Explore our Business English courses designed to enhance your professional communication skills."
                keywords="商务英语, Business English, 职场英语, 商业英语, 商务沟通, 英语演讲"
                ogTitle="商务英语课程 - Business English Courses"
                ogDescription="探索我们的商务英语课程，提升职场英语沟通能力。"
            />

            {/* Hero Section */}
            <section className="bg-gradient-to-b from-red-50 via-red-50/50 to-white min-h-[500px] w-full -mt-[70px]">
                <div className="container max-w-6xl mx-auto px-4 pb-16 relative pt-[200px]">
                    <div className="max-w-2xl relative z-10">
                        <h1 className="text-5xl md:text-6xl font-bold mb-8">
                            <span className="block text-red-500">商务英语课程</span>
                            <span className="block mt-2 text-gray-700">Business English Courses</span>
                        </h1>

                        <p className="text-gray-800 mb-8 text-lg">
                            提升您的职场英语能力，掌握专业商务沟通技巧。我们的商务英语课程针对职场人士和商务环境设计，帮助您自信地处理各种商务场景。
                        </p>
                        <p className="text-gray-600 mb-8">
                            Enhance your professional English skills and master business communication. Our Business English courses are designed for professionals and tailored to business environments, helping you confidently handle various business scenarios.
                        </p>

                        <div className="flex flex-wrap gap-3">
                            <Button className="rounded-full bg-red-500 text-white hover:bg-red-600">
                                免费咨询 / Free Consultation
                            </Button>
                            <Button variant="outline" className="rounded-full bg-white">
                                查看课程价格 / View Pricing
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Course Types */}
            <section className="py-16 w-full">
                <div className="container max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-12 text-center">
                        <span className="text-red-500">我们的商务英语课程</span>
                        <span className="block mt-2 text-xl text-gray-600">Our Business English Programs</span>
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                            <div className="h-48 bg-blue-100 relative">
                                <img
                                    src="/images/business-meetings.jpg"
                                    alt="Business Meetings"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = 'https://via.placeholder.com/400x200?text=Business+Meetings';
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                                    <h3 className="text-white font-bold text-xl">商务会议英语 <span className="block text-sm font-normal">Business Meeting English</span></h3>
                                </div>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-700 mb-4">
                                    学习如何有效参与和主持英语商务会议，掌握会议常用词汇、表达方式和礼仪，提高会议发言和讨论的能力。
                                </p>
                                <p className="text-sm text-gray-500 mb-4">
                                    Learn how to effectively participate in and chair English business meetings, master common meeting vocabulary, expressions, and etiquette, and improve your ability to speak and discuss in meetings.
                                </p>
                                <ul className="text-gray-600 text-sm space-y-2 mb-6">
                                    <li className="flex items-start">
                                        <span className="text-red-500 mr-2">✓</span>
                                        会议开场和结束用语
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-red-500 mr-2">✓</span>
                                        提出意见和反馈
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-red-500 mr-2">✓</span>
                                        处理分歧和达成共识
                                    </li>
                                </ul>
                                <Link to="/contact">
                                    <Button variant="outline" className="w-full">了解更多 Learn More</Button>
                                </Link>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                            <div className="h-48 bg-red-100 relative">
                                <img
                                    src="/images/business-writing.jpg"
                                    alt="Business Writing"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = 'https://via.placeholder.com/400x200?text=Business+Writing';
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                                    <h3 className="text-white font-bold text-xl">商务写作 <span className="block text-sm font-normal">Business Writing</span></h3>
                                </div>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-700 mb-4">
                                    提升商务邮件、报告和提案的写作能力，学习专业的商务写作格式和语言，确保您的书面沟通清晰、简洁和专业。
                                </p>
                                <p className="text-sm text-gray-500 mb-4">
                                    Improve your ability to write business emails, reports, and proposals. Learn professional business writing formats and language to ensure your written communication is clear, concise, and professional.
                                </p>
                                <ul className="text-gray-600 text-sm space-y-2 mb-6">
                                    <li className="flex items-start">
                                        <span className="text-red-500 mr-2">✓</span>
                                        商务邮件结构和礼仪
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-red-500 mr-2">✓</span>
                                        报告和提案写作
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-red-500 mr-2">✓</span>
                                        正式与非正式写作风格
                                    </li>
                                </ul>
                                <Link to="/contact">
                                    <Button variant="outline" className="w-full">了解更多 Learn More</Button>
                                </Link>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                            <div className="h-48 bg-green-100 relative">
                                <img
                                    src="/images/presentations.jpg"
                                    alt="Presentations"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = 'https://via.placeholder.com/400x200?text=Presentations';
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                                    <h3 className="text-white font-bold text-xl">商务演讲与展示 <span className="block text-sm font-normal">Presentations & Public Speaking</span></h3>
                                </div>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-700 mb-4">
                                    培养自信的英语演讲能力，学习如何准备和展示专业的商业演示，掌握演讲技巧和应对问答环节的策略。
                                </p>
                                <p className="text-sm text-gray-500 mb-4">
                                    Develop confident English speaking skills, learn how to prepare and deliver professional business presentations, and master presentation techniques and strategies for handling Q&A sessions.
                                </p>
                                <ul className="text-gray-600 text-sm space-y-2 mb-6">
                                    <li className="flex items-start">
                                        <span className="text-red-500 mr-2">✓</span>
                                        演示结构和流程
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-red-500 mr-2">✓</span>
                                        数据和图表解说
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-red-500 mr-2">✓</span>
                                        应对提问和反馈
                                    </li>
                                </ul>
                                <Link to="/contact">
                                    <Button variant="outline" className="w-full">了解更多 Learn More</Button>
                                </Link>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                            <div className="h-48 bg-purple-100 relative">
                                <img
                                    src="/images/negotiations.jpg"
                                    alt="Negotiations"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = 'https://via.placeholder.com/400x200?text=Negotiations';
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                                    <h3 className="text-white font-bold text-xl">商务谈判 <span className="block text-sm font-normal">Business Negotiations</span></h3>
                                </div>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-700 mb-4">
                                    学习英语商务谈判技巧，掌握谈判策略和专业术语，提高谈判过程中的沟通效率和说服力。
                                </p>
                                <p className="text-sm text-gray-500 mb-4">
                                    Learn English business negotiation skills, master negotiation strategies and professional terminology, and improve communication efficiency and persuasiveness during negotiations.
                                </p>
                                <ul className="text-gray-600 text-sm space-y-2 mb-6">
                                    <li className="flex items-start">
                                        <span className="text-red-500 mr-2">✓</span>
                                        谈判策略和技巧
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-red-500 mr-2">✓</span>
                                        价格和条款讨论
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-red-500 mr-2">✓</span>
                                        跨文化谈判要点
                                    </li>
                                </ul>
                                <Link to="/contact">
                                    <Button variant="outline" className="w-full">了解更多 Learn More</Button>
                                </Link>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                            <div className="h-48 bg-yellow-100 relative">
                                <img
                                    src="/images/industry-specific.jpg"
                                    alt="Industry Specific"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = 'https://via.placeholder.com/400x200?text=Industry+Specific';
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                                    <h3 className="text-white font-bold text-xl">行业专业英语 <span className="block text-sm font-normal">Industry-Specific English</span></h3>
                                </div>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-700 mb-4">
                                    针对特定行业的英语培训，如金融、医疗、IT、法律和市场营销等。学习行业专业术语和沟通模式。
                                </p>
                                <p className="text-sm text-gray-500 mb-4">
                                    English training for specific industries such as finance, healthcare, IT, legal, and marketing. Learn industry-specific terminology and communication patterns.
                                </p>
                                <ul className="text-gray-600 text-sm space-y-2 mb-6">
                                    <li className="flex items-start">
                                        <span className="text-red-500 mr-2">✓</span>
                                        行业专业术语
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-red-500 mr-2">✓</span>
                                        案例分析和讨论
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-red-500 mr-2">✓</span>
                                        行业最新趋势
                                    </li>
                                </ul>
                                <Link to="/contact">
                                    <Button variant="outline" className="w-full">了解更多 Learn More</Button>
                                </Link>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                            <div className="h-48 bg-indigo-100 relative">
                                <img
                                    src="/images/networking.jpg"
                                    alt="Networking"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = 'https://via.placeholder.com/400x200?text=Networking';
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                                    <h3 className="text-white font-bold text-xl">商务社交英语 <span className="block text-sm font-normal">Business Networking</span></h3>
                                </div>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-700 mb-4">
                                    提升商务社交场合的英语沟通能力，学习如何进行自我介绍，开展小型交谈，以及建立和维护专业关系。
                                </p>
                                <p className="text-sm text-gray-500 mb-4">
                                    Improve your English communication skills in business social settings. Learn how to introduce yourself, engage in small talk, and establish and maintain professional relationships.
                                </p>
                                <ul className="text-gray-600 text-sm space-y-2 mb-6">
                                    <li className="flex items-start">
                                        <span className="text-red-500 mr-2">✓</span>
                                        自我介绍和小型交谈
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-red-500 mr-2">✓</span>
                                        商务宴请和社交礼仪
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-red-500 mr-2">✓</span>
                                        跨文化社交技巧
                                    </li>
                                </ul>
                                <Link to="/contact">
                                    <Button variant="outline" className="w-full">了解更多 Learn More</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Course Formats */}
            <section className="py-16 w-full bg-gray-50">
                <div className="container max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-12 text-center">
                        <span className="text-red-500">课程形式</span>
                        <span className="block mt-2 text-xl text-gray-600">Course Formats</span>
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-2xl shadow-sm">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-6">
                                <i className="fas fa-user-friends text-2xl"></i>
                            </div>
                            <h3 className="font-bold text-xl mb-4">
                                一对一私教课
                                <span className="block text-sm font-normal text-gray-500 mt-1">One-on-One Private Lessons</span>
                            </h3>
                            <p className="text-gray-700">
                                私人定制的一对一课程，根据您的具体需求、行业和学习目标量身定制，提供最个性化的学习体验。
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                Personalized one-on-one lessons tailored to your specific needs, industry, and learning goals, providing the most individualized learning experience.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-6">
                                <i className="fas fa-users text-2xl"></i>
                            </div>
                            <h3 className="font-bold text-xl mb-4">
                                小组课程
                                <span className="block text-sm font-normal text-gray-500 mt-1">Small Group Classes</span>
                            </h3>
                            <p className="text-gray-700">
                                3-6人的小组课程，适合希望在互动环境中学习的学员，可以与同行业或类似英语水平的学习者一起学习。
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                Small group classes of 3-6 people, ideal for learners who prefer an interactive environment, allowing you to learn with peers from the same industry or similar English level.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-6">
                                <i className="fas fa-building text-2xl"></i>
                            </div>
                            <h3 className="font-bold text-xl mb-4">
                                企业培训
                                <span className="block text-sm font-normal text-gray-500 mt-1">Corporate Training</span>
                            </h3>
                            <p className="text-gray-700">
                                为企业量身定制的英语培训计划，可在公司场地或在线进行，侧重于团队特定的沟通需求和行业专业知识。
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                Customized English training programs for companies, conducted on-site or online, focusing on team-specific communication needs and industry expertise.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-16 w-full">
                <div className="container max-w-6xl mx-auto px-4">
                    <div className="bg-red-50 rounded-3xl p-8 md:p-12 text-center">
                        <h2 className="text-3xl font-bold mb-6">
                            <span className="text-red-500">提升您的职场英语能力</span>
                            <span className="block mt-2 text-xl text-gray-700">Enhance Your Professional English Skills</span>
                        </h2>
                        <p className="text-gray-700 max-w-2xl mx-auto mb-8">
                            无论您是想提升商务沟通能力，准备国际商务会议，还是拓展职业发展机会，我们的商务英语课程都能帮助您实现目标。
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link to="/contact">
                                <Button className="rounded-full bg-red-500 text-white hover:bg-red-600 px-8">
                                    立即咨询 / Contact Us Now
                                </Button>
                            </Link>
                            <Link to="/pricing">
                                <Button variant="outline" className="rounded-full bg-white px-8">
                                    查看课程价格 / View Pricing
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
} 