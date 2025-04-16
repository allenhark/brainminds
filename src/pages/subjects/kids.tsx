import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import HelmetComponent from "@/components/HelmetComponent";

export default function KidsEnglishCoursePage() {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-gradient-to-b from-red-50 via-red-50/50 to-white">
            <HelmetComponent
                title="Children's English Courses - BrainMinds"
                description="Fun and effective English courses for children. Interactive lessons, engaging activities, and experienced teachers to help your child develop language skills naturally."
            />

            {/* Hero Section */}
            <section className="py-16 md:py-24">
                <div className="container max-w-6xl mx-auto px-4">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            <span className="block text-red-500">少儿英语课程</span>
                            <span className="block text-2xl mt-2 text-gray-600">Children's English Courses</span>
                        </h1>
                        <p className="text-lg text-gray-700 mb-8">
                            通过有趣、互动的方式帮助孩子自然习得英语，培养语言兴趣和自信心。
                        </p>
                        <p className="text-base text-gray-600 mb-8">
                            Help your child learn English naturally through fun, interactive methods that build language interest and confidence.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Button className="bg-red-500 hover:bg-red-600 text-white rounded-full"
                                onClick={() => navigate('/login')}>
                                预约免费试听 Book Free Trial
                            </Button>
                            <Button variant="outline" className="rounded-full"
                                onClick={() => navigate('/login')}>
                                查看课程详情 View Course Details
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Course Benefits Section */}
            <section className="py-16 bg-white">
                <div className="container max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-12 text-center">
                        <span className="block text-red-500">为什么选择我们的少儿英语课程？</span>
                        <span className="block text-xl mt-2 text-gray-600">Why Choose Our Children's English Courses?</span>
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-red-50 p-6 rounded-2xl">
                            <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                                <span className="text-red-500 text-xl">🎮</span>
                            </div>
                            <h3 className="text-xl font-bold mb-3">
                                <span className="block text-red-500">互动学习</span>
                                <span className="block text-gray-700">Interactive Learning</span>
                            </h3>
                            <p className="text-gray-600">
                                通过游戏、歌曲和故事等有趣方式学习英语，让孩子保持学习兴趣。
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                Learn English through fun methods like games, songs, and stories to keep children engaged.
                            </p>
                        </div>
                        <div className="bg-red-50 p-6 rounded-2xl">
                            <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                                <span className="text-red-500 text-xl">👨‍🏫</span>
                            </div>
                            <h3 className="text-xl font-bold mb-3">
                                <span className="block text-red-500">专业教师</span>
                                <span className="block text-gray-700">Professional Teachers</span>
                            </h3>
                            <p className="text-gray-600">
                                经验丰富的少儿英语教师，了解儿童心理和学习特点，因材施教。
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                Experienced children's English teachers who understand child psychology and learning characteristics.
                            </p>
                        </div>
                        <div className="bg-red-50 p-6 rounded-2xl">
                            <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                                <span className="text-red-500 text-xl">📈</span>
                            </div>
                            <h3 className="text-xl font-bold mb-3">
                                <span className="block text-red-500">循序渐进</span>
                                <span className="block text-gray-700">Progressive Learning</span>
                            </h3>
                            <p className="text-gray-600">
                                根据孩子的年龄和水平设计课程，确保学习效果和进步。
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                Courses designed according to children's age and level to ensure learning effectiveness and progress.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Course Levels Section */}
            <section className="py-16">
                <div className="container max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-12 text-center">
                        <span className="block text-red-500">课程级别</span>
                        <span className="block text-xl mt-2 text-gray-600">Course Levels</span>
                    </h2>
                    <div className="grid md:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
                            <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-red-500 text-2xl">👶</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2">
                                <span className="block text-red-500">启蒙班</span>
                                <span className="block text-gray-700">Starter</span>
                            </h3>
                            <p className="text-sm text-gray-600">3-5岁</p>
                            <p className="text-xs text-gray-500">Ages 3-5</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
                            <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-red-500 text-2xl">👧</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2">
                                <span className="block text-red-500">基础班</span>
                                <span className="block text-gray-700">Basic</span>
                            </h3>
                            <p className="text-sm text-gray-600">6-7岁</p>
                            <p className="text-xs text-gray-500">Ages 6-7</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
                            <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-red-500 text-2xl">👦</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2">
                                <span className="block text-red-500">提高班</span>
                                <span className="block text-gray-700">Intermediate</span>
                            </h3>
                            <p className="text-sm text-gray-600">8-9岁</p>
                            <p className="text-xs text-gray-500">Ages 8-9</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
                            <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-red-500 text-2xl">🧑</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2">
                                <span className="block text-red-500">高级班</span>
                                <span className="block text-gray-700">Advanced</span>
                            </h3>
                            <p className="text-sm text-gray-600">10-12岁</p>
                            <p className="text-xs text-gray-500">Ages 10-12</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Course Features Section */}
            <section className="py-16 bg-white">
                <div className="container max-w-6xl mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-6">
                                <span className="block text-red-500">课程特色</span>
                                <span className="block text-xl mt-2 text-gray-600">Course Features</span>
                            </h2>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="bg-red-100 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-red-500">1</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">小班教学 Small Class Size</h3>
                                        <p className="text-gray-600">每班最多6名学生，确保每位学生都能得到充分关注</p>
                                        <p className="text-sm text-gray-500">Maximum 6 students per class to ensure each student receives adequate attention</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-red-100 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-red-500">2</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">多媒体教学 Multimedia Teaching</h3>
                                        <p className="text-gray-600">利用动画、视频和互动软件增强学习体验</p>
                                        <p className="text-sm text-gray-500">Enhance learning experience with animations, videos, and interactive software</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-red-100 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-red-500">3</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">主题活动 Theme Activities</h3>
                                        <p className="text-gray-600">每月围绕不同主题开展活动，拓展词汇和表达</p>
                                        <p className="text-sm text-gray-500">Monthly themed activities to expand vocabulary and expressions</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-red-100 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-red-500">4</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">定期评估 Regular Assessment</h3>
                                        <p className="text-gray-600">通过游戏和活动评估学习进度，及时调整教学计划</p>
                                        <p className="text-sm text-gray-500">Assess learning progress through games and activities, adjust teaching plans accordingly</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-red-50 p-8 rounded-2xl">
                            <h3 className="text-xl font-bold mb-4">
                                <span className="block text-red-500">学习成果</span>
                                <span className="block text-lg mt-2 text-gray-600">Learning Outcomes</span>
                            </h3>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <span className="text-red-500">✓</span>
                                    <div>
                                        <p className="font-medium">自然发音 Natural Pronunciation</p>
                                        <p className="text-sm text-gray-600">培养正确的英语发音和语调</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-red-500">✓</span>
                                    <div>
                                        <p className="font-medium">词汇积累 Vocabulary Building</p>
                                        <p className="text-sm text-gray-600">通过情境学习掌握实用词汇</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-red-500">✓</span>
                                    <div>
                                        <p className="font-medium">基础语法 Basic Grammar</p>
                                        <p className="text-sm text-gray-600">掌握简单的英语语法结构</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-red-500">✓</span>
                                    <div>
                                        <p className="font-medium">口语表达 Speaking Skills</p>
                                        <p className="text-sm text-gray-600">培养英语思维和表达能力</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-red-500">✓</span>
                                    <div>
                                        <p className="font-medium">文化认知 Cultural Awareness</p>
                                        <p className="text-sm text-gray-600">了解英语国家的文化和习俗</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Parent Testimonials Section */}
            <section className="py-16">
                <div className="container max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-12 text-center">
                        <span className="block text-red-500">家长反馈</span>
                        <span className="block text-xl mt-2 text-gray-600">Parent Testimonials</span>
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-2xl shadow-sm">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-gray-300"></div>
                                <div>
                                    <h3 className="font-semibold">王女士 Mrs. Wang</h3>
                                    <p className="text-sm text-gray-600">孩子年龄: 6岁 Child's age: 6</p>
                                </div>
                            </div>
                            <p className="text-gray-700 italic mb-4">
                                "我的女儿以前对英语没有兴趣，但在BrainMinds上课后，她变得非常喜欢英语，每天都会主动用英语和我交流。老师们非常耐心，课程设计很有趣。"
                            </p>
                            <p className="text-sm text-gray-600 italic">
                                "My daughter wasn't interested in English before, but after taking classes at BrainMinds, she has become very fond of English and actively communicates with me in English every day. The teachers are very patient, and the course design is fun."
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-gray-300"></div>
                                <div>
                                    <h3 className="font-semibold">李先生 Mr. Li</h3>
                                    <p className="text-sm text-gray-600">孩子年龄: 8岁 Child's age: 8</p>
                                </div>
                            </div>
                            <p className="text-gray-700 italic mb-4">
                                "我的儿子在BrainMinds学习英语已经两年了，他的进步非常大。现在他可以用英语进行简单的日常对话，阅读简单的英文故事书。老师们非常专业，课程内容丰富多彩。"
                            </p>
                            <p className="text-sm text-gray-600 italic">
                                "My son has been learning English at BrainMinds for two years, and his progress has been remarkable. Now he can have simple daily conversations in English and read simple English storybooks. The teachers are very professional, and the course content is rich and diverse."
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-gray-300"></div>
                                <div>
                                    <h3 className="font-semibold">张女士 Mrs. Zhang</h3>
                                    <p className="text-sm text-gray-600">孩子年龄: 5岁 Child's age: 5</p>
                                </div>
                            </div>
                            <p className="text-gray-700 italic mb-4">
                                "我的小女儿在BrainMinds的启蒙班学习，她非常喜欢这里的课程。老师们用游戏和歌曲教学，让孩子在快乐中学习英语。她的英语发音非常标准，这让我很惊喜。"
                            </p>
                            <p className="text-sm text-gray-600 italic">
                                "My little daughter is learning in the Starter class at BrainMinds, and she really enjoys the courses here. The teachers use games and songs to teach, allowing children to learn English while having fun. Her English pronunciation is very standard, which pleasantly surprises me."
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="py-16 bg-white">
                <div className="container max-w-6xl mx-auto px-4">
                    <div className="bg-red-500 text-white p-8 md:p-12 rounded-2xl text-center">
                        <h2 className="text-3xl font-bold mb-6">
                            <span className="block">为您的孩子开启英语学习之旅</span>
                            <span className="block text-xl mt-2 text-red-100">Start Your Child's English Learning Journey</span>
                        </h2>
                        <p className="text-lg mb-8 max-w-2xl mx-auto">
                            立即预约免费试听课程，让您的孩子体验有趣的英语学习。
                        </p>
                        <p className="text-base mb-8 max-w-2xl mx-auto text-red-100">
                            Book a free trial class now and let your child experience fun English learning.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button className="bg-white text-red-500 hover:bg-red-50 rounded-full"
                                onClick={() => navigate('/login')}  >
                                预约免费试听 Book Free Trial
                            </Button>
                            <Button variant="outline" className="border-white text-white hover:bg-red-600 rounded-full"
                                onClick={() => navigate('/login')}>
                                联系我们 Contact Us
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
} 