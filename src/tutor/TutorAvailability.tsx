import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import Api, { tutorApi } from '@/Api';

interface AvailabilitySlot {
    day: string;
    startTime: string;
    endTime: string;
}

interface Session {
    id: number;
    startTime: string;
    endTime: string;
    status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
    studentId: number;
}

interface TutorProfile {
    timezone: string;
    lessonDuration: number;
}

const weekdays = [
    { value: 'Monday', label: 'Monday' },
    { value: 'Tuesday', label: 'Tuesday' },
    { value: 'Wednesday', label: 'Wednesday' },
    { value: 'Thursday', label: 'Thursday' },
    { value: 'Friday', label: 'Friday' },
    { value: 'Saturday', label: 'Saturday' },
    { value: 'Sunday', label: 'Sunday' },
];

const timeSlots = Array.from({ length: 24 * 4 }, (_, i) => {
    const hour = Math.floor(i / 4);
    const minute = (i % 4) * 15;
    const formattedHour = hour.toString().padStart(2, '0');
    const formattedMinute = minute.toString().padStart(2, '0');
    return `${formattedHour}:${formattedMinute}`;
});

const TutorAvailability: React.FC = () => {
    const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([]);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [tutorProfile, setTutorProfile] = useState<TutorProfile>({
        timezone: '',
        lessonDuration: 60
    });
    const [isLoading, setIsLoading] = useState(false);
    const [addSlotDialogOpen, setAddSlotDialogOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [slotForm, setSlotForm] = useState({
        day: '',
        startTime: '09:00',
        endTime: '17:00'
    });

    // Fetch tutor's availability and scheduled sessions
    useEffect(() => {
        setIsLoading(true);
        setErrorMessage('');

        const fetchData = async () => {
            try {
                const { data: user } = await Api.get('auth/me');

                if (!user) {
                    setErrorMessage('User ID not found. Please log in again.');
                    setIsLoading(false);
                    return;
                }

                // Fetch tutor profile to get availability and other profile details
                const tutorProfileResponse = await tutorApi.getTutorProfile(parseInt(user.id));

                // Store timezone and lesson duration
                setTutorProfile({
                    timezone: tutorProfileResponse.timezone || 'UTC',
                    lessonDuration: tutorProfileResponse.lessonDuration || 60
                });

                // Get schedule data
                const scheduleResponse = await Api.get('/tutor/sessions/schedule');
                setAvailabilitySlots(scheduleResponse.data);

                // Fetch upcoming sessions to check for conflicts
                const sessionsResponse = await Api.get('/tutor/sessions/schedule');
                setSessions(sessionsResponse.data);

                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching availability data:', error);
                setErrorMessage('Failed to load availability data. Please try again later.');
                setIsLoading(false);
                toast.error('Failed to load availability data');
            }
        };

        fetchData();
    }, []);

    const handleSlotFormChange = (field: string, value: string | boolean) => {
        setSlotForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Check if a new time slot conflicts with any booked sessions
    const checkSessionConflicts = (day: string, startTime: string, endTime: string): boolean => {
        for (const session of sessions) {
            const sessionDate = new Date(session.startTime);
            const sessionDay = sessionDate.toLocaleDateString('en-US', { weekday: 'long' });
            const sessionStartTime = sessionDate.toTimeString().substring(0, 5);
            const sessionEndTime = new Date(session.endTime).toTimeString().substring(0, 5);

            // For recurring slots, check day of week
            if (sessionDay === day &&
                ((startTime <= sessionStartTime && endTime > sessionStartTime) ||
                    (startTime < sessionEndTime && endTime >= sessionEndTime) ||
                    (startTime >= sessionStartTime && endTime <= sessionEndTime))) {
                return true;
            }
        }
        return false;
    };

    // Check if a new time slot overlaps with existing time slots on the same day
    const checkTimeSlotOverlap = (day: string, startTime: string, endTime: string): boolean => {
        // Filter slots for the given day
        const daySlots = availabilitySlots.filter(slot => slot.day === day);

        // Check for overlaps with any existing slot
        for (const slot of daySlots) {
            // Check if the new slot overlaps with this existing slot
            if ((startTime < slot.endTime && endTime > slot.startTime)) {
                return true;
            }
        }

        return false;
    };

    const handleAddSlot = async () => {
        // Validate form
        if (!slotForm.day || !slotForm.startTime || !slotForm.endTime) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (slotForm.startTime >= slotForm.endTime) {
            toast.error('End time must be after start time');
            return;
        }

        // Check for conflicts with booked sessions
        if (checkSessionConflicts(slotForm.day, slotForm.startTime, slotForm.endTime)) {
            toast.error('This time slot conflicts with a booked session');
            return;
        }

        // Check for overlaps with existing time slots
        if (checkTimeSlotOverlap(slotForm.day, slotForm.startTime, slotForm.endTime)) {
            toast.error('This time slot overlaps with an existing availability slot');
            return;
        }

        setIsLoading(true);

        try {
            const newSlot = {
                day: slotForm.day,
                startTime: slotForm.startTime,
                endTime: slotForm.endTime
            };

            // Add to local state first for immediate feedback
            const updatedSlots = [...availabilitySlots, newSlot];
            setAvailabilitySlots(updatedSlots);

            // Get the current user
            const { data: user } = await Api.get('auth/me');
            if (!user) {
                throw new Error('User ID not found');
            }

            // Send to the API using the schedule update with actual profile data
            await tutorApi.updateTutorSchedule(parseInt(user.id), {
                timezone: tutorProfile.timezone,
                lessonDuration: tutorProfile.lessonDuration,
                schedule: updatedSlots
            });

            setAddSlotDialogOpen(false);
            toast.success('Availability slot added successfully');

            // Reset form
            setSlotForm({
                day: '',
                startTime: '09:00',
                endTime: '17:00'
            });
        } catch (error) {
            console.error('Error adding availability slot:', error);
            toast.error('Failed to add availability slot');
            // Revert the optimistic update
            setAvailabilitySlots([...availabilitySlots]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteSlot = async (index: number) => {
        // Find the slot to check for conflicts
        const slotToDelete = availabilitySlots[index];
        if (!slotToDelete) return;

        // Check for conflicts with booked sessions
        if (checkSessionConflicts(slotToDelete.day, slotToDelete.startTime, slotToDelete.endTime)) {
            toast.error('Cannot delete a time slot that has booked sessions');
            return;
        }

        setIsLoading(true);

        try {
            // Update local state first for immediate feedback
            const updatedSlots = availabilitySlots.filter((_, i) => i !== index);
            setAvailabilitySlots(updatedSlots);

            // Get the current user
            const { data: user } = await Api.get('auth/me');
            if (!user) {
                throw new Error('User ID not found');
            }

            // Send to the API using the schedule update with actual profile data
            await tutorApi.updateTutorSchedule(parseInt(user.id), {
                timezone: tutorProfile.timezone,
                lessonDuration: tutorProfile.lessonDuration,
                schedule: updatedSlots
            });

            toast.success('Availability slot removed');
        } catch (error) {
            console.error('Error removing availability slot:', error);
            toast.error('Failed to remove availability slot');
            // Revert the optimistic update
            setAvailabilitySlots([...availabilitySlots]);
        } finally {
            setIsLoading(false);
        }
    };

    const formatTime = (time: string) => {
        const [hours, minutes] = time.split(':').map(Number);
        const date = new Date();
        date.setHours(hours, minutes, 0);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getDayLabel = (day: string) => {
        return weekdays.find(w => w.value === day)?.label || day;
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Availability Management</h1>
            </div>

            <p className="text-gray-500">
                Set your regular teaching hours. Students will only be able to book sessions during your available time slots.
            </p>

            {errorMessage && (
                <div className="bg-red-50 p-4 rounded-md text-red-800 mb-4">
                    {errorMessage}
                </div>
            )}

            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Weekly Schedule</h2>
                <Button onClick={() => setAddSlotDialogOpen(true)}>
                    <i className="far fa-plus mr-2"></i>
                    Add Time Slot
                </Button>
            </div>

            {isLoading && availabilitySlots.length === 0 ? (
                <div className="flex justify-center py-10">
                    <i className="far fa-spinner-third fa-spin text-2xl text-gray-400"></i>
                </div>
            ) : availabilitySlots.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                    {weekdays.map(day => {
                        const daySlots = availabilitySlots.filter(slot => slot.day === day.value);

                        return (
                            <Card key={day.value} className={daySlots.length > 0 ? 'border-blue-200' : ''}>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg">{day.label}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {daySlots.length > 0 ? (
                                        <div className="space-y-2">
                                            {daySlots.map((slot, index) => (
                                                <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded-md">
                                                    <div className="flex items-center">
                                                        <i className="far fa-clock text-blue-600 mr-2"></i>
                                                        <span>
                                                            {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                                                        </span>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        onClick={() => handleDeleteSlot(availabilitySlots.indexOf(slot))}
                                                    >
                                                        <i className="far fa-trash-alt"></i>
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-4 text-gray-500">
                                            Not available
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            ) : (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-10">
                        <i className="far fa-calendar-times text-5xl text-gray-300 mb-4"></i>
                        <p className="text-gray-500">No availability slots set</p>
                        <Button className="mt-4" onClick={() => setAddSlotDialogOpen(true)}>
                            Set Your Availability
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Add Availability Slot Dialog */}
            <Dialog open={addSlotDialogOpen} onOpenChange={setAddSlotDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add Availability Slot</DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="day">Day of Week</Label>
                            <Select
                                value={slotForm.day}
                                onValueChange={(value) => handleSlotFormChange('day', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select day" />
                                </SelectTrigger>
                                <SelectContent>
                                    {weekdays.map(day => (
                                        <SelectItem key={day.value} value={day.value}>
                                            {day.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="startTime">Start Time</Label>
                                <Select
                                    value={slotForm.startTime}
                                    onValueChange={(value) => handleSlotFormChange('startTime', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select time" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-[200px] overflow-y-auto">
                                        {timeSlots.map(time => (
                                            <SelectItem key={`start-${time}`} value={time}>
                                                {formatTime(time)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="endTime">End Time</Label>
                                <Select
                                    value={slotForm.endTime}
                                    onValueChange={(value) => handleSlotFormChange('endTime', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select time" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-[200px] overflow-y-auto">
                                        {timeSlots.map(time => (
                                            <SelectItem key={`end-${time}`} value={time}>
                                                {formatTime(time)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setAddSlotDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleAddSlot} disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <i className="far fa-spinner-third fa-spin mr-2"></i>
                                    Adding...
                                </>
                            ) : 'Add Slot'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default TutorAvailability; 