import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Api from "@/Api";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { url } from "@/config";
import HelmetComponent from "@/components/HelmetComponent";

// Types definition based on Prisma schema
interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    role: "STUDENT" | "TUTOR" | "ADMIN";
    status: "ACTIVE" | "INACTIVE" | "PENDING_VERIFICATION";
    avatar: string | null;
    language: string | null;
    createdAt: string;
    updatedAt: string;
}

interface Subscription {
    id: number;
    status: "ACTIVE" | "EXPIRED" | "CANCELED" | "PENDING";
    startDate: string;
    endDate: string;
    amount: number;
    paymentMethod: string | null;
    paymentId: string | null;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
}

interface Session {
    id: number;
    startTime: string;
    endTime: string;
    status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
    notes: string | null;
    classLink: string | null;
    tutor: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        avatar: string | null;
    };
}

interface ChatRoom {
    id: number;
    tutor: {
        id: number;
        firstName: string;
        lastName: string;
        avatar: string | null;
    };
    lastMessageAt: string | null;
    lastMessagePreview: string | null;
}

interface TutorEnrollment {
    id: number;
    tutor: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        avatar: string | null;
    };
    status: string;
    message: string | null;
    startDate: string | null;
    isActive: boolean;
}

interface Student extends User {
    subscription: Subscription | null;
    studentSessions: Session[];
    studentChats: ChatRoom[];
    enrolledWith: TutorEnrollment[];
}

// Add a new interface for tutor availability
interface AvailabilitySlot {
    day: string;
    startTime: string;
    endTime: string;
}

interface TutorAvailability {
    availability: AvailabilitySlot[];
    timezone: string;
}

