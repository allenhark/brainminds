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

interface AvailabilitySlot {
    id: number;
    day: string;
    startTime: string;
    endTime: string;
    isRecurring: boolean;
}

interface TimeBlock {
    id: number;
    date: string;
    startTime: string;
    endTime: string;
    type: 'available' | 'unavailable';
    note?: string;
}

const weekdays = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' },
];

const timeSlots = Array.from({ length: 24 * 4 }, (_, i) => {
    const hour = Math.floor(i / 4);
    const minute = (i % 4) * 15;
    const formattedHour = hour.toString().padStart(2, '0');
    const formattedMinute = minute.toString().padStart(2, '0');
    return `${formattedHour}:${formattedMinute}`;
});

const TutorAvailability: React.FC = () => {
    const [recurringSlots, setRecurringSlots] = useState<AvailabilitySlot[]>([]);
    const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [addSlotDialogOpen, setAddSlotDialogOpen] = useState(false);
    const [addBlockDialogOpen, setAddBlockDialogOpen] = useState(false);

    const [slotForm, setSlotForm] = useState({
        day: '',
        startTime: '09:00',
        endTime: '17:00',
        isRecurring: true
    });

    const [blockForm, setBlockForm] = useState({
        date: format(new Date(), 'yyyy-MM-dd'),
        startTime: '09:00',
        endTime: '17:00',
        type: 'available',
        note: ''
    });

    // Simulate fetching availability data
    useEffect(() => {
        setIsLoading(true);

        setTimeout(() => {
            setRecurringSlots([
                {
                    id: 1,
                    day: 'monday',
                    startTime: '09:00',
                    endTime: '12:00',
                    isRecurring: true
                },
                {
                    id: 2,
                    day: 'tuesday',
                    startTime: '13:00',
                    endTime: '17:00',
                    isRecurring: true
                },
                {
                    id: 3,
                    day: 'wednesday',
                    startTime: '10:00',
                    endTime: '15:00',
                    isRecurring: true
                },
                {
                    id: 4,
                    day: 'friday',
                    startTime: '09:00',
                    endTime: '12:00',
                    isRecurring: true
                },
                {
                    id: 5,
                    day: 'saturday',
                    startTime: '14:00',
                    endTime: '18:00',
                    isRecurring: true
                }
            ]);

            setTimeBlocks([
                {
                    id: 1,
                    date: '2023-04-10',
                    startTime: '09:00',
                    endTime: '12:00',
                    type: 'unavailable',
                    note: 'Doctor appointment'
                },
                {
                    id: 2,
                    date: '2023-04-15',
                    startTime: '14:00',
                    endTime: '18:00',
                    type: 'available',
                    note: 'Special availability for exam preparation'
                }
            ]);

            setIsLoading(false);
        }, 500);
    }, []);

    const handleSlotFormChange = (field: string, value: string | boolean) => {
        setSlotForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleBlockFormChange = (field: string, value: string) => {
        setBlockForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleAddSlot = () => {
        // Validate form
        if (!slotForm.day || !slotForm.startTime || !slotForm.endTime) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (slotForm.startTime >= slotForm.endTime) {
            toast.error('End time must be after start time');
            return;
        }

        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            const newSlot = {
                id: recurringSlots.length + 1,
                ...slotForm
            };

            setRecurringSlots([...recurringSlots, newSlot]);
            setAddSlotDialogOpen(false);
            setIsLoading(false);
            toast.success('Availability slot added successfully');

            // Reset form
            setSlotForm({
                day: '',
                startTime: '09:00',
                endTime: '17:00',
                isRecurring: true
            });
        }, 500);
    };

    const handleAddBlock = () => {
        // Validate form
        if (!blockForm.date || !blockForm.startTime || !blockForm.endTime) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (blockForm.startTime >= blockForm.endTime) {
            toast.error('End time must be after start time');
            return;
        }

        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            const newBlock = {
                id: timeBlocks.length + 1,
                ...blockForm
            };

            setTimeBlocks([...timeBlocks, newBlock]);
            setAddBlockDialogOpen(false);
            setIsLoading(false);
            toast.success('Time block added successfully');

            // Reset form
            setBlockForm({
                date: format(new Date(), 'yyyy-MM-dd'),
                startTime: '09:00',
                endTime: '17:00',
                type: 'available',
                note: ''
            });
        }, 500);
    };

    const handleDeleteSlot = (id: number) => {
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setRecurringSlots(recurringSlots.filter(slot => slot.id !== id));
            setIsLoading(false);
            toast.success('Availability slot removed');
        }, 500);
    };

    const handleDeleteBlock = (id: number) => {
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setTimeBlocks(timeBlocks.filter(block => block.id !== id));
            setIsLoading(false);
            toast.success('Time block removed');
        }, 500);
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

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return format(date, 'MMM d, yyyy');
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Availability Management</h1>
            </div>

            <p className="text-gray-500">
                Set your regular teaching hours and manage exceptions to your schedule.
                Students will only be able to book sessions during your available time slots.
            </p>

            <Tabs defaultValue="recurring" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="recurring">
                        Weekly Schedule
                    </TabsTrigger>
                    <TabsTrigger value="exceptions">
                        Exceptions
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="recurring">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-medium">Weekly Availability</h2>
                        <Button onClick={() => setAddSlotDialogOpen(true)}>
                            <i className="far fa-plus mr-2"></i>
                            Add Time Slot
                        </Button>
                    </div>

                    {isLoading && recurringSlots.length === 0 ? (
                        <div className="flex justify-center py-10">
                            <i className="far fa-spinner-third fa-spin text-2xl text-gray-400"></i>
                        </div>
                    ) : recurringSlots.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4">
                            {weekdays.map(day => {
                                const daySlots = recurringSlots.filter(slot => slot.day === day.value);

                                return (
                                    <Card key={day.value} className={daySlots.length > 0 ? 'border-blue-200' : ''}>
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-lg">{day.label}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            {daySlots.length > 0 ? (
                                                <div className="space-y-2">
                                                    {daySlots.map(slot => (
                                                        <div key={slot.id} className="flex items-center justify-between p-2 bg-blue-50 rounded-md">
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
                                                                onClick={() => handleDeleteSlot(slot.id)}
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
                </TabsContent>

                <TabsContent value="exceptions">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-medium">Schedule Exceptions</h2>
                        <Button onClick={() => setAddBlockDialogOpen(true)}>
                            <i className="far fa-plus mr-2"></i>
                            Add Exception
                        </Button>
                    </div>

                    {isLoading && timeBlocks.length === 0 ? (
                        <div className="flex justify-center py-10">
                            <i className="far fa-spinner-third fa-spin text-2xl text-gray-400"></i>
                        </div>
                    ) : timeBlocks.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4">
                            {timeBlocks.map(block => (
                                <Card
                                    key={block.id}
                                    className={block.type === 'available' ? 'border-green-200' : 'border-red-200'}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="flex items-center">
                                                    <i className={`far fa-calendar-${block.type === 'available' ? 'plus text-green-600' : 'minus text-red-600'} mr-2`}></i>
                                                    <h3 className="font-medium">{formatDate(block.date)}</h3>
                                                </div>

                                                <div className="mt-1 text-gray-600">
                                                    {formatTime(block.startTime)} - {formatTime(block.endTime)}
                                                </div>

                                                {block.note && (
                                                    <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                                                        {block.note}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${block.type === 'available'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {block.type === 'available' ? 'Available' : 'Unavailable'}
                                                </span>

                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => handleDeleteBlock(block.id)}
                                                >
                                                    <i className="far fa-trash-alt"></i>
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-10">
                                <i className="far fa-calendar-alt text-5xl text-gray-300 mb-4"></i>
                                <p className="text-gray-500">No schedule exceptions set</p>
                                <Button className="mt-4" onClick={() => setAddBlockDialogOpen(true)}>
                                    Add Exception
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>

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

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="isRecurring"
                                checked={slotForm.isRecurring}
                                onCheckedChange={(checked) =>
                                    handleSlotFormChange('isRecurring', checked === true)
                                }
                            />
                            <Label htmlFor="isRecurring">Repeat weekly</Label>
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

            {/* Add Time Block Dialog */}
            <Dialog open={addBlockDialogOpen} onOpenChange={setAddBlockDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add Schedule Exception</DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="date">Date</Label>
                            <input
                                type="date"
                                id="date"
                                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                value={blockForm.date}
                                onChange={(e) => handleBlockFormChange('date', e.target.value)}
                                min={format(new Date(), 'yyyy-MM-dd')}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="startTime">Start Time</Label>
                                <Select
                                    value={blockForm.startTime}
                                    onValueChange={(value) => handleBlockFormChange('startTime', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select time" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-[200px] overflow-y-auto">
                                        {timeSlots.map(time => (
                                            <SelectItem key={`block-start-${time}`} value={time}>
                                                {formatTime(time)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="endTime">End Time</Label>
                                <Select
                                    value={blockForm.endTime}
                                    onValueChange={(value) => handleBlockFormChange('endTime', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select time" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-[200px] overflow-y-auto">
                                        {timeSlots.map(time => (
                                            <SelectItem key={`block-end-${time}`} value={time}>
                                                {formatTime(time)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="type">Type</Label>
                            <Select
                                value={blockForm.type}
                                onValueChange={(value) => handleBlockFormChange('type', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="available">Available (Extra Hours)</SelectItem>
                                    <SelectItem value="unavailable">Unavailable (Time Off)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="note">Note (Optional)</Label>
                            <textarea
                                id="note"
                                className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Add a note about this exception"
                                value={blockForm.note}
                                onChange={(e) => handleBlockFormChange('note', e.target.value)}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setAddBlockDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleAddBlock} disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <i className="far fa-spinner-third fa-spin mr-2"></i>
                                    Adding...
                                </>
                            ) : 'Add Exception'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default TutorAvailability; 