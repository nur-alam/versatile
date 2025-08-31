import { useState } from 'react';
import { __ } from '@wordpress/i18n';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Copy, Eye, EyeOff, Check } from 'lucide-react';
import { TempLogin, TempLoginListQueryParams, useDeleteTempLogin, useGetTempLoginList, useToggleTempLoginStatus } from '@/services/temp-login-services';
import { isDateExpired } from '@/utils/date-utils';
import { copyUrl } from '@/utils/utils';

const TempLoginTable = () => {
	const [searchParams] = useState<TempLoginListQueryParams>({
		page: 1,
		per_page: 10,
		order: 'desc',
		orderby: 'created_at',
		role: '',
		status: 'all',
	});

	const [copiedId, setCopiedId] = useState<number | null>(null);

	const { data: tempLoginList } = useGetTempLoginList(searchParams);

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

	return <>
		<Card>
			<CardHeader>
				<CardTitle>{__('Temporary Logins', 'versatile-toolkit')}</CardTitle>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>{__('Name', 'versatile-toolkit')}</TableHead>
							<TableHead>{__('Email', 'versatile-toolkit')}</TableHead>
							<TableHead>{__('Role', 'versatile-toolkit')}</TableHead>
							<TableHead>{__('Status', 'versatile-toolkit')}</TableHead>
							<TableHead>{__('Expires', 'versatile-toolkit')}</TableHead>
							<TableHead>{__('Login Count', 'versatile-toolkit')}</TableHead>
							<TableHead>{__('Last Login', 'versatile-toolkit')}</TableHead>
							<TableHead>{__('Allowed IP', 'versatile-toolkit')}</TableHead>
							<TableHead>{__('Actions', 'versatile-toolkit')}</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{
							tempLoginList && tempLoginList?.temp_logins?.map((tempLogin: TempLogin) => (
								<>
									<TableRow>
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
											{new Date(tempLogin.expires_at).toLocaleString('en-BD', {
												timeZone: 'Asia/Dhaka',
												hour12: true,
												year: 'numeric',
												month: 'long',
												day: 'numeric',
												hour: '2-digit',
												minute: '2-digit',
											})}
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
								</>
							))
						}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	</>
}

export default TempLoginTable;
