import React, { useState, useEffect } from "react";
import Api from "@/Api";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";
import HelmetComponent from "@/components/HelmetComponent";
import { format } from "date-fns";

interface Student {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
}

interface Session {
    id: number;
    startTime: string;
    endTime: string;
    status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
    notes?: string;
    classLink?: string;
    student: Student;
}

export default function TutorSessions() {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("scheduled");
    const [selectedSession, setSelectedSession] = useState<Session | null>(null);
    const [classLink, setClassLink] = useState("");
    const [updatingLink, setUpdatingLink] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    // Fetch sessions based on status
    const fetchSessions = async (status: string) => {
        setIsLoading(true);
        try {
            const response = await Api.get(`/tutor/sessions/${status.toUpperCase()}`);
            setSessions(response.data);
        } catch (error) {
            console.error(`Error fetching ${status} sessions:`, error);
            toast.error(`Failed to load ${status} sessions`);
        } finally {
            setIsLoading(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchSessions(activeTab);
    }, [activeTab]);

    // Handle tab change
    const handleTabChange = (value: string) => {
        setActiveTab(value);
    };

    // Open the class link dialog
    const openClassLinkDialog = (session: Session) => {
        setSelectedSession(session);
        setClassLink(session.classLink || "");
        setDialogOpen(true);
    };

    // Handle class link update
    const updateClassLink = async () => {
        if (!selectedSession) return;

        // Validate link format
        if (!validateClassLink(classLink)) {
            toast.error("Please enter a valid URL (e.g., https://zoom.us/j/12345)");
            return;
        }

        setUpdatingLink(true);
        try {
            await Api.put(`/tutor/session/${selectedSession.id}/link`, {
                classLink,
            });

            // Update session in state
            setSessions(prevSessions =>
                prevSessions.map(session =>
                    session.id === selectedSession.id
                        ? { ...session, classLink }
                        : session
                )
            );

            toast.success("Class link updated! Student has been notified via email.");
            setDialogOpen(false);
        } catch (error) {
            console.error("Error updating class link:", error);
            toast.error("Failed to update class link");
        } finally {
            setUpdatingLink(false);
        }
    };

    // Validate class link format
    const validateClassLink = (link: string): boolean => {
        if (!link) return false;

        try {
            // Basic URL validation
            const url = new URL(link);
            return url.protocol === 'http:' || url.protocol === 'https:';
        } catch (error) {
            return false;
        }
    };

    // Format date and time
    const formatDateTime = (dateString: string) => {
        return format(new Date(dateString), "MMM d, yyyy - h:mm a");
    };

    // Calculate session duration in minutes
    const calculateDuration = (startTime: string, endTime: string) => {
        const start = new Date(startTime);
        const end = new Date(endTime);
        const diffMs = end.getTime() - start.getTime();
        const diffMins = Math.round(diffMs / 60000);
        return diffMins;
    };

    // Render session status badge
    const renderStatusBadge = (status: string) => {
        switch (status) {
            case "SCHEDULED":
                return <Badge variant="outline" className="bg-blue-50 text-blue-700">Scheduled</Badge>;
            case "COMPLETED":
                return <Badge variant="outline" className="bg-green-50 text-green-700">Completed</Badge>;
            case "CANCELLED":
                return <Badge variant="outline" className="bg-red-50 text-red-700">Cancelled</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <HelmetComponent
                title="Tutor Sessions"
                description="Manage your tutoring sessions"
            />

            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Sessions Management</h1>
                <Button
                    variant="outline"
                    onClick={() => fetchSessions(activeTab)}
                    size="sm"
                >
                    <i className="far fa-sync mr-2"></i> Refresh
                </Button>
            </div>

            <Tabs
                defaultValue="scheduled"
                value={activeTab}
                onValueChange={handleTabChange}
                className="w-full"
            >
                <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="scheduled">Upcoming</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                    <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                </TabsList>

                {["scheduled", "completed", "cancelled"].map((status) => (
                    <TabsContent key={status} value={status}>
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {status === "scheduled" ? "Upcoming Sessions" :
                                        status === "completed" ? "Completed Sessions" :
                                            "Cancelled Sessions"}
                                </CardTitle>
                                <CardDescription>
                                    {status === "scheduled" ? "View and manage your upcoming sessions" :
                                        status === "completed" ? "Review your past sessions" :
                                            "View your cancelled sessions"}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {isLoading ? (
                                    // Loading skeletons
                                    <div className="space-y-4">
                                        {[...Array(3)].map((_, i) => (
                                            <div key={i} className="flex flex-col space-y-3">
                                                <Skeleton className="h-8 w-full" />
                                                <Skeleton className="h-8 w-3/4" />
                                                <Skeleton className="h-8 w-1/2" />
                                            </div>
                                        ))}
                                    </div>
                                ) : sessions.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Student</TableHead>
                                                <TableHead>Date & Time</TableHead>
                                                <TableHead>Duration</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Class Link</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {sessions.map((session) => (
                                                <TableRow key={session.id}>
                                                    <TableCell className="font-medium">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                                                {session.student.avatar ? (
                                                                    <img
                                                                        src={session.student.avatar}
                                                                        alt={`${session.student.firstName} ${session.student.lastName}`}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <i className="far fa-user text-gray-500"></i>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <div>{session.student.firstName} {session.student.lastName}</div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div>{formatDateTime(session.startTime)}</div>
                                                        <div className="text-xs text-gray-500">to {format(new Date(session.endTime), "h:mm a")}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {calculateDuration(session.startTime, session.endTime)} min
                                                    </TableCell>
                                                    <TableCell>
                                                        {renderStatusBadge(session.status)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {session.classLink ? (
                                                            <a
                                                                href={session.classLink}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-blue-600 hover:underline flex items-center"
                                                            >
                                                                <i className="far fa-external-link mr-1"></i>
                                                                <span className="truncate max-w-[150px] inline-block">
                                                                    {session.classLink.replace(/^https?:\/\//, '')}
                                                                </span>
                                                            </a>
                                                        ) : (
                                                            <span className="text-gray-500 italic">Not set</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        {session.status === "SCHEDULED" && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => openClassLinkDialog(session)}
                                                            >
                                                                {session.classLink ? "Update Link" : "Add Link"}
                                                            </Button>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                                            <i className="far fa-calendar-xmark text-gray-500 text-xl"></i>
                                        </div>
                                        <h3 className="text-lg font-medium">No {status} sessions</h3>
                                        <p className="text-gray-500 mt-1">
                                            {status === "scheduled" ? "You don't have any upcoming sessions yet" :
                                                status === "completed" ? "You haven't completed any sessions yet" :
                                                    "You don't have any cancelled sessions"}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                ))}
            </Tabs>

            {/* Class Link Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {selectedSession?.classLink ? "Update Class Link" : "Add Class Link"}
                        </DialogTitle>
                        <DialogDescription>
                            Enter the link for your virtual classroom. This link will be sent to the student via email.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedSession && (
                        <div className="space-y-4">
                            <div className="border rounded-md p-3 bg-gray-50">
                                <div className="text-sm font-medium">Session Details</div>
                                <div className="text-sm mt-1">
                                    <div>Student: {selectedSession.student.firstName} {selectedSession.student.lastName}</div>
                                    <div>Time: {formatDateTime(selectedSession.startTime)}</div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="classLink">Class Link</Label>
                                <Input
                                    id="classLink"
                                    placeholder="https://zoom.us/j/123456789"
                                    value={classLink}
                                    onChange={(e) => setClassLink(e.target.value)}
                                />
                                <div className="text-xs">
                                    <p className="text-gray-500 mb-1">
                                        Paste the URL for Zoom, Google Meet, or any other virtual classroom platform
                                    </p>
                                    <p className="text-amber-600 flex items-center">
                                        <i className="far fa-info-circle mr-1"></i>
                                        Student will receive an email notification with the updated link
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDialogOpen(false)}
                            disabled={updatingLink}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={updateClassLink}
                            disabled={!classLink || updatingLink || !validateClassLink(classLink)}
                        >
                            {updatingLink ? (
                                <>
                                    <i className="far fa-spinner-third fa-spin mr-2"></i>
                                    Updating...
                                </>
                            ) : (
                                <>Save & Notify Student</>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
