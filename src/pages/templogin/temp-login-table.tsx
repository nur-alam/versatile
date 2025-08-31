import { useEffect, useState } from 'react';
import { __ } from '@wordpress/i18n';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Copy, Eye, EyeOff, Check, Search } from 'lucide-react';
import { TempLogin, TempLoginListQueryParams, useAvailableRoles, useDeleteTempLogin, useGetTempLoginList, useToggleTempLoginStatus } from '@/services/temp-login-services';
import { isDateExpired } from '@/utils/date-utils';
import { copyUrl } from '@/utils/utils';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDebounce } from '@/hooks/useDebounce';
import { TableSkeleton } from '@/components/loader';
import { EmptyStateIcon } from '@/icons';
import TableRowEmptyState from '@/components/loader/TableRowEmptyState';

const columns = [
	{ key: 'name', label: 'Name' },
	{ key: 'email', label: 'Email' },
	{ key: 'role', label: 'Role' },
	{ key: 'status', label: 'Status' },
	{ key: 'expires_at', label: 'Expires At' },
	{ key: 'login_count', label: 'Login Count' },
	{ key: 'last_login', label: 'Last Login' },
	{ key: 'allowed_ip', label: 'Allowed IP' },
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
	const onDelete = async (id: number) => {
		await deleteTempLogin({ id });
	};

	const { data: availableRoles } = useAvailableRoles();

	const handleSearch = (term: string) => {
		setSearchTerm(term);
	};

	useEffect(() => {
		setSearchParams(prev => ({ ...prev, search: debouncedSearchTerm, page: 1 }));
	}, [debouncedSearchTerm]);

	const handleFilterChange = (key: keyof TempLoginListQueryParams, value: string) => {
		console.log('key', key, 'value', value);
		setSearchParams(prev => ({ ...prev, [key]: value }));
	};

	return <>
		<Card>
			<CardHeader>
				{/* <CardTitle className='text-2xl font-bold'>
					{__('Temporary Logins', 'versatile-toolkit')}
				</CardTitle> */}
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
							// Loading state
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
										{tempLogin.expires_at}
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
										{tempLogin.last_login}
									</TableCell>
									<TableCell>
										{tempLogin.allowed_ip}
									</TableCell>
									<TableCell>
										<div className="flex space-x-2">
											<Button
												size="sm"
												variant="outline"
												onClick={() => handleCopyUrl(tempLogin)}
												title={__('Copy Login URL', 'versatile-toolkit')}
												className={copiedId === tempLogin.id ? 'bg-green-50 border-green-200' : ''}
											>
												{copiedId === tempLogin.id ? (
													<Check className="w-4 h-4 text-green-600" />
												) : (
													<Copy className="w-4 h-4" />
												)}
											</Button>
											<Button
												size="sm"
												variant="outline"
												onClick={() => onToggleStatus(tempLogin.id, tempLogin.is_active)}
												title={__('Deactivate', 'versatile-toolkit')}
											>
												{tempLogin.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
											</Button>
											<Button
												size="sm"
												variant="outline"
												onClick={() => onDelete(tempLogin.id)}
												title={__('Delete', 'versatile-toolkit')}
											>
												<Trash2 className="w-4 h-4" />
											</Button>
										</div>
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
		</Card>
	</>
}

export default TempLoginTable;
