import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import HelmetComponent from "../../components/HelmetComponent";
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

export default function GuangzhouPage() {
    const [tutors, setTutors] = useState<Tutor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTutors = async () => {
            try {
                // In a real app, we'd filter tutors by Guangzhou location
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
                title="广州英语家教 - Guangzhou English Tutors | 学习English"
                description="在广州寻找专业英语家教，提供商务英语、雅思、少儿英语和发音课程。Connect with professional English tutors in Guangzhou."
                keywords="广州英语家教, Guangzhou English tutors, 广州商务英语, 广州雅思培训, 广州少儿英语, 英语发音"
                ogTitle="广州英语家教 - Guangzhou English Tutors"
                ogDescription="在广州寻找专业英语家教，提供商务英语、雅思、少儿英语和发音课程。"
            />
            {/* Hero Section */}
            <section className="bg-gradient-to-b from-red-50 via-red-50/50 to-white min-h-[600px] w-full -mt-[70px]">
                <div className="container max-w-6xl mx-auto px-4 pb-16 relative pt-[200px]">
                    <div className="max-w-xl relative z-10">
                        <h1 className="text-5xl md:text-6xl font-bold mb-8">
                            <span className="block text-red-500">广州英语家教</span>
                            <span className="block mt-2 text-gray-700">Guangzhou English Tutors</span>
                        </h1>

                        <div className="space-y-2 mb-8">
                            <div className="flex items-center gap-2">
                                <span className="text-red-500">⏰</span>
                                <div>
                                    <span className="block text-gray-800">广州地区灵活的英语课程安排</span>
                                    <span className="block text-sm text-gray-600">Flexible English lessons in Guangzhou</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-red-500">💻</span>
                                <div>
                                    <span className="block text-gray-800">线上和线下课程均可选择</span>
                                    <span className="block text-sm text-gray-600">Online and in-person lessons available</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-red-500">✅</span>
                                <div>
                                    <span className="block text-gray-800">专业英语发音指导</span>
                                    <span className="block text-sm text-gray-600">Professional pronunciation coaching</span>
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

                        <div className="flex flex-wrap gap-3">
                            <Link to="/guangzhou/business-english">
                                <Button variant="outline" className="rounded-full bg-white">
                                    商务英语 Business English
                                </Button>
                            </Link>
                            <Link to="/guangzhou/ielts">
                                <Button variant="outline" className="rounded-full bg-white">
                                    雅思 IELTS
                                </Button>
                            </Link>
                            <Link to="/guangzhou/kids">
                                <Button variant="outline" className="rounded-full bg-white">
                                    少儿英语 Kids English
                                </Button>
                            </Link>
                            <Link to="/guangzhou/pronunciation">
                                <Button variant="outline" className="rounded-full bg-white">
                                    发音 Pronunciation
                                </Button>
                            </Link>
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
                            <span className="text-red-500">广州英语教师</span>
                            <span className="ml-2 text-gray-700">Guangzhou English Tutors</span>
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
                                            {tutor.tutorProfile.applicationStatus === "APPROVED" && (
                                                <span className="text-violet-600 px-2 py-1 text-xs bg-violet-50 rounded-full">Verified  实名认证</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1 mb-2">
                                            <div className="flex items-center text-yellow-400">
                                                <i className="fas fa-star"></i>
                                                <span className="ml-1 text-gray-700 text-sm">
                                                    {tutor.tutorStats.averageRating || "New"}
                                                </span>
                                            </div>
                                            <span className="text-gray-500 text-sm">
                                                ({tutor.tutorStats.completedSessions} sessions)
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                            {tutor.tutorProfile.aboutMe || `${tutor.tutorProfile.teachingStyle} - ${tutor.tutorProfile.educationLevel}`}
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
                                <h3 className="text-lg font-semibold mb-2">广州暂无老师 / No tutors available in Guangzhou</h3>
                                <p className="text-gray-600 max-w-md mx-auto">
                                    我们目前在广州地区没有找到英语老师。请稍后再试或调整您的搜索条件。 <br />
                                    We couldn't find any tutors in Guangzhou at the moment. Please check back later or adjust your search criteria.
                                </p>
                            </div>
                        )}
                    </div>
                    <div className="text-center mt-8">
                        <Button variant="outline" className="rounded-full">
                            查看更多广州老师 / Show more Guangzhou tutors
                        </Button>
                    </div>
                </div>
            </section>

            {/* Guangzhou-specific section */}
            <section className="py-16 w-full bg-gray-50">
                <div className="container max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-8">
                        <span className="block text-red-500">广州英语学习特色</span>
                        <span className="block text-xl mt-2 text-gray-600">English Learning in Guangzhou</span>
                    </h2>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white p-6 rounded-2xl shadow-sm">
                            <h3 className="font-semibold text-lg mb-3">
                                <span className="block text-red-500">发音专家指导</span>
                                <span className="block text-gray-700">Pronunciation Experts</span>
                            </h3>
                            <p className="text-gray-800">广州地区拥有专业的英语发音指导教师，帮助学生克服发音难点，改善口音，说出更地道的英语。</p>
                            <p className="text-sm text-gray-600 mt-2">Guangzhou has professional English pronunciation coaches to help students overcome pronunciation challenges, improve accents, and speak more authentic English.</p>
                            <Link to="/guangzhou/pronunciation" className="mt-4 inline-block text-red-500 hover:underline">了解更多 Learn more →</Link>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm">
                            <h3 className="font-semibold text-lg mb-3">
                                <span className="block text-red-500">少儿英语课程</span>
                                <span className="block text-gray-700">Children's English Programs</span>
                            </h3>
                            <p className="text-gray-800">我们的广州少儿英语课程专为不同年龄段的孩子设计，通过游戏、歌曲和互动活动培养孩子的英语兴趣和能力。</p>
                            <p className="text-sm text-gray-600 mt-2">Our Guangzhou children's English programs are specially designed for kids of different ages, nurturing their interest and ability in English through games, songs, and interactive activities.</p>
                            <Link to="/guangzhou/kids" className="mt-4 inline-block text-red-500 hover:underline">少儿英语 Kids English →</Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
} 