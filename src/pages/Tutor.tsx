import { Link } from "react-router-dom";
import { Button } from "~/ui/button";

// Sample tutor data - this would come from your API/database in a real app
const tutorData = {
    name: "Sarah",
    title: "TEFL certified English Teacher",
    image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d",
    rating: 5,
    reviews: 1704,
    location: "United States",
    languages: ["English (Native)", "Spanish (Conversational)"],
    specialties: ["Business English", "IELTS Preparation", "Conversation Practice"],
    about: "TEFL certified with 5+ years experience teaching Business English and conversation skills. I specialize in helping professionals improve their workplace communication and prepare for international certifications. My lessons are tailored to each student's needs and goals.",
    education: [
        "TEFL Certification - Cambridge",
        "BA in English Literature - University of California"
    ],
    experience: "5+ years of teaching experience",
    schedule: {
        availability: "Mon-Fri: 9AM-6PM EST",
        timezone: "EST (UTC-5)"
    },
    testimonials: [
        {
            name: "李明",
            text: "Sarah is an excellent teacher! Her business English lessons helped me communicate more confidently with international clients.",
            rating: 5,
            date: "2024-02-15",
            image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36"
        },
        {
            name: "王芳",
            text: "Very patient and professional. The IELTS preparation was exactly what I needed to achieve my target score.",
            rating: 5,
            date: "2024-02-10",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80"
        },
        {
            name: "张伟",
            text: "Great teaching style and very flexible with scheduling. Highly recommend for business English.",
            rating: 5,
            date: "2024-02-01",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
        }
    ],
    badges: ["Verified Teacher", "Native Speaker", "Quick Responder"],
    memberSince: "January 2022",
    teachingStyle: "Conversational, Interactive, Student-centered",
    // Teaching materials would also be part of the tutor's profile
    materials: ["Custom PDF worksheets", "Interactive exercises", "Audio materials"]
};

// Suggested tutors data
const suggestedTutors = [
    {
        name: "Michael",
        image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d",
        description: "Native speaker specializing in IELTS and TOEFL, helping students achieve their academic aims.",
        reviews: 1567,
        verified: true,
    },
    {
        name: "Emma",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
        description: "Experienced in teaching young learners, making English enjoyable for children.",
        reviews: 1603,
        verified: true,
    },
    {
        name: "James",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
        description: "Former IELTS examiner with extensive test preparation experience.",
        reviews: 1892,
        verified: true,
    }
];

