import React, { useState, useEffect } from "react";
import { __ } from '@wordpress/i18n';
import { useDebounce } from '@/hooks/useDebounce';
import {
    useTempLogins,
    useCreateTempLogin,
    useDeleteTempLogin,
    useToggleTempLogin,
    useCopyLoginUrl,
    useAvailableRoles,
    tempLoginApi,
    TempLoginCreateData,
    TempLoginSearchParams,
    getExpirationTimestamp
} from '@/services/templogin-services';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search } from 'lucide-react';
import TemploginTable from './templogin-table';

const Templogin = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const [searchParams, setSearchParams] = useState<TempLoginSearchParams>({
        page: 1,
        perPage: 3,
        search: '',
        role: '',
        status: 'all',
        sortKey: 'created_at',
        order: 'desc'
    });

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [createFormData, setCreateFormData] = useState<TempLoginCreateData>({
        display_name: '',
        email: '',
        role: 'subscriber',
        expires_at: '',
        redirect_url: '',
        language: 'en'
    });

    // Queries and mutations
    const { data: tempLoginsData, isLoading, error } = useTempLogins(searchParams);
    const { data: availableRoles } = useAvailableRoles();
    const createMutation = useCreateTempLogin();
    const deleteMutation = useDeleteTempLogin();
    const toggleMutation = useToggleTempLogin();
    const copyUrlMutation = useCopyLoginUrl();

    const expirationOptions = tempLoginApi.getExpirationOptions() || [
        { value: '1_hour', label: __('1 Hour', 'versatile-toolkit') },
        { value: '1_day', label: __('1 Day', 'versatile-toolkit') },
        { value: '1_week', label: __('1 Week', 'versatile-toolkit') },
        { value: '1_month', label: __('1 Month', 'versatile-toolkit') }
    ];

    // Fallback roles in case API fails
    const defaultRoles = {
        'subscriber': __('Subscriber', 'versatile-toolkit'),
        'contributor': __('Contributor', 'versatile-toolkit'),
        'author': __('Author', 'versatile-toolkit'),
        'editor': __('Editor', 'versatile-toolkit'),
        'administrator': __('Administrator', 'versatile-toolkit')
    };

    const rolesToUse = (availableRoles && typeof availableRoles === 'object' && Object.keys(availableRoles).length > 0) ? availableRoles : defaultRoles;

    // Debug logging
    // console.log('Available roles:', availableRoles);
    // console.log('Roles to use:', rolesToUse);
    // console.log('Expiration options:', expirationOptions);

    // Update search params when debounced search term changes
    useEffect(() => {
        setSearchParams(prev => ({ ...prev, search: debouncedSearchTerm, page: 1 }));
    }, [debouncedSearchTerm]);

    const handleSearch = (value: string) => {
        setSearchTerm(value);
    };

    const handleFilterChange = (key: keyof TempLoginSearchParams, value: string) => {
        setSearchParams(prev => ({ ...prev, [key]: value, page: 1 }));
    };

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createMutation.mutate(createFormData, {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                setCreateFormData({
                    display_name: '',
                    email: '',
                    role: 'subscriber',
                    expires_at: '',
                    redirect_url: '',
                    language: 'en'
                });
            }
        });
    };

    const handleExpirationChange = (value: string) => {
        if (value === 'custom') {
            // Let user pick custom date
            setCreateFormData(prev => ({ ...prev, expires_at: '' }));
        } else {
            const timestamp = getExpirationTimestamp(value);
            setCreateFormData(prev => ({ ...prev, expires_at: timestamp }));
        }
    };

    const handleToggleStatus = (id: number, currentStatus: boolean) => {
        toggleMutation.mutate({ id, isActive: !currentStatus });
    };

    const handleDelete = (id: number) => {
        if (confirm(__('Are you sure you want to delete this temporary login?', 'versatile-toolkit'))) {
            deleteMutation.mutate(id);
        }
    };

    const handleCopyUrl = (loginUrl: string) => {
        copyUrlMutation.mutate(loginUrl);
    };



    if (error) {
        return (
            <div className="p-6">
                <div className="text-red-600">
                    {__('Error loading temporary logins: ', 'versatile-toolkit')} {error.message}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">{__('Temporary Logins', 'versatile-toolkit')}</h1>
                    <p className="text-gray-600">
                        {__('Create and manage temporary login access for users', 'versatile-toolkit')}
                    </p>
                </div>
                <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            {__('Create Temp Login', 'versatile-toolkit')}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>{__('Create Temporary Login', 'versatile-toolkit')}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreateSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    {__('Display Name', 'versatile-toolkit')} *
                                </label>
                                <Input
                                    value={createFormData.display_name}
                                    onChange={(e) => setCreateFormData(prev => ({ ...prev, display_name: e.target.value }))}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    {__('Email', 'versatile-toolkit')}
                                </label>
                                <Input
                                    type="email"
                                    value={createFormData.email}
                                    onChange={(e) => setCreateFormData(prev => ({ ...prev, email: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    {__('Role', 'versatile-toolkit')} *
                                </label>
                                <Select
                                    value={createFormData.role}
                                    onValueChange={(value) => {
                                        console.log('Role selected:', value);
                                        setCreateFormData(prev => ({ ...prev, role: value }));
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={__('Select a role', 'versatile-toolkit')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {rolesToUse && typeof rolesToUse === 'object' && Object.entries(rolesToUse).map(([key, label]) => (
                                            <SelectItem key={`role-${key}`} value={key}>{label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    {__('Expires In', 'versatile-toolkit')} *
                                </label>
                                <Select onValueChange={(value) => {
                                    console.log('Expiration selected:', value);
                                    handleExpirationChange(value);
                                }}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={__('Select expiration', 'versatile-toolkit')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {expirationOptions && expirationOptions.map(option => (
                                            <SelectItem key={`exp-${option.value}`} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    {__('Redirect URL', 'versatile-toolkit')}
                                </label>
                                <Input
                                    type="url"
                                    value={createFormData.redirect_url}
                                    onChange={(e) => setCreateFormData(prev => ({ ...prev, redirect_url: e.target.value }))}
                                    placeholder="https://example.com/dashboard"
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                                    {__('Cancel', 'versatile-toolkit')}
                                </Button>
                                <Button type="submit" disabled={createMutation.isPending}>
                                    {createMutation.isPending ? __('Creating...', 'versatile-toolkit') : __('Create', 'versatile-toolkit')}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-wrap gap-4">
                        <div className="flex-1 min-w-64">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder={__('Search by name or email...', 'versatile-toolkit')}
                                    value={searchTerm}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <Select value={searchParams.role || 'all_roles'} onValueChange={(value) => handleFilterChange('role', value === 'all_roles' ? '' : value)}>
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder={__('All Roles', 'versatile-toolkit')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all_roles">{__('All Roles', 'versatile-toolkit')}</SelectItem>
                                {rolesToUse && Object.entries(rolesToUse).map(([key, label]) => (
                                    <SelectItem key={key} value={key}>{label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={searchParams.status} onValueChange={(value) => handleFilterChange('status', value)}>
                            <SelectTrigger className="w-48">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{__('All Status', 'versatile-toolkit')}</SelectItem>
                                <SelectItem value="active">{__('Active', 'versatile-toolkit')}</SelectItem>
                                <SelectItem value="expired">{__('Expired', 'versatile-toolkit')}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Temporary Logins Table */}
            <TemploginTable
                tempLoginsData={tempLoginsData}
                isLoading={isLoading}
                rolesToUse={rolesToUse}
                currentPage={searchParams.page || 1}
                onCopyUrl={handleCopyUrl}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDelete}
                onPageChange={(page) => setSearchParams(prev => ({ ...prev, page }))}
            />
        </div>
    );
};

export default Templogin;