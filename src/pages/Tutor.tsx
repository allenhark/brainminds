import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Api from "@/Api";
import { useEffect, useState } from "react";
import { url } from "@/config";
import HelmetComponent from "@/components/HelmetComponent";

// Define interfaces for type safety
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
    createdAt: string;
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

interface TutorData {
    id: number;
    firstName: string;
    lastName: string;
    avatar: string | null;
    tutorProfile: TutorProfile;
    tutorStats: TutorStats;
}

export default function Tutor() {
    const { slug } = useParams<{ slug: string }>();
    const [tutor, setTutor] = useState<TutorData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [suggestedTutors, setSuggestedTutors] = useState<TutorData[]>([]);

    useEffect(() => {
        const fetchTutors = async () => {
            try {
                const { data } = await Api.get(`/site/featured-tutors`);
                setSuggestedTutors(data);
            } catch (error) {
                console.error("Error fetching featured tutors:", error);
            }
        };

        fetchTutors();
    }, []);

    useEffect(() => {
        const fetchTutorData = async () => {
            try {
                setLoading(true);
                const { data } = await Api.get(`/site/tutor/${slug}`);
                setTutor(data);

                console.log(data);

            } catch (err) {
                console.error("Error fetching tutor data:", err);
                setError("Failed to load tutor information. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchTutorData();
        }
    }, [slug]);



    // Helper function to get avatar URL
    const getAvatarUrl = (avatar: string | null) => {
        if (!avatar) return "https://api.dicebear.com/7.x/micah/svg?size=200";
        return avatar.startsWith('http') ? avatar : `${url}/${avatar}`;
    };

    // Parse availability JSON string to object
    const parseAvailability = (availabilityStr: string | undefined) => {
        if (!availabilityStr) return [];
        try {
            return JSON.parse(availabilityStr);
        } catch (err) {
            console.error("Error parsing availability:", err);
            return [];
        }
    };

    // Format member since date
    const formatMemberSince = (dateStr: string | undefined) => {
        if (!dateStr) return "Recently joined";
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    };

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-8 flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error || !tutor) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Error</h2>
                <p className="text-gray-600 mb-6">{error || "Tutor not found"}</p>
                <Link to="/">
                    <Button variant="outline">Return to Home</Button>
                </Link>
            </div>
        );
    }

    const availability = parseAvailability(tutor.tutorProfile.availability);

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">

            <HelmetComponent
                title={`${tutor.firstName} ${tutor.lastName} - 专业英语老师 Professional English Tutors`}
                description={`${tutor.tutorProfile.aboutMe || "No description provided."}`}
            />

            {/* Tutor Profile Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {/* Left Column */}
                <div className="md:col-span-1">
                    <div className="relative aspect-[3/4] rounded-[8px] overflow-hidden shadow-md">
                        <img
                            src={getAvatarUrl(tutor.avatar)}
                            alt={`${tutor.firstName} ${tutor.lastName}`}
                            className="object-cover w-full h-full"
                        />
                    </div>

                    {/* Tutor Badges */}
                    <div className="mt-4 flex flex-wrap gap-2">
                        {tutor.tutorProfile.applicationStatus === "APPROVED" && (
                            <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-medium">
                                Verified Teacher
                            </span>
                        )}
                        {tutor.tutorStats.responseRate >= 90 && (
                            <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-medium">
                                Quick Responder
                            </span>
                        )}
                    </div>

                    {/* Quick Info */}
                    <div className="mt-4 bg-gray-50 rounded-[5px] p-4 space-y-3">
                        <div className="flex items-center gap-2">
                            <i className="fas fa-user-clock text-gray-500"></i>
                            <span className="text-sm text-gray-700">Member since {formatMemberSince(tutor.tutorProfile.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <i className="fas fa-clock text-gray-500"></i>
                            <span className="text-sm text-gray-700">
                                Lesson Duration: {tutor.tutorProfile.lessonDuration} minutes
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <i className="fas fa-graduation-cap text-gray-500"></i>
                            <span className="text-sm text-gray-700">{tutor.tutorProfile.educationLevel || "Education not specified"}</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 space-y-3">
                        <Button className="w-full bg-red-500 hover:bg-red-600 text-white">
                            开始学习 Start Learning
                        </Button>
                        <Button variant="outline" className="w-full">
                            发送消息 Send Message
                        </Button>
                        <Button variant="ghost" className="w-full flex items-center justify-center gap-2">
                            <i className="fas fa-heart h-4 w-4"></i>
                            <span>收藏老师 Save to My List</span>
                        </Button>
                    </div>
                </div>

                {/* Right Column */}
                <div className="md:col-span-2">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-4xl font-bold mb-3">{tutor.firstName} {tutor.lastName}</h1>
                            <p className="text-xl text-gray-600">{tutor.tutorProfile.teachingCredentials || "English Teacher"}</p>
                        </div>
                        {tutor.tutorStats.completedSessions > 50 && (
                            <span className="text-blue-600 px-4 py-2 text-sm bg-blue-50 rounded-full font-medium">
                                Ambassador
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-6 mb-8">
                        <div className="flex items-center">
                            <i className="fas fa-star h-6 w-6 text-yellow-400"></i>
                            <span className="ml-2 text-lg font-semibold">{tutor.tutorStats.averageRating || "New"}</span>
                            <span className="text-gray-500 ml-2">({tutor.tutorStats.completedSessions} sessions)</span>
                        </div>
                        <div className="text-gray-300 text-xl">|</div>
                        <div className="text-gray-600 text-lg">{tutor.tutorProfile.timezone || "Timezone not set"}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-8">
                        {[
                            { icon: "fas fa-clock", text: `${tutor.tutorProfile.lessonDuration} min lessons` },
                            { icon: "fas fa-users", text: `${tutor.tutorStats.totalStudents} students taught` },
                            { icon: "fas fa-award", text: tutor.tutorProfile.educationLevel || "Education not specified" },
                            { icon: "fas fa-book-open", text: tutor.tutorProfile.teachingStyle || "Teaching style not specified" }
                        ].map(({ icon, text }, index) => (
                            <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                <i className={`${icon} h-6 w-6 text-gray-500`}></i>
                                <span className="text-gray-700">{text}</span>
                            </div>
                        ))}
                    </div>

                    {/* Replace Trial Lesson Card with Subscription Info */}
                    <div className="flex items-center justify-between p-6 bg-gradient-to-r from-red-50 to-red-100 rounded-xl border border-red-200 mb-8">
                        <div>
                            <p className="text-3xl font-bold mb-1">¥13,000</p>
                            <p className="text-red-500 font-medium">每月 / Per Month</p>
                            <p className="text-sm text-gray-600 mt-1">无限制访问所有老师 Unlimited access to all tutors</p>
                        </div>
                        <Link to="/login" className="bg-red-500 hover:bg-red-600 text-white px-8 py-6 text-lg rounded-lg">
                            立即订阅 Subscribe Now
                        </Link>
                    </div>
                </div>
            </div>

            {/* About Section */}
            <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">About Me</h2>
                <p className="text-gray-600 whitespace-pre-line">
                    {tutor.tutorProfile.aboutMe || "No description provided."}
                </p>

                {/* Teaching Style */}
                <div className="mt-6">
                    <h3 className="text-lg font-medium mb-3">教学风格 Teaching Style</h3>
                    <p className="text-gray-600">{tutor.tutorProfile.teachingStyle || "Teaching style not specified."}</p>
                </div>

                {/* Teaching Materials */}
                <div className="mt-6">
                    <h3 className="text-lg font-medium mb-3">教学资料 Teaching Materials</h3>
                    <p className="text-gray-600">{tutor.tutorProfile.teachingMaterials || "Teaching materials not specified."}</p>
                </div>

                {/* Availability */}
                <div className="mt-6">
                    <h3 className="text-lg font-medium mb-3">时间安排 Availability</h3>
                    {availability.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {availability.map((slot: any, index: number) => (
                                <div key={index} className="bg-gray-50 p-3 rounded-md">
                                    <p className="font-medium">{slot.day}</p>
                                    <p className="text-gray-600">{slot.startTime} - {slot.endTime}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600">Availability not specified.</p>
                    )}
                </div>
            </section>

            {/* Update Suggested Tutors Section */}
            <section className="mb-16">
                <h2 className="text-2xl font-semibold mb-8">专业英语老师 Professional English Tutors</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {suggestedTutors.map((suggestedTutor) => (
                        <Link
                            to={`/tutor/${suggestedTutor.id}`}
                            key={suggestedTutor.id}
                            className="block group"
                        >
                            <div className="overflow-hidden bg-gray-50 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                <div className="relative">
                                    <img
                                        src={getAvatarUrl(suggestedTutor.avatar)}
                                        alt={`${suggestedTutor.firstName} ${suggestedTutor.lastName}`}
                                        className="w-full aspect-square object-cover"
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute top-2 right-2 z-10 text-white hover:text-primary bg-black/20 rounded-full"
                                        onClick={(e: React.MouseEvent) => {
                                            e.preventDefault();
                                        }}
                                    >
                                        <i className="fas fa-heart h-4 w-4"></i>
                                    </Button>
                                </div>
                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="font-semibold text-lg">{suggestedTutor.firstName} {suggestedTutor.lastName}</h3>
                                        {suggestedTutor.tutorProfile.applicationStatus === "APPROVED" && (
                                            <span className="text-violet-600 px-2 py-1 text-xs bg-violet-50 rounded-full">
                                                Verified
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1 mb-2">
                                        <div className="flex items-center text-yellow-400">
                                            <i className="fas fa-star h-4 w-4"></i>
                                            <span className="ml-1 text-gray-700 text-sm">
                                                {suggestedTutor.tutorStats.averageRating || "New"}
                                            </span>
                                        </div>
                                        <span className="text-gray-500 text-sm">
                                            ({suggestedTutor.tutorStats.completedSessions} sessions)
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                        {suggestedTutor.tutorProfile.aboutMe || `${suggestedTutor.tutorProfile.teachingStyle} - ${suggestedTutor.tutorProfile.educationLevel}`}
                                    </p>
                                    <div className="flex items-center justify-between pt-2 border-t">
                                        <p className="text-sm text-gray-600">Included in subscription</p>
                                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                                            View Profile
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}
