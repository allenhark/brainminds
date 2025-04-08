import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Api from '@/Api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';
import { url } from '@/config';
import HelmetComponent from '@/components/HelmetComponent';

// Types
interface Tutor {
    id: number;
    firstName: string;
    lastName: string;
    avatar?: string;
    subjects: string[];
    educationLevel: string;
    yearsOfExperience: number;
    lessonPrice: number;
    rating: number;
    availability: Array<{
        day: string;
        startTime: string;
        endTime: string;
    }>;
    timezone: string;
    bio: string;
    teachingStyle: string;
}

interface SubscriptionStatus {
    isSubscribed: boolean;
    expiryDate?: string;
}

// Timezone options based on Chinese regions
const TIMEZONE_OPTIONS = [
    { value: "CST", label: "中国标准时间 (UTC+8) / China Standard Time" },
    { value: "XJT", label: "新疆时间 (UTC+6) / Xinjiang Time" },
    { value: "HKT", label: "香港时间 (UTC+8) / Hong Kong Time" },
    { value: "TWT", label: "台湾时间 (UTC+8) / Taiwan Time" }
];

// Availability options
const AVAILABILITY_OPTIONS = [
    { value: "morning", label: "早上 / Morning (6am-12pm)" },
    { value: "afternoon", label: "下午 / Afternoon (12pm-6pm)" },
    { value: "evening", label: "晚上 / Evening (6pm-10pm)" },
    { value: "weekend", label: "周末 / Weekends" },
    { value: "monday", label: "周一 / Monday" },
    { value: "tuesday", label: "周二 / Tuesday" },
    { value: "wednesday", label: "周三 / Wednesday" },
    { value: "thursday", label: "周四 / Thursday" },
    { value: "friday", label: "周五 / Friday" }
];

