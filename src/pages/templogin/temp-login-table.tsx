import { useEffect, useState } from 'react';
import { __ } from '@wordpress/i18n';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Copy, Eye, EyeOff, Check, Search, Edit, MoreVertical, Clock } from 'lucide-react';
import { TempLogin, TempLoginListQueryParams, UpdateTempLoginData, useAvailableRoles, useDeleteTempLogin, useGetTempLoginList, useToggleTempLoginStatus, useUpdateTempLogin, useExtendTempLoginTime, expiresAtOptions } from '@/services/temp-login-services';
import { copyUrl } from '@/utils/utils';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDebounce } from '@/hooks/useDebounce';
import { TableSkeleton } from '@/components/loader';
import TableRowEmptyState from '@/components/loader/TableRowEmptyState';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import toast from 'react-hot-toast';
import { getTimeAgo, isDateExpired } from '@/utils/date-utils';
import { getTimeRemaining } from '@/utils/date-utils';

const columns = [
	{ key: 'name', label: 'Name' },
	{ key: 'email', label: 'Email' },
	{ key: 'role', label: 'Role' },
	{ key: 'status', label: 'Status' },
	{ key: 'expires_at', label: 'Expires At' },
	{ key: 'login_count', label: 'Login Count' },
	{ key: 'last_login', label: 'Last Login' },
	{ key: 'actions', label: 'Actions' },
];

