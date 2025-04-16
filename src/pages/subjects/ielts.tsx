import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import HelmetComponent from "../../components/HelmetComponent";

export default function IELTSCoursePage() {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col justify-center items-center">
            <HelmetComponent
                title="IELTS 备考课程 - IELTS Preparation Courses | 学习English"
                description="专业的 IELTS 雅思考试备考课程，提高听说读写能力，助您获得理想分数。Professional IELTS preparation courses to improve listening, speaking, reading, and writing skills."
                keywords="IELTS, 雅思考试, 雅思备考, 雅思培训, 雅思听力, 雅思口语, 雅思阅读, 雅思写作"
                ogTitle="IELTS 备考课程 - IELTS Preparation Courses"
                ogDescription="专业的 IELTS 雅思考试备考课程，提高听说读写能力，助您获得理想分数。"
            />

            {/* Hero Section */}
            <section className="bg-gradient-to-b from-blue-50 via-blue-50/50 to-white min-h-[500px] w-full -mt-[70px]">
                <div className="container max-w-6xl mx-auto px-4 pb-16 relative pt-[200px]">
                    <div className="max-w-2xl relative z-10">
                        <h1 className="text-5xl md:text-6xl font-bold mb-8">
                            <span className="block text-blue-600">IELTS 雅思备考</span>
                            <span className="block mt-2 text-gray-700">IELTS Preparation</span>
                        </h1>

                        <p className="text-gray-800 mb-8 text-lg">
                            专业雅思备考课程，针对性提高听说读写四项能力，助您实现留学、移民或职业发展的梦想。
                        </p>
                        <p className="text-gray-600 mb-8">
                            Professional IELTS preparation courses designed to improve your listening, speaking, reading, and writing skills to help you achieve your study abroad, immigration, or career development goals.
                        </p>

                        <div className="flex flex-wrap gap-3">
                            <Button className="rounded-full bg-blue-600 text-white hover:bg-blue-700"
                                onClick={() => navigate('/login')}>
                                免费评估 / Free Assessment
                            </Button>
                            <Button variant="outline" className="rounded-full bg-white"
                                onClick={() => navigate('/login')}>
                                查看课程价格 / View Pricing
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* IELTS Overview */}
            <section className="py-16 w-full">
                <div className="container max-w-6xl mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-6">
                                <span className="text-blue-600">什么是雅思考试?</span>
                                <span className="block mt-2 text-xl text-gray-600">What is the IELTS Exam?</span>
                            </h2>

                            <p className="text-gray-700 mb-4">
                                国际英语语言测试系统 (IELTS) 是全球认可的英语语言测试，每年有超过300万人参加考试。雅思考试评估您在真实生活环境中使用英语的能力，分为学术类和普通类两种类型。
                            </p>

                            <p className="text-gray-600 mb-4">
                                The International English Language Testing System (IELTS) is a globally recognized English language test with over 3 million tests taken each year. IELTS assesses your ability to use English in real-life situations and offers Academic and General Training versions.
                            </p>

                            <div className="bg-blue-50 p-6 rounded-xl mt-8">
                                <h3 className="font-bold text-blue-600 mb-4">雅思考试包括四个部分 / IELTS Tests Four Skills:</h3>
                                <ul className="space-y-3">
                                    <li className="flex items-start">
                                        <span className="text-blue-600 mr-2 font-bold">•</span>
                                        <div>
                                            <span className="font-semibold">听力 / Listening</span> - 30分钟，40道题目
                                        </div>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-blue-600 mr-2 font-bold">•</span>
                                        <div>
                                            <span className="font-semibold">阅读 / Reading</span> - 60分钟，40道题目
                                        </div>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-blue-600 mr-2 font-bold">•</span>
                                        <div>
                                            <span className="font-semibold">写作 / Writing</span> - 60分钟，2篇文章
                                        </div>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-blue-600 mr-2 font-bold">•</span>
                                        <div>
                                            <span className="font-semibold">口语 / Speaking</span> - 11-14分钟，面对面会话
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="relative h-[400px] md:h-full">
                            <div className="absolute inset-0 bg-blue-100 rounded-3xl transform -rotate-3"></div>
                            <img
                                src="/images/ielts-exam.jpg"
                                alt="IELTS Exam"
                                className="relative rounded-3xl h-full w-full object-cover shadow-md transform rotate-2"
                                onError={(e) => {
                                    e.currentTarget.src = 'https://via.placeholder.com/600x800?text=IELTS+Exam';
                                }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Our IELTS Courses */}
            <section className="py-16 w-full bg-gradient-to-b from-white to-blue-50/30">
                <div className="container max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-12 text-center">
                        <span className="text-blue-600">我们的雅思课程</span>
                        <span className="block mt-2 text-xl text-gray-600">Our IELTS Programs</span>
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                            <div className="h-48 bg-blue-100 relative">
                                <img
                                    src="/images/ielts-foundation.jpg"
                                    alt="IELTS Foundation"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = 'https://via.placeholder.com/400x200?text=IELTS+Foundation';
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                                    <h3 className="text-white font-bold text-xl">雅思基础课程 <span className="block text-sm font-normal">IELTS Foundation</span></h3>
                                </div>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-700 mb-4">
                                    适合雅思初学者和目标分数在5.5-6.5分的学生，从基础开始建立英语能力，熟悉考试格式和要求。
                                </p>
                                <p className="text-sm text-gray-500 mb-4">
                                    Suitable for IELTS beginners and students aiming for a score of 5.5-6.5, building English skills from the basics and becoming familiar with the test format and requirements.
                                </p>
                                <ul className="text-gray-600 text-sm space-y-2 mb-6">
                                    <li className="flex items-start">
                                        <span className="text-blue-600 mr-2">✓</span>
                                        基础词汇和语法
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-blue-600 mr-2">✓</span>
                                        考试技巧和策略
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-blue-600 mr-2">✓</span>
                                        全真模拟练习
                                    </li>
                                </ul>
                                <Link to="/contact">
                                    了解更多 Learn More
                                </Link>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                            <div className="h-48 bg-blue-100 relative">
                                <img
                                    src="/images/ielts-advanced.jpg"
                                    alt="IELTS Advanced"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = 'https://via.placeholder.com/400x200?text=IELTS+Advanced';
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                                    <h3 className="text-white font-bold text-xl">雅思高分课程 <span className="block text-sm font-normal">IELTS Advanced</span></h3>
                                </div>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-700 mb-4">
                                    为目标7分以上的学生设计，深入掌握高级语言技巧，提高解题速度和准确性，掌握高分策略。
                                </p>
                                <p className="text-sm text-gray-500 mb-4">
                                    Designed for students aiming for a score of 7 or above, mastering advanced language skills, improving problem-solving speed and accuracy, and learning high-score strategies.
                                </p>
                                <ul className="text-gray-600 text-sm space-y-2 mb-6">
                                    <li className="flex items-start">
                                        <span className="text-blue-600 mr-2">✓</span>
                                        高级词汇和表达
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-blue-600 mr-2">✓</span>
                                        复杂题型解析
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-blue-600 mr-2">✓</span>
                                        批判性思维培养
                                    </li>
                                </ul>
                                <Link to="/contact">
                                    <Button variant="outline" className="w-full">了解更多 Learn More</Button>
                                </Link>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                            <div className="h-48 bg-blue-100 relative">
                                <img
                                    src="/images/ielts-intensive.jpg"
                                    alt="IELTS Intensive"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = 'https://via.placeholder.com/400x200?text=IELTS+Intensive';
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                                    <h3 className="text-white font-bold text-xl">雅思强化冲刺班 <span className="block text-sm font-normal">IELTS Intensive</span></h3>
                                </div>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-700 mb-4">
                                    为即将参加考试的学生提供短期集中训练，针对个人弱点进行强化，快速提升能力和信心。
                                </p>
                                <p className="text-sm text-gray-500 mb-4">
                                    Providing short-term intensive training for students about to take the exam, strengthening individual weaknesses and quickly boosting skills and confidence.
                                </p>
                                <ul className="text-gray-600 text-sm space-y-2 mb-6">
                                    <li className="flex items-start">
                                        <span className="text-blue-600 mr-2">✓</span>
                                        针对性弱项突破
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-blue-600 mr-2">✓</span>
                                        每日模拟练习
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-blue-600 mr-2">✓</span>
                                        详细反馈和指导
                                    </li>
                                </ul>
                                <Link to="/contact">
                                    <Button variant="outline" className="w-full">了解更多 Learn More</Button>
                                </Link>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                            <div className="h-48 bg-blue-100 relative">
                                <img
                                    src="/images/ielts-speaking.jpg"
                                    alt="IELTS Speaking"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = 'https://via.placeholder.com/400x200?text=IELTS+Speaking';
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                                    <h3 className="text-white font-bold text-xl">雅思口语专项班 <span className="block text-sm font-normal">IELTS Speaking</span></h3>
                                </div>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-700 mb-4">
                                    专注提高雅思口语能力，包括流利度、词汇量、发音和语法准确性，提供大量实战练习机会。
                                </p>
                                <p className="text-sm text-gray-500 mb-4">
                                    Focusing on improving IELTS speaking skills, including fluency, vocabulary, pronunciation, and grammatical accuracy, providing ample practical practice opportunities.
                                </p>
                                <ul className="text-gray-600 text-sm space-y-2 mb-6">
                                    <li className="flex items-start">
                                        <span className="text-blue-600 mr-2">✓</span>
                                        口语评分标准讲解
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-blue-600 mr-2">✓</span>
                                        高频话题准备
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-blue-600 mr-2">✓</span>
                                        模拟面试训练
                                    </li>
                                </ul>
                                <Link to="/contact">
                                    <Button variant="outline" className="w-full">了解更多 Learn More</Button>
                                </Link>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                            <div className="h-48 bg-blue-100 relative">
                                <img
                                    src="/images/ielts-writing.jpg"
                                    alt="IELTS Writing"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = 'https://via.placeholder.com/400x200?text=IELTS+Writing';
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                                    <h3 className="text-white font-bold text-xl">雅思写作专项班 <span className="block text-sm font-normal">IELTS Writing</span></h3>
                                </div>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-700 mb-4">
                                    针对雅思写作任务1和任务2进行专项训练，掌握各类图表描述和议论文写作技巧，提高写作质量。
                                </p>
                                <p className="text-sm text-gray-500 mb-4">
                                    Specialized training for IELTS Writing Task 1 and Task 2, mastering various chart description and essay writing skills to improve writing quality.
                                </p>
                                <ul className="text-gray-600 text-sm space-y-2 mb-6">
                                    <li className="flex items-start">
                                        <span className="text-blue-600 mr-2">✓</span>
                                        任务1图表描述技巧
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-blue-600 mr-2">✓</span>
                                        任务2议论文结构
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-blue-600 mr-2">✓</span>
                                        高分写作词汇和句式
                                    </li>
                                </ul>
                                <Link to="/contact">
                                    <Button variant="outline" className="w-full">了解更多 Learn More</Button>
                                </Link>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                            <div className="h-48 bg-blue-100 relative">
                                <img
                                    src="/images/ielts-one-on-one.jpg"
                                    alt="IELTS One-on-One"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = 'https://via.placeholder.com/400x200?text=IELTS+One-on-One';
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                                    <h3 className="text-white font-bold text-xl">雅思一对一辅导 <span className="block text-sm font-normal">IELTS One-on-One</span></h3>
                                </div>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-700 mb-4">
                                    根据个人需求和学习进度制定专属课程计划，提供个性化指导和反馈，快速提高薄弱环节。
                                </p>
                                <p className="text-sm text-gray-500 mb-4">
                                    Developing personalized course plans based on individual needs and learning progress, providing customized guidance and feedback to quickly improve weak areas.
                                </p>
                                <ul className="text-gray-600 text-sm space-y-2 mb-6">
                                    <li className="flex items-start">
                                        <span className="text-blue-600 mr-2">✓</span>
                                        个性化学习计划
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-blue-600 mr-2">✓</span>
                                        灵活安排课程时间
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-blue-600 mr-2">✓</span>
                                        一对一针对性指导
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

            {/* Our IELTS Teachers */}
            <section className="py-16 w-full">
                <div className="container max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-12 text-center">
                        <span className="text-blue-600">我们的雅思教师团队</span>
                        <span className="block mt-2 text-xl text-gray-600">Our IELTS Teaching Team</span>
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
                            <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-6">
                                <img
                                    src="/images/teacher-ielts-1.jpg"
                                    alt="IELTS Teacher"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = 'https://via.placeholder.com/200x200?text=IELTS+Teacher';
                                    }}
                                />
                            </div>
                            <h3 className="font-bold text-xl mb-2">Sarah Johnson</h3>
                            <p className="text-blue-600 mb-4">雅思主考官 / Former IELTS Examiner</p>
                            <p className="text-gray-600 text-sm">
                                10年雅思考官经验，精通考试评分标准和要求，帮助数百名学生达到7分以上。
                            </p>
                            <p className="text-gray-500 text-xs mt-2">
                                10 years of experience as an IELTS examiner, mastering the scoring criteria and requirements, having helped hundreds of students achieve Band 7 or above.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
                            <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-6">
                                <img
                                    src="/images/teacher-ielts-2.jpg"
                                    alt="IELTS Teacher"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = 'https://via.placeholder.com/200x200?text=IELTS+Teacher';
                                    }}
                                />
                            </div>
                            <h3 className="font-bold text-xl mb-2">李明 / Li Ming</h3>
                            <p className="text-blue-600 mb-4">写作和口语专家 / Writing & Speaking Expert</p>
                            <p className="text-gray-600 text-sm">
                                英国剑桥大学语言学硕士，8年雅思教学经验，擅长写作和口语教学，深入了解中国学生常见问题。
                            </p>
                            <p className="text-gray-500 text-xs mt-2">
                                Master's in Linguistics from Cambridge University, 8 years of IELTS teaching experience, specializing in writing and speaking, with deep understanding of common issues faced by Chinese students.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
                            <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-6">
                                <img
                                    src="/images/teacher-ielts-3.jpg"
                                    alt="IELTS Teacher"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = 'https://via.placeholder.com/200x200?text=IELTS+Teacher';
                                    }}
                                />
                            </div>
                            <h3 className="font-bold text-xl mb-2">Michael Zhang</h3>
                            <p className="text-blue-600 mb-4">阅读和听力专家 / Reading & Listening Expert</p>
                            <p className="text-gray-600 text-sm">
                                雅思9分获得者，美国哥伦比亚大学TESOL硕士，开发了独特的阅读和听力教学方法，帮助学生快速提分。
                            </p>
                            <p className="text-gray-500 text-xs mt-2">
                                IELTS Band 9 achiever, Master's in TESOL from Columbia University, has developed unique teaching methods for reading and listening, helping students improve their scores quickly.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Success Stories */}
            <section className="py-16 w-full bg-blue-50">
                <div className="container max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-12 text-center">
                        <span className="text-blue-600">学员成功案例</span>
                        <span className="block mt-2 text-xl text-gray-600">Student Success Stories</span>
                    </h2>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white p-6 rounded-2xl shadow-sm relative">
                            <div className="text-blue-500 text-6xl absolute -top-6 -left-2 opacity-20">"</div>
                            <p className="text-gray-700 mb-4 relative z-10">
                                通过三个月的雅思强化课程，我的总分从5.5提升到了7.0，成功申请到了英国曼彻斯特大学的研究生项目。老师们不仅教会了我应试技巧，更让我真正提高了英语能力。
                            </p>
                            <p className="text-gray-500 text-sm italic mb-6">
                                After three months of intensive IELTS courses, my overall score improved from 5.5 to 7.0, and I successfully applied for a graduate program at the University of Manchester in the UK. The teachers not only taught me test-taking skills but also truly improved my English abilities.
                            </p>
                            <div className="flex items-center">
                                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                                    <img
                                        src="/images/student-1.jpg"
                                        alt="Student"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.src = 'https://via.placeholder.com/48x48?text=Student';
                                        }}
                                    />
                                </div>
                                <div>
                                    <h4 className="font-bold">王小明 / Wang Xiaoming</h4>
                                    <p className="text-sm text-blue-600">雅思 7.0 分 / IELTS Band 7.0</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm relative">
                            <div className="text-blue-500 text-6xl absolute -top-6 -left-2 opacity-20">"</div>
                            <p className="text-gray-700 mb-4 relative z-10">
                                作为一名工作多年的职场人士，我需要雅思成绩申请加拿大移民。在这里学习的一对一雅思课程非常灵活，能够适应我的工作时间，最终帮助我获得了所需的6.5分。
                            </p>
                            <p className="text-gray-500 text-sm italic mb-6">
                                As a professional who has been working for many years, I needed an IELTS score to apply for Canadian immigration. The one-on-one IELTS courses here were very flexible, able to accommodate my work schedule, and ultimately helped me achieve the required 6.5 score.
                            </p>
                            <div className="flex items-center">
                                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                                    <img
                                        src="/images/student-2.jpg"
                                        alt="Student"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.src = 'https://via.placeholder.com/48x48?text=Student';
                                        }}
                                    />
                                </div>
                                <div>
                                    <h4 className="font-bold">张丽 / Zhang Li</h4>
                                    <p className="text-sm text-blue-600">雅思 6.5 分 / IELTS Band 6.5</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* IELTS Learning Resources */}
            <section className="py-16 w-full">
                <div className="container max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-12 text-center">
                        <span className="text-blue-600">雅思学习资源</span>
                        <span className="block mt-2 text-xl text-gray-600">IELTS Learning Resources</span>
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100">
                            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-6">
                                <i className="fas fa-book text-2xl"></i>
                            </div>
                            <h3 className="font-bold text-xl mb-4">最新雅思备考材料</h3>
                            <p className="text-gray-600 text-sm mb-4">
                                我们提供最新的剑桥雅思真题、官方指南和专业补充材料，确保您接触到最新的考试趋势和题型。
                            </p>
                            <p className="text-gray-500 text-xs">
                                We provide the latest Cambridge IELTS authentic tests, official guides, and professional supplementary materials to ensure you are exposed to the latest exam trends and question types.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100">
                            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-6">
                                <i className="fas fa-laptop text-2xl"></i>
                            </div>
                            <h3 className="font-bold text-xl mb-4">在线练习平台</h3>
                            <p className="text-gray-600 text-sm mb-4">
                                学员可以访问我们的专属在线平台，包含数千道雅思练习题、模拟测试和个性化的练习推荐。
                            </p>
                            <p className="text-gray-500 text-xs">
                                Students can access our exclusive online platform, which includes thousands of IELTS practice questions, mock tests, and personalized practice recommendations.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100">
                            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-6">
                                <i className="fas fa-users text-2xl"></i>
                            </div>
                            <h3 className="font-bold text-xl mb-4">学习社区</h3>
                            <p className="text-gray-600 text-sm mb-4">
                                加入我们的雅思学习社区，与其他考生交流经验，参加每周讨论和问答环节，互相支持和鼓励。
                            </p>
                            <p className="text-gray-500 text-xs">
                                Join our IELTS learning community to exchange experiences with other test takers, participate in weekly discussions and Q&A sessions, and support and encourage each other.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-16 w-full">
                <div className="container max-w-6xl mx-auto px-4">
                    <div className="bg-blue-50 rounded-3xl p-8 md:p-12 text-center">
                        <h2 className="text-3xl font-bold mb-6">
                            <span className="text-blue-600">开始您的雅思备考之旅</span>
                            <span className="block mt-2 text-xl text-gray-700">Start Your IELTS Preparation Journey</span>
                        </h2>
                        <p className="text-gray-700 max-w-2xl mx-auto mb-8">
                            无论您的目标分数是多少，我们都能为您提供专业的雅思备考指导。立即联系我们，安排免费水平测试和课程咨询。
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link to="/contact">
                                <Button className="rounded-full bg-blue-600 text-white hover:bg-blue-700 px-8">
                                    免费评估 / Free Assessment
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