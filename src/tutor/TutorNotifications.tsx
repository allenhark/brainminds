import React, { useState, useEffect, useContext } from "react";
import Api from "@/Api";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import HelmetComponent from "@/components/HelmetComponent";
import { Skeleton } from "@/components/ui/skeleton";

type NotificationType =
    | 'MESSAGE'
    | 'SESSION_SCHEDULED'
    | 'SESSION_REMINDER'
    | 'SESSION_CANCELLED'
    | 'PAYMENT_RECEIVED'
    | 'ADMIN_NOTICE';

type NotificationStatus = 'UNREAD' | 'READ';

interface Notification {
    id: number;
    type: NotificationType;
    status: NotificationStatus;
    title: string;
    content: string;
    linkUrl?: string;
    createdAt: string;
    relatedId?: number; // Session ID or other related entity ID
}

interface NotificationsResponse {
    notifications: Notification[];
    unreadCount: number;
    hasMore: boolean;
}

const TutorNotifications: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [hasMore, setHasMore] = useState(false);
    const [page, setPage] = useState(0);
    const [includeRead, setIncludeRead] = useState(true);
    const limit = 20;
    const navigate = useNavigate();
    const [groupedNotifications, setGroupedNotifications] = useState<Record<string, Notification[]>>({});
    const [groupByType, setGroupByType] = useState(false);

    // Fetch notifications
    const fetchNotifications = async (pageNum = 0, showRead = true) => {
        try {
            setIsLoading(true);
            const offset = pageNum * limit;
            const response = await Api.get<NotificationsResponse>(`/notifications?limit=${limit}&offset=${offset}&includeRead=${showRead}`);

            if (pageNum === 0) {
                setNotifications(response.data.notifications);
            } else {
                setNotifications(prev => [...prev, ...response.data.notifications]);
            }

            setUnreadCount(response.data.unreadCount);
            setHasMore(response.data.hasMore);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching notifications:", error);
            toast.error("Failed to load notifications");
            setIsLoading(false);
        }
    };

    // Group notifications by date or type when notifications change
    useEffect(() => {
        if (groupByType) {
            const grouped = notifications.reduce((acc, notification) => {
                const key = notification.type;
                if (!acc[key]) {
                    acc[key] = [];
                }
                acc[key].push(notification);
                return acc;
            }, {} as Record<string, Notification[]>);
            setGroupedNotifications(grouped);
        } else {
            // Group by date (today, yesterday, this week, earlier)
            const grouped = notifications.reduce((acc, notification) => {
                const date = new Date(notification.createdAt);
                const now = new Date();
                const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);
                const thisWeekStart = new Date(today);
                thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay());

                let key = 'Earlier';
                if (date >= today) {
                    key = 'Today';
                } else if (date >= yesterday) {
                    key = 'Yesterday';
                } else if (date >= thisWeekStart) {
                    key = 'This Week';
                }

                if (!acc[key]) {
                    acc[key] = [];
                }
                acc[key].push(notification);
                return acc;
            }, {} as Record<string, Notification[]>);
            setGroupedNotifications(grouped);
        }
    }, [notifications, groupByType]);

    // Initial fetch
    useEffect(() => {
        fetchNotifications(0, includeRead);
    }, [includeRead]);

    // Handle mark as read
    const handleMarkAsRead = async (notificationId: number) => {
        try {
            await Api.put(`/notifications/${notificationId}/read`);

            // Update local state
            setNotifications(prev =>
                prev.map(notification =>
                    notification.id === notificationId
                        ? { ...notification, status: 'READ' as NotificationStatus }
                        : notification
                )
            );

            // Update unread count
            setUnreadCount(prev => Math.max(0, prev - 1));

        } catch (error) {
            console.error("Error marking notification as read:", error);
            toast.error("Failed to mark notification as read");
        }
    };

    // Handle mark all as read
    const handleMarkAllAsRead = async () => {
        try {
            await Api.put('/notifications/read-all');

            // Update local state
            setNotifications(prev =>
                prev.map(notification => ({ ...notification, status: 'READ' as NotificationStatus }))
            );

            // Update unread count
            setUnreadCount(0);
            toast.success("All notifications marked as read");

        } catch (error) {
            console.error("Error marking all notifications as read:", error);
            toast.error("Failed to mark all notifications as read");
        }
    };

    // Handle notification click - navigate if linkUrl exists
    const handleNotificationClick = (notification: Notification) => {
        // Mark as read
        if (notification.status === 'UNREAD') {
            handleMarkAsRead(notification.id);
        }

        // Navigate if linkUrl exists
        if (notification.linkUrl) {
            navigate(notification.linkUrl);
        }
    };

    // Load more notifications
    const loadMoreNotifications = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchNotifications(nextPage, includeRead);
    };

    // Toggle between all and unread notifications
    const toggleReadFilter = () => {
        setPage(0);
        setIncludeRead(!includeRead);
    };

    // Toggle grouping mode
    const toggleGrouping = () => {
        setGroupByType(!groupByType);
    };

    // Function to navigate to session details
    const goToSession = (sessionId: number) => {
        navigate(`/my-tutor/sessions/${sessionId}`);
    };

    // Get human-readable notification group title
    const getGroupTitle = (key: string): string => {
        if (['Today', 'Yesterday', 'This Week', 'Earlier'].includes(key)) {
            return key;
        }

        // Convert notification type to readable title
        switch (key) {
            case 'MESSAGE':
                return 'Messages';
            case 'SESSION_SCHEDULED':
                return 'Scheduled Sessions';
            case 'SESSION_REMINDER':
                return 'Session Reminders';
            case 'SESSION_CANCELLED':
                return 'Cancelled Sessions';
            case 'PAYMENT_RECEIVED':
                return 'Payments';
            case 'ADMIN_NOTICE':
                return 'Admin Notices';
            default:
                return key;
        }
    };

    // Get notification icon based on type
    const getNotificationIcon = (type: NotificationType) => {
        switch (type) {
            case 'MESSAGE':
                return <i className="far fa-envelope text-blue-500 mr-2"></i>;
            case 'SESSION_SCHEDULED':
                return <i className="far fa-calendar-plus text-green-500 mr-2"></i>;
            case 'SESSION_REMINDER':
                return <i className="far fa-bell text-yellow-500 mr-2"></i>;
            case 'SESSION_CANCELLED':
                return <i className="far fa-calendar-times text-red-500 mr-2"></i>;
            case 'PAYMENT_RECEIVED':
                return <i className="far fa-money-bill text-green-500 mr-2"></i>;
            case 'ADMIN_NOTICE':
                return <i className="far fa-bullhorn text-purple-500 mr-2"></i>;
            default:
                return <i className="far fa-bell text-gray-500 mr-2"></i>;
        }
    };

    // Format notification date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.round(diffMs / 60000);
        const diffHours = Math.round(diffMs / 3600000);
        const diffDays = Math.round(diffMs / 86400000);

        if (diffMins < 60) {
            return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
        } else if (diffHours < 24) {
            return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
        } else if (diffDays < 7) {
            return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
        } else {
            return date.toLocaleDateString();
        }
    };

    return (
        <div className="space-y-6">
            <HelmetComponent
                title="Notifications"
                description="View your notifications"
            />

            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Notifications</h1>
                <div className="space-x-2">
                    <Button
                        variant={includeRead ? "outline" : "default"}
                        onClick={toggleReadFilter}
                        size="sm"
                    >
                        {includeRead ? "Show Unread Only" : "Show All"}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={toggleGrouping}
                        size="sm"
                    >
                        Group by: {groupByType ? "Type" : "Date"}
                    </Button>
                    {unreadCount > 0 && (
                        <Button
                            onClick={handleMarkAllAsRead}
                            variant="outline"
                            size="sm"
                        >
                            Mark All as Read
                        </Button>
                    )}
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>
                        Your Notifications
                        {unreadCount > 0 && (
                            <Badge variant="destructive" className="ml-2">
                                {unreadCount} unread
                            </Badge>
                        )}
                    </CardTitle>
                    <CardDescription>
                        Stay updated with your sessions, messages, and important announcements
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading && page === 0 ? (
                        // Loading skeletons
                        <div className="space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="flex items-start space-x-4">
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <div className="space-y-2 flex-1">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-3/4" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : notifications.length > 0 ? (
                        <div className="space-y-6">
                            {Object.entries(groupedNotifications).map(([group, groupNotifications]) => (
                                <div key={group} className="space-y-2">
                                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                                        {getGroupTitle(group)}
                                    </h3>
                                    <div className="space-y-2">
                                        {groupNotifications.map((notification) => (
                                            <div
                                                key={notification.id}
                                                className={`p-4 rounded-md cursor-pointer hover:bg-gray-50 transition-colors ${notification.status === 'UNREAD' ? 'bg-blue-50' : ''
                                                    }`}
                                                onClick={() => handleNotificationClick(notification)}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div className="flex items-start space-x-2">
                                                        <div className="mt-1">
                                                            {getNotificationIcon(notification.type)}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-medium">
                                                                {notification.title}
                                                                {notification.status === 'UNREAD' && (
                                                                    <Badge variant="default" className="ml-2 text-xs">
                                                                        New
                                                                    </Badge>
                                                                )}
                                                            </h3>
                                                            <p className="text-gray-600 mt-1">{notification.content}</p>

                                                            {(notification.type === 'SESSION_SCHEDULED' ||
                                                                notification.type === 'SESSION_REMINDER') &&
                                                                notification.linkUrl && (
                                                                    <div className="mt-2">
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            className="mr-2"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                if (notification.linkUrl) {
                                                                                    navigate(notification.linkUrl);
                                                                                }
                                                                            }}
                                                                        >
                                                                            <i className="far fa-calendar-check mr-1"></i> View Session
                                                                        </Button>
                                                                    </div>
                                                                )}
                                                        </div>
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {formatDate(notification.createdAt)}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            {hasMore && (
                                <div className="flex justify-center mt-4">
                                    <Button
                                        onClick={loadMoreNotifications}
                                        variant="outline"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <i className="far fa-spinner-third fa-spin mr-2"></i>
                                                Loading...
                                            </>
                                        ) : (
                                            "Load More"
                                        )}
                                    </Button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                                <i className="far fa-bell-slash text-gray-500 text-xl"></i>
                            </div>
                            <h3 className="text-lg font-medium">No notifications yet</h3>
                            <p className="text-gray-500 mt-1">
                                {includeRead
                                    ? "You don't have any notifications yet"
                                    : "You don't have any unread notifications"
                                }
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default TutorNotifications;