import React, { useState } from 'react';

type Payment = {
    id: number;
    invoiceNumber: string;
    student: string;
    tutor: string;
    amount: number;
    date: string;
    dueDate: string;
    status: 'paid' | 'pending' | 'overdue';
    paymentMethod?: 'credit_card' | 'bank_transfer' | 'paypal';
};

const PaymentsManagement: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');
    const [dateRange, setDateRange] = useState<'all' | 'this_month' | 'last_month' | 'custom'>('all');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Sample payments data
    const payments: Payment[] = [
        {
            id: 1,
            invoiceNumber: 'INV-2023-001',
            student: 'Emily Johnson',
            tutor: 'John Smith',
            amount: 120.00,
            date: '2023-05-01',
            dueDate: '2023-05-15',
            status: 'paid',
            paymentMethod: 'credit_card'
        },
        {
            id: 2,
            invoiceNumber: 'INV-2023-002',
            student: 'Michael Brown',
            tutor: 'Sarah Parker',
            amount: 180.00,
            date: '2023-05-05',
            dueDate: '2023-05-20',
            status: 'paid',
            paymentMethod: 'paypal'
        },
        {
            id: 3,
            invoiceNumber: 'INV-2023-003',
            student: 'Emma Davis',
            tutor: 'David Wilson',
            amount: 90.00,
            date: '2023-05-10',
            dueDate: '2023-05-25',
            status: 'pending'
        },
        {
            id: 4,
            invoiceNumber: 'INV-2023-004',
            student: 'William Taylor',
            tutor: 'Jessica Lee',
            amount: 150.00,
            date: '2023-04-20',
            dueDate: '2023-05-05',
            status: 'overdue'
        },
        {
            id: 5,
            invoiceNumber: 'INV-2023-005',
            student: 'Olivia Wilson',
            tutor: 'Robert Miller',
            amount: 135.00,
            date: '2023-04-25',
            dueDate: '2023-05-10',
            status: 'paid',
            paymentMethod: 'bank_transfer'
        },
        {
            id: 6,
            invoiceNumber: 'INV-2023-006',
            student: 'James Anderson',
            tutor: 'John Smith',
            amount: 200.00,
            date: '2023-05-12',
            dueDate: '2023-05-27',
            status: 'pending'
        },
    ];

    // Calculate financial summary
    const totalPaid = payments.filter(payment => payment.status === 'paid').reduce((sum, payment) => sum + payment.amount, 0);
    const totalPending = payments.filter(payment => payment.status === 'pending').reduce((sum, payment) => sum + payment.amount, 0);
    const totalOverdue = payments.filter(payment => payment.status === 'overdue').reduce((sum, payment) => sum + payment.amount, 0);
    const totalRevenue = totalPaid + totalPending + totalOverdue;

    // Filter payments based on search, status, and date range
    const filteredPayments = payments.filter(payment => {
        // Search filter
        const matchesSearch =
            payment.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            payment.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
            payment.tutor.toLowerCase().includes(searchQuery.toLowerCase());

        // Status filter
        const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;

        // Date range filter
        let matchesDateRange = true;
        const paymentDate = new Date(payment.date);

        if (dateRange === 'this_month') {
            const today = new Date();
            const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            matchesDateRange = paymentDate >= firstDayOfMonth && paymentDate <= lastDayOfMonth;
        } else if (dateRange === 'last_month') {
            const today = new Date();
            const firstDayOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            const lastDayOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
            matchesDateRange = paymentDate >= firstDayOfLastMonth && paymentDate <= lastDayOfLastMonth;
        } else if (dateRange === 'custom' && startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            matchesDateRange = paymentDate >= start && paymentDate <= end;
        }

        return matchesSearch && matchesStatus && matchesDateRange;
    });

    // Handle adding a new payment (just a placeholder function)
    const handleAddPayment = () => {
        alert('Open add payment modal');
    };

    // Handle viewing a payment receipt (just a placeholder function)
    const handleViewReceipt = (id: number) => {
        alert(`View receipt for payment with ID: ${id}`);
    };

    // Format currency
    const formatCurrency = (amount: number): string => {
        return `$${amount.toFixed(2)}`;
    };

    // Format date
    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString();
    };

    // Get status color class
    const getStatusColorClass = (status: 'paid' | 'pending' | 'overdue'): string => {
        switch (status) {
            case 'paid':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'overdue':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Get payment method display text
    const getPaymentMethodDisplay = (method?: 'credit_card' | 'bank_transfer' | 'paypal'): string => {
        switch (method) {
            case 'credit_card':
                return 'Credit Card';
            case 'bank_transfer':
                return 'Bank Transfer';
            case 'paypal':
                return 'PayPal';
            default:
                return 'N/A';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Payments Management</h2>
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                    onClick={handleAddPayment}
                >
                    <i className="far fa-plus mr-2"></i> Create Invoice
                </button>
            </div>

            {/* Financial Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-500">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-500">Paid</p>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(totalPaid)}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-500">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">{formatCurrency(totalPending)}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-500">Overdue</p>
                    <p className="text-2xl font-bold text-red-600">{formatCurrency(totalOverdue)}</p>
                </div>
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
                                placeholder="Search invoices..."
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
                            onChange={(e) => setFilterStatus(e.target.value as 'all' | 'paid' | 'pending' | 'overdue')}
                        >
                            <option value="all">All</option>
                            <option value="paid">Paid</option>
                            <option value="pending">Pending</option>
                            <option value="overdue">Overdue</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="date-range" className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                        <select
                            id="date-range"
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value as 'all' | 'this_month' | 'last_month' | 'custom')}
                        >
                            <option value="all">All Time</option>
                            <option value="this_month">This Month</option>
                            <option value="last_month">Last Month</option>
                            <option value="custom">Custom Range</option>
                        </select>
                    </div>

                    {dateRange === 'custom' && (
                        <div className="flex gap-2">
                            <div>
                                <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                <input
                                    type="date"
                                    id="start-date"
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                <input
                                    type="date"
                                    id="end-date"
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Payments Table */}
            <div className="bg-white rounded-lg p-5 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Invoice
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Student
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tutor
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Due Date
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Payment Method
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredPayments.map((payment) => (
                                <tr key={payment.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {payment.invoiceNumber}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {payment.student}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {payment.tutor}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {formatCurrency(payment.amount)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(payment.date)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(payment.dueDate)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColorClass(payment.status)}`}>
                                            {payment.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {getPaymentMethodDisplay(payment.paymentMethod)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {payment.status === 'paid' && (
                                            <button
                                                onClick={() => handleViewReceipt(payment.id)}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                <i className="far fa-file-alt mr-1"></i> Receipt
                                            </button>
                                        )}
                                        {payment.status === 'pending' && (
                                            <button
                                                className="text-green-600 hover:text-green-900"
                                            >
                                                <i className="far fa-credit-card mr-1"></i> Collect
                                            </button>
                                        )}
                                        {payment.status === 'overdue' && (
                                            <button
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <i className="far fa-envelope mr-1"></i> Remind
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredPayments.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No payments found matching your search criteria</p>
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
                                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredPayments.length}</span> of <span className="font-medium">{filteredPayments.length}</span> results
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

export default PaymentsManagement;