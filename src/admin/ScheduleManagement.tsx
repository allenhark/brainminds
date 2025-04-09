import React, { useState } from 'react';
import HelmetComponent from '@/components/HelmetComponent';
type Session = {
    id: number;
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    tutor: string;
    student: string;
    subject: string;
    status: 'scheduled' | 'completed' | 'cancelled';
    notes?: string;
};

type Day = {
    date: Date;
    isCurrentMonth: boolean;
    isToday: boolean;
    sessions: Session[];
};

const ScheduleManagement: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedSession, setSelectedSession] = useState<Session | null>(null);
    const [viewType, setViewType] = useState<'month' | 'week' | 'day'>('month');

    // Helper function to generate days for the current month view
    const getDaysInMonth = (date: Date): Day[] => {
        const year = date.getFullYear();
        const month = date.getMonth();

        // Get the first day of the month
        const firstDayOfMonth = new Date(year, month, 1);
        const firstDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday, 1 = Monday, etc.

        // Get the number of days in the month
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Get the number of days in the previous month
        const daysInPrevMonth = new Date(year, month, 0).getDate();

        const days: Day[] = [];

        // Add days from the previous month
        for (let i = firstDayOfWeek - 1; i >= 0; i--) {
            const prevDate = new Date(year, month - 1, daysInPrevMonth - i);
            days.push({
                date: prevDate,
                isCurrentMonth: false,
                isToday: isSameDay(prevDate, new Date()),
                sessions: getSessionsForDay(prevDate)
            });
        }

        // Add days from the current month
        for (let i = 1; i <= daysInMonth; i++) {
            const currentDate = new Date(year, month, i);
            days.push({
                date: currentDate,
                isCurrentMonth: true,
                isToday: isSameDay(currentDate, new Date()),
                sessions: getSessionsForDay(currentDate)
            });
        }

        // Add days from the next month to complete the grid (6 rows x 7 columns = 42 cells)
        const remainingDays = 42 - days.length;
        for (let i = 1; i <= remainingDays; i++) {
            const nextDate = new Date(year, month + 1, i);
            days.push({
                date: nextDate,
                isCurrentMonth: false,
                isToday: isSameDay(nextDate, new Date()),
                sessions: getSessionsForDay(nextDate)
            });
        }

        return days;
    };

    // Helper function to check if two dates are the same day
    const isSameDay = (date1: Date, date2: Date): boolean => {
        return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
        );
    };

    // Sample sessions data
    const sessions: Session[] = [
        {
            id: 1,
            title: 'Mathematics Tutoring',
            date: '2023-05-15',
            startTime: '10:00',
            endTime: '11:00',
            tutor: 'John Smith',
            student: 'Emily Johnson',
            subject: 'Mathematics',
            status: 'completed'
        },
        {
            id: 2,
            title: 'Physics Tutoring',
            date: '2023-05-16',
            startTime: '14:00',
            endTime: '15:30',
            tutor: 'Sarah Parker',
            student: 'Michael Brown',
            subject: 'Physics',
            status: 'scheduled'
        },
        {
            id: 3,
            title: 'Chemistry Tutoring',
            date: '2023-05-17',
            startTime: '11:00',
            endTime: '12:00',
            tutor: 'David Wilson',
            student: 'Emma Davis',
            subject: 'Chemistry',
            status: 'scheduled'
        },
        {
            id: 4,
            title: 'Biology Tutoring',
            date: '2023-05-18',
            startTime: '13:00',
            endTime: '14:00',
            tutor: 'Jessica Lee',
            student: 'William Taylor',
            subject: 'Biology',
            status: 'scheduled'
        },
        {
            id: 5,
            title: 'English Literature Tutoring',
            date: '2023-05-15',
            startTime: '16:00',
            endTime: '17:00',
            tutor: 'Robert Miller',
            student: 'Olivia Wilson',
            subject: 'English Literature',
            status: 'cancelled',
            notes: 'Student had a family emergency'
        }
    ];

    // Helper function to get sessions for a specific day
    const getSessionsForDay = (date: Date): Session[] => {
        const dateString = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        return sessions.filter(session => session.date === dateString);
    };

    // Get days for the current month
    const days = getDaysInMonth(currentDate);

    // Handle month navigation
    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    // Handle day click
    const handleDayClick = (day: Day) => {
        setSelectedDate(day.date);
    };

    // Handle session click
    const handleSessionClick = (session: Session) => {
        setSelectedSession(session);
    };

    // Handle add session
    const handleAddSession = () => {
        alert('Open add session modal');
    };

    // Format date for display
    const formatMonthYear = (date: Date): string => {
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    // Format time for display
    const formatTime = (time: string): string => {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours, 10);
        const period = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${period}`;
    };

    // Get status color class
    const getStatusColorClass = (status: 'scheduled' | 'completed' | 'cancelled'): string => {
        switch (status) {
            case 'scheduled':
                return 'bg-blue-100 text-blue-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            <HelmetComponent
                title="Schedule Management"
                description="Schedule management for the admin"
            />

            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Schedule Management</h2>
                <div className="flex space-x-2">
                    <div className="inline-flex rounded-md shadow-sm">
                        <button
                            type="button"
                            className={`px-4 py-2 text-sm font-medium ${viewType === 'month'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                } rounded-l-md`}
                            onClick={() => setViewType('month')}
                        >
                            Month
                        </button>
                        <button
                            type="button"
                            className={`px-4 py-2 text-sm font-medium ${viewType === 'week'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 border-t border-b border-gray-300 hover:bg-gray-50'
                                }`}
                            onClick={() => setViewType('week')}
                        >
                            Week
                        </button>
                        <button
                            type="button"
                            className={`px-4 py-2 text-sm font-medium ${viewType === 'day'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                } rounded-r-md`}
                            onClick={() => setViewType('day')}
                        >
                            Day
                        </button>
                    </div>
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                        onClick={handleAddSession}
                    >
                        <i className="far fa-plus mr-2"></i> Add Session
                    </button>
                </div>
            </div>

            {/* Calendar View */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Calendar Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">{formatMonthYear(currentDate)}</h3>
                        <div className="flex space-x-2">
                            <button
                                type="button"
                                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                                onClick={handlePrevMonth}
                            >
                                <i className="far fa-chevron-left mr-1"></i>
                                Previous
                            </button>
                            <button
                                type="button"
                                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                                onClick={() => setCurrentDate(new Date())}
                            >
                                Today
                            </button>
                            <button
                                type="button"
                                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                                onClick={handleNextMonth}
                            >
                                Next
                                <i className="far fa-chevron-right ml-1"></i>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Month View */}
                {viewType === 'month' && (
                    <div className="bg-white">
                        {/* Day headers */}
                        <div className="grid grid-cols-7 gap-px border-b border-gray-200">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                <div key={day} className="py-2 text-center text-sm font-medium text-gray-500">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar grid */}
                        <div className="grid grid-cols-7 gap-px bg-gray-200">
                            {days.map((day, dayIdx) => (
                                <div
                                    key={dayIdx}
                                    className={`min-h-[120px] p-2 bg-white ${day.isToday ? 'bg-blue-50' : day.isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-500'
                                        } ${isSameDay(day.date, selectedDate || new Date(-1)) ? 'ring-2 ring-blue-600' : ''
                                        }`}
                                    onClick={() => handleDayClick(day)}
                                >
                                    <div className="flex justify-between">
                                        <span
                                            className={`text-sm font-medium ${day.isToday ? 'text-blue-600' : day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                                                }`}
                                        >
                                            {day.date.getDate()}
                                        </span>
                                        {day.sessions.length > 0 && (
                                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs text-blue-600">
                                                {day.sessions.length}
                                            </span>
                                        )}
                                    </div>
                                    <div className="mt-2 space-y-1 overflow-y-auto max-h-[80px]">
                                        {day.sessions.slice(0, 2).map((session) => (
                                            <div
                                                key={session.id}
                                                className={`px-2 py-1 text-xs rounded cursor-pointer ${getStatusColorClass(session.status)}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleSessionClick(session);
                                                }}
                                            >
                                                <div className="font-medium truncate">{session.title}</div>
                                                <div>{formatTime(session.startTime)} - {formatTime(session.endTime)}</div>
                                            </div>
                                        ))}
                                        {day.sessions.length > 2 && (
                                            <div className="text-xs text-gray-500 pl-2">
                                                +{day.sessions.length - 2} more
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Session Details */}
            {selectedSession && (
                <div className="bg-white rounded-lg p-5 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-medium text-gray-900">{selectedSession.title}</h3>
                        <div className="flex space-x-2">
                            <button
                                className="text-blue-600 hover:text-blue-900"
                                onClick={() => alert(`Edit session with ID: ${selectedSession.id}`)}
                            >
                                <i className="far fa-edit"></i>
                            </button>
                            <button
                                className="text-red-600 hover:text-red-900"
                                onClick={() => alert(`Delete session with ID: ${selectedSession.id}`)}
                            >
                                <i className="far fa-trash-alt"></i>
                            </button>
                            <button
                                className="text-gray-400 hover:text-gray-600"
                                onClick={() => setSelectedSession(null)}
                            >
                                <i className="far fa-times"></i>
                            </button>
                        </div>
                    </div>

                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Date</dt>
                            <dd className="mt-1 text-sm text-gray-900">
                                {new Date(selectedSession.date).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Time</dt>
                            <dd className="mt-1 text-sm text-gray-900">
                                {formatTime(selectedSession.startTime)} - {formatTime(selectedSession.endTime)}
                            </dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Tutor</dt>
                            <dd className="mt-1 text-sm text-gray-900">{selectedSession.tutor}</dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Student</dt>
                            <dd className="mt-1 text-sm text-gray-900">{selectedSession.student}</dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Subject</dt>
                            <dd className="mt-1 text-sm text-gray-900">{selectedSession.subject}</dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Status</dt>
                            <dd className="mt-1 text-sm">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColorClass(selectedSession.status)}`}>
                                    {selectedSession.status}
                                </span>
                            </dd>
                        </div>
                        {selectedSession.notes && (
                            <div className="sm:col-span-2">
                                <dt className="text-sm font-medium text-gray-500">Notes</dt>
                                <dd className="mt-1 text-sm text-gray-900">{selectedSession.notes}</dd>
                            </div>
                        )}
                    </dl>
                </div>
            )}
        </div>
    );
};

export default ScheduleManagement; 