export default function Tutor() {
    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Tutor Profile Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {/* Left Column */}
                <div className="md:col-span-1">
                    <div className="relative aspect-[3/4] rounded-[8px] overflow-hidden shadow-md">
                        <img
                            src={tutorData.image}
                            alt={tutorData.name}
                            className="object-cover w-full h-full"
                        />
                    </div>

                    {/* Tutor Badges */}
                    <div className="mt-4 flex flex-wrap gap-2">
                        {tutorData.badges.map((badge, index) => (
                            <span key={index} className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-medium">
                                {badge}
                            </span>
                        ))}
                    </div>

                    {/* Quick Info */}
                    <div className="mt-4 bg-gray-50 rounded-[5px] p-4 space-y-3">
                        <div className="flex items-center gap-2">
                            <i className="fas fa-user-clock text-gray-500"></i>
                            <span className="text-sm text-gray-700">Member since {tutorData.memberSince}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <i className="fas fa-language text-gray-500"></i>
                            <span className="text-sm text-gray-700">
                                {tutorData.languages.join(", ")}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <i className="fas fa-graduation-cap text-gray-500"></i>
                            <span className="text-sm text-gray-700">{tutorData.education[0]}</span>
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
                            <h1 className="text-4xl font-bold mb-3">{tutorData.name}</h1>
                            <p className="text-xl text-gray-600">{tutorData.title}</p>
                        </div>
                        <span className="text-blue-600 px-4 py-2 text-sm bg-blue-50 rounded-full font-medium">
                            Ambassador
                        </span>
                    </div>

                    <div className="flex items-center gap-6 mb-8">
                        <div className="flex items-center">
                            <i className="fas fa-star h-6 w-6 text-yellow-400"></i>
                            <span className="ml-2 text-lg font-semibold">{tutorData.rating}</span>
                            <span className="text-gray-500 ml-2">({tutorData.reviews} reviews)</span>
                        </div>
                        <div className="text-gray-300 text-xl">|</div>
                        <div className="text-gray-600 text-lg">{tutorData.location}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-8">
                        {[
                            { icon: "fas fa-clock", text: tutorData.schedule.availability },
                            { icon: "fas fa-language", text: tutorData.languages[0] },
                            { icon: "fas fa-award", text: tutorData.education[0] },
                            { icon: "fas fa-book-open", text: tutorData.specialties[0] }
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
                        <Button className="bg-red-500 hover:bg-red-600 text-white px-8 py-6 text-lg rounded-lg">
                            立即订阅 Subscribe Now
                        </Button>
                    </div>
                </div>
            </div>

            {/* About Section */}
            <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">About Me</h2>
                <p className="text-gray-600 whitespace-pre-line">{tutorData.about}</p>

                {/* Teaching Style */}
                <div className="mt-6">
                    <h3 className="text-lg font-medium mb-3">教学风格 Teaching Style</h3>
                    <p className="text-gray-600">{tutorData.teachingStyle}</p>
                </div>

                {/* Teaching Materials */}
                <div className="mt-6">
                    <h3 className="text-lg font-medium mb-3">教学资料 Teaching Materials</h3>
                    <ul className="list-disc pl-5 text-gray-600 space-y-1">
                        {tutorData.materials.map((material, index) => (
                            <li key={index}>{material}</li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="mb-16">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">学生评价 Student Reviews</h2>
                    <select
                        className="px-3 py-2 border rounded-[5px] text-sm text-gray-600 bg-white"
                        defaultValue="newest"
                    >
                        <option value="newest">Newest First</option>
                        <option value="highest">Highest Rating (5→1)</option>
                        <option value="lowest">Lowest Rating (1→5)</option>
                    </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {tutorData.testimonials
                        .sort((a, b) => b.rating - a.rating) // Sort by rating high to low
                        .map((testimonial, index) => (
                            <div key={index} className="bg-gray-50 p-6 rounded-[5px]">
                                <div className="flex items-start gap-4">
                                    <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                                        <img
                                            src={testimonial.image}
                                            alt={testimonial.name}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-semibold">{testimonial.name}</h3>
                                            <div className="flex items-center">
                                                <i className="fas fa-star h-4 w-4 text-yellow-400"></i>
                                                <span className="ml-1 text-sm">{testimonial.rating}.0</span>
                                            </div>
                                        </div>
                                        <p className="text-gray-600">{testimonial.text}</p>
                                        <p className="text-sm text-gray-400 mt-2">{testimonial.date}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </section>

            <hr className="my-16" />

            {/* Update Suggested Tutors Section */}
            <section className="mb-16">
                <h2 className="text-2xl font-semibold mb-8">专业英语老师 Professional English Tutors</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {suggestedTutors.map((tutor) => (
                        <Link
                            to={`/tutor/${tutor.name.toLowerCase()}`}
                            key={tutor.name}
                            className="block group"
                        >
                            <div className="overflow-hidden bg-gray-50 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
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
                                        onClick={(e) => {
                                            e.preventDefault();
                                        }}
                                    >
                                        <i className="fas fa-heart h-4 w-4"></i>
                                    </Button>
                                </div>
                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="font-semibold text-lg">{tutor.name}</h3>
                                        <span className="text-violet-600 px-2 py-1 text-xs bg-violet-50 rounded-full">
                                            Ambassador
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1 mb-2">
                                        <div className="flex items-center text-yellow-400">
                                            <i className="fas fa-star h-4 w-4"></i>
                                            <span className="ml-1 text-gray-700 text-sm">5.0</span>
                                        </div>
                                        <span className="text-gray-500 text-sm">({tutor.reviews} reviews)</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                        {tutor.description}
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
