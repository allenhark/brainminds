import React, { useState, useEffect } from 'react';
import Api from "@/Api";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';

type Admin = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    status: string;
    createdAt: string;
    updatedAt: string;
    avatar: string | null;
}

type AdminFormData = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    status: string;
}

const UserManagement: React.FC = () => {
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
    const [formData, setFormData] = useState<AdminFormData>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        status: 'ACTIVE'
    });

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        try {
            setIsLoading(true);
            const response = await Api.get('/admin/admins');
            setAdmins(response.data);
        } catch (error) {
            console.error('Failed to fetch admins:', error);
            toast.error('Failed to load admin users');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateAdmin = () => {
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            status: 'ACTIVE'
        });
        setIsCreateDialogOpen(true);
    };

    const handleViewAdmin = (admin: Admin) => {
        setSelectedAdmin(admin);
        setIsViewDialogOpen(true);
    };

    const handleEditAdmin = (admin: Admin) => {
        setSelectedAdmin(admin);
        setFormData({
            firstName: admin.firstName,
            lastName: admin.lastName,
            email: admin.email,
            phone: admin.phone || '',
            status: admin.status
        });
        setIsEditDialogOpen(true);
    };

    const handleDeleteAdmin = (admin: Admin) => {
        setSelectedAdmin(admin);
        setIsDeleteDialogOpen(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmitCreate = async () => {
        try {
            await Api.post('/admin/admins', formData);
            toast.success('Admin created successfully');
            setIsCreateDialogOpen(false);
            fetchAdmins();
        } catch (error) {
            console.error('Failed to create admin:', error);
            toast.error('Failed to create admin');
        }
    };

    const handleSubmitEdit = async () => {
        if (!selectedAdmin) return;

        try {
            await Api.put(`/admin/admins/${selectedAdmin.id}`, formData);
            toast.success('Admin updated successfully');
            setIsEditDialogOpen(false);
            fetchAdmins();
        } catch (error) {
            console.error('Failed to update admin:', error);
            toast.error('Failed to update admin');
        }
    };

    const handleConfirmDelete = async () => {
        if (!selectedAdmin) return;

        try {
            await Api.delete(`/admin/admins/${selectedAdmin.id}`);
            toast.success('Admin deleted successfully');
            setIsDeleteDialogOpen(false);
            fetchAdmins();
        } catch (error) {
            console.error('Failed to delete admin:', error);
            toast.error('Failed to delete admin');
        }
    };

    // Filter admins based on search query
    const filteredAdmins = admins.filter(admin => {
        const fullName = `${admin.firstName} ${admin.lastName}`.toLowerCase();
        const searchLower = searchQuery.toLowerCase();

        return (
            fullName.includes(searchLower) ||
            admin.email.toLowerCase().includes(searchLower)
        );
    });

    return (
        <div className="p-6">
            <HelmetComponent
                title="Admin Management"
                description="Admin management for the admin"
            />

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Admin Management</h1>
                <Button onClick={handleCreateAdmin} className="bg-green-600 hover:bg-green-700">
                    <i className="fas fa-plus mr-2"></i> Add Admin
                </Button>
            </div>

            <div className="bg-white rounded-lg p-5 shadow-sm mb-6">
                <div className="relative mb-4">
                    <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    <Input
                        type="text"
                        placeholder="Search admins..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAdmins.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                                        No admin users found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredAdmins.map((admin) => (
                                    <TableRow key={admin.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                                                    {admin.avatar ? (
                                                        <img
                                                            src={admin.avatar}
                                                            alt={`${admin.firstName} ${admin.lastName}`}
                                                            className="w-8 h-8 rounded-full"
                                                        />
                                                    ) : (
                                                        <i className="fas fa-user text-gray-500"></i>
                                                    )}
                                                </div>
                                                {admin.firstName} {admin.lastName}
                                            </div>
                                        </TableCell>
                                        <TableCell>{admin.email}</TableCell>
                                        <TableCell>
                                            <Badge className={
                                                admin.status === 'ACTIVE'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-gray-100 text-gray-800'
                                            }>
                                                {admin.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{new Date(admin.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <div className="flex space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleViewAdmin(admin)}
                                                    className="p-1 h-8 w-8"
                                                >
                                                    <i className="fas fa-eye text-blue-500"></i>
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleEditAdmin(admin)}
                                                    className="p-1 h-8 w-8"
                                                >
                                                    <i className="fas fa-edit text-amber-500"></i>
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDeleteAdmin(admin)}
                                                    className="p-1 h-8 w-8"
                                                >
                                                    <i className="fas fa-trash text-red-500"></i>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                )}
            </div>

            {/* Create Admin Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Create New Admin</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium mb-1">First Name</label>
                                <Input
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    placeholder="First Name"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium mb-1">Last Name</label>
                                <Input
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    placeholder="Last Name"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Email"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone</label>
                            <Input
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="Phone"
                            />
                        </div>
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium mb-1">Status</label>
                            <Select
                                value={formData.status}
                                onValueChange={(value) => handleSelectChange('status', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ACTIVE">Active</SelectItem>
                                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSubmitCreate}>Create Admin</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* View Admin Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Admin Details</DialogTitle>
                    </DialogHeader>
                    {selectedAdmin && (
                        <div className="py-4">
                            <div className="flex justify-center mb-4">
                                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                                    {selectedAdmin.avatar ? (
                                        <img
                                            src={selectedAdmin.avatar}
                                            alt={`${selectedAdmin.firstName} ${selectedAdmin.lastName}`}
                                            className="w-24 h-24 rounded-full"
                                        />
                                    ) : (
                                        <i className="fas fa-user text-gray-500 text-4xl"></i>
                                    )}
                                </div>
                            </div>
                            <dl className="space-y-3">
                                <div className="grid grid-cols-3 gap-4">
                                    <dt className="text-sm font-medium">Name:</dt>
                                    <dd className="text-sm col-span-2">{selectedAdmin.firstName} {selectedAdmin.lastName}</dd>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <dt className="text-sm font-medium">Email:</dt>
                                    <dd className="text-sm col-span-2">{selectedAdmin.email}</dd>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <dt className="text-sm font-medium">Phone:</dt>
                                    <dd className="text-sm col-span-2">{selectedAdmin.phone || 'None'}</dd>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <dt className="text-sm font-medium">Status:</dt>
                                    <dd className="text-sm col-span-2">
                                        <Badge className={
                                            selectedAdmin.status === 'ACTIVE'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                        }>
                                            {selectedAdmin.status}
                                        </Badge>
                                    </dd>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <dt className="text-sm font-medium">Created:</dt>
                                    <dd className="text-sm col-span-2">{new Date(selectedAdmin.createdAt).toLocaleString()}</dd>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <dt className="text-sm font-medium">Last Updated:</dt>
                                    <dd className="text-sm col-span-2">{new Date(selectedAdmin.updatedAt).toLocaleString()}</dd>
                                </div>
                            </dl>
                        </div>
                    )}
                    <DialogFooter>
                        <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Admin Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Admin</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="edit-firstName" className="block text-sm font-medium mb-1">First Name</label>
                                <Input
                                    id="edit-firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    placeholder="First Name"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="edit-lastName" className="block text-sm font-medium mb-1">Last Name</label>
                                <Input
                                    id="edit-lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    placeholder="Last Name"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="edit-email" className="block text-sm font-medium mb-1">Email</label>
                            <Input
                                id="edit-email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Email"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="edit-phone" className="block text-sm font-medium mb-1">Phone</label>
                            <Input
                                id="edit-phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="Phone"
                            />
                        </div>
                        <div>
                            <label htmlFor="edit-status" className="block text-sm font-medium mb-1">Status</label>
                            <Select
                                value={formData.status}
                                onValueChange={(value) => handleSelectChange('status', value)}
                            >
                                <SelectTrigger id="edit-status">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ACTIVE">Active</SelectItem>
                                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSubmitEdit}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Admin Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Confirm Delete</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        {selectedAdmin && (
                            <p>
                                Are you sure you want to delete the admin account for <span className="font-semibold">{selectedAdmin.firstName} {selectedAdmin.lastName}</span>?
                                This action cannot be undone.
                            </p>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleConfirmDelete}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default UserManagement;