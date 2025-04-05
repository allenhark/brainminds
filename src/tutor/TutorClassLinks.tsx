import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import toast from 'react-hot-toast';

interface ClassLink {
    id: number;
    name: string;
    url: string;
    platform: string;
    description: string;
    isDefault: boolean;
}

const TutorClassLinks: React.FC = () => {
    const [links, setLinks] = useState<ClassLink[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingLink, setEditingLink] = useState<ClassLink | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        url: '',
        platform: '',
        description: '',
        isDefault: false
    });

    // Platforms options
    const platforms = [
        { value: 'zoom', label: 'Zoom' },
        { value: 'google-meet', label: 'Google Meet' },
        { value: 'microsoft-teams', label: 'Microsoft Teams' },
        { value: 'skype', label: 'Skype' },
        { value: 'other', label: 'Other' }
    ];

    // Simulate fetching link data
    useEffect(() => {
        setIsLoading(true);

        setTimeout(() => {
            setLinks([
                {
                    id: 1,
                    name: 'Regular Zoom Class',
                    url: 'https://zoom.us/j/123456789?pwd=abc123',
                    platform: 'zoom',
                    description: 'My primary Zoom meeting room for regular classes',
                    isDefault: true
                },
                {
                    id: 2,
                    name: 'Google Meet Backup',
                    url: 'https://meet.google.com/abc-defg-hij',
                    platform: 'google-meet',
                    description: 'Backup option if Zoom is having issues',
                    isDefault: false
                },
                {
                    id: 3,
                    name: 'Special Topics Class',
                    url: 'https://zoom.us/j/987654321?pwd=xyz789',
                    platform: 'zoom',
                    description: 'Special room for advanced topics with screen sharing enabled',
                    isDefault: false
                }
            ]);

            setIsLoading(false);
        }, 500);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: checked
        }));
    };

    const handleSelectChange = (value: string) => {
        setFormData(prev => ({
            ...prev,
            platform: value
        }));
    };

    const openAddDialog = () => {
        setFormData({
            name: '',
            url: '',
            platform: '',
            description: '',
            isDefault: false
        });
        setEditingLink(null);
        setIsDialogOpen(true);
    };

    const openEditDialog = (link: ClassLink) => {
        setFormData({
            name: link.name,
            url: link.url,
            platform: link.platform,
            description: link.description,
            isDefault: link.isDefault
        });
        setEditingLink(link);
        setIsDialogOpen(true);
    };

    const handleSubmit = () => {
        if (!formData.name || !formData.url || !formData.platform) {
            toast.error('Please fill in all required fields');
            return;
        }

        setIsLoading(true);

        // If creating a new link
        if (!editingLink) {
            // Simulate API call to create link
            setTimeout(() => {
                const newLink = {
                    id: links.length + 1,
                    ...formData
                };

                // If setting as default, update other links
                let updatedLinks;
                if (formData.isDefault) {
                    updatedLinks = links.map(link => ({
                        ...link,
                        isDefault: false
                    }));
                    updatedLinks.push(newLink);
                } else {
                    updatedLinks = [...links, newLink];
                }

                setLinks(updatedLinks);
                setIsDialogOpen(false);
                setIsLoading(false);
                toast.success('Class link added successfully');
            }, 500);
        } else {
            // Simulate API call to update link
            setTimeout(() => {
                let updatedLinks;
                if (formData.isDefault) {
                    // If setting this as default, unset others
                    updatedLinks = links.map(link => ({
                        ...link,
                        isDefault: link.id === editingLink.id ? true : false
                    }));
                } else {
                    updatedLinks = links.map(link =>
                        link.id === editingLink.id
                            ? { ...link, ...formData }
                            : link
                    );
                }

                setLinks(updatedLinks);
                setIsDialogOpen(false);
                setIsLoading(false);
                toast.success('Class link updated successfully');
            }, 500);
        }
    };

    const handleDelete = (id: number) => {
        setIsLoading(true);

        // Simulate API call to delete link
        setTimeout(() => {
            const updatedLinks = links.filter(link => link.id !== id);
            setLinks(updatedLinks);
            setIsLoading(false);
            toast.success('Class link deleted');
        }, 500);
    };

    const handleSetDefault = (id: number) => {
        setIsLoading(true);

        // Simulate API call to set default
        setTimeout(() => {
            const updatedLinks = links.map(link => ({
                ...link,
                isDefault: link.id === id
            }));

            setLinks(updatedLinks);
            setIsLoading(false);
            toast.success('Default class link updated');
        }, 500);
    };

    const getPlatformIcon = (platform: string) => {
        switch (platform) {
            case 'zoom':
                return 'far fa-video';
            case 'google-meet':
                return 'fab fa-google';
            case 'microsoft-teams':
                return 'fab fa-microsoft';
            case 'skype':
                return 'fab fa-skype';
            default:
                return 'far fa-globe';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Class Links</h1>
                <Button onClick={openAddDialog}>
                    <i className="far fa-plus mr-2"></i>
                    Add New Link
                </Button>
            </div>

            <p className="text-gray-500">
                Manage your online class links that can be quickly assigned to sessions.
                These links will be included in session notifications and reminders sent to students.
            </p>

            {isLoading && links.length === 0 ? (
                <div className="flex justify-center py-10">
                    <i className="far fa-spinner-third fa-spin text-2xl text-gray-400"></i>
                </div>
            ) : links.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                    {links.map(link => (
                        <Card key={link.id} className={link.isDefault ? 'border-blue-200 bg-blue-50' : ''}>
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center">
                                            <i className={`${getPlatformIcon(link.platform)} text-xl mr-3 text-gray-600`}></i>
                                            <div>
                                                <h3 className="font-medium text-lg flex items-center">
                                                    {link.name}
                                                    {link.isDefault && (
                                                        <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                                            Default
                                                        </span>
                                                    )}
                                                </h3>
                                                <p className="text-gray-500 truncate">
                                                    <a
                                                        href={link.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:underline"
                                                    >
                                                        {link.url}
                                                    </a>
                                                </p>
                                            </div>
                                        </div>

                                        {link.description && (
                                            <p className="mt-3 text-gray-600">
                                                {link.description}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex space-x-2">
                                        {!link.isDefault && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleSetDefault(link.id)}
                                            >
                                                <i className="far fa-star mr-2"></i>
                                                Set Default
                                            </Button>
                                        )}

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => openEditDialog(link)}
                                        >
                                            <i className="far fa-edit mr-2"></i>
                                            Edit
                                        </Button>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => handleDelete(link.id)}
                                        >
                                            <i className="far fa-trash-alt mr-2"></i>
                                            Delete
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
                        <i className="far fa-link-slash text-5xl text-gray-300 mb-4"></i>
                        <p className="text-gray-500">No class links created yet</p>
                        <Button className="mt-4" onClick={openAddDialog}>
                            Create Your First Link
                        </Button>
                    </CardContent>
                </Card>
            )}

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>
                            {editingLink ? 'Edit Class Link' : 'Add New Class Link'}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Link Name <span className="text-red-500">*</span></Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="e.g., Regular Zoom Class"
                                value={formData.name}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="platform">Platform <span className="text-red-500">*</span></Label>
                            <Select value={formData.platform} onValueChange={handleSelectChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select platform" />
                                </SelectTrigger>
                                <SelectContent>
                                    {platforms.map(platform => (
                                        <SelectItem key={platform.value} value={platform.value}>
                                            {platform.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="url">Class Link URL <span className="text-red-500">*</span></Label>
                            <Input
                                id="url"
                                name="url"
                                placeholder="e.g., https://zoom.us/j/123456789"
                                value={formData.url}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="Additional information about this link"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={3}
                            />
                        </div>

                        <div className="flex items-center space-x-2 pt-2">
                            <input
                                type="checkbox"
                                id="isDefault"
                                name="isDefault"
                                checked={formData.isDefault}
                                onChange={handleCheckboxChange}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <Label htmlFor="isDefault" className="text-sm text-gray-700">
                                Set as default link (automatically added to new sessions)
                            </Label>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <i className="far fa-spinner-third fa-spin mr-2"></i>
                                    {editingLink ? 'Updating...' : 'Creating...'}
                                </>
                            ) : (
                                editingLink ? 'Update Link' : 'Add Link'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default TutorClassLinks; 