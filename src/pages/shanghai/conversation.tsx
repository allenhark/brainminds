import { Button } from "@/components/ui/button";
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

export default function ShanghaiConversation() {
    const [tutors, setTutors] = useState<Tutor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTutors = async () => {
            try {
                // In a real app, we'd filter tutors by Shanghai location and Conversation specialty
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
                title="上海英语口语课程 - English Conversation in Shanghai | 学习English"
                description="在上海寻找专业英语口语教师，提高口语流利度和日常交流能力。Find professional English conversation tutors in Shanghai."
                keywords="上海英语口语, Shanghai English conversation, 英语口语课程, oral English, 英语对话, 日常英语"
                ogTitle="上海英语口语课程 - English Conversation in Shanghai"
                ogDescription="在上海寻找专业英语口语教师，提高口语流利度和日常交流能力。"
            />
            {/* Hero Section */}
            <section className="bg-gradient-to-b from-red-50 via-red-50/50 to-white min-h-[500px] w-full -mt-[70px]">
                <div className="container max-w-6xl mx-auto px-4 pb-16 relative pt-[200px]">
                    <div className="max-w-xl relative z-10">
                        <div className="mb-4">
                            <Link to="/shanghai" className="text-gray-600 hover:text-red-500">
                                <i className="fas fa-arrow-left mr-2"></i> 上海英语家教 Shanghai
                            </Link>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold mb-8">
                            <span className="block text-red-500">上海英语口语课程</span>
                            <span className="block mt-2 text-gray-700">Conversation Courses in Shanghai</span>
                        </h1>

                        <p className="text-gray-800 mb-8">
                            提高英语口语流利度，建立沟通自信。我们的上海英语口语课程专注于实用对话、发音纠正和日常交流情境练习。
                        </p>
                        <p className="text-gray-600 mb-8">
                            Improve your English speaking fluency and build communication confidence. Our Shanghai conversation courses focus on practical dialogues, pronunciation correction, and everyday communication scenarios.
                        </p>

                        <div className="flex flex-wrap gap-3">
                            <Button className="rounded-full bg-red-500 text-white hover:bg-red-600">
                                免费预约咨询 / Book a Free Trial
                            </Button>
                            <Button variant="outline" className="rounded-full bg-white">
                                查看课程价格 / View Pricing
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Key Benefits */}
            <section className="py-16 w-full">
                <div className="container max-w-6xl mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-8">
                        <span className="text-red-500">口语课程内容</span>
                        <span className="ml-2 text-gray-700">Conversation Course Content</span>
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="text-red-500 text-2xl mb-4">🗣️</div>
                            <h3 className="font-semibold text-lg mb-2">
                                <span className="block text-gray-800">日常对话</span>
                                <span className="block text-sm text-gray-600">Everyday Conversations</span>
                            </h3>
                            <p className="text-gray-700">
                                学习在餐厅、商店、旅行和社交场合中的实用对话，提高日常生活中的英语交流能力。
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="text-red-500 text-2xl mb-4">🔊</div>
                            <h3 className="font-semibold text-lg mb-2">
                                <span className="block text-gray-800">发音纠正</span>
                                <span className="block text-sm text-gray-600">Pronunciation Correction</span>
                            </h3>
                            <p className="text-gray-700">
                                专注于改善发音、语调和语音语调，让您的英语听起来更加地道自然。
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="text-red-500 text-2xl mb-4">💬</div>
                            <h3 className="font-semibold text-lg mb-2">
                                <span className="block text-gray-800">流利度练习</span>
                                <span className="block text-sm text-gray-600">Fluency Practice</span>
                            </h3>
                            <p className="text-gray-700">
                                通过角色扮演、讨论和即兴演讲练习，打破口语障碍，增强英语表达的流畅性。
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Conversation Tutors */}
            <section className="py-16 flex w-full justify-center items-center bg-gray-50">
                <div className="container max-w-6xl mx-auto px-4">
                    <div className="flex items-center gap-2 mb-8">
                        <h2 className="text-2xl font-bold">
                            <span className="text-red-500">上海英语口语教师</span>
                            <span className="ml-2 text-gray-700">Shanghai Conversation Tutors</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-10">
                        {loading ? (
                            // Loading state
                            Array(3).fill(0).map((_, index) => (
                                <div key={index} className="bg-white rounded-2xl shadow-sm animate-pulse">
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
                                <Link to={`/tutor/${tutor.id}`} key={tutor.id} className="overflow-hidden group bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                    <div className="relative">
                                        <img
                                            src={getAvatarUrl(tutor.avatar)}
                                            alt={`${tutor.firstName} ${tutor.lastName}`}
                                            className="w-full aspect-square object-cover"
                                        />
                                        <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                            口语专家 Conversation
                                        </div>
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
                                <h3 className="text-lg font-semibold mb-2">上海暂无口语教师 / No conversation tutors available</h3>
                                <p className="text-gray-600 max-w-md mx-auto">
                                    我们目前在上海地区没有找到英语口语教师。请稍后再试或调整您的搜索条件。 <br />
                                    We couldn't find any conversation tutors in Shanghai at the moment. Please check back later.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 flex w-full justify-center items-center">
                <div className="container max-w-6xl mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-8">
                        <span className="text-red-500">英语口语常见问题</span>
                        <span className="ml-2 text-gray-700">Conversation FAQs</span>
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="font-semibold text-lg mb-3">
                                <span className="text-gray-800">什么是英语口语课程的特点？</span>
                            </h3>
                            <p className="text-gray-700">
                                我们的英语口语课程注重互动和实践，提供大量真实场景的对话练习，并为每位学生提供个性化的发音和表达指导。
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                Our English conversation courses emphasize interaction and practice, providing plenty of real-world dialogue exercises and personalized pronunciation and expression guidance for each student.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="font-semibold text-lg mb-3">
                                <span className="text-gray-800">如何克服说英语的紧张感？</span>
                            </h3>
                            <p className="text-gray-700">
                                我们的教师会创造轻松的学习环境，从简单的对话开始，逐步建立您的自信心。定期练习和积极的反馈是克服语言焦虑的关键。
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                Our teachers create a relaxed learning environment, starting with simple conversations and gradually building your confidence. Regular practice and positive feedback are key to overcoming language anxiety.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
} 