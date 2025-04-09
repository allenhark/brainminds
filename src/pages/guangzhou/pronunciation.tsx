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

export default function GuangzhouPronunciation() {
    const [tutors, setTutors] = useState<Tutor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTutors = async () => {
            try {
                // In a real app, we'd filter tutors by Guangzhou location and Pronunciation specialty
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
                title="广州英语发音课程 - English Pronunciation in Guangzhou | 学习English"
                description="在广州寻找专业英语发音教师，提高英语发音准确度和口音纠正。Find professional English pronunciation tutors in Guangzhou."
                keywords="广州英语发音, Guangzhou English pronunciation, 发音课程, accent reduction, 口音纠正, 语音训练"
                ogTitle="广州英语发音课程 - English Pronunciation in Guangzhou"
                ogDescription="在广州寻找专业英语发音教师，提高英语发音准确度和口音纠正。"
            />
            {/* Hero Section */}
            <section className="bg-gradient-to-b from-red-50 via-red-50/50 to-white min-h-[500px] w-full -mt-[70px]">
                <div className="container max-w-6xl mx-auto px-4 pb-16 relative pt-[200px]">
                    <div className="max-w-xl relative z-10">
                        <div className="mb-4">
                            <Link to="/guangzhou" className="text-gray-600 hover:text-red-500">
                                <i className="fas fa-arrow-left mr-2"></i> 广州英语家教 Guangzhou
                            </Link>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold mb-8">
                            <span className="block text-red-500">广州英语发音课程</span>
                            <span className="block mt-2 text-gray-700">Pronunciation Courses in Guangzhou</span>
                        </h1>

                        <p className="text-gray-800 mb-8">
                            提高英语发音准确度，消除口音障碍。我们的广州英语发音课程专注于口音纠正、语音训练和自然流利的英语表达。
                        </p>
                        <p className="text-gray-600 mb-8">
                            Improve your English pronunciation accuracy and reduce accent barriers. Our Guangzhou pronunciation courses focus on accent correction, phonetic training, and natural fluent English expression.
                        </p>

                        <div className="flex flex-wrap gap-3">
                            <Button className="rounded-full bg-red-500 text-white hover:bg-red-600">
                                免费试听课程 / Book a Free Assessment
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
                        <span className="text-red-500">发音课程内容</span>
                        <span className="ml-2 text-gray-700">Pronunciation Course Content</span>
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="text-red-500 text-2xl mb-4">🔤</div>
                            <h3 className="font-semibold text-lg mb-2">
                                <span className="block text-gray-800">音素训练</span>
                                <span className="block text-sm text-gray-600">Phoneme Training</span>
                            </h3>
                            <p className="text-gray-700">
                                专注于英语中各个元音和辅音的准确发音，解决中国学生常见的发音难点，如 th、r、l 等音素。
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="text-red-500 text-2xl mb-4">🎵</div>
                            <h3 className="font-semibold text-lg mb-2">
                                <span className="block text-gray-800">语调与重音</span>
                                <span className="block text-sm text-gray-600">Intonation & Stress</span>
                            </h3>
                            <p className="text-gray-700">
                                掌握英语语调、重音和节奏的规律，让您的英语听起来更加自然流畅，而不是单调生硬。
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="text-red-500 text-2xl mb-4">🗣️</div>
                            <h3 className="font-semibold text-lg mb-2">
                                <span className="block text-gray-800">口音纠正</span>
                                <span className="block text-sm text-gray-600">Accent Reduction</span>
                            </h3>
                            <p className="text-gray-700">
                                通过个性化的指导和练习，帮助您减轻母语口音对英语发音的影响，提高发音的准确性和清晰度。
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pronunciation Tutors */}
            <section className="py-16 flex w-full justify-center items-center bg-gray-50">
                <div className="container max-w-6xl mx-auto px-4">
                    <div className="flex items-center gap-2 mb-8">
                        <h2 className="text-2xl font-bold">
                            <span className="text-red-500">广州英语发音教师</span>
                            <span className="ml-2 text-gray-700">Guangzhou Pronunciation Tutors</span>
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
                                        <div className="absolute top-2 left-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                                            发音专家 Pronunciation
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
                                <h3 className="text-lg font-semibold mb-2">广州暂无发音教师 / No pronunciation tutors available</h3>
                                <p className="text-gray-600 max-w-md mx-auto">
                                    我们目前在广州地区没有找到英语发音教师。请稍后再试或调整您的搜索条件。 <br />
                                    We couldn't find any pronunciation tutors in Guangzhou at the moment. Please check back later.
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
                        <span className="text-red-500">英语发音常见问题</span>
                        <span className="ml-2 text-gray-700">Pronunciation FAQs</span>
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="font-semibold text-lg mb-3">
                                <span className="text-gray-800">学习英语发音需要多长时间？</span>
                            </h3>
                            <p className="text-gray-700">
                                改善发音是个渐进的过程，大多数学生在坚持8-12周的课程后能看到明显的进步。重要的是定期练习和接收专业反馈。
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                Improving pronunciation is a gradual process. Most students see noticeable progress after 8-12 weeks of lessons. Regular practice and professional feedback are crucial.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="font-semibold text-lg mb-3">
                                <span className="text-gray-800">您使用什么方法教授发音？</span>
                            </h3>
                            <p className="text-gray-700">
                                我们采用多种方法，包括音素训练、语音模仿、录音分析和实时反馈。我们也使用专业的发音软件和工具来帮助可视化发音过程。
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                We use multiple methods, including phoneme training, speech mimicry, recording analysis, and real-time feedback. We also utilize specialized pronunciation software and tools to visualize the pronunciation process.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
} 