const TempLoginTable = () => {
	const [searchParams, setSearchParams] = useState<TempLoginListQueryParams>({
		page: 1,
		per_page: 10,
		order: 'desc',
		orderby: 'created_at',
		role: '',
		status: 'all',
	});
	const [searchTerm, setSearchTerm] = useState('');
	const debouncedSearchTerm = useDebounce(searchTerm, 500);

	const [copiedId, setCopiedId] = useState<number | null>(null);
	const [editingTempLogin, setEditingTempLogin] = useState<TempLogin | null>(null);
	const [editFormData, setEditFormData] = useState<Omit<UpdateTempLoginData, 'id'>>({});
	const [deletingTempLogin, setDeletingTempLogin] = useState<TempLogin | null>(null);
	const [extendingTempLogin, setExtendingTempLogin] = useState<TempLogin | null>(null);
	const [extendTimeValue, setExtendTimeValue] = useState<string>('1_hour');

	const { data: tempLoginList, isLoading: isLoadingList } = useGetTempLoginList(searchParams);

	const handleCopyUrl = async (tempLogin: TempLogin) => {
		setCopiedId(tempLogin.id);
		await copyUrl(tempLogin.login_url);

		// Reset the icon after 2 seconds
		setTimeout(() => {
			setCopiedId(null);
		}, 2000);
	};

	const getStatusBadge = (tempLogin: TempLogin) => {
		if (!tempLogin.is_active) {
			return <Badge variant="outline">{__('Inactive', 'versatile-toolkit')}</Badge>;
		}
		if (isDateExpired(tempLogin.expires_at)) {
			return <Badge variant="destructive">{__('Expired', 'versatile-toolkit')}</Badge>;
		}
		return <Badge variant="default">{__('Active', 'versatile-toolkit')}</Badge>;
	};

	const { mutateAsync: toggleTempLoginStatus } = useToggleTempLoginStatus();
	const onToggleStatus = async (id: number, isActive: boolean) => {
		await toggleTempLoginStatus({ id, is_active: !isActive });
	};

	const { mutateAsync: deleteTempLogin } = useDeleteTempLogin();

	const handleDeleteClick = (tempLogin: TempLogin) => {
		setDeletingTempLogin(tempLogin);
	};

	const handleDeleteConfirm = async () => {
		if (!deletingTempLogin) return;

		try {
			await deleteTempLogin({ id: deletingTempLogin.id });
			setDeletingTempLogin(null);
		} catch (error) {
			console.error('Failed to delete temp login:', error);
		}
	};

	const handleDeleteCancel = () => {
		setDeletingTempLogin(null);
	};

	const { mutateAsync: updateTempLogin, isPending: isUpdating } = useUpdateTempLogin();

	const onEdit = (tempLogin: TempLogin) => {
		setEditingTempLogin(tempLogin);
		setEditFormData({
			display_name: tempLogin.display_name,
			email: tempLogin.email,
			role: tempLogin.role,
			redirect_url: tempLogin.redirect_url,
			expires_at: tempLogin.expires_at,
		});
	};

	const handleEditSubmit = async () => {
		if (!editingTempLogin) return;

		// Basic validation
		if (!editFormData.display_name?.trim()) {
			toast.error(__('Display name is required', 'versatile-toolkit'));
			return;
		}

		if (!editFormData.email?.trim()) {
			toast.error(__('Email is required', 'versatile-toolkit'));
			return;
		}

		try {
			await updateTempLogin({
				id: editingTempLogin.id,
				...editFormData,
			});
			setEditingTempLogin(null);
			setEditFormData({});
		} catch (error) {
			console.error('Failed to update temp login', error);
		}
	};

	const handleEditCancel = () => {
		setEditingTempLogin(null);
		setEditFormData({});
	};

	const onExtendTime = (tempLogin: TempLogin) => {
		setExtendingTempLogin(tempLogin);
		setExtendTimeValue('1_hour');
	};

	const { mutateAsync: extendTempLoginTime, isPending: isExtending } = useExtendTempLoginTime();

	const handleExtendTimeSubmit = async () => {
		if (!extendingTempLogin) return;

		try {
			await extendTempLoginTime({
				id: extendingTempLogin.id,
				extend_by: extendTimeValue,
			});
			setExtendingTempLogin(null);
			setExtendTimeValue('1_hour');
		} catch (error) {
			console.error('Failed to extend time');
		}
	};

	const handleExtendTimeCancel = () => {
		setExtendingTempLogin(null);
		setExtendTimeValue('1_hour');
	};

	const { data: availableRoles } = useAvailableRoles();

	const handleSearch = (term: string) => {
		setSearchTerm(term);
	};

	useEffect(() => {
		setSearchParams(prev => ({ ...prev, search: debouncedSearchTerm, page: 1 }));
	}, [debouncedSearchTerm]);

	const handleFilterChange = (key: keyof TempLoginListQueryParams, value: string) => {
		setSearchParams(prev => ({ ...prev, [key]: value }));
	};

	const onPageChange = (page: number) => {
		setSearchParams(prev => ({ ...prev, page }));
	};

	return <>
		<Card>
			<CardHeader>
				<div className="flex flex-wrap gap-4 justify-end">
					<div className="w-[300px]">
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
							{Object.entries(availableRoles ?? {}).map(([key, value]) => (
								<SelectItem key={key} value={key}>{String(value)}</SelectItem>
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
							<SelectItem value="inactive">{__('Inactive', 'versatile-toolkit')}</SelectItem>
							<SelectItem value="expired">{__('Expired', 'versatile-toolkit')}</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							{columns.map((col) => (
								<TableHead key={col.key}>{col.label}</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						{isLoadingList ? (
							// Loading state.
							<TableSkeleton
								columns={columns.map(col => ({
									key: String(col.key),
									label: String(col.key)
								}))}
								rows={5}
							/>
						) : tempLoginList && tempLoginList?.temp_logins?.length > 0 ? (
							// Data rows
							tempLoginList.temp_logins.map((tempLogin: TempLogin) => (
								<TableRow key={tempLogin.id}>
									<TableCell>{tempLogin.display_name}</TableCell>
									<TableCell>
										{tempLogin.email}
									</TableCell>
									<TableCell>
										<Badge>{tempLogin.role}</Badge>
									</TableCell>
									<TableCell>
										{getStatusBadge(tempLogin)}
									</TableCell>
									<TableCell>
										<span className={`${isDateExpired(tempLogin.expires_at) ? 'text-red-500' : ''}`}>
											{getTimeRemaining(tempLogin.expires_at)}
										</span>
										{/* {new Date(tempLogin.expires_at).toLocaleString('en-BD', {
											timeZone: 'Asia/Dhaka',
											hour12: true,
											year: 'numeric',
											month: 'long',
											day: 'numeric',
											hour: '2-digit',
											minute: '2-digit',
										})} */}
									</TableCell>
									<TableCell>
										{tempLogin.login_count}
									</TableCell>
									<TableCell>
										{tempLogin.last_login ? getTimeAgo(tempLogin.last_login) : '-'}
									</TableCell>
									<TableCell>
										<Popover>
											<PopoverTrigger asChild>
												<Button
													size="sm"
													variant="ghost"
													className="h-8 w-8 p-0"
												>
													<MoreVertical className="h-4 w-4" />
													<span className="sr-only">{__('Open menu', 'versatile-toolkit')}</span>
												</Button>
											</PopoverTrigger>
											<PopoverContent className="w-48 p-1" align="end">
												<div className="space-y-1">
													<Button
														variant="ghost"
														size="sm"
														className="w-full justify-start"
														onClick={() => handleCopyUrl(tempLogin)}
													>
														{copiedId === tempLogin.id ? (
															<Check className="mr-2 h-4 w-4 text-green-600" />
														) : (
															<Copy className="mr-2 h-4 w-4" />
														)}
														{__('Copy Login URL', 'versatile-toolkit')}
													</Button>
													<Button
														variant="ghost"
														size="sm"
														className="w-full justify-start"
														onClick={() => onEdit(tempLogin)}
													>
														<Edit className="mr-2 h-4 w-4" />
														{__('Edit', 'versatile-toolkit')}
													</Button>
													<Button
														variant="ghost"
														size="sm"
														className="w-full justify-start"
														onClick={() => onExtendTime(tempLogin)}
													>
														<Clock className="mr-2 h-4 w-4" />
														{__('Extend Time', 'versatile-toolkit')}
													</Button>
													<Button
														variant="ghost"
														size="sm"
														className="w-full justify-start"
														onClick={() => onToggleStatus(tempLogin.id, tempLogin.is_active)}
													>
														{tempLogin.is_active ? (
															<EyeOff className="mr-2 h-4 w-4" />
														) : (
															<Eye className="mr-2 h-4 w-4" />
														)}
														{tempLogin.is_active ? __('Deactivate', 'versatile-toolkit') : __('Activate', 'versatile-toolkit')}
													</Button>
													<Button
														variant="ghost"
														size="sm"
														className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
														onClick={() => handleDeleteClick(tempLogin)}
													>
														<Trash2 className="mr-2 h-4 w-4" />
														{__('Delete', 'versatile-toolkit')}
													</Button>
												</div>
											</PopoverContent>
										</Popover>
									</TableCell>
								</TableRow>
							))
						) : (
							// Empty state
							<TableRowEmptyState title="No temporary logins found" description="Try adjusting your search or filters" />
						)}
					</TableBody>
				</Table>
			</CardContent>

			{/* Pagination */}
			{tempLoginList && tempLoginList.total_pages > 1 && (
				<CardContent className="pt-0">
					<div className="flex justify-center space-x-2">
						<Button
							variant="outline"
							disabled={tempLoginList.page === 1}
							onClick={() => onPageChange(tempLoginList.page - 1)}
						>
							{__('Previous', 'versatile-toolkit')}
						</Button>
						<span className="flex items-center px-4">
							{__('Page', 'versatile-toolkit')} {tempLoginList.page} {__('of', 'versatile-toolkit')} {tempLoginList.total_pages}
						</span>
						<Button
							variant="outline"
							disabled={tempLoginList.page === tempLoginList.total_pages}
							onClick={() => onPageChange(tempLoginList.page + 1)}
						>
							{__('Next', 'versatile-toolkit')}
						</Button>
					</div>
				</CardContent>
			)}
		</Card>

		{/* Edit Modal */}
		<Dialog open={!!editingTempLogin} onOpenChange={(open) => !open && handleEditCancel()}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>{__('Edit Temporary Login', 'versatile-toolkit')}</DialogTitle>
					<p className="text-sm text-muted-foreground">
						{__('Note: Expiration date cannot be modified after creation.', 'versatile-toolkit')}
					</p>
				</DialogHeader>

				<div className="space-y-4">
					<div className='d-flex flex-col gap-3'>
						<Label htmlFor="edit-display-name">{__('Display Name', 'versatile-toolkit')}</Label>
						<Input
							id="edit-display-name"
							value={editFormData.display_name || ''}
							onChange={(e) => setEditFormData(prev => ({ ...prev, display_name: e.target.value }))}
							placeholder={__('Enter display name', 'versatile-toolkit')}
						/>
					</div>

					<div className='d-flex flex-col gap-3'>
						<Label htmlFor="edit-email">{__('Email', 'versatile-toolkit')}</Label>
						<Input
							id="edit-email"
							type="email"
							value={editFormData.email || ''}
							onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
							placeholder={__('Enter email address', 'versatile-toolkit')}
						/>
					</div>

					<div className='d-flex flex-col gap-3'>
						<Label htmlFor="edit-role">{__('Role', 'versatile-toolkit')}</Label>
						<Select
							value={editFormData.role || ''}
							onValueChange={(value) => setEditFormData(prev => ({ ...prev, role: value }))}
						>
							<SelectTrigger>
								<SelectValue placeholder={__('Select role', 'versatile-toolkit')} />
							</SelectTrigger>
							<SelectContent>
								{Object.entries(availableRoles ?? {}).map(([key, value]) => (
									<SelectItem key={key} value={key}>{String(value)}</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className='d-flex flex-col gap-3'>
						<Label htmlFor="edit-redirect-url">{__('Redirect URL', 'versatile-toolkit')}</Label>
						<Input
							id="edit-redirect-url"
							type="url"
							value={editFormData.redirect_url || ''}
							onChange={(e) => setEditFormData(prev => ({ ...prev, redirect_url: e.target.value }))}
							placeholder={__('Enter redirect URL', 'versatile-toolkit')}
						/>
					</div>
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={handleEditCancel}>
						{__('Cancel', 'versatile-toolkit')}
					</Button>
					<Button onClick={handleEditSubmit} disabled={isUpdating}>
						{isUpdating ? __('Updating...', 'versatile-toolkit') : __('Update', 'versatile-toolkit')}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>

		{/* Delete Confirmation Modal */}
		<Dialog open={!!deletingTempLogin} onOpenChange={(open) => !open && handleDeleteCancel()}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle className="text-red-600">{__('Delete Temporary Login', 'versatile-toolkit')}</DialogTitle>
				</DialogHeader>

				<div className="space-y-4">
					<p className="text-sm text-muted-foreground">
						{__('Are you sure you want to delete this temporary login? This action cannot be undone.', 'versatile-toolkit')}
					</p>

					{deletingTempLogin && (
						<div className="bg-gray-50 p-3 rounded-md">
							<p className="font-medium">{deletingTempLogin.display_name}</p>
							<p className="text-sm text-gray-600">{deletingTempLogin.email}</p>
							<p className="text-sm text-gray-600">{deletingTempLogin.role}</p>
						</div>
					)}
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={handleDeleteCancel}>
						{__('Cancel', 'versatile-toolkit')}
					</Button>
					<Button
						variant="destructive"
						onClick={handleDeleteConfirm}
					>
						{__('Delete', 'versatile-toolkit')}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>

		{/* Extend Time Modal */}
		<Dialog open={!!extendingTempLogin} onOpenChange={(open) => !open && handleExtendTimeCancel()}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>{__('Extend Expiration Time', 'versatile-toolkit')}</DialogTitle>
					<p className="text-sm text-muted-foreground">
						{__('Select how much time to add to the current expiration date.', 'versatile-toolkit')}
					</p>
				</DialogHeader>

				<div className="space-y-4">
					{extendingTempLogin && (
						<div className="bg-gray-100 p-3 rounded-md">
							<p className="font-medium">{extendingTempLogin.display_name}</p>
							<p className="text-sm text-gray-600">{extendingTempLogin.email}</p>
							<p className="text-sm text-gray-600">
								{__('Current expiration:', 'versatile-toolkit')} {new Date(extendingTempLogin.expires_at).toLocaleString()}
							</p>
						</div>
					)}

					<div>
						<Label htmlFor="extend-time-select" className='d-block mb-4'>{__('Extend by', 'versatile-toolkit')}</Label>
						<Select value={extendTimeValue} onValueChange={setExtendTimeValue}>
							<SelectTrigger className='w-full d-block'>
								<SelectValue placeholder={__('Select expires at', 'versatile-toolkit')} />
							</SelectTrigger>
							<SelectContent className='w-full max-h-60 scroll'>
								{expiresAtOptions.map((option) => (
									<SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>

				<DialogFooter className='mt-4'>
					<Button variant="outline" onClick={handleExtendTimeCancel}>
						{__('Cancel', 'versatile-toolkit')}
					</Button>
					<Button onClick={handleExtendTimeSubmit} disabled={isExtending}>
						{isExtending ? __('Extending...', 'versatile-toolkit') : __('Extend Time', 'versatile-toolkit')}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	</>
}

export default TempLoginTable;
