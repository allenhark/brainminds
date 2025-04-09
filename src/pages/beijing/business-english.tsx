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

export default function BeijingBusinessEnglish() {
    const [tutors, setTutors] = useState<Tutor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTutors = async () => {
            try {
                // In a real app, we'd filter tutors by Beijing location and Business English specialty
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
                title="北京商务英语课程 - Business English in Beijing | 学习English"
                description="在北京寻找专业商务英语家教，提升职场英语能力和商业沟通技巧。Find professional Business English tutors in Beijing."
                keywords="北京商务英语, Beijing Business English, 商务英语培训, business communication, 职场英语, 商业英语"
                ogTitle="北京商务英语课程 - Business English in Beijing"
                ogDescription="在北京寻找专业商务英语家教，提升职场英语能力和商业沟通技巧。"
            />
            {/* Hero Section */}
            <section className="bg-gradient-to-b from-red-50 via-red-50/50 to-white min-h-[500px] w-full -mt-[70px]">
                <div className="container max-w-6xl mx-auto px-4 pb-16 relative pt-[200px]">
                    <div className="max-w-xl relative z-10">
                        <div className="mb-4">
                            <Link to="/beijing" className="text-gray-600 hover:text-red-500">
                                <i className="fas fa-arrow-left mr-2"></i> 北京英语家教 Beijing
                            </Link>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold mb-8">
                            <span className="block text-red-500">北京商务英语</span>
                            <span className="block mt-2 text-gray-700">Business English in Beijing</span>
                        </h1>

                        <p className="text-gray-800 mb-8">
                            提升您的商务英语能力，增强商业沟通技巧。我们的北京商务英语教师专注于帮助学生掌握商业会议、谈判、演讲和专业邮件写作技巧。
                        </p>
                        <p className="text-gray-600 mb-8">
                            Improve your Business English skills and enhance your professional communication. Our Beijing Business English tutors focus on helping students master business meetings, negotiations, presentations, and professional email writing.
                        </p>

                        <div className="flex flex-wrap gap-3">
                            <Button className="rounded-full bg-red-500 text-white hover:bg-red-600">
                                免费预约咨询 / Book a Free Consultation
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
                        <span className="text-red-500">商务英语课程内容</span>
                        <span className="ml-2 text-gray-700">Business English Curriculum</span>
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="text-red-500 text-2xl mb-4">📊</div>
                            <h3 className="font-semibold text-lg mb-2">
                                <span className="block text-gray-800">商业会议和谈判</span>
                                <span className="block text-sm text-gray-600">Meetings & Negotiations</span>
                            </h3>
                            <p className="text-gray-700">
                                学习如何有效地参与和主持英语商务会议，掌握谈判技巧和专业术语。
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="text-red-500 text-2xl mb-4">📝</div>
                            <h3 className="font-semibold text-lg mb-2">
                                <span className="block text-gray-800">商务写作</span>
                                <span className="block text-sm text-gray-600">Business Writing</span>
                            </h3>
                            <p className="text-gray-700">
                                提升您的商务邮件、报告和提案写作能力，学习正式与非正式的商务写作风格。
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="text-red-500 text-2xl mb-4">🎤</div>
                            <h3 className="font-semibold text-lg mb-2">
                                <span className="block text-gray-800">演讲与展示</span>
                                <span className="block text-sm text-gray-600">Presentations</span>
                            </h3>
                            <p className="text-gray-700">
                                培养自信的英语演讲能力，学习如何准备和展示专业的商业演示。
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Business English Tutors */}
            <section className="py-16 flex w-full justify-center items-center bg-gray-50">
                <div className="container max-w-6xl mx-auto px-4">
                    <div className="flex items-center gap-2 mb-8">
                        <h2 className="text-2xl font-bold">
                            <span className="text-red-500">北京商务英语教师</span>
                            <span className="ml-2 text-gray-700">Beijing Business English Tutors</span>
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
                                        <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                            商务英语专家 Business English
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
                                <h3 className="text-lg font-semibold mb-2">北京暂无商务英语老师 / No Business English tutors available</h3>
                                <p className="text-gray-600 max-w-md mx-auto">
                                    我们目前在北京地区没有找到商务英语老师。请稍后再试或调整您的搜索条件。 <br />
                                    We couldn't find any Business English tutors in Beijing at the moment. Please check back later.
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
                        <span className="text-red-500">商务英语常见问题</span>
                        <span className="ml-2 text-gray-700">Business English FAQs</span>
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="font-semibold text-lg mb-3">
                                <span className="text-gray-800">多久能看到商务英语的进步？</span>
                            </h3>
                            <p className="text-gray-700">
                                大多数学生在坚持3个月的课程后能够明显提升商务英语沟通能力。具体进展取决于您的起点和学习频率。
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                Most students see noticeable improvement in their business communication skills after 3 months of consistent lessons. Progress depends on your starting level and study frequency.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="font-semibold text-lg mb-3">
                                <span className="text-gray-800">课程是如何安排的？</span>
                            </h3>
                            <p className="text-gray-700">
                                我们的商务英语课程可以根据您的需求灵活安排，包括一对一或小组课程，可以在线或在北京市内指定地点面授。
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                Our Business English courses can be flexibly arranged according to your needs, including one-on-one or small group lessons, either online or in-person at designated locations in Beijing.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
} 