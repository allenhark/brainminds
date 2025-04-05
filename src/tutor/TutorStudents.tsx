import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import toast from 'react-hot-toast';

interface Student {
    id: number;
    name: string;
    email: string;
    avatar: string;
    level: string;
    joinedDate: string;
    lastSession: string | null;
    nextSession: string | null;
    totalSessions: number;
    notes: string;
    status: 'active' | 'inactive';
}

const TutorStudents: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [notesDialogOpen, setNotesDialogOpen] = useState(false);
    const [studentNotes, setStudentNotes] = useState('');
    const [sortBy, setSortBy] = useState('name');

    // Simulate fetching students
    useEffect(() => {
        setIsLoading(true);

        setTimeout(() => {
            setStudents([
                {
                    id: 101,
                    name: 'Emma Johnson',
                    email: 'emma.j@example.com',
                    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
                    level: 'Intermediate',
                    joinedDate: '2023-01-15',
                    lastSession: '2023-04-03',
                    nextSession: '2023-04-12',
                    totalSessions: 8,
                    notes: 'Working on improving conversation skills. Interested in business English.',
                    status: 'active'
                },
                {
                    id: 102,
                    name: 'Michael Chen',
                    email: 'michael.c@example.com',
                    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
                    level: 'Advanced',
                    joinedDate: '2022-11-05',
                    lastSession: '2023-04-01',
                    nextSession: '2023-04-08',
                    totalSessions: 15,
                    notes: 'Preparing for IELTS exam. Focus on academic writing and speaking.',
                    status: 'active'
                },
                {
                    id: 103,
                    name: 'Sofia Rodriguez',
                    email: 'sofia.r@example.com',
                    avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
                    level: 'Beginner',
                    joinedDate: '2023-03-20',
                    lastSession: null,
                    nextSession: '2023-04-10',
                    totalSessions: 0,
                    notes: 'First-time English learner. Focusing on basic vocabulary and simple conversations.',
                    status: 'active'
                },
                {
                    id: 104,
                    name: 'Alex Kim',
                    email: 'alex.k@example.com',
                    avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
                    level: 'Intermediate',
                    joinedDate: '2022-08-12',
                    lastSession: '2023-02-15',
                    nextSession: null,
                    totalSessions: 12,
                    notes: 'Taking a break due to work commitments. Plans to resume in May.',
                    status: 'inactive'
                },
                {
                    id: 105,
                    name: 'Jessica Lee',
                    email: 'jessica.l@example.com',
                    avatar: 'https://randomuser.me/api/portraits/women/5.jpg',
                    level: 'Advanced',
                    joinedDate: '2022-06-30',
                    lastSession: '2023-03-28',
                    nextSession: '2023-04-11',
                    totalSessions: 24,
                    notes: 'Focusing on business presentations and email writing.',
                    status: 'active'
                },
            ]);

            setIsLoading(false);
        }, 500);
    }, []);

    const openNotesDialog = (student: Student) => {
        setSelectedStudent(student);
        setStudentNotes(student.notes);
        setNotesDialogOpen(true);
    };

    const handleSaveNotes = () => {
        if (!selectedStudent) return;

        setIsLoading(true);

        // Simulate API call to update notes
        setTimeout(() => {
            setStudents(prevStudents =>
                prevStudents.map(student =>
                    student.id === selectedStudent.id
                        ? { ...student, notes: studentNotes }
                        : student
                )
            );

            toast.success('Student notes updated successfully');
            setNotesDialogOpen(false);
            setIsLoading(false);
        }, 500);
    };

    const handleContactStudent = (email: string) => {
        // In a real app, this would integrate with the messaging system
        window.location.href = `/tutor/messages?email=${email}`;
    };

    const handleViewSessions = (studentId: number) => {
        // In a real app, this would navigate to filtered sessions view
        window.location.href = `/tutor/sessions?studentId=${studentId}`;
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';

        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const filteredStudents = students.filter(student => {
        const searchLower = searchQuery.toLowerCase();
        return (
            student.name.toLowerCase().includes(searchLower) ||
            student.email.toLowerCase().includes(searchLower) ||
            student.level.toLowerCase().includes(searchLower)
        );
    });

    const activeStudents = filteredStudents.filter(s => s.status === 'active');
    const inactiveStudents = filteredStudents.filter(s => s.status === 'inactive');

    const sortedStudents = (studentsToSort: Student[]) => {
        return [...studentsToSort].sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'level':
                    return a.level.localeCompare(b.level);
                case 'sessions':
                    return b.totalSessions - a.totalSessions;
                case 'recent':
                    if (!a.lastSession) return 1;
                    if (!b.lastSession) return -1;
                    return new Date(b.lastSession).getTime() - new Date(a.lastSession).getTime();
                case 'joined':
                    return new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime();
                default:
                    return 0;
            }
        });
    };

    const getLevelBadgeColor = (level: string) => {
        switch (level.toLowerCase()) {
            case 'beginner':
                return 'bg-green-100 text-green-800';
            case 'intermediate':
                return 'bg-blue-100 text-blue-800';
            case 'advanced':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">My Students</h1>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="relative w-full md:w-72">
                    <Input
                        placeholder="Search students..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8"
                    />
                    <i className="far fa-search absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Sort by:</span>
                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="name">Name</SelectItem>
                            <SelectItem value="level">Level</SelectItem>
                            <SelectItem value="sessions">Total Sessions</SelectItem>
                            <SelectItem value="recent">Recent Activity</SelectItem>
                            <SelectItem value="joined">Join Date</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Tabs defaultValue="active" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="active">
                        Active Students ({activeStudents.length})
                    </TabsTrigger>
                    <TabsTrigger value="inactive">
                        Inactive Students ({inactiveStudents.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="active">
                    {isLoading ? (
                        <div className="flex justify-center py-10">
                            <i className="far fa-spinner-third fa-spin text-2xl text-gray-400"></i>
                        </div>
                    ) : activeStudents.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4">
                            {sortedStudents(activeStudents).map(student => (
                                <StudentCard
                                    key={student.id}
                                    student={student}
                                    onContactClick={handleContactStudent}
                                    onViewSessionsClick={handleViewSessions}
                                    onNotesClick={openNotesDialog}
                                />
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-10">
                                <i className="far fa-user-graduate text-5xl text-gray-300 mb-4"></i>
                                <p className="text-gray-500">No active students found</p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="inactive">
                    {isLoading ? (
                        <div className="flex justify-center py-10">
                            <i className="far fa-spinner-third fa-spin text-2xl text-gray-400"></i>
                        </div>
                    ) : inactiveStudents.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4">
                            {sortedStudents(inactiveStudents).map(student => (
                                <StudentCard
                                    key={student.id}
                                    student={student}
                                    onContactClick={handleContactStudent}
                                    onViewSessionsClick={handleViewSessions}
                                    onNotesClick={openNotesDialog}
                                />
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-10">
                                <i className="far fa-user-slash text-5xl text-gray-300 mb-4"></i>
                                <p className="text-gray-500">No inactive students found</p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>

            {/* Notes Dialog */}
            <Dialog open={notesDialogOpen} onOpenChange={setNotesDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            {selectedStudent && (
                                <>
                                    <img
                                        src={selectedStudent.avatar}
                                        alt={selectedStudent.name}
                                        className="w-8 h-8 rounded-full"
                                    />
                                    <span>Notes for {selectedStudent.name}</span>
                                </>
                            )}
                        </DialogTitle>
                    </DialogHeader>

                    <Textarea
                        value={studentNotes}
                        onChange={(e) => setStudentNotes(e.target.value)}
                        placeholder="Add notes about this student's progress, interests, and learning goals..."
                        className="min-h-[200px]"
                    />

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setNotesDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveNotes} disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <i className="far fa-spinner-third fa-spin mr-2"></i>
                                    Saving...
                                </>
                            ) : 'Save Notes'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

interface StudentCardProps {
    student: Student;
    onContactClick: (email: string) => void;
    onViewSessionsClick: (id: number) => void;
    onNotesClick: (student: Student) => void;
}

const StudentCard: React.FC<StudentCardProps> = ({
    student,
    onContactClick,
    onViewSessionsClick,
    onNotesClick
}) => {
    const getLevelBadgeColor = (level: string) => {
        switch (level.toLowerCase()) {
            case 'beginner':
                return 'bg-green-100 text-green-800';
            case 'intermediate':
                return 'bg-blue-100 text-blue-800';
            case 'advanced':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';

        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <Card className={student.status === 'inactive' ? 'border-gray-200 bg-gray-50' : ''}>
            <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                        <img
                            src={student.avatar}
                            alt={student.name}
                            className="w-12 h-12 rounded-full"
                        />

                        <div>
                            <h3 className="font-medium text-lg flex items-center gap-2">
                                {student.name}
                                <Badge className={getLevelBadgeColor(student.level)}>
                                    {student.level}
                                </Badge>
                                {student.status === 'inactive' && (
                                    <Badge variant="outline" className="bg-gray-100 text-gray-600">
                                        Inactive
                                    </Badge>
                                )}
                            </h3>

                            <p className="text-gray-500">{student.email}</p>

                            <div className="flex flex-wrap mt-2 gap-x-6 gap-y-1 text-sm text-gray-600">
                                <div>
                                    <i className="far fa-calendar mr-1"></i>
                                    Joined: {formatDate(student.joinedDate)}
                                </div>

                                <div>
                                    <i className="far fa-clock mr-1"></i>
                                    Sessions: {student.totalSessions}
                                </div>

                                <div>
                                    <i className="far fa-calendar-check mr-1"></i>
                                    Last session: {formatDate(student.lastSession)}
                                </div>

                                <div>
                                    <i className="far fa-calendar-day mr-1"></i>
                                    Next session: {formatDate(student.nextSession)}
                                </div>
                            </div>

                            {student.notes && (
                                <div className="mt-3 text-sm text-gray-600 line-clamp-2">
                                    <i className="far fa-sticky-note mr-1"></i>
                                    {student.notes}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-row md:flex-col gap-2 self-stretch justify-end md:min-w-[120px]">
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 md:flex-none w-full"
                            onClick={() => onContactClick(student.email)}
                        >
                            <i className="far fa-comment-dots mr-2"></i>
                            Message
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 md:flex-none w-full"
                            onClick={() => onViewSessionsClick(student.id)}
                        >
                            <i className="far fa-calendar-alt mr-2"></i>
                            Sessions
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 md:flex-none w-full"
                            onClick={() => onNotesClick(student)}
                        >
                            <i className="far fa-edit mr-2"></i>
                            Notes
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default TutorStudents; 