const StudentView: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [student, setStudent] = useState<Student | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Dialog states
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
    const [isSubscriptionDialogOpen, setIsSubscriptionDialogOpen] = useState(false);
    const [isAssignTutorDialogOpen, setIsAssignTutorDialogOpen] = useState(false);
    const [isSessionDialogOpen, setIsSessionDialogOpen] = useState(false);
    const [selectedSession, setSelectedSession] = useState<Session | null>(null);

    // List states
    const [availableTutors, setAvailableTutors] = useState<any[]>([]);
    const [selectedTutor, setSelectedTutor] = useState<string>("");
    const [assignMessage, setAssignMessage] = useState<string>("");
    const [removeTutorId, setRemoveTutorId] = useState<number | null>(null);
    const [removeTutorDialogOpen, setRemoveTutorDialogOpen] = useState(false);
    const [removeReason, setRemoveReason] = useState<string>("");

    // Subscription state
    const [subscriptionMonths, setSubscriptionMonths] = useState(1);
    const [newPassword, setNewPassword] = useState("");

    // Add state for tutor availability
    const [tutorAvailability, setTutorAvailability] = useState<TutorAvailability | null>(null);
    const [availabilityLoading, setAvailabilityLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [timeSlots, setTimeSlots] = useState<{ start: string, end: string }[]>([]);
    const [dateError, setDateError] = useState<string | null>(null);

    // Add new state variables for tutor search
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [searchLoading, setSearchLoading] = useState<boolean>(false);
    const [searchError, setSearchError] = useState<string | null>(null);

    // Form for editing student info
    const studentForm = useForm({
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            language: "",
            status: "ACTIVE" as "ACTIVE" | "INACTIVE" | "PENDING_VERIFICATION",
        },
    });

    // Form for editing session
    const sessionForm = useForm({
        defaultValues: {
            startTime: "",
            endTime: "",
            tutorId: "",
            notes: "",
            classLink: "",
            status: "SCHEDULED" as "SCHEDULED" | "COMPLETED" | "CANCELLED",
        },
    });

    // Add debounce function for search
    const debounce = (fn: Function, ms = 300) => {
        let timeoutId: ReturnType<typeof setTimeout>;
        return function (this: any, ...args: any[]) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn.apply(this, args), ms);
        };
    };

    // Add search tutors function
    const searchTutors = async (query: string) => {
        if (!query || query.trim() === '') {
            setSearchResults([]);
            return;
        }

        setSearchLoading(true);
        setSearchError(null);

        try {
            const response = await Api.get(`/admin/tutors/search?query=${encodeURIComponent(query)}`);
            setSearchResults(response.data.data || []);
        } catch (error) {
            console.error("Failed to search tutors:", error);
            setSearchError("Failed to search tutors. Please try again.");
            setSearchResults([]);
        } finally {
            setSearchLoading(false);
        }
    };

    // Create debounced search function
    const debouncedSearch = useCallback(
        debounce((query: string) => searchTutors(query)),
        []
    );

    // Handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
        debouncedSearch(value);
    };

    // Handle tutor selection from search results
    const handleSelectTutor = (tutor: any) => {
        setSelectedTutor(tutor.id.toString());
        setSearchQuery("");
        setSearchResults([]);
    };

    // Fetch student data
    useEffect(() => {
        const fetchStudent = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await Api.get(`/admin/students/${id}`);
                setStudent(response.data.data);

                // Pre-fill student form with current data
                if (response.data.data) {
                    const studentData = response.data.data;
                    studentForm.reset({
                        firstName: studentData.firstName,
                        lastName: studentData.lastName,
                        email: studentData.email,
                        phone: studentData.phone || "",
                        language: studentData.language || "en",
                        status: studentData.status,
                    });
                }
            } catch (error) {
                console.error("Failed to fetch student:", error);
                setError("Failed to load student data. Please try again later.");
                toast.error("Failed to load student data");
            } finally {
                setLoading(false);
            }
        };

        fetchStudent();
    }, [id]);

    // Fetch available tutors
    const fetchAvailableTutors = async () => {
        try {
            if (selectedTutor) {
                // Fetch specific tutor details if we have a selected tutor
                const response = await Api.get(`/admin/tutors/${selectedTutor}`);
                if (response.data) {
                    setAvailableTutors([response.data]);
                }
            } else {
                // Fetch all tutors if no tutor is selected
                const response = await Api.get("/admin/tutors");
                setAvailableTutors(response.data || []);
            }
        } catch (error) {
            console.error("Failed to fetch tutors:", error);
            toast.error("Failed to load tutors");
        }
    };

    // Update student info
    const handleUpdateStudent = async (data: any) => {
        try {
            await Api.put(`/admin/students/${id}`, data);
            toast.success("Student information updated successfully");
            setIsEditDialogOpen(false);

            // Refresh student data
            const response = await Api.get(`/admin/students/${id}`);
            setStudent(response.data.data);
        } catch (error) {
            console.error("Failed to update student:", error);
            toast.error("Failed to update student information");
        }
    };

    // Update student password
    const handleUpdatePassword = async () => {
        try {
            if (!newPassword || newPassword.length < 6) {
                toast.error("Password must be at least 6 characters long");
                return;
            }

            await Api.put(`/admin/students/${id}/password`, { password: newPassword });
            toast.success("Password updated successfully");
            setIsPasswordDialogOpen(false);
            setNewPassword("");
        } catch (error) {
            console.error("Failed to update password:", error);
            toast.error("Failed to update password");
        }
    };

    // Add subscription
    const handleAddSubscription = async () => {
        try {
            const expiryDate = new Date();
            expiryDate.setMonth(expiryDate.getMonth() + subscriptionMonths);

            await Api.post(`/admin/students/${id}/subscription`, {
                plan: "STANDARD",
                startDate: new Date().toISOString(),
                endDate: expiryDate.toISOString(),
            });

            toast.success("Subscription added successfully");
            setIsSubscriptionDialogOpen(false);

            // Refresh student data
            const response = await Api.get(`/admin/students/${id}`);
            setStudent(response.data.data);
        } catch (error) {
            console.error("Failed to add subscription:", error);
            toast.error("Failed to add subscription");
        }
    };

    // Cancel subscription
    const handleCancelSubscription = async () => {
        try {
            await Api.delete(`/admin/students/${id}/subscription`);
            toast.success("Subscription cancelled successfully");

            // Refresh student data
            const response = await Api.get(`/admin/students/${id}`);
            setStudent(response.data.data);
        } catch (error) {
            console.error("Failed to cancel subscription:", error);
            toast.error("Failed to cancel subscription");
        }
    };

    // Assign tutor to student
    const handleAssignTutor = async () => {
        try {
            if (!selectedTutor) {
                toast.error("Please select a tutor");
                return;
            }

            await Api.post(`/admin/students/${id}/tutors/${selectedTutor}`, {
                message: assignMessage,
            });

            toast.success("Tutor assigned successfully");
            setIsAssignTutorDialogOpen(false);
            setSelectedTutor("");
            setAssignMessage("");

            // Refresh student data
            const response = await Api.get(`/admin/students/${id}`);
            setStudent(response.data.data);
        } catch (error) {
            console.error("Failed to assign tutor:", error);
            toast.error("Failed to assign tutor");
        }
    };

    // Remove tutor from student
    const handleRemoveTutor = async () => {
        try {
            if (!removeTutorId) return;

            await Api.delete(`/admin/students/${id}/tutors/${removeTutorId}`, {
                data: { reason: removeReason },
            });

            toast.success("Tutor removed successfully");
            setRemoveTutorDialogOpen(false);
            setRemoveTutorId(null);
            setRemoveReason("");

            // Refresh student data
            const response = await Api.get(`/admin/students/${id}`);
            setStudent(response.data.data);
        } catch (error) {
            console.error("Failed to remove tutor:", error);
            toast.error("Failed to remove tutor");
        }
    };

    // Fetch tutor availability
    const fetchTutorAvailability = async (tutorId: string, date?: string) => {
        try {
            setAvailabilityLoading(true);
            const response = await Api.get(`/admin/tutors/${tutorId}/schedule`);
            setTutorAvailability(response.data);

            if (date) {
                generateTimeSlotsForDate(date, response.data.availability);
            }
        } catch (error) {
            console.error("Failed to fetch tutor availability:", error);
            toast.error("Failed to load tutor availability");
        } finally {
            setAvailabilityLoading(false);
        }
    };

    // Generate time slots based on tutor's availability for a specific date
    const generateTimeSlotsForDate = (date: string, availability: AvailabilitySlot[]) => {
        const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

        // Find slots for the selected day
        const daySlots = availability.filter(slot =>
            slot.day.toLowerCase() === dayOfWeek
        );

        if (daySlots.length === 0) {
            setTimeSlots([]);
            setDateError(`The tutor is not available on ${dayOfWeek}s`);
            return;
        }

        setDateError(null);

        // Convert availability slots to actual time slots in 30-minute increments
        const slots: { start: string, end: string }[] = [];

        daySlots.forEach(slot => {
            const [startHour, startMinute] = slot.startTime.split(':').map(Number);
            const [endHour, endMinute] = slot.endTime.split(':').map(Number);

            const startDate = new Date(date);
            startDate.setHours(startHour, startMinute, 0, 0);

            const endDate = new Date(date);
            endDate.setHours(endHour, endMinute, 0, 0);

            // Create 30-minute slots
            let currentSlotStart = new Date(startDate);
            while (currentSlotStart < endDate) {
                const currentSlotEnd = new Date(currentSlotStart);
                currentSlotEnd.setMinutes(currentSlotEnd.getMinutes() + 30);

                if (currentSlotEnd <= endDate) {
                    slots.push({
                        start: currentSlotStart.toISOString(),
                        end: currentSlotEnd.toISOString()
                    });
                }

                currentSlotStart = new Date(currentSlotEnd);
            }
        });

        setTimeSlots(slots);
    };

    // Handle date change when editing session
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const dateValue = e.target.value;
        setSelectedDate(dateValue);

        if (dateValue && sessionForm.getValues("tutorId")) {
            generateTimeSlotsForDate(dateValue, tutorAvailability?.availability || []);
        }
    };

    // Handle tutor change when editing session
    const handleTutorChange = (tutorId: string) => {
        sessionForm.setValue("tutorId", tutorId);

        if (tutorId) {
            fetchTutorAvailability(tutorId, selectedDate);
        }
    };

    // Handle session edit
    const handleEditSession = (session: Session) => {
        setSelectedSession(session);

        // Format date strings for datetime-local input
        const startDateTime = new Date(session.startTime);
        const endDateTime = new Date(session.endTime);

        const startDate = startDateTime.toISOString().split('T')[0];
        const startTime = startDateTime.toISOString().slice(11, 16);
        const endTime = endDateTime.toISOString().slice(11, 16);

        setSelectedDate(startDate);

        sessionForm.reset({
            startTime: startDateTime.toISOString().slice(0, 16),
            endTime: endDateTime.toISOString().slice(0, 16),
            tutorId: session.tutor.id.toString(),
            notes: session.notes || "",
            classLink: session.classLink || "",
            status: session.status,
        });

        // Fetch tutor availability
        fetchTutorAvailability(session.tutor.id.toString(), startDate);

        setIsSessionDialogOpen(true);
    };

    // Update session
    const handleUpdateSession = async (data: any) => {
        try {
            if (!selectedSession) return;

            await Api.put(`/admin/students/sessions/${selectedSession.id}`, data);
            toast.success("Session updated successfully");
            setIsSessionDialogOpen(false);

            // Refresh student data
            const response = await Api.get(`/admin/students/${id}`);
            setStudent(response.data.data);
        } catch (error) {
            console.error("Failed to update session:", error);
            toast.error("Failed to update session");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <div className="text-red-500 mb-4">{error}</div>
                <Button onClick={() => navigate("/admin/students")}>Back to Students</Button>
            </div>
        );
    }

    if (!student) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <div className="text-red-500 mb-4">Student not found</div>
                <Button onClick={() => navigate("/admin/students")}>Back to Students</Button>
            </div>
        );
    }

    return (
        <div className="p-6">
            <HelmetComponent
                title={`${student?.firstName} ${student?.lastName} - Student Details`}
                description={`View and manage details for ${student?.firstName} ${student?.lastName}`}
            />

            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" onClick={() => navigate("/admin/students")}>
                        <i className="fas fa-arrow-left mr-2"></i>
                        Back
                    </Button>
                    <h1 className="text-2xl font-bold">Student Details</h1>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsEditDialogOpen(true)}>
                        <i className="fas fa-edit mr-2"></i>
                        Edit Profile
                    </Button>
                    <Button variant="outline" onClick={() => setIsPasswordDialogOpen(true)}>
                        <i className="fas fa-key mr-2"></i>
                        Change Password
                    </Button>
                </div>
            </div>

            {/* Student Summary Card */}
            <Card className="mb-6">
                <CardHeader className="pb-2">
                    <div className="flex justify-between">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-20 w-20">
                                <AvatarImage src={student.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.email}`} />
                                <AvatarFallback>{student.firstName[0]}{student.lastName[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle className="text-2xl">{student.firstName} {student.lastName}</CardTitle>
                                <CardDescription className="text-lg">
                                    <div className="flex items-center gap-2">
                                        <i className="fas fa-envelope text-gray-500"></i>
                                        {student.email}
                                    </div>
                                    {student.phone && (
                                        <div className="flex items-center gap-2">
                                            <i className="fas fa-phone text-gray-500"></i>
                                            {student.phone}
                                        </div>
                                    )}
                                </CardDescription>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <Badge className={badgeVariants({ variant: student.status === "ACTIVE" ? "default" : student.status === "INACTIVE" ? "destructive" : "outline" })}>
                                {student.status}
                            </Badge>
                            <div className="text-sm text-gray-500">Joined {new Date(student.createdAt).toLocaleDateString()}</div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-between items-center mt-4">
                        <div className="flex gap-4">
                            <div className="text-center border rounded p-3 min-w-[100px]">
                                <div className="text-2xl font-bold">{student.studentSessions?.length || 0}</div>
                                <div className="text-sm text-gray-500">Total Sessions</div>
                            </div>
                            <div className="text-center border rounded p-3 min-w-[100px]">
                                <div className="text-2xl font-bold">
                                    {student.studentSessions?.filter(s => s.status === "COMPLETED").length || 0}
                                </div>
                                <div className="text-sm text-gray-500">Completed</div>
                            </div>
                            <div className="text-center border rounded p-3 min-w-[100px]">
                                <div className="text-2xl font-bold">
                                    {student.enrolledWith?.length || 0}
                                </div>
                                <div className="text-sm text-gray-500">Active Tutors</div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 items-end">
                            <div className="mb-2">
                                {student.subscription ? (
                                    <div className="border p-3 rounded-lg">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Badge className={badgeVariants({
                                                variant: student.subscription.status === "ACTIVE" ? "default" :
                                                    student.subscription.status === "EXPIRED" ? "destructive" : "outline"
                                            })} style={{ color: 'white' }}>
                                                {student.subscription.status}
                                            </Badge>
                                            <div className="text-sm text-gray-500">
                                                Expires: {new Date(student.subscription.endDate).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={handleCancelSubscription}
                                            disabled={student.subscription.status !== "ACTIVE"}
                                        >
                                            Cancel Subscription
                                        </Button>
                                    </div>
                                ) : (
                                    <Button onClick={() => {
                                        setSubscriptionMonths(1);
                                        setIsSubscriptionDialogOpen(true);
                                    }}>
                                        <i className="fas fa-plus mr-2"></i>
                                        Add Subscription
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Main Content Tabs */}
            <Tabs defaultValue="sessions" className="mt-6">
                <TabsList className="mb-4">
                    <TabsTrigger value="sessions">Sessions</TabsTrigger>
                    <TabsTrigger value="tutors">Tutors</TabsTrigger>
                </TabsList>

                {/* Sessions Tab */}
                <TabsContent value="sessions">
                    <Card>
                        <CardHeader>
                            <CardTitle>Sessions</CardTitle>
                            <CardDescription>Manage student's learning sessions</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {student.studentSessions && student.studentSessions.length > 0 ? (
                                <div className="max-h-[50vh] overflow-y-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 sticky top-0">
                                            <tr>
                                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Date</th>
                                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Time</th>
                                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Tutor</th>
                                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Status</th>
                                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Class Link</th>
                                                <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {student.studentSessions.map((session) => (
                                                <tr key={session.id} className="border-b">
                                                    <td className="px-4 py-2 text-sm">
                                                        {new Date(session.startTime).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-4 py-2 text-sm">
                                                        {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                                                        {new Date(session.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </td>
                                                    <td className="px-4 py-2 text-sm">
                                                        <div className="flex items-center gap-2">
                                                            <Avatar className="h-6 w-6">
                                                                <AvatarImage src={`${url}/${session.tutor.avatar}`} />
                                                                <AvatarFallback>{session.tutor.firstName[0]}{session.tutor.lastName[0]}</AvatarFallback>
                                                            </Avatar>
                                                            {session.tutor.firstName} {session.tutor.lastName}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-2 text-sm">
                                                        <Badge className={`  ${badgeVariants({
                                                            variant: session.status === "COMPLETED" ? "default" :
                                                                session.status === "CANCELLED" ? "destructive" : "outline"
                                                        })}`}
                                                            style={{ color: 'white' }}
                                                        >
                                                            {session.status}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-4 py-2 text-sm">
                                                        {session.classLink ? (
                                                            <a href={session.classLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                                                <i className="fas fa-video mr-1"></i> Join
                                                            </a>
                                                        ) : (
                                                            <span className="text-gray-400">No link</span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-2 text-right">
                                                        <Button variant="ghost" size="sm" onClick={() => handleEditSession(session)}>
                                                            <i className="fas fa-edit text-blue-500"></i>
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    No sessions found for this student
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tutors Tab */}
                <TabsContent value="tutors">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Assigned Tutors</CardTitle>
                                <CardDescription>Manage student's tutors and assignments</CardDescription>
                            </div>
                            <Button onClick={() => {
                                fetchAvailableTutors();
                                setIsAssignTutorDialogOpen(true);
                            }}>
                                <i className="fas fa-plus mr-2"></i>
                                Assign New Tutor
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {student.enrolledWith && student.enrolledWith.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {student.enrolledWith.map((enrollment) => (
                                        <Card key={enrollment.id}>
                                            <CardHeader className="pb-2">
                                                <div className="flex justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <Avatar>
                                                            <AvatarImage src={enrollment.tutor.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${enrollment.tutor.email}`} />
                                                            <AvatarFallback>{enrollment.tutor.firstName[0]}{enrollment.tutor.lastName[0]}</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <CardTitle>{enrollment.tutor.firstName} {enrollment.tutor.lastName}</CardTitle>
                                                            <CardDescription>{enrollment.tutor.email}</CardDescription>
                                                        </div>
                                                    </div>
                                                    <Badge variant="outline">{enrollment.status}</Badge>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="pt-2">
                                                {enrollment.message && (
                                                    <div className="text-sm text-gray-600 mb-2">{enrollment.message}</div>
                                                )}
                                                {enrollment.startDate && (
                                                    <div className="text-sm text-gray-500">
                                                        Assigned on {new Date(enrollment.startDate).toLocaleDateString()}
                                                    </div>
                                                )}
                                            </CardContent>
                                            <CardFooter className="flex justify-end">
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => {
                                                        setRemoveTutorId(enrollment.tutor.id);
                                                        setRemoveTutorDialogOpen(true);
                                                    }}
                                                >
                                                    Remove Tutor
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    No tutors assigned to this student
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Edit Student Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Student Profile</DialogTitle>
                        <DialogDescription>
                            Update the student's information
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...studentForm}>
                        <form onSubmit={studentForm.handleSubmit(handleUpdateStudent)} className="space-y-4">
                            <FormField
                                control={studentForm.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>First Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={studentForm.control}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Last Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={studentForm.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="email" />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={studentForm.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={studentForm.control}
                                name="language"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Preferred Language</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select language" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="en">English</SelectItem>
                                                <SelectItem value="zh">Chinese</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={studentForm.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="ACTIVE">Active</SelectItem>
                                                <SelectItem value="INACTIVE">Inactive</SelectItem>
                                                <SelectItem value="PENDING_VERIFICATION">Pending Verification</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <Button type="submit">Save Changes</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Password Change Dialog */}
            <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Change Password</DialogTitle>
                        <DialogDescription>
                            Set a new password for this student
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label htmlFor="new-password" className="text-sm font-medium">
                                New Password
                            </label>
                            <Input
                                id="new-password"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new password"
                            />
                            <p className="text-sm text-gray-500">
                                Password must be at least 6 characters long
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleUpdatePassword}>Update Password</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add Subscription Dialog */}
            <Dialog open={isSubscriptionDialogOpen} onOpenChange={setIsSubscriptionDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add Subscription</DialogTitle>
                        <DialogDescription>
                            Add a subscription plan for this student
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label htmlFor="subscription-months" className="text-sm font-medium">
                                Subscription Period
                            </label>
                            <Select
                                value={subscriptionMonths.toString()}
                                onValueChange={(value) => setSubscriptionMonths(parseInt(value))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select months" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">1 Month (¥13,000)</SelectItem>
                                    <SelectItem value="3">3 Months (¥39,000)</SelectItem>
                                    <SelectItem value="6">6 Months (¥78,000)</SelectItem>
                                    <SelectItem value="12">12 Months (¥156,000)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="pt-2">
                            <div className="text-sm font-medium">Total Amount</div>
                            <div className="text-2xl font-bold">
                                ¥{(subscriptionMonths * 13000).toLocaleString()}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleAddSubscription}>Add Subscription</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Assign Tutor Dialog */}
            <Dialog open={isAssignTutorDialogOpen} onOpenChange={setIsAssignTutorDialogOpen}>
                <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader>
                        <DialogTitle>Assign Tutor</DialogTitle>
                        <DialogDescription>
                            Search and assign a tutor to this student
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label htmlFor="tutor-search" className="text-sm font-medium">
                                Search Tutor
                            </label>
                            <div className="relative">
                                <Input
                                    id="tutor-search"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    placeholder="Search by name or email"
                                    className="pr-10"
                                />
                                {searchLoading && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <div className="animate-spin h-4 w-4 border-2 border-gray-500 rounded-full border-t-transparent"></div>
                                    </div>
                                )}
                            </div>
                            {searchError && <p className="text-sm text-red-500">{searchError}</p>}

                            {/* Search Results */}
                            {searchResults.length > 0 && (
                                <div className="mt-2 max-h-48 overflow-y-auto rounded-md border border-gray-200 bg-white shadow-sm">
                                    {searchResults.map((tutor) => (
                                        <div
                                            key={tutor.id}
                                            className="flex items-center justify-between border-b border-gray-100 px-3 py-2 hover:bg-gray-50 cursor-pointer"
                                            onClick={() => handleSelectTutor(tutor)}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={tutor.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${tutor.email}`} />
                                                    <AvatarFallback>{tutor.firstName[0]}{tutor.lastName[0]}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="text-sm font-medium">{tutor.firstName} {tutor.lastName}</div>
                                                    <div className="text-xs text-gray-500">{tutor.email}</div>
                                                </div>
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {tutor.rating ? (
                                                    <div className="flex items-center">
                                                        <i className="fas fa-star text-yellow-400 mr-1"></i>
                                                        <span>{tutor.rating.toFixed(1)}</span>
                                                    </div>
                                                ) : (
                                                    <span>No ratings</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {selectedTutor && (
                            <>
                                <div className="space-y-2">
                                    <label htmlFor="selected-tutor" className="text-sm font-medium">
                                        Selected Tutor
                                    </label>
                                    <div className="p-3 border rounded-md">
                                        {availableTutors.find(t => t.id.toString() === selectedTutor) ? (
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage
                                                        src={
                                                            availableTutors.find(t => t.id.toString() === selectedTutor)?.avatar ||
                                                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${availableTutors.find(t => t.id.toString() === selectedTutor)?.email}`
                                                        }
                                                    />
                                                    <AvatarFallback>
                                                        {availableTutors.find(t => t.id.toString() === selectedTutor)?.firstName[0]}
                                                        {availableTutors.find(t => t.id.toString() === selectedTutor)?.lastName[0]}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium">
                                                        {availableTutors.find(t => t.id.toString() === selectedTutor)?.firstName}{' '}
                                                        {availableTutors.find(t => t.id.toString() === selectedTutor)?.lastName}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {availableTutors.find(t => t.id.toString() === selectedTutor)?.email}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-gray-500">Loading tutor information...</div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="assign-message" className="text-sm font-medium">
                                        Message (Optional)
                                    </label>
                                    <Textarea
                                        id="assign-message"
                                        value={assignMessage}
                                        onChange={(e) => setAssignMessage(e.target.value)}
                                        placeholder="Add a message about this assignment"
                                    />
                                </div>
                            </>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAssignTutorDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAssignTutor}
                            disabled={!selectedTutor}
                        >
                            Assign Tutor
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Remove Tutor Dialog */}
            <Dialog open={removeTutorDialogOpen} onOpenChange={setRemoveTutorDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Remove Tutor</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to remove this tutor from the student?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label htmlFor="remove-reason" className="text-sm font-medium">
                                Reason (Optional)
                            </label>
                            <Textarea
                                id="remove-reason"
                                value={removeReason}
                                onChange={(e) => setRemoveReason(e.target.value)}
                                placeholder="Provide a reason for removing this tutor"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRemoveTutorDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleRemoveTutor}>
                            Remove Tutor
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Session Dialog */}
            <Dialog open={isSessionDialogOpen} onOpenChange={setIsSessionDialogOpen}>
                <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader>
                        <DialogTitle>Edit Session</DialogTitle>
                        <DialogDescription>
                            Update session details
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...sessionForm}>
                        <form onSubmit={sessionForm.handleSubmit(handleUpdateSession)} className="space-y-4">
                            <div className="grid grid-cols-1 gap-4">
                                <FormField
                                    control={sessionForm.control}
                                    name="startTime"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Session Date</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="date"
                                                    value={selectedDate}
                                                    onChange={handleDateChange}
                                                />
                                            </FormControl>
                                            {dateError && <p className="text-sm text-red-500">{dateError}</p>}
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={sessionForm.control}
                                    name="tutorId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tutor</FormLabel>
                                            <FormControl>
                                                <Select
                                                    value={field.value}
                                                    onValueChange={(value) => handleTutorChange(value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select tutor" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {availableTutors.map((tutor) => (
                                                            <SelectItem key={tutor.id} value={tutor.id.toString()}>
                                                                {tutor.firstName} {tutor.lastName}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                {timeSlots.length > 0 && (
                                    <FormField
                                        control={sessionForm.control}
                                        name="startTime"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Time Slot</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        value={field.value}
                                                        onValueChange={(value) => {
                                                            const [start, end] = value.split('|');
                                                            sessionForm.setValue("startTime", start);
                                                            sessionForm.setValue("endTime", end);
                                                        }}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select time slot" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {timeSlots.map((slot, index) => {
                                                                const startTime = new Date(slot.start);
                                                                const endTime = new Date(slot.end);
                                                                const displayText = `${startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                                                                const value = `${slot.start}|${slot.end}`;

                                                                return (
                                                                    <SelectItem key={index} value={value}>
                                                                        {displayText}
                                                                    </SelectItem>
                                                                );
                                                            })}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                {timeSlots.length === 0 && !dateError && !availabilityLoading && (
                                                    <p className="text-sm text-amber-500">No available time slots for this date</p>
                                                )}
                                                {availabilityLoading && (
                                                    <p className="text-sm text-gray-500">Loading available time slots...</p>
                                                )}
                                            </FormItem>
                                        )}
                                    />
                                )}

                                <FormField
                                    control={sessionForm.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Status</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                                                    <SelectItem value="COMPLETED">Completed</SelectItem>
                                                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={sessionForm.control}
                                    name="classLink"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Class Link</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="url" placeholder="https://zoom.us/..." />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={sessionForm.control}
                                    name="notes"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Notes</FormLabel>
                                            <FormControl>
                                                <Textarea {...field} placeholder="Session notes..." />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <DialogFooter>
                                <Button type="submit">Save Changes</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default StudentView;