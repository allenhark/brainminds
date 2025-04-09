import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import HelmetComponent from "../../components/HelmetComponent";

export default function GeneralEnglishCoursePage() {
    return (
        <div className="flex flex-col justify-center items-center">
            <HelmetComponent
                title="通用英语课程 - General English Courses | 学习English"
                description="提供各个级别的通用英语课程，提高您的听说读写能力。General English courses for all levels to improve your listening, speaking, reading, and writing skills."
                keywords="通用英语, 英语学习, 英语课程, 初级英语, 中级英语, 高级英语, 英语口语, 英语听力"
                ogTitle="通用英语课程 - General English Courses"
                ogDescription="提供各个级别的通用英语课程，提高您的听说读写能力。"
            />

            {/* Hero Section */}
            <section className="bg-gradient-to-b from-emerald-50 via-emerald-50/50 to-white min-h-[500px] w-full -mt-[70px]">
                <div className="container max-w-6xl mx-auto px-4 pb-16 relative pt-[200px]">
                    <div className="max-w-2xl relative z-10">
                        <h1 className="text-5xl md:text-6xl font-bold mb-8">
                            <span className="block text-emerald-600">通用英语课程</span>
                            <span className="block mt-2 text-gray-700">General English</span>
                        </h1>

                        <p className="text-gray-800 mb-8 text-lg">
                            从零基础到高级水平，我们的通用英语课程涵盖所有语言技能，满足您的学习目标和需求。
                        </p>
                        <p className="text-gray-600 mb-8">
                            From beginner to advanced levels, our General English courses cover all language skills to meet your learning goals and needs.
                        </p>

                        <div className="flex flex-wrap gap-3">
                            <Button className="rounded-full bg-emerald-600 text-white hover:bg-emerald-700">
                                免费课程咨询 / Free Consultation
                            </Button>
                            <Button variant="outline" className="rounded-full bg-white">
                                查看课程价格 / View Pricing
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Course Levels */}
            <section className="py-16 w-full">
                <div className="container max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-12 text-center">
                        <span className="text-emerald-600">我们的英语课程级别</span>
                        <span className="block mt-2 text-xl text-gray-600">Our English Course Levels</span>
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Beginner Level */}
                        <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                            <div className="h-24 bg-emerald-100 relative flex items-center justify-center">
                                <h3 className="text-emerald-800 font-bold text-xl">初级英语 <span className="block text-sm font-normal">Beginner Level</span></h3>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-700 mb-4">
                                    适合零基础或有少量英语基础的学习者，帮助您掌握基本的日常交流能力和简单句型。
                                </p>
                                <p className="text-sm text-gray-500 mb-4">
                                    Suitable for complete beginners or those with minimal English knowledge, helping you master basic daily communication skills and simple sentence patterns.
                                </p>
                                <ul className="text-gray-600 text-sm space-y-2 mb-6">
                                    <li className="flex items-start">
                                        <span className="text-emerald-600 mr-2">✓</span>
                                        基础词汇和短语
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-emerald-600 mr-2">✓</span>
                                        简单日常对话
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-emerald-600 mr-2">✓</span>
                                        基本听力和阅读训练
                                    </li>
                                </ul>
                                <Link to="/contact">
                                    <Button variant="outline" className="w-full">了解更多 Learn More</Button>
                                </Link>
                            </div>
                        </div>

                        {/* Elementary Level */}
                        <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                            <div className="h-24 bg-emerald-100 relative flex items-center justify-center">
                                <h3 className="text-emerald-800 font-bold text-xl">基础英语 <span className="block text-sm font-normal">Elementary Level</span></h3>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-700 mb-4">
                                    巩固基础知识，拓展词汇量，提高简单对话能力，能够理解和表达简单的信息和需求。
                                </p>
                                <p className="text-sm text-gray-500 mb-4">
                                    Consolidate basic knowledge, expand vocabulary, improve simple conversation skills, and be able to understand and express simple information and needs.
                                </p>
                                <ul className="text-gray-600 text-sm space-y-2 mb-6">
                                    <li className="flex items-start">
                                        <span className="text-emerald-600 mr-2">✓</span>
                                        常用词汇和表达
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-emerald-600 mr-2">✓</span>
                                        基本语法结构
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-emerald-600 mr-2">✓</span>
                                        简单写作训练
                                    </li>
                                </ul>
                                <Link to="/contact">
                                    <Button variant="outline" className="w-full">了解更多 Learn More</Button>
                                </Link>
                            </div>
                        </div>

                        {/* Pre-Intermediate Level */}
                        <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                            <div className="h-24 bg-emerald-100 relative flex items-center justify-center">
                                <h3 className="text-emerald-800 font-bold text-xl">初中级英语 <span className="block text-sm font-normal">Pre-Intermediate</span></h3>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-700 mb-4">
                                    进一步提高语言流利度，能够在日常生活和简单工作场景中进行交流，表达观点和意见。
                                </p>
                                <p className="text-sm text-gray-500 mb-4">
                                    Further improve language fluency, be able to communicate in daily life and simple work scenarios, express views and opinions.
                                </p>
                                <ul className="text-gray-600 text-sm space-y-2 mb-6">
                                    <li className="flex items-start">
                                        <span className="text-emerald-600 mr-2">✓</span>
                                        扩展词汇和表达方式
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-emerald-600 mr-2">✓</span>
                                        中级语法结构
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-emerald-600 mr-2">✓</span>
                                        日常话题讨论
                                    </li>
                                </ul>
                                <Link to="/contact">
                                    <Button variant="outline" className="w-full">了解更多 Learn More</Button>
                                </Link>
                            </div>
                        </div>

                        {/* Intermediate Level */}
                        <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                            <div className="h-24 bg-emerald-100 relative flex items-center justify-center">
                                <h3 className="text-emerald-800 font-bold text-xl">中级英语 <span className="block text-sm font-normal">Intermediate Level</span></h3>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-700 mb-4">
                                    能够自信地用英语交流，理解和讨论相对复杂的话题，表达清晰的观点和解释。
                                </p>
                                <p className="text-sm text-gray-500 mb-4">
                                    Be able to communicate confidently in English, understand and discuss relatively complex topics, express clear views and explanations.
                                </p>
                                <ul className="text-gray-600 text-sm space-y-2 mb-6">
                                    <li className="flex items-start">
                                        <span className="text-emerald-600 mr-2">✓</span>
                                        丰富的词汇和表达
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-emerald-600 mr-2">✓</span>
                                        复杂语法结构
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-emerald-600 mr-2">✓</span>
                                        提高口语流利度
                                    </li>
                                </ul>
                                <Link to="/contact">
                                    <Button variant="outline" className="w-full">了解更多 Learn More</Button>
                                </Link>
                            </div>
                        </div>

                        {/* Upper-Intermediate Level */}
                        <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                            <div className="h-24 bg-emerald-100 relative flex items-center justify-center">
                                <h3 className="text-emerald-800 font-bold text-xl">中高级英语 <span className="block text-sm font-normal">Upper-Intermediate</span></h3>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-700 mb-4">
                                    能够在大多数情境下流利使用英语，参与各种话题的讨论，表达详细观点和复杂想法。
                                </p>
                                <p className="text-sm text-gray-500 mb-4">
                                    Be able to use English fluently in most contexts, participate in discussions on various topics, express detailed views and complex ideas.
                                </p>
                                <ul className="text-gray-600 text-sm space-y-2 mb-6">
                                    <li className="flex items-start">
                                        <span className="text-emerald-600 mr-2">✓</span>
                                        高级词汇和惯用表达
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-emerald-600 mr-2">✓</span>
                                        提高写作技巧
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-emerald-600 mr-2">✓</span>
                                        培养批判性思维
                                    </li>
                                </ul>
                                <Link to="/contact">
                                    <Button variant="outline" className="w-full">了解更多 Learn More</Button>
                                </Link>
                            </div>
                        </div>

                        {/* Advanced Level */}
                        <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                            <div className="h-24 bg-emerald-100 relative flex items-center justify-center">
                                <h3 className="text-emerald-800 font-bold text-xl">高级英语 <span className="block text-sm font-normal">Advanced Level</span></h3>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-700 mb-4">
                                    接近母语水平的英语使用能力，能够在各种专业和学术场合自如交流，表达微妙和复杂的概念。
                                </p>
                                <p className="text-sm text-gray-500 mb-4">
                                    Near-native level of English proficiency, able to communicate effortlessly in various professional and academic settings, express subtle and complex concepts.
                                </p>
                                <ul className="text-gray-600 text-sm space-y-2 mb-6">
                                    <li className="flex items-start">
                                        <span className="text-emerald-600 mr-2">✓</span>
                                        专业和学术词汇
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-emerald-600 mr-2">✓</span>
                                        高级演讲和辩论技巧
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-emerald-600 mr-2">✓</span>
                                        深入文化理解
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

            {/* Key Features */}
            <section className="py-16 w-full bg-emerald-50">
                <div className="container max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-12 text-center">
                        <span className="text-emerald-600">我们的课程特色</span>
                        <span className="block mt-2 text-xl text-gray-600">Our Course Features</span>
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-2xl shadow-sm">
                            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-6">
                                <i className="fas fa-user-graduate text-2xl"></i>
                            </div>
                            <h3 className="font-bold text-xl mb-4">专业外教团队</h3>
                            <p className="text-gray-600">
                                我们的教师均为经验丰富的母语或接近母语水平的外教，拥有专业教学资格证书和多年教学经验。
                            </p>
                            <p className="text-gray-500 text-sm mt-2">
                                Our teachers are all experienced native or near-native English speakers with professional teaching qualifications and years of teaching experience.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm">
                            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-6">
                                <i className="fas fa-book-open text-2xl"></i>
                            </div>
                            <h3 className="font-bold text-xl mb-4">全面语言技能培养</h3>
                            <p className="text-gray-600">
                                我们的课程全面培养听、说、读、写四项基本技能，确保您在所有方面都能获得平衡发展。
                            </p>
                            <p className="text-gray-500 text-sm mt-2">
                                Our courses comprehensively develop the four basic skills of listening, speaking, reading, and writing, ensuring balanced development in all areas.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm">
                            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-6">
                                <i className="fas fa-users text-2xl"></i>
                            </div>
                            <h3 className="font-bold text-xl mb-4">小班互动教学</h3>
                            <p className="text-gray-600">
                                我们采用小班授课，每班学生数量有限，确保每位学员都能得到充分的关注和互动机会。
                            </p>
                            <p className="text-gray-500 text-sm mt-2">
                                We use small class teaching with a limited number of students per class to ensure that each student receives adequate attention and interaction opportunities.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm">
                            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-6">
                                <i className="fas fa-laptop text-2xl"></i>
                            </div>
                            <h3 className="font-bold text-xl mb-4">线上线下结合</h3>
                            <p className="text-gray-600">
                                提供灵活的学习方式，包括线下课堂教学和线上学习平台，满足不同学员的学习需求。
                            </p>
                            <p className="text-gray-500 text-sm mt-2">
                                Offering flexible learning methods, including offline classroom teaching and online learning platforms, to meet the learning needs of different students.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm">
                            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-6">
                                <i className="fas fa-chart-line text-2xl"></i>
                            </div>
                            <h3 className="font-bold text-xl mb-4">定期评估与反馈</h3>
                            <p className="text-gray-600">
                                定期进行学习进度评估，提供详细的反馈和建议，帮助学员了解自己的优势和需要改进的方面。
                            </p>
                            <p className="text-gray-500 text-sm mt-2">
                                Regular assessments of learning progress, providing detailed feedback and suggestions to help students understand their strengths and areas for improvement.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm">
                            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-6">
                                <i className="fas fa-globe text-2xl"></i>
                            </div>
                            <h3 className="font-bold text-xl mb-4">文化融合学习</h3>
                            <p className="text-gray-600">
                                结合英语国家的文化背景知识，帮助学员更好地理解语言使用环境和文化差异。
                            </p>
                            <p className="text-gray-500 text-sm mt-2">
                                Incorporating cultural background knowledge of English-speaking countries to help students better understand language use contexts and cultural differences.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Course Formats */}
            <section className="py-16 w-full">
                <div className="container max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-12 text-center">
                        <span className="text-emerald-600">灵活的课程形式</span>
                        <span className="block mt-2 text-xl text-gray-600">Flexible Course Formats</span>
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
                            <div className="h-48 bg-emerald-100 rounded-xl mb-6 flex items-center justify-center">
                                <img
                                    src="/images/private-lessons.jpg"
                                    alt="Private Lessons"
                                    className="w-full h-full object-cover rounded-xl"
                                    onError={(e) => {
                                        e.currentTarget.src = 'https://via.placeholder.com/400x200?text=Private+Lessons';
                                    }}
                                />
                            </div>
                            <h3 className="font-bold text-xl mb-4">一对一私教课程</h3>
                            <p className="text-gray-600 mb-4">
                                根据个人需求定制的一对一教学，提供最大的灵活性和个性化关注，进度完全按照您的学习速度调整。
                            </p>
                            <ul className="text-gray-600 text-sm space-y-2 mb-6">
                                <li className="flex items-start">
                                    <span className="text-emerald-600 mr-2">✓</span>
                                    完全个性化的学习计划
                                </li>
                                <li className="flex items-start">
                                    <span className="text-emerald-600 mr-2">✓</span>
                                    灵活的上课时间
                                </li>
                                <li className="flex items-start">
                                    <span className="text-emerald-600 mr-2">✓</span>
                                    针对性强，进步快
                                </li>
                            </ul>
                            <Link to="/contact">
                                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">预约咨询</Button>
                            </Link>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
                            <div className="h-48 bg-emerald-100 rounded-xl mb-6 flex items-center justify-center">
                                <img
                                    src="/images/small-group.jpg"
                                    alt="Small Group Classes"
                                    className="w-full h-full object-cover rounded-xl"
                                    onError={(e) => {
                                        e.currentTarget.src = 'https://via.placeholder.com/400x200?text=Small+Group+Classes';
                                    }}
                                />
                            </div>
                            <h3 className="font-bold text-xl mb-4">小班课程</h3>
                            <p className="text-gray-600 mb-4">
                                3-6人小班教学，在保持个性化关注的同时提供丰富的互动和交流机会，性价比高。
                            </p>
                            <ul className="text-gray-600 text-sm space-y-2 mb-6">
                                <li className="flex items-start">
                                    <span className="text-emerald-600 mr-2">✓</span>
                                    充分的师生互动
                                </li>
                                <li className="flex items-start">
                                    <span className="text-emerald-600 mr-2">✓</span>
                                    同伴学习氛围
                                </li>
                                <li className="flex items-start">
                                    <span className="text-emerald-600 mr-2">✓</span>
                                    性价比高
                                </li>
                            </ul>
                            <Link to="/contact">
                                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">预约咨询</Button>
                            </Link>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
                            <div className="h-48 bg-emerald-100 rounded-xl mb-6 flex items-center justify-center">
                                <img
                                    src="/images/online-course.jpg"
                                    alt="Online Courses"
                                    className="w-full h-full object-cover rounded-xl"
                                    onError={(e) => {
                                        e.currentTarget.src = 'https://via.placeholder.com/400x200?text=Online+Courses';
                                    }}
                                />
                            </div>
                            <h3 className="font-bold text-xl mb-4">在线课程</h3>
                            <p className="text-gray-600 mb-4">
                                通过视频会议平台进行的实时在线课程，无地域限制，在家就能享受专业英语教学。
                            </p>
                            <ul className="text-gray-600 text-sm space-y-2 mb-6">
                                <li className="flex items-start">
                                    <span className="text-emerald-600 mr-2">✓</span>
                                    无地域限制
                                </li>
                                <li className="flex items-start">
                                    <span className="text-emerald-600 mr-2">✓</span>
                                    节省通勤时间
                                </li>
                                <li className="flex items-start">
                                    <span className="text-emerald-600 mr-2">✓</span>
                                    录制课程可回看
                                </li>
                            </ul>
                            <Link to="/contact">
                                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">预约咨询</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-16 w-full bg-gradient-to-b from-white to-emerald-50/30">
                <div className="container max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-12 text-center">
                        <span className="text-emerald-600">学员反馈</span>
                        <span className="block mt-2 text-xl text-gray-600">Student Testimonials</span>
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-2xl shadow-sm relative">
                            <div className="text-emerald-500 text-6xl absolute -top-6 -left-2 opacity-20">"</div>
                            <p className="text-gray-700 mb-4 relative z-10">
                                在这里学习英语是我做过的最好的决定之一。老师们非常专业和耐心，课程设计合理，进步明显。现在我可以自信地用英语与外国客户交流了。
                            </p>
                            <div className="flex items-center mt-6">
                                <div className="w-12 h-12 rounded-full overflow-hidden mr-4 bg-emerald-100">
                                    <img
                                        src="/images/testimonial-1.jpg"
                                        alt="Student"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.src = 'https://via.placeholder.com/48x48?text=Student';
                                        }}
                                    />
                                </div>
                                <div>
                                    <h4 className="font-bold">李先生 / Mr. Li</h4>
                                    <p className="text-sm text-emerald-600">中级英语学员</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm relative">
                            <div className="text-emerald-500 text-6xl absolute -top-6 -left-2 opacity-20">"</div>
                            <p className="text-gray-700 mb-4 relative z-10">
                                小班教学模式非常适合我，既有足够的老师关注，又能和其他学员一起练习交流。课堂气氛轻松愉快，学习效果很好。
                            </p>
                            <div className="flex items-center mt-6">
                                <div className="w-12 h-12 rounded-full overflow-hidden mr-4 bg-emerald-100">
                                    <img
                                        src="/images/testimonial-2.jpg"
                                        alt="Student"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.src = 'https://via.placeholder.com/48x48?text=Student';
                                        }}
                                    />
                                </div>
                                <div>
                                    <h4 className="font-bold">王女士 / Ms. Wang</h4>
                                    <p className="text-sm text-emerald-600">初级英语学员</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm relative">
                            <div className="text-emerald-500 text-6xl absolute -top-6 -left-2 opacity-20">"</div>
                            <p className="text-gray-700 mb-4 relative z-10">
                                作为一个零基础的学习者，我很担心跟不上课程，但老师的耐心指导和循序渐进的教学方法让我很快就适应了，现在已经能进行简单的日常对话了。
                            </p>
                            <div className="flex items-center mt-6">
                                <div className="w-12 h-12 rounded-full overflow-hidden mr-4 bg-emerald-100">
                                    <img
                                        src="/images/testimonial-3.jpg"
                                        alt="Student"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.src = 'https://via.placeholder.com/48x48?text=Student';
                                        }}
                                    />
                                </div>
                                <div>
                                    <h4 className="font-bold">张女士 / Ms. Zhang</h4>
                                    <p className="text-sm text-emerald-600">初级英语学员</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-16 w-full">
                <div className="container max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-12 text-center">
                        <span className="text-emerald-600">常见问题</span>
                        <span className="block mt-2 text-xl text-gray-600">Frequently Asked Questions</span>
                    </h2>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white p-6 rounded-2xl shadow-sm">
                            <h3 className="font-bold text-lg mb-3">如何确定我的英语水平?</h3>
                            <p className="text-gray-600">
                                我们会为每位新学员提供免费的水平测试，包括笔试和口试，以便准确评估您当前的英语水平，并推荐最适合您的课程。
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm">
                            <h3 className="font-bold text-lg mb-3">每周需要上多少课时?</h3>
                            <p className="text-gray-600">
                                根据您的学习目标和时间安排，我们有灵活的课时选择，一般建议每周2-3次课，每次1.5-2小时，以保持学习连贯性和效果。
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm">
                            <h3 className="font-bold text-lg mb-3">是否提供试听课?</h3>
                            <p className="text-gray-600">
                                是的，我们为新学员提供一次免费的试听课，让您了解我们的教学方法和课堂氛围，帮助您做出更好的决定。
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm">
                            <h3 className="font-bold text-lg mb-3">需要额外购买教材吗?</h3>
                            <p className="text-gray-600">
                                不需要，我们的课程费用已包含所有教材和学习资料，您无需额外支付教材费用。我们使用国际认可的教材，并提供补充学习资料。
                            </p>
                        </div>
                    </div>

                    <div className="text-center mt-10">
                        <Link to="/faq">
                            <Button variant="outline">查看更多常见问题 View More FAQs</Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-16 w-full">
                <div className="container max-w-6xl mx-auto px-4">
                    <div className="bg-emerald-50 rounded-3xl p-8 md:p-12 text-center">
                        <h2 className="text-3xl font-bold mb-6">
                            <span className="text-emerald-600">开始您的英语学习之旅</span>
                            <span className="block mt-2 text-xl text-gray-700">Start Your English Learning Journey</span>
                        </h2>
                        <p className="text-gray-700 max-w-2xl mx-auto mb-8">
                            无论您是零基础初学者还是想提高已有英语水平，我们都能为您提供专业的指导和支持。立即联系我们，开启您的英语学习之旅。
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link to="/contact">
                                <Button className="rounded-full bg-emerald-600 text-white hover:bg-emerald-700 px-8">
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