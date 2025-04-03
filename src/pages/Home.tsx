import { Button } from "~/ui/button";
import { Card } from "~/ui/card";
import { Input } from "~/ui/input";
import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="flex flex-col justify-center items-center">
            {/* Hero Section */}
            <section className="bg-gradient-to-b from-red-50 via-red-50/50 to-white min-h-[600px] w-full -mt-[70px]">
                <div className="container max-w-6xl mx-auto px-4 pb-16 relative pt-[100px]">
                    <div className="max-w-xl relative z-10">
                        <h1 className="text-5xl md:text-6xl font-bold mb-8">
                            找英语老师
                            <span className="block mt-2">Find an English Tutor Near Me</span>
                        </h1>

                        <div className="space-y-2 mb-8">
                            <div className="flex items-center gap-2">
                                <span className="text-red-500">⏰</span>
                                <span>随时随地学习英语 Quality English tutoring at your fingertips</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-red-500">💻</span>
                                <span>超过10万英语老师 100,000+ English tutors available</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-red-500">✅</span>
                                <span>实名认证 Verified reviews</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-red-500">🔒</span>
                                <span>安全支付 Secure payment</span>
                            </div>
                        </div>

                        <div className="bg-white rounded-full shadow-lg p-3 flex items-center relative z-20">
                            <div className="flex-1 flex items-center gap-2 px-6">
                                <span className="text-gray-400">🔍</span>
                                <Input
                                    placeholder="寻找英语老师 / Find English tutors"
                                    className="border-0 focus:ring-0 text-lg leading-relaxed placeholder:text-gray-400 h-12"
                                />
                            </div>
                            <Button className="bg-red-500 hover:bg-red-600 text-white rounded-full px-8 h-12 text-lg">
                                搜索 Search
                            </Button>
                        </div>
                    </div>

                    {/* Tutor images */}
                    <div className="absolute right-0 top-0 bottom-0 hidden lg:flex items-center z-0">
                        <div className="flex gap-4 h-[600px]">
                            <div className="w-48 rounded-3xl overflow-hidden h-[450px]">
                                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e" alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="w-48 rounded-3xl overflow-hidden h-[500px] mt-24">
                                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330" alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="w-48 rounded-3xl overflow-hidden h-[400px] mt-12">
                                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d" alt="" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tutor Listings */}
            <section className="py-16 flex w-full justify-center items-center">
                <div className="container max-w-6xl mx-auto px-4">
                    <div className="flex items-center gap-2 mb-8">
                        <h2 className="text-2xl font-bold">专业英语老师 Professional English Tutors</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-10">
                        {[
                            {
                                name: "Sarah",
                                image: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd",
                                description: "TESOL certified with 5+ years experience teaching Business English and conversation skills to Chinese professionals",
                                price: "¥200/h",
                                rating: 5,
                                reviews: 184,
                                verified: true,
                            },
                            {
                                name: "Michael",
                                image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d",
                                description: "Native speaker specializing in IELTS and TOEFL preparation. Helped 100+ students achieve their target scores",
                                price: "¥180/h",
                                rating: 5,
                                reviews: 167,
                                verified: true,
                            },
                            {
                                name: "Emma",
                                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
                                description: "Experienced in teaching young learners. Making English fun and engaging for children through interactive lessons",
                                price: "¥150/h",
                                rating: 5,
                                reviews: 203,
                                verified: true,
                            },
                            {
                                name: "David",
                                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
                                description: "Business English specialist with corporate training experience. Focus on presentation and negotiation skills",
                                price: "¥220/h",
                                rating: 5,
                                reviews: 156,
                                verified: true,
                            },
                            {
                                name: "Linda",
                                image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
                                description: "Pronunciation expert helping students overcome accent challenges and speak with confidence",
                                price: "¥190/h",
                                rating: 5,
                                reviews: 178,
                                verified: true,
                            },
                            {
                                name: "James",
                                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
                                description: "Former IELTS examiner with extensive experience in test preparation and academic English",
                                price: "¥250/h",
                                rating: 5,
                                reviews: 192,
                                verified: true,
                            },
                        ].map((tutor) => (
                            <Link to={`/tutor/${tutor.name.toLowerCase()}`} key={tutor.name} className="overflow-hidden group bg-gray-50 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                <div className="relative">
                                    <img
                                        src={tutor.image}
                                        alt={tutor.name}
                                        className="w-full aspect-square object-cover"
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute top-2 right-2 z-10 text-white hover:text-primary bg-black/20 rounded-full"
                                    >
                                        <i className="fas fa-heart text-sm"></i>
                                    </Button>
                                </div>
                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="font-semibold text-lg">{tutor.name}</h3>
                                        <span className="text-violet-600 px-2 py-1 text-xs bg-violet-50 rounded-full">Ambassador</span>
                                    </div>
                                    <div className="flex items-center gap-1 mb-2">
                                        <div className="flex items-center text-yellow-400">
                                            <i className="fas fa-star"></i>
                                            <span className="ml-1 text-gray-700 text-sm">{tutor.rating}</span>
                                        </div>
                                        <span className="text-gray-500 text-sm">({tutor.reviews} reviews)</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                        {tutor.description}
                                    </p>
                                    <div className="flex items-center justify-between pt-2 border-t">

                                        <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white w-full">
                                            预约 Book Now
                                        </Button>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <div className="text-center mt-8">
                        <Button variant="outline" className="rounded-full">
                            Show more tutors
                        </Button>
                    </div>
                </div>
            </section>

            {/* How it Works */}
            <section className="py-16 w-full">
                <div className="container max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-12">
                        学习英语很简单
                        <span className="block text-xl mt-2 text-gray-600">Finding English tutoring is simple</span>
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Step 1 */}
                        <div>
                            <div className="bg-red-50 rounded-3xl p-12 mb-6 flex items-center justify-center">
                                <div className="bg-red-500 rounded-full p-6">
                                    <i className="fas fa-search text-2xl text-white"></i>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold mb-3">1. 浏览英语老师档案<br />Browse English tutor profiles</h3>
                            <p className="text-gray-600">根据您的需求选择理想的英语老师（价格、资质、评价、在线或线下课程）</p>
                            <p className="text-sm text-gray-500 mt-1">Find your ideal English tutor based on your needs (prices, qualifications, reviews, online or in-person lessons)</p>
                        </div>

                        {/* Step 2 */}
                        <div>
                            <div className="bg-blue-50 rounded-3xl p-12 mb-6 flex items-center justify-center">
                                <div className="relative w-16 h-16">
                                    <div className="bg-white rounded-lg w-12 h-12 absolute top-0 right-0">
                                        <div className="bg-red-500 w-2 h-2 rounded-full absolute -top-1 -right-1" />
                                    </div>
                                    <div className="bg-blue-100 rounded-lg w-12 h-12 absolute bottom-0 left-0">
                                        <div className="bg-blue-500 w-2 h-2 rounded-full absolute -bottom-1 -left-1" />
                                    </div>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold mb-3">2. 安排英语课程<br />Arrange your English lessons</h3>
                            <p className="text-gray-600">与老师沟通学习需求和时间安排。在收件箱中安全地安排和支付课程。</p>
                            <p className="text-sm text-gray-500 mt-1">Discuss your needs and schedule with your tutor. Schedule and pay for lessons securely from your inbox.</p>
                        </div>

                        {/* Step 3 */}
                        <div>
                            <div className="bg-red-50 rounded-3xl p-12 mb-6 flex items-center justify-center">
                                <div className="bg-white rounded-lg w-16 h-16 flex items-center justify-center">
                                    <div className="text-3xl">😊</div>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold mb-3">3. 开启学习之旅<br />Discover new experiences</h3>
                            <p className="text-gray-600">学生会员卡让您可以接触到所有老师、教练和大师课程。与优秀的老师一起发现新的学习激情。</p>
                            <p className="text-sm text-gray-500 mt-1">The Student Pass gives you unlimited access to all tutors, coaches, and masterclasses. Discover new passions with great teachers.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 flex w-full justify-center items-center bg-gray-50">
                <div className="container max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-8 text-center">
                        常见问题
                        <span className="block text-xl mt-2 text-gray-600">Frequently Asked Questions</span>
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        <div className="bg-white p-6 rounded-2xl shadow-sm">
                            <h3 className="font-semibold text-lg mb-3">如何选择合适的英语老师？<br />How do I choose the right tutor?</h3>
                            <p className="text-gray-600">查看老师评价，检查资质认证，并与老师沟通学习目标。<br />Read reviews, check qualifications, and message tutors to discuss your learning goals.</p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm">
                            <h3 className="font-semibold text-lg mb-3">第一节课是怎样的？<br />What happens in the first lesson?</h3>
                            <p className="text-gray-600">老师会评估您的英语水平，了解您的需求，制定个性化的学习计划。<br />Your tutor will assess your level, understand your needs, and create a personalized learning plan.</p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm">
                            <h3 className="font-semibold text-lg mb-3">如何支付课程费用？<br />How do I pay for lessons?</h3>
                            <p className="text-gray-600">通过我们的安全支付系统，可以使用信用卡或支付宝进行支付。<br />Use our secure payment system with credit card or Alipay options.</p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm">
                            <h3 className="font-semibold text-lg mb-3">可以随时取消课程吗？<br />Can I cancel lessons?</h3>
                            <p className="text-gray-600">是的，提前24小时取消课程可获得全额退款。<br />Yes, cancel 24 hours in advance for a full refund.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Statistics Section */}
            <section className="py-16 bg-blue-50 flex w-full justify-center items-center">
                <div className="container max-w-6xl mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-8">英语学习成就 Learning Achievements</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div>
                            <p className="text-4xl font-bold text-blue-600 mb-2">95%</p>
                            <p className="text-gray-600">学生提高了英语水平</p>
                            <p className="text-sm text-gray-500">Students improved their English</p>
                        </div>
                        <div>
                            <p className="text-4xl font-bold text-blue-600 mb-2">4.8/5</p>
                            <p className="text-gray-600">Average tutor rating</p>
                        </div>
                        <div>
                            <p className="text-4xl font-bold text-blue-600 mb-2">1M+</p>
                            <p className="text-gray-600">Active students</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}