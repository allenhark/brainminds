import React, { useState } from 'react';

type Student = {
    id: number;
    name: string;
    email: string;
    phone: string;
    grade: string;
    subjects: string[];
    totalSessions: number;
    status: 'active' | 'inactive';
    joinDate: string;
};

const StudentManagement: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
    const [filterGrade, setFilterGrade] = useState('all');

    // Sample student data
    const students: Student[] = [
        {
            id: 1,
            name: 'Emily Johnson',
            email: 'emily.johnson@example.com',
            phone: '(123) 456-7890',
            grade: '10th Grade',
            subjects: ['Mathematics', 'Physics'],
            totalSessions: 15,
            status: 'active',
            joinDate: '2022-03-15'
        },
        {
            id: 2,
            name: 'Michael Brown',
            email: 'michael.brown@example.com',
            phone: '(234) 567-8901',
            grade: '11th Grade',
            subjects: ['Physics', 'Chemistry'],
            totalSessions: 8,
            status: 'active',
            joinDate: '2022-04-22'
        },
        {
            id: 3,
            name: 'Emma Davis',
            email: 'emma.davis@example.com',
            phone: '(345) 678-9012',
            grade: '9th Grade',
            subjects: ['Chemistry', 'Biology'],
            totalSessions: 12,
            status: 'active',
            joinDate: '2022-05-10'
        },
        {
            id: 4,
            name: 'William Taylor',
            email: 'william.taylor@example.com',
            phone: '(456) 789-0123',
            grade: '12th Grade',
            subjects: ['Biology', 'English'],
            totalSessions: 20,
            status: 'inactive',
            joinDate: '2022-02-18'
        },
        {
            id: 5,
            name: 'Olivia Wilson',
            email: 'olivia.wilson@example.com',
            phone: '(567) 890-1234',
            grade: '10th Grade',
            subjects: ['English Literature', 'History'],
            totalSessions: 10,
            status: 'active',
            joinDate: '2022-06-01'
        },
        {
            id: 6,
            name: 'James Anderson',
            email: 'james.anderson@example.com',
            phone: '(678) 901-2345',
            grade: '8th Grade',
            subjects: ['Mathematics', 'Science'],
            totalSessions: 5,
            status: 'active',
            joinDate: '2022-06-15'
        },
    ];

    // Get unique grades for filter
    const grades = ['all', ...Array.from(new Set(students.map(student => student.grade)))];

    // Filter students based on search query, status, and grade
    const filteredStudents = students.filter(student => {
        const matchesSearch =
            student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.subjects.some(subject => subject.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesStatus = filterStatus === 'all' || student.status === filterStatus;
        const matchesGrade = filterGrade === 'all' || student.grade === filterGrade;

        return matchesSearch && matchesStatus && matchesGrade;
    });

    // Handle adding a new student (just a placeholder function)
    const handleAddStudent = () => {
        alert('Open add student modal');
    };

    // Handle editing a student (just a placeholder function)
    const handleEditStudent = (id: number) => {
        alert(`Edit student with ID: ${id}`);
    };

    // Handle deleting a student (just a placeholder function)
    const handleDeleteStudent = (id: number) => {
        alert(`Delete student with ID: ${id}`);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Student Management</h2>
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                    onClick={handleAddStudent}
                >
                    <i className="far fa-plus mr-2"></i> Add New Student
                </button>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-lg p-5 shadow-sm">
                <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[200px]">
                        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <i className="far fa-search text-gray-400"></i>
                            </div>
                            <input
                                type="text"
                                id="search"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Search students..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            id="status"
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
                        >
                            <option value="all">All</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                        <select
                            id="grade"
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={filterGrade}
                            onChange={(e) => setFilterGrade(e.target.value)}
                        >
                            {grades.map((grade) => (
                                <option key={grade} value={grade}>
                                    {grade === 'all' ? 'All Grades' : grade}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Students Table */}
            <div className="bg-white rounded-lg p-5 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Student
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Contact
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Grade
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Subjects
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Sessions
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Join Date
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredStudents.map((student) => (
                                <tr key={student.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-medium">
                                                {student.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{student.email}</div>
                                        <div className="text-sm text-gray-500">{student.phone}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {student.grade}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-wrap gap-1">
                                            {student.subjects.map((subject, index) => (
                                                <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    {subject}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {student.totalSessions}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${student.status === 'active'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                            }`}>
                                            {student.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(student.joinDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleEditStudent(student.id)}
                                            className="text-blue-600 hover:text-blue-900 mr-3"
                                        >
                                            <i className="far fa-edit"></i>
                                        </button>
                                        <button
                                            onClick={() => handleDeleteStudent(student.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            <i className="far fa-trash-alt"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredStudents.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No students found matching your search criteria</p>
                    </div>
                )}

                {/* Pagination */}
                <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 mt-4">
                    <div className="flex-1 flex justify-between sm:hidden">
                        <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                            Previous
                        </button>
                        <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                            Next
                        </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredStudents.length}</span> of <span className="font-medium">{filteredStudents.length}</span> results
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                    <span className="sr-only">Previous</span>
                                    <i className="far fa-chevron-left text-gray-400"></i>
                                </button>
                                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-blue-600 hover:bg-blue-50">
                                    1
                                </button>
                                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                    <span className="sr-only">Next</span>
                                    <i className="far fa-chevron-right text-gray-400"></i>
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentManagement; 