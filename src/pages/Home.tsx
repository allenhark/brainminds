import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import HelmetComponent from "../components/HelmetComponent";
import Api from "@/Api";
import { useEffect, useState } from "react";
import { url } from "@/config";

interface TutorProfile {
    id: number;
    userId: number;
    educationLevel: string;
    teachingCredentials: string;
    teachingStyle: string;
    teachingMaterials: string;
    aboutMe: string;
    availability: string;
    timezone: string;
    lessonDuration: number;
    applicationStatus: string;
}

interface TutorStats {
    id: number;
    userId: number;
    totalStudents: number;
    totalSessions: number;
    completedSessions: number;
    cancelledSessions: number;
    totalHoursTaught: number;
    averageRating: number | null;
    responseRate: number;
}

interface Tutor {
    id: number;
    firstName: string;
    lastName: string;
    avatar: string | null;
    tutorProfile: TutorProfile;
    tutorStats: TutorStats;
}

export default function Home() {
    const [tutors, setTutors] = useState<Tutor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTutors = async () => {
            try {
                const { data } = await Api.get(`/site/featured-tutors`);
                setTutors(data);
            } catch (error) {
                setError(error as any);
            } finally {
                setLoading(false);
            }
        };

        fetchTutors();
    }, []);

    // Helper function to generate avatar URL
    const getAvatarUrl = (avatar: string | null) => {
        if (!avatar) return "https://api.dicebear.com/7.x/micah/svg?size=200";
        return avatar.startsWith('http') ? avatar : `${url}/${avatar}`;
    };

    return (
        <div className="flex flex-col justify-center items-center">
            <HelmetComponent
                title="学习English - Learn English with Native Tutors"
                description="Connect with native English tutors for personalized online lessons. Improve your speaking, listening, and grammar skills."
            />
            {/* Hero Section */}
            <section className="bg-gradient-to-b from-red-50 via-red-50/50 to-white min-h-[600px] w-full -mt-[70px]">
                <div className="container max-w-6xl mx-auto px-4 pb-16 relative pt-[200px]">
                    <div className="max-w-xl relative z-10">
                        <h1 className="text-5xl md:text-6xl font-bold mb-8">
                            <span className="block text-red-500">找英语老师</span>
                            <span className="block mt-2 text-gray-700">Find an English Tutor</span>
                        </h1>

                        <div className="space-y-2 mb-8">
                            <div className="flex items-center gap-2">
                                <span className="text-red-500">⏰</span>
                                <div>
                                    <span className="block text-gray-800">随时随地学习英语</span>
                                    <span className="block text-sm text-gray-600">Quality English tutoring at your fingertips</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-red-500">💻</span>
                                <div>
                                    <span className="block text-gray-800">超过1.7万英语老师</span>
                                    <span className="block text-sm text-gray-600">17,000+ English tutors available</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-red-500">✅</span>
                                <div>
                                    <span className="block text-gray-800">实名认证</span>
                                    <span className="block text-sm text-gray-600">Verified reviews</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-red-500">🔒</span>
                                <div>
                                    <span className="block text-gray-800">安全支付</span>
                                    <span className="block text-sm text-gray-600">Secure payment</span>
                                </div>
                            </div>
                        </div>


                    </div>

                    {/* Tutor images */}
                    <div className="absolute right-0 top-0 bottom-0 hidden lg:flex items-center z-0">
                        <div className="flex gap-4 h-[600px] mt-[120px]">
                            <div className="w-48 rounded-3xl overflow-hidden h-[450px]">
                                <img src="/tutor1.jpeg" alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="w-48 rounded-3xl overflow-hidden h-[500px] mt-24">
                                <img src="/tutor2.jpeg" alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="w-48 rounded-3xl overflow-hidden h-[400px] mt-12">
                                <img src="/tutor3.jpeg" alt="" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tutor Listings */}
            <section className="py-16 flex w-full justify-center items-center mt-10">
                <div className="container max-w-6xl mx-auto px-4">
                    <div className="flex items-center gap-2 mb-8">
                        <h2 className="text-2xl font-bold">
                            <span className="text-red-500">专业英语老师</span>
                            <span className="ml-2 text-gray-700">Professional English Tutors</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-10">
                        {loading ? (
                            // Loading state
                            Array(3).fill(0).map((_, index) => (
                                <div key={index} className="bg-gray-50 rounded-2xl shadow-sm animate-pulse">
                                    <div className="w-full aspect-square bg-gray-200"></div>
                                    <div className="p-4">
                                        <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
                                        <div className="h-16 bg-gray-200 rounded mb-3"></div>
                                        <div className="h-10 bg-gray-200 rounded"></div>
                                    </div>
                                </div>
                            ))
                        ) : tutors.length > 0 ? (
                            // Map real tutors from API
                            tutors.map((tutor) => (
                                <Link to={`/tutor/${tutor.id}`} key={tutor.id} className="overflow-hidden group bg-gray-50 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                    <div className="relative">
                                        <img
                                            src={getAvatarUrl(tutor.avatar)}
                                            alt={`${tutor.firstName} ${tutor.lastName}`}
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
                                            <h3 className="font-semibold text-lg">{tutor.firstName} {tutor.lastName}</h3>
                                            {tutor.tutorProfile?.applicationStatus === "APPROVED" && (
                                                <span className="text-violet-600 px-2 py-1 text-xs bg-violet-50 rounded-full">Verified  实名认证</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1 mb-2">
                                            <div className="flex items-center text-yellow-400">
                                                <i className="fas fa-star"></i>
                                                <span className="ml-1 text-gray-700 text-sm">
                                                    {tutor.tutorStats?.averageRating || "New"}
                                                </span>
                                            </div>
                                            <span className="text-gray-500 text-sm">
                                                ({tutor.tutorStats?.completedSessions} sessions)
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                            {tutor.tutorProfile?.aboutMe || `${tutor.tutorProfile?.teachingStyle} - ${tutor.tutorProfile?.educationLevel}`}
                                        </p>
                                        <div className="flex items-center justify-between pt-2 border-t">
                                            <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white w-full">
                                                预约 Book Now
                                            </Button>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            // No tutors available
                            <div className="col-span-3 py-12 text-center">
                                <div className="mb-4 text-gray-400">
                                    <i className="fas fa-user-slash text-4xl"></i>
                                </div>
                                <h3 className="text-lg font-semibold mb-2">No tutors available / 没有老师</h3>
                                <p className="text-gray-600 max-w-md mx-auto">
                                    We couldn't find any tutors at the moment. Please check back later or adjust your search criteria. <br />
                                    目前没有老师，请稍后再试或调整您的搜索条件。
                                </p>
                            </div>
                        )}
                    </div>
                    <div className="text-center mt-8">
                        <Button variant="outline" className="rounded-full">
                            查看更多老师/ Show more tutors
                        </Button>
                    </div>
                </div>
            </section>

            {/* How it Works */}
            <section className="py-16 w-full">
                <div className="container max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-12">
                        <span className="block text-red-500">学习英语很简单</span>
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
                            <h3 className="text-xl font-bold mb-3">
                                <span className="block text-red-500">1. 浏览英语老师档案</span>
                                <span className="block text-gray-700 text-lg">Browse English tutor profiles</span>
                            </h3>
                            <p className="text-gray-800">根据您的需求选择理想的英语老师（价格、资质、评价、在线或线下课程）</p>
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
                            <h3 className="text-xl font-bold mb-3">
                                <span className="block text-red-500">2. 安排英语课程</span>
                                <span className="block text-gray-700 text-lg">Arrange your English lessons</span>
                            </h3>
                            <p className="text-gray-800">与老师沟通学习需求和时间安排。在收件箱中安全地安排和支付课程。</p>
                            <p className="text-sm text-gray-500 mt-1">Discuss your needs and schedule with your tutor. Schedule and pay for lessons securely from your inbox.</p>
                        </div>

                        {/* Step 3 */}
                        <div>
                            <div className="bg-red-50 rounded-3xl p-12 mb-6 flex items-center justify-center">
                                <div className="bg-white rounded-lg w-16 h-16 flex items-center justify-center">
                                    <div className="text-3xl">😊</div>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold mb-3">
                                <span className="block text-red-500">3. 开启学习之旅</span>
                                <span className="block text-gray-700 text-lg">Discover new experiences</span>
                            </h3>
                            <p className="text-gray-800">学生会员卡让您可以接触到所有老师、教练和大师课程。与优秀的老师一起发现新的学习激情。</p>
                            <p className="text-sm text-gray-500 mt-1">The Student Pass gives you unlimited access to all tutors, coaches, and masterclasses. Discover new passions with great teachers.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 flex w-full justify-center items-center bg-gray-50">
                <div className="container max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-8 text-center">
                        <span className="block text-red-500">常见问题</span>
                        <span className="block text-xl mt-2 text-gray-600">Frequently Asked Questions</span>
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        <div className="bg-white p-6 rounded-2xl shadow-sm">
                            <h3 className="font-semibold text-lg mb-3">
                                <span className="block text-red-500">如何选择合适的英语老师？</span>
                                <span className="block text-gray-700">How do I choose the right tutor?</span>
                            </h3>
                            <p className="text-gray-800">查看老师评价，检查资质认证，并与老师沟通学习目标。</p>
                            <p className="text-sm text-gray-600">Read reviews, check qualifications, and message tutors to discuss your learning goals.</p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm">
                            <h3 className="font-semibold text-lg mb-3">
                                <span className="block text-red-500">第一节课是怎样的？</span>
                                <span className="block text-gray-700">What happens in the first lesson?</span>
                            </h3>
                            <p className="text-gray-800">老师会评估您的英语水平，了解您的需求，制定个性化的学习计划。</p>
                            <p className="text-sm text-gray-600">Your tutor will assess your level, understand your needs, and create a personalized learning plan.</p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm">
                            <h3 className="font-semibold text-lg mb-3">
                                <span className="block text-red-500">如何支付课程费用？</span>
                                <span className="block text-gray-700">How do I pay for lessons?</span>
                            </h3>
                            <p className="text-gray-800">通过我们的安全支付系统，可以使用支付宝或微信支付进行支付。</p>
                            <p className="text-sm text-gray-600">Use our secure payment system with Alipay or WeChat Pay options.</p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm">
                            <h3 className="font-semibold text-lg mb-3">
                                <span className="block text-red-500">可以随时取消课程吗？</span>
                                <span className="block text-gray-700">Can I cancel lessons?</span>
                            </h3>
                            <p className="text-gray-800">是的，提前24小时取消课程可获得全额退款。</p>
                            <p className="text-sm text-gray-600">Yes, cancel 24 hours in advance for a full refund.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Statistics Section */}
            <section className="py-16 bg-blue-50 flex w-full justify-center items-center">
                <div className="container max-w-6xl mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-8">
                        <span className="text-red-500">英语学习成就</span>
                        <span className="ml-2 text-gray-700">Learning Achievements</span>
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div>
                            <p className="text-4xl font-bold text-blue-600 mb-2">98.3%</p>
                            <p className="text-gray-600">学生提高了英语水平 / Students improved their English</p>
                        </div>
                        <div>
                            <p className="text-4xl font-bold text-blue-600 mb-2">4.8/5</p>
                            <p className="text-gray-600">Average tutor rating / 平均老师评分</p>
                        </div>
                        <div>
                            <p className="text-4xl font-bold text-blue-600 mb-2">567K+ </p>
                            <p className="text-gray-600">Active students / 活跃学生</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}