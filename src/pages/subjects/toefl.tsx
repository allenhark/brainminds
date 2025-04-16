import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import HelmetComponent from "@/components/HelmetComponent";

export default function TOEFLCoursePage() {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-gradient-to-b from-red-50 via-red-50/50 to-white">
            <HelmetComponent
                title="TOEFL Exam Preparation - BrainMinds"
                description="Comprehensive TOEFL exam preparation courses to help you achieve your target score. Expert instructors, personalized study plans, and proven strategies."
            />

            {/* Hero Section */}
            <section className="py-16 md:py-24">
                <div className="container max-w-6xl mx-auto px-4">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            <span className="block text-red-500">托福考试准备</span>
                            <span className="block text-2xl mt-2 text-gray-600">TOEFL Exam Preparation</span>
                        </h1>
                        <p className="text-lg text-gray-700 mb-8">
                            通过我们的专业托福考试准备课程，提高您的托福成绩，实现您的学术目标。
                        </p>
                        <p className="text-base text-gray-600 mb-8">
                            Boost your TOEFL score with our specialized preparation courses designed to help you achieve your academic goals.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Button className="bg-red-500 hover:bg-red-600 text-white rounded-full"
                                onClick={() => navigate('/login')}>
                                预约免费评估 Book Free Assessment
                            </Button>
                            <Button variant="outline" className="rounded-full"
                                onClick={() => navigate('/login')}>
                                查看课程详情 View Course Details
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* TOEFL Overview Section */}
            <section className="py-16 bg-white">
                <div className="container max-w-6xl mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-6">
                                <span className="block text-red-500">什么是托福考试？</span>
                                <span className="block text-xl mt-2 text-gray-600">What is the TOEFL Exam?</span>
                            </h2>
                            <p className="text-gray-700 mb-4">
                                托福（Test of English as a Foreign Language）是一项评估非英语母语者英语水平的标准化考试，被全球超过11,000所大学和机构认可。
                            </p>
                            <p className="text-gray-600 mb-6">
                                The TOEFL (Test of English as a Foreign Language) is a standardized test that measures the English language proficiency of non-native English speakers, accepted by over 11,000 universities and institutions worldwide.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <span className="text-red-500 text-xl">📝</span>
                                    <div>
                                        <h3 className="font-semibold">考试结构 Exam Structure</h3>
                                        <p className="text-sm text-gray-600">阅读、听力、口语和写作四个部分，全面评估英语能力</p>
                                        <p className="text-xs text-gray-500">Four sections: Reading, Listening, Speaking, and Writing</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="text-red-500 text-xl">⏱️</span>
                                    <div>
                                        <h3 className="font-semibold">考试时长 Duration</h3>
                                        <p className="text-sm text-gray-600">约3小时，包括所有四个部分</p>
                                        <p className="text-xs text-gray-500">Approximately 3 hours, including all four sections</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="text-red-500 text-xl">🎯</span>
                                    <div>
                                        <h3 className="font-semibold">分数范围 Score Range</h3>
                                        <p className="text-sm text-gray-600">总分0-120分，每个部分0-30分</p>
                                        <p className="text-xs text-gray-500">Total score range: 0-120, with 0-30 points per section</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-red-50 p-8 rounded-2xl">
                            <h3 className="text-xl font-bold mb-4">
                                <span className="block text-red-500">托福考试的重要性</span>
                                <span className="block text-lg mt-2 text-gray-600">Why TOEFL Matters</span>
                            </h3>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <span className="text-red-500">✓</span>
                                    <div>
                                        <p className="font-medium">大学入学 University Admission</p>
                                        <p className="text-sm text-gray-600">许多英语国家大学要求托福成绩作为入学条件</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-red-500">✓</span>
                                    <div>
                                        <p className="font-medium">奖学金申请 Scholarships</p>
                                        <p className="text-sm text-gray-600">高分托福成绩可增加获得奖学金的机会</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-red-500">✓</span>
                                    <div>
                                        <p className="font-medium">签证申请 Visa Applications</p>
                                        <p className="text-sm text-gray-600">部分国家在签证申请过程中要求托福成绩</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-red-500">✓</span>
                                    <div>
                                        <p className="font-medium">职业发展 Career Development</p>
                                        <p className="text-sm text-gray-600">托福成绩可证明您的英语水平，提升职业竞争力</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Course Offerings Section */}
            <section className="py-16">
                <div className="container max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-12 text-center">
                        <span className="block text-red-500">我们的托福课程</span>
                        <span className="block text-xl mt-2 text-gray-600">Our TOEFL Courses</span>
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-2xl shadow-sm">
                            <div className="bg-red-50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                                <span className="text-red-500 text-xl">📚</span>
                            </div>
                            <h3 className="text-xl font-bold mb-3">
                                <span className="block text-red-500">托福基础课程</span>
                                <span className="block text-gray-700">TOEFL Foundation</span>
                            </h3>
                            <p className="text-gray-600 mb-4">适合托福初学者，全面介绍考试结构和策略</p>
                            <p className="text-sm text-gray-500 mb-4">Perfect for TOEFL beginners, comprehensive introduction to exam structure and strategies</p>
                            <ul className="space-y-2 mb-6">
                                <li className="flex items-center gap-2">
                                    <span className="text-red-500">•</span>
                                    <span className="text-sm">考试格式和评分系统介绍</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-red-500">•</span>
                                    <span className="text-sm">基础词汇和语法强化</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-red-500">•</span>
                                    <span className="text-sm">各部分的答题技巧</span>
                                </li>
                            </ul>
                            <Button className="w-full bg-red-500 hover:bg-red-600 text-white rounded-full">
                                了解更多 Learn More
                            </Button>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm">
                            <div className="bg-red-50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                                <span className="text-red-500 text-xl">🎯</span>
                            </div>
                            <h3 className="text-xl font-bold mb-3">
                                <span className="block text-red-500">托福强化课程</span>
                                <span className="block text-gray-700">TOEFL Intensive</span>
                            </h3>
                            <p className="text-gray-600 mb-4">针对目标分数90+的考生，深入讲解高级技巧</p>
                            <p className="text-sm text-gray-500 mb-4">For students aiming for 90+ scores, advanced techniques and strategies</p>
                            <ul className="space-y-2 mb-6">
                                <li className="flex items-center gap-2">
                                    <span className="text-red-500">•</span>
                                    <span className="text-sm">高级词汇和学术表达</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-red-500">•</span>
                                    <span className="text-sm">复杂阅读材料分析</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-red-500">•</span>
                                    <span className="text-sm">口语和写作高级技巧</span>
                                </li>
                            </ul>
                            <Button className="w-full bg-red-500 hover:bg-red-600 text-white rounded-full">
                                了解更多 Learn More
                            </Button>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm">
                            <div className="bg-red-50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                                <span className="text-red-500 text-xl">📝</span>
                            </div>
                            <h3 className="text-xl font-bold mb-3">
                                <span className="block text-red-500">托福模拟考试</span>
                                <span className="block text-gray-700">TOEFL Mock Tests</span>
                            </h3>
                            <p className="text-gray-600 mb-4">真实考试环境模拟，帮助您熟悉考试流程</p>
                            <p className="text-sm text-gray-500 mb-4">Simulated test environment to help you familiarize with the exam process</p>
                            <ul className="space-y-2 mb-6">
                                <li className="flex items-center gap-2">
                                    <span className="text-red-500">•</span>
                                    <span className="text-sm">完整考试模拟</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-red-500">•</span>
                                    <span className="text-sm">详细成绩分析</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-red-500">•</span>
                                    <span className="text-sm">个性化改进建议</span>
                                </li>
                            </ul>
                            <Button className="w-full bg-red-500 hover:bg-red-600 text-white rounded-full">
                                了解更多 Learn More
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-16 bg-white">
                <div className="container max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-12 text-center">
                        <span className="block text-red-500">学生成功案例</span>
                        <span className="block text-xl mt-2 text-gray-600">Student Success Stories</span>
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-red-50 p-6 rounded-2xl">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-gray-300"></div>
                                <div>
                                    <h3 className="font-semibold">张明 Zhang Ming</h3>
                                    <p className="text-sm text-gray-600">托福成绩: 105</p>
                                </div>
                            </div>
                            <p className="text-gray-700 italic mb-4">
                                "通过BrainMinds的托福课程，我的成绩从85分提高到了105分，成功申请到了理想的大学。老师们非常专业，课程内容针对性强。"
                            </p>
                            <p className="text-sm text-gray-600 italic">
                                "With BrainMinds' TOEFL course, my score improved from 85 to 105, and I successfully got into my dream university. The teachers are very professional, and the course content is highly targeted."
                            </p>
                        </div>
                        <div className="bg-red-50 p-6 rounded-2xl">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-gray-300"></div>
                                <div>
                                    <h3 className="font-semibold">李华 Li Hua</h3>
                                    <p className="text-sm text-gray-600">托福成绩: 98</p>
                                </div>
                            </div>
                            <p className="text-gray-700 italic mb-4">
                                "口语一直是我的弱项，但在BrainMinds老师的指导下，我的口语成绩提高了8分。他们的教学方法非常有效。"
                            </p>
                            <p className="text-sm text-gray-600 italic">
                                "Speaking was always my weakness, but under the guidance of BrainMinds teachers, my speaking score improved by 8 points. Their teaching methods are very effective."
                            </p>
                        </div>
                        <div className="bg-red-50 p-6 rounded-2xl">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-gray-300"></div>
                                <div>
                                    <h3 className="font-semibold">王芳 Wang Fang</h3>
                                    <p className="text-sm text-gray-600">托福成绩: 112</p>
                                </div>
                            </div>
                            <p className="text-gray-700 italic mb-4">
                                "BrainMinds的模拟考试帮助我熟悉了真实考试环境，减轻了考试压力。写作部分的技巧特别有用，我的写作成绩提高了10分。"
                            </p>
                            <p className="text-sm text-gray-600 italic">
                                "BrainMinds' mock tests helped me familiarize with the real exam environment and reduced my test anxiety. The writing techniques were particularly useful, and my writing score improved by 10 points."
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="py-16">
                <div className="container max-w-6xl mx-auto px-4">
                    <div className="bg-red-500 text-white p-8 md:p-12 rounded-2xl text-center">
                        <h2 className="text-3xl font-bold mb-6">
                            <span className="block">准备好提高您的托福成绩了吗？</span>
                            <span className="block text-xl mt-2 text-red-100">Ready to improve your TOEFL score?</span>
                        </h2>
                        <p className="text-lg mb-8 max-w-2xl mx-auto">
                            立即预约免费评估，了解您的托福水平，获取个性化学习计划。
                        </p>
                        <p className="text-base mb-8 max-w-2xl mx-auto text-red-100">
                            Book a free assessment now to understand your TOEFL level and get a personalized study plan.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button className="bg-white text-red-500 hover:bg-red-50 rounded-full"
                                onClick={() => navigate('/login')}
                            >
                                预约免费评估 Book Free Assessment
                            </Button>
                            <Button variant="outline" className="border-white text-white hover:bg-red-600 rounded-full"
                                onClick={() => navigate('/login')}
                            >
                                联系我们 Contact Us
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
} 