const Tutors: React.FC = () => {
    const [tutors, setTutors] = useState<Tutor[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [timezoneFilter, setTimezoneFilter] = useState('');
    const [availabilityFilter, setAvailabilityFilter] = useState('');
    const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>({
        isSubscribed: false
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);

                // Build query parameters for filtering
                const params = new URLSearchParams();
                if (searchQuery) params.append('search', searchQuery);
                if (timezoneFilter) params.append('timezone', timezoneFilter);
                if (availabilityFilter) params.append('availability', availabilityFilter);

                const [tutorsResponse, subscriptionResponse] = await Promise.all([
                    Api.get(`/student/tutors?${params.toString()}`),
                    Api.get('/student/subscription')
                ]);

                setTutors(tutorsResponse.data.data || []);
                setSubscriptionStatus(subscriptionResponse.data);
            } catch (error) {
                console.error('Failed to fetch tutors:', error);
                toast.error('获取老师数据失败 / Failed to load tutors data');
                setTutors([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [searchQuery, timezoneFilter, availabilityFilter]);

    // Filter tutors on the client side - note this is now also happening on server
    // but we keep it in case we need to do additional filtering
    const filteredTutors = tutors.filter(tutor => {
        const matchesSearch =
            searchQuery === '' ||
            `${tutor.firstName} ${tutor.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tutor.bio.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesSearch;
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-500"></div>
            </div>
        );
    }

    // Prepare dynamic meta content based on filters and results
    const pageTitle = `找英语老师 - Find English Tutors${timezoneFilter ? ` in ${timezoneFilter}` : ''}`;
    const pageDescription = `Browse and connect with professional English tutors${timezoneFilter ? ` in ${timezoneFilter}` : ''}. ${filteredTutors.length} tutors available${availabilityFilter ? ` for ${availabilityFilter}` : ''}.`;
    const keywords = `english tutors, learn english, online tutoring, english teachers${timezoneFilter ? `, ${timezoneFilter} tutors` : ''}${availabilityFilter ? `, ${availabilityFilter} classes` : ''}`;
    const currentUrl = window.location.href;

    return (
        <div className="space-y-6">
            <HelmetComponent
                title={pageTitle}
                description={pageDescription}
                keywords={keywords}
                ogTitle={pageTitle}
                ogDescription={pageDescription}
                ogUrl={currentUrl}
            />

            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">
                    找英语老师
                    <span className="block mt-2 text-xl">Find an English Tutor</span>
                </h1>
                {!subscriptionStatus.isSubscribed && (
                    <Link to="/study/payments">
                        <Button className="bg-red-500 hover:bg-red-600 text-white">订阅 / Subscribe</Button>
                    </Link>
                )}
            </div>

            {/* Search and Filter */}
            <div className="bg-white p-4 rounded-lg shadow-sm border space-y-4">
                <div className="relative flex-grow">
                    <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    <Input
                        type="text"
                        placeholder="搜索名字或关键词 / Search by name or keywords..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1">时区 / Timezone</label>
                        <select
                            id="timezone"
                            value={timezoneFilter}
                            onChange={(e) => setTimezoneFilter(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                            <option value="">所有时区 / All Timezones</option>
                            {TIMEZONE_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-1">可用时间 / Availability</label>
                        <select
                            id="availability"
                            value={availabilityFilter}
                            onChange={(e) => setAvailabilityFilter(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                            <option value="">任何时间 / Any Availability</option>
                            {AVAILABILITY_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Results Count */}
            <p className="text-gray-600">
                显示 {filteredTutors.length} 位老师 / Showing {filteredTutors.length} {filteredTutors.length === 1 ? 'tutor' : 'tutors'}
            </p>

            {/* Tutors List */}
            <div className="space-y-4">
                {filteredTutors.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500">没有找到符合您条件的老师 / No tutors found matching your criteria.</p>
                    </div>
                ) : (
                    filteredTutors.map(tutor => (
                        <Card key={tutor.id} className="overflow-hidden hover:shadow-md transition-shadow">
                            <CardContent className="p-0">
                                <div className="flex flex-col md:flex-row">
                                    {/* Tutor Image and Basic Info */}
                                    <div className="p-6 flex flex-col items-center md:items-start md:w-1/4 border-b md:border-b-0 md:border-r bg-gray-50">
                                        <img
                                            src={tutor.avatar ? `${url}/${tutor.avatar}` : `https://api.dicebear.com/6.x/bottts/svg?seed=${tutor.firstName}`}
                                            alt={`${tutor.firstName} ${tutor.lastName}`}
                                            className="w-32 h-32 rounded-2xl mb-3 object-cover"
                                        />
                                        <h3 className="text-xl font-semibold text-center md:text-left">{tutor.firstName} {tutor.lastName}</h3>
                                        <div className="flex items-center mt-1 text-yellow-500">
                                            <i className="fas fa-star text-yellow-500"></i>
                                            <span className="ml-1 text-gray-700">{tutor.rating.toFixed(1)}</span>
                                        </div>
                                        <p className="mt-2 text-sm text-gray-600">{tutor.educationLevel}</p>
                                        <p className="text-sm text-gray-600">{tutor.yearsOfExperience} 年经验 / years experience</p>
                                        <p className="text-sm text-gray-600 mt-2">时区 / Timezone: {tutor.timezone}</p>
                                    </div>

                                    {/* Tutor Details */}
                                    <div className="p-6 flex-grow">
                                        <div className="mb-4">
                                            <p className="text-gray-600 mb-2">{tutor.bio}</p>
                                            <p className="text-sm text-gray-500">
                                                <span className="font-medium">教学风格 / Teaching Style:</span> {tutor.teachingStyle}
                                            </p>
                                        </div>

                                        <div className="mb-4">
                                            <h4 className="font-medium text-gray-700 mb-1 flex items-center">
                                                <i className="fas fa-check text-green-500 mr-1"></i> 科目 / Subjects
                                            </h4>
                                            <div className="flex flex-wrap gap-1">
                                                <Badge variant="secondary">英语 / English</Badge>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <h4 className="font-medium text-gray-700 mb-1 flex items-center">
                                                <i className="fas fa-clock text-blue-500 mr-1"></i> 可用时间 / Availability
                                            </h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                                {tutor.availability.map((slot, idx) => (
                                                    <p key={idx} className="text-sm text-gray-600">
                                                        {slot.day}: {slot.startTime} - {slot.endTime}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-wrap gap-3 mt-6">
                                            <Link to={`/study/tutors/${tutor.id}`}>
                                                <Button variant="default" className="bg-red-500 hover:bg-red-600 text-white">
                                                    查看档案 / View Profile
                                                </Button>
                                            </Link>

                                            {subscriptionStatus.isSubscribed ? (
                                                <>
                                                    <Link to={`/study/schedule?tutor=${tutor.id}`}>
                                                        <Button variant="outline" className="flex items-center">
                                                            <i className="fas fa-calendar-alt mr-2"></i>
                                                            安排课程 / Schedule
                                                        </Button>
                                                    </Link>
                                                </>
                                            ) : (
                                                <Link to="/study/payments">
                                                    <Button variant="outline">订阅后联系 / Subscribe to Connect</Button>
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default Tutors; 