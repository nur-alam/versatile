import { TableSkeleton } from '@/components/loader';
import TableRowEmptyState from '@/components/loader/TableRowEmptyState';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ConnectionType, useGetEmailConnections } from '@/services/smtp-services';
import { __ } from '@wordpress/i18n';
import { Mail, Pencil, PlusIcon, Send, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EditConnectionSheet } from './edit-connection';

const columns = [
	{ key: 'connection', label: __('Connection', 'versatile-toolkit') },
	{ key: 'provider', label: __('Provider', 'versatile-toolkit') },
	{ key: 'email', label: __('Email', 'versatile-toolkit') },
	{ key: 'created_at', label: __('Created On', 'versatile-toolkit') },
	{ key: 'test_email', label: __('Test Email', 'versatile-toolkit') },
	{ key: 'actions', label: __('Actions', 'versatile-toolkit') },
];

const formatDateTime = (value: string) => {
	if (!value) {
		return '-';
	}

	const date = new Date(value.replace(' ', 'T'));

	if (Number.isNaN(date.getTime())) {
		return value;
	}

	return date.toLocaleString();
};

const Connections = () => {
	const navigate = useNavigate();
	const [selectedConnection, setSelectedConnection] = useState<ConnectionType | null>(null);
	const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
	const { data, isLoading } = useGetEmailConnections();
	const connections = data?.data ?? [];

	const handleEditConnection = (connection: ConnectionType) => {
		setSelectedConnection(connection);
		setIsEditSheetOpen(true);
	};

	return (
		<Card className="vt-mt-6">
			<CardHeader className="vt-flex vt-flex-row vt-items-center vt-justify-between">
				<CardTitle>{__('Connection List', 'versatile-toolkit')}</CardTitle>
				<Button size="sm" className="vt-gap-x-2" onClick={() => navigate('/smtp/connection/add')}>
					<PlusIcon className="vt-w-4 vt-h-4" />
					{__('Add Connection', 'versatile-toolkit')}
				</Button>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							{columns.map((column) => (
								<TableHead key={column.key}>{column.label}</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						{isLoading ? (
							<TableSkeleton columns={columns} rows={4} />
						) : connections.length > 0 ? (
							connections.map((connection: ConnectionType) => (
								<TableRow key={connection.provider}>
									<TableCell>
										<div className="vt-flex vt-items-center vt-justify-center vt-w-8 vt-h-8 vt-rounded-md vt-bg-primary/10 vt-text-primary">
											<Mail className="vt-w-4 vt-h-4" />
										</div>
									</TableCell>
									<TableCell className="vt-font-medium">{connection.provider}</TableCell>
									<TableCell>{connection.fromEmail || '-'}</TableCell>
									<TableCell>{formatDateTime(connection.createdAt)}</TableCell>
									<TableCell>
										<Button type="button" size="sm" variant="outline" className="vt-gap-2">
											<Send className="vt-w-4 vt-h-4" />
											{__('Send Test Email', 'versatile-toolkit')}
										</Button>
									</TableCell>
									<TableCell>
										<div className="vt-flex vt-items-center vt-gap-2">
											<Button type="button" size="icon" variant="ghost" aria-label={__('Edit connection', 'versatile-toolkit')}
												onClick={() => handleEditConnection(connection)}
											>
												<Pencil className="vt-w-4 vt-h-4" />
											</Button>
											<Button type="button" size="icon" variant="ghost" aria-label={__('Delete connection', 'versatile-toolkit')}>
												<Trash2 className="vt-w-4 vt-h-4 vt-text-destructive" />
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRowEmptyState
								colSpan={columns.length}
								title={__('No email connections found', 'versatile-toolkit')}
								description={__('Add a connection to start sending email with your preferred provider.', 'versatile-toolkit')}
							/>
						)}
					</TableBody>
				</Table>

			{
				selectedConnection && (
					<>
						{/* <TestEmailSheet
							open={isTestEmailSheetOpen}
							onOpenChange={setIsTestEmailSheetOpen}
							connection={selectedConnection}
						/> */}
						<EditConnectionSheet
							open={isEditSheetOpen}
							onOpenChange={setIsEditSheetOpen}
							connection={selectedConnection}
						/>
						{/* <DeleteConnectionSheet
							open={isDeleteSheetOpen}
							onOpenChange={setIsDeleteSheetOpen}
							connection={selectedConnection}
							setInitialConnections={setInitialConnections}
						/> */}
					</>
				)
			}
				
			</CardContent>
		</Card>
	);
};

export default Connections;
