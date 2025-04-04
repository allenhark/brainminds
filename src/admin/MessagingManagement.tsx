import React, { useState } from 'react';

type Message = {
    id: number;
    sender: string;
    senderType: 'admin' | 'tutor' | 'student';
    recipient: string;
    recipientType: 'admin' | 'tutor' | 'student';
    subject: string;
    content: string;
    timestamp: string;
    read: boolean;
};

type Contact = {
    id: number;
    name: string;
    type: 'tutor' | 'student';
    lastActive: string;
    avatar?: string;
};

const MessagingManagement: React.FC = () => {
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [messageText, setMessageText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'tutor' | 'student'>('all');

    // Sample contacts data
    const contacts: Contact[] = [
        {
            id: 1,
            name: 'John Smith',
            type: 'tutor',
            lastActive: '2023-05-15T10:30:00Z'
        },
        {
            id: 2,
            name: 'Sarah Parker',
            type: 'tutor',
            lastActive: '2023-05-14T14:45:00Z'
        },
        {
            id: 3,
            name: 'Emily Johnson',
            type: 'student',
            lastActive: '2023-05-15T09:15:00Z'
        },
        {
            id: 4,
            name: 'Michael Brown',
            type: 'student',
            lastActive: '2023-05-13T16:20:00Z'
        },
        {
            id: 5,
            name: 'David Wilson',
            type: 'tutor',
            lastActive: '2023-05-12T11:10:00Z'
        },
        {
            id: 6,
            name: 'Emma Davis',
            type: 'student',
            lastActive: '2023-05-11T13:40:00Z'
        }
    ];

    // Sample messages data
    const messages: Message[] = [
        {
            id: 1,
            sender: 'Admin',
            senderType: 'admin',
            recipient: 'John Smith',
            recipientType: 'tutor',
            subject: 'Schedule Update',
            content: 'Hello John, I wanted to confirm your availability for the upcoming week. We have several new students requesting sessions with you.',
            timestamp: '2023-05-15T09:30:00Z',
            read: true
        },
        {
            id: 2,
            sender: 'John Smith',
            senderType: 'tutor',
            recipient: 'Admin',
            recipientType: 'admin',
            subject: 'Re: Schedule Update',
            content: 'Hi Admin, I am available Monday, Wednesday, and Friday from 3PM to 7PM. Please let me know if you need me to open up more slots.',
            timestamp: '2023-05-15T10:15:00Z',
            read: true
        },
        {
            id: 3,
            sender: 'Admin',
            senderType: 'admin',
            recipient: 'Emily Johnson',
            recipientType: 'student',
            subject: 'Tutoring Session Confirmation',
            content: 'Hello Emily, I am writing to confirm your tutoring session with John Smith on Monday at 4PM. Please let me know if you need to reschedule.',
            timestamp: '2023-05-14T11:00:00Z',
            read: true
        },
        {
            id: 4,
            sender: 'Emily Johnson',
            senderType: 'student',
            recipient: 'Admin',
            recipientType: 'admin',
            subject: 'Re: Tutoring Session Confirmation',
            content: 'Thank you for the confirmation. I will be there!',
            timestamp: '2023-05-14T13:20:00Z',
            read: false
        }
    ];

    // Filter contacts based on search and type
    const filteredContacts = contacts.filter(contact => {
        const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === 'all' || contact.type === filterType;

        return matchesSearch && matchesType;
    });

    // Get messages for selected contact
    const getMessagesForContact = (contactId: number | null): Message[] => {
        if (!contactId) return [];

        const contact = contacts.find(c => c.id === contactId);
        if (!contact) return [];

        return messages.filter(message =>
            (message.recipient === contact.name && message.senderType === 'admin') ||
            (message.sender === contact.name && message.recipientType === 'admin')
        ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    };

    // Get messages for the selected contact
    const contactMessages = selectedContact ? getMessagesForContact(selectedContact.id) : [];

    // Handle selecting a contact
    const handleContactSelect = (contact: Contact) => {
        setSelectedContact(contact);
        setMessageText('');
    };

    // Handle sending a message
    const handleSendMessage = () => {
        if (!selectedContact || !messageText.trim()) return;

        alert(`Message sent to ${selectedContact.name}: "${messageText}"`);
        setMessageText('');
    };

    // Format timestamp
    const formatTimestamp = (timestamp: string): string => {
        const date = new Date(timestamp);
        return date.toLocaleString();
    };

    // Format last active time
    const formatLastActive = (timestamp: string): string => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

        if (diffInHours < 1) {
            return 'Just now';
        } else if (diffInHours < 24) {
            return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
        } else {
            const diffInDays = Math.floor(diffInHours / 24);
            return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
        }
    };

    // Get initials from name
    const getInitials = (name: string): string => {
        return name.split(' ').map(n => n[0]).join('');
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Messaging</h2>
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                    onClick={() => alert('Open compose message modal')}
                >
                    <i className="far fa-envelope mr-2"></i> Compose New
                </button>
            </div>

            {/* Messaging Interface */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="flex h-[600px]">
                    {/* Contacts Sidebar */}
                    <div className="w-1/3 border-r border-gray-200 flex flex-col">
                        {/* Search and Filter */}
                        <div className="p-4 border-b border-gray-200">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <i className="far fa-search text-gray-400"></i>
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Search contacts..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="mt-2 flex">
                                <button
                                    className={`px-3 py-1 text-xs rounded-md font-medium ${filterType === 'all'
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                    onClick={() => setFilterType('all')}
                                >
                                    All
                                </button>
                                <button
                                    className={`ml-2 px-3 py-1 text-xs rounded-md font-medium ${filterType === 'tutor'
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                    onClick={() => setFilterType('tutor')}
                                >
                                    Tutors
                                </button>
                                <button
                                    className={`ml-2 px-3 py-1 text-xs rounded-md font-medium ${filterType === 'student'
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                    onClick={() => setFilterType('student')}
                                >
                                    Students
                                </button>
                            </div>
                        </div>

                        {/* Contacts List */}
                        <div className="flex-1 overflow-y-auto">
                            {filteredContacts.map((contact) => (
                                <div
                                    key={contact.id}
                                    className={`p-4 border-b border-gray-200 flex items-center cursor-pointer hover:bg-gray-50 ${selectedContact?.id === contact.id ? 'bg-blue-50' : ''
                                        }`}
                                    onClick={() => handleContactSelect(contact)}
                                >
                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-medium ${contact.type === 'tutor' ? 'bg-blue-500' : 'bg-green-500'
                                        }`}>
                                        {getInitials(contact.name)}
                                    </div>
                                    <div className="ml-3 flex-1">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-gray-900">{contact.name}</p>
                                            <p className="text-xs text-gray-500">{formatLastActive(contact.lastActive)}</p>
                                        </div>
                                        <p className="text-xs text-gray-500 capitalize">{contact.type}</p>
                                    </div>
                                </div>
                            ))}

                            {filteredContacts.length === 0 && (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">No contacts found matching your criteria</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="w-2/3 flex flex-col">
                        {selectedContact ? (
                            <>
                                {/* Selected Contact Header */}
                                <div className="p-4 border-b border-gray-200 flex items-center">
                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-medium ${selectedContact.type === 'tutor' ? 'bg-blue-500' : 'bg-green-500'
                                        }`}>
                                        {getInitials(selectedContact.name)}
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-900">{selectedContact.name}</p>
                                        <p className="text-xs text-gray-500 capitalize">{selectedContact.type}</p>
                                    </div>
                                </div>

                                {/* Messages List */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    {contactMessages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={`max-w-[80%] p-3 rounded-lg ${message.senderType === 'admin'
                                                ? 'bg-blue-100 text-blue-900 ml-auto rounded-br-none'
                                                : 'bg-gray-100 text-gray-900 rounded-bl-none'
                                                }`}
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <p className="text-xs font-medium">
                                                    {message.senderType === 'admin' ? 'You' : message.sender}
                                                </p>
                                                <p className="text-xs text-gray-500 ml-4">{formatTimestamp(message.timestamp)}</p>
                                            </div>
                                            <p className="text-sm">{message.content}</p>
                                        </div>
                                    ))}

                                    {contactMessages.length === 0 && (
                                        <div className="text-center py-8">
                                            <p className="text-gray-500">No message history with this contact</p>
                                            <p className="text-sm text-gray-400 mt-1">Start the conversation below</p>
                                        </div>
                                    )}
                                </div>

                                {/* Message Input */}
                                <div className="p-4 border-t border-gray-200">
                                    <div className="flex">
                                        <input
                                            type="text"
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Type your message..."
                                            value={messageText}
                                            onChange={(e) => setMessageText(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSendMessage();
                                                }
                                            }}
                                        />
                                        <button
                                            className="px-4 py-2 bg-blue-600 text-white rounded-r-md text-sm font-medium hover:bg-blue-700"
                                            onClick={handleSendMessage}
                                        >
                                            <i className="far fa-paper-plane mr-2"></i> Send
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="text-center p-6">
                                    <div className="mx-auto h-12 w-12 text-gray-400">
                                        <i className="far fa-comment-alt text-3xl"></i>
                                    </div>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No conversation selected</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Select a contact from the list to start messaging
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessagingManagement; 