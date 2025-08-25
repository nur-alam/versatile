import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { Button, Card, CardBody, CardHeader, Flex, FlexItem, Notice, Spinner, SelectControl } from '@wordpress/components';
import config from '@/config';

interface DebugLogStatus {
	enabled: boolean;
	file_exists: boolean;
	file_size: number;
	file_size_formatted: string;
	last_modified: number | null;
}

interface LogEntry {
	id: number;
	timestamp: string;
	type: string;
	severity: 'error' | 'warning' | 'notice' | 'info';
	message: string;
	file: string;
	line: string;
	stack_trace: string;
	raw_line: string;
}

interface DebugLogContent {
	entries: LogEntry[];
	total_lines: number;
	current_page: number;
	total_pages: number;
	per_page: number;
}

const DebugLog = () => {
	const [status, setStatus] = useState<DebugLogStatus | null>(null);
	const [logContent, setLogContent] = useState<DebugLogContent | null>(null);
	const [loading, setLoading] = useState(false);
	const [toggleLoading, setToggleLoading] = useState(false);
	const [clearLoading, setClearLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [perPage, setPerPage] = useState(10);
	const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
	const [autoRefresh, setAutoRefresh] = useState(false);
	const [selectedEntry, setSelectedEntry] = useState<LogEntry | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const nonce = config?.nonce_value || '';

	// Auto refresh every 30 seconds when enabled
	useEffect(() => {
		let interval: NodeJS.Timeout;
		if (autoRefresh && status?.enabled) {
			interval = setInterval(() => {
				loadLogContent(currentPage, perPage, false);
			}, 30000);
		}
		return () => {
			if (interval) clearInterval(interval);
		};
	}, [autoRefresh, status?.enabled, currentPage, perPage]);

	const showNotice = (type: 'success' | 'error', message: string) => {
		setNotice({ type, message });
		setTimeout(() => setNotice(null), 5000);
	};

	const loadStatus = async () => {
		try {
			const formData = new FormData();
			formData.append('action', 'versatile_get_debug_log_status');
			formData.append('versatile_nonce', nonce);

			const response = await fetch(config.ajax_url, {
				method: 'POST',
				body: formData
			});

			const result = await response.json();
			if (result.success) {
				setStatus(result.data);
			}
		} catch (error) {
			console.error('Error loading debug log status:', error);
		}
	};

	const loadLogContent = async (page = 1, itemsPerPage = 50, showLoader = true) => {
		if (showLoader) setLoading(true);

		try {
			const formData = new FormData();
			formData.append('action', 'versatile_get_debug_log_content');
			formData.append('versatile_nonce', nonce);
			formData.append('page', page.toString());
			formData.append('per_page', itemsPerPage.toString());

			const response = await fetch(config.ajax_url, {
				method: 'POST',
				body: formData
			});

			const result = await response.json();
			if (result.success) {
				setLogContent(result.data);
			}
		} catch (error) {
			console.error('Error loading debug log content:', error);
		} finally {
			if (showLoader) setLoading(false);
		}
	};

	const toggleDebugLog = async () => {
		setToggleLoading(true);

		try {
			const formData = new FormData();
			formData.append('action', 'versatile_toggle_debug_log');
			formData.append('versatile_nonce', nonce);
			formData.append('enable', (!status?.enabled).toString());

			const response = await fetch(config.ajax_url, {
				method: 'POST',
				body: formData
			});

			const result = await response.json();
			if (result.success) {
				showNotice('success', result.data.message);
				await loadStatus();
				if (result.data.enabled) {
					loadLogContent(1, perPage);
				} else {
					setLogContent(null);
				}
			} else {
				showNotice('error', result.data?.message || __('Failed to toggle debug log', 'versatile-toolkit'));
			}
		} catch (error) {
			showNotice('error', __('Error toggling debug log', 'versatile-toolkit'));
		} finally {
			setToggleLoading(false);
		}
	};

	const clearDebugLog = async () => {
		if (!confirm(__('Are you sure you want to clear the debug log? This action cannot be undone.', 'versatile-toolkit'))) {
			return;
		}

		setClearLoading(true);

		try {
			const formData = new FormData();
			formData.append('action', 'versatile_clear_debug_log');
			formData.append('versatile_nonce', nonce);

			const response = await fetch(config.ajax_url, {
				method: 'POST',
				body: formData
			});

			const result = await response.json();
			if (result.success) {
				showNotice('success', result.data.message);
				await loadStatus();
				loadLogContent(1, perPage);
			} else {
				showNotice('error', result.data?.message || __('Failed to clear debug log', 'versatile-toolkit'));
			}
		} catch (error) {
			showNotice('error', __('Error clearing debug log', 'versatile-toolkit'));
		} finally {
			setClearLoading(false);
		}
	};

	const downloadDebugLog = () => {
		const url = `${config.ajax_url}?action=versatile_download_debug_log&versatile_nonce=${nonce}`;
		window.open(url, '_blank');
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
		loadLogContent(page, perPage);
	};

	const handlePerPageChange = (newPerPage: string) => {
		const itemsPerPage = parseInt(newPerPage);
		setPerPage(itemsPerPage);
		setCurrentPage(1);
		loadLogContent(1, itemsPerPage);
	};

	useEffect(() => {
		loadStatus();
	}, []);

	useEffect(() => {
		if (status?.enabled && status?.file_exists) {
			loadLogContent(currentPage, perPage);
		}
	}, [status?.enabled]);

	const formatDate = (timestamp: number) => {
		return new Date(timestamp * 1000).toLocaleString();
	};

	const formatLogTimestamp = (timestamp: string) => {
		if (!timestamp) return '';
		try {
			// Parse WordPress log timestamp format: "16-Aug-2025 10:30:15 UTC"
			const date = new Date(timestamp);
			return date.toLocaleString();
		} catch {
			return timestamp;
		}
	};

	const getSeverityColor = (severity: string) => {
		switch (severity) {
			case 'error':
				return '#d63638';
			case 'warning':
				return '#f56e28';
			case 'notice':
				return '#f0b849';
			default:
				return '#2271b1';
		}
	};

	const getSeverityIcon = (severity: string) => {
		switch (severity) {
			case 'error':
				return '❌';
			case 'warning':
				return '⚠️';
			case 'notice':
				return '📝';
			default:
				return 'ℹ️';
		}
	};

	const openDetailModal = (entry: LogEntry) => {
		setSelectedEntry(entry);
		setIsModalOpen(true);
	};

	const closeDetailModal = () => {
		setSelectedEntry(null);
		setIsModalOpen(false);
	};

	const renderPagination = () => {
		if (!logContent || logContent.total_pages <= 1) return null;

		const pages = [];
		const maxVisiblePages = 5;
		let startPage = Math.max(1, logContent.current_page - Math.floor(maxVisiblePages / 2));
		let endPage = Math.min(logContent.total_pages, startPage + maxVisiblePages - 1);

		if (endPage - startPage + 1 < maxVisiblePages) {
			startPage = Math.max(1, endPage - maxVisiblePages + 1);
		}

		for (let i = startPage; i <= endPage; i++) {
			pages.push(
				<Button
					key={i}
					variant={i === logContent.current_page ? 'primary' : 'secondary'}
					onClick={() => handlePageChange(i)}
					disabled={loading}
				>
					{i}
				</Button>
			);
		}

		return (
			<Flex justify="space-between" align="center" style={{ marginTop: '20px' }}>
				<FlexItem>
					<Button
						variant="secondary"
						onClick={() => handlePageChange(logContent.current_page - 1)}
						disabled={logContent.current_page <= 1 || loading}
					>
						{__('Previous', 'versatile-toolkit')}
					</Button>
				</FlexItem>
				<FlexItem>
					<Flex gap={1}>
						{pages}
					</Flex>
				</FlexItem>
				<FlexItem>
					<Button
						variant="secondary"
						onClick={() => handlePageChange(logContent.current_page + 1)}
						disabled={logContent.current_page >= logContent.total_pages || loading}
					>
						{__('Next', 'versatile-toolkit')}
					</Button>
				</FlexItem>
			</Flex>
		);
	};

	return (
		<div>
			{notice && (
				<Notice status={notice.type} isDismissible onRemove={() => setNotice(null)}>
					{notice.message}
				</Notice>
			)}

			<Card>
				<CardHeader>
					<h2>{__('Debug Log Settings', 'versatile-toolkit')}</h2>
				</CardHeader>
				<CardBody>
					{status && (
						<>
							<Flex direction="column" gap={4}>
								<FlexItem>
									<Flex justify="space-between" align="center">
										<FlexItem>
											<strong>{__('Debug Logging Status:', 'versatile-toolkit')}</strong>
											<span style={{ marginLeft: '10px', color: status.enabled ? '#00a32a' : '#d63638' }}>
												{status.enabled ? __('Enabled', 'versatile-toolkit') : __('Disabled', 'versatile-toolkit')}
											</span>
										</FlexItem>
										<FlexItem>
											<Button
												variant="primary"
												onClick={toggleDebugLog}
												disabled={toggleLoading}
											>
												{toggleLoading && <Spinner />}
												{status.enabled
													? __('Disable Debug Log', 'versatile-toolkit')
													: __('Enable Debug Log', 'versatile-toolkit')
												}
											</Button>
										</FlexItem>
									</Flex>
								</FlexItem>

								{status.file_exists && (
									<FlexItem>
										<Flex direction="column" gap={2}>
											<FlexItem>
												<strong>{__('Log File Info:', 'versatile-toolkit')}</strong>
											</FlexItem>
											<FlexItem>
												{__('Size:', 'versatile-toolkit')} {status.file_size_formatted}
											</FlexItem>
											{status.last_modified && (
												<FlexItem>
													{__('Last Modified:', 'versatile-toolkit')} {formatDate(status.last_modified)}
												</FlexItem>
											)}
										</Flex>
									</FlexItem>
								)}

								{status.enabled && status.file_exists && (
									<FlexItem>
										<Flex gap={2} wrap>
											<FlexItem>
												<Button
													variant="secondary"
													onClick={() => loadLogContent(currentPage, perPage)}
													disabled={loading}
												>
													{loading && <Spinner />}
													{__('Refresh Log', 'versatile-toolkit')}
												</Button>
											</FlexItem>
											<FlexItem>
												<Button
													variant="secondary"
													onClick={downloadDebugLog}
												>
													{__('Download Log', 'versatile-toolkit')}
												</Button>
											</FlexItem>
											<FlexItem>
												<Button
													variant="secondary"
													onClick={clearDebugLog}
													disabled={clearLoading}
													isDestructive
												>
													{clearLoading && <Spinner />}
													{__('Clear Log', 'versatile-toolkit')}
												</Button>
											</FlexItem>
											<FlexItem>
												<Button
													variant={autoRefresh ? 'primary' : 'secondary'}
													onClick={() => setAutoRefresh(!autoRefresh)}
												>
													{autoRefresh ? __('Stop Auto Refresh', 'versatile-toolkit') : __('Auto Refresh', 'versatile-toolkit')}
												</Button>
											</FlexItem>
										</Flex>
									</FlexItem>
								)}
							</Flex>
						</>
					)}
				</CardBody>
			</Card>

			{status?.enabled && status?.file_exists && (
				<Card style={{ marginTop: '20px' }}>
					<CardHeader>
						<Flex justify="space-between" align="center">
							<FlexItem>
								<h2>{__('Debug Log Content', 'versatile-toolkit')}</h2>
							</FlexItem>
							<FlexItem>
								<SelectControl
									label={__('Entries per page:', 'versatile-toolkit')}
									value={perPage.toString() as "10" | "25" | "50" | "100"}
									options={[
										{ label: '10', value: '10' },
										{ label: '25', value: '25' },
										{ label: '50', value: '50' },
										{ label: '100', value: '100' }
									]}
									onChange={(value) => handlePerPageChange(value || '50')}
									disabled={loading}
								/>
							</FlexItem>
						</Flex>
					</CardHeader>
					<CardBody>
						{loading ? (
							<div style={{ textAlign: 'center', padding: '40px' }}>
								<Spinner />
								<p>{__('Loading debug log...', 'versatile-toolkit')}</p>
							</div>
						) : logContent ? (
							<>
								{logContent.entries && logContent.entries.length > 0 ? (
									<>
										<div style={{ marginBottom: '15px', fontSize: '14px', color: '#666' }}>
											{__('Showing entries', 'versatile-toolkit')} {((logContent.current_page - 1) * logContent.per_page) + 1} - {Math.min(logContent.current_page * logContent.per_page, logContent.total_lines)} {__('of', 'versatile-toolkit')} {logContent.total_lines}
										</div>

										<div style={{ overflowX: 'auto' }}>
											<table style={{
												width: '100%',
												borderCollapse: 'collapse',
												fontSize: '14px'
											}}>
												<thead>
													<tr style={{ backgroundColor: '#f6f7f7' }}>
														<th style={{
															padding: '12px 8px',
															textAlign: 'left',
															borderBottom: '2px solid #ddd',
															fontWeight: '600'
														}}>
															{__('Type', 'versatile-toolkit')}
														</th>
														<th style={{
															padding: '12px 8px',
															textAlign: 'left',
															borderBottom: '2px solid #ddd',
															fontWeight: '600'
														}}>
															{__('Message', 'versatile-toolkit')}
														</th>
														<th style={{
															padding: '12px 8px',
															textAlign: 'left',
															borderBottom: '2px solid #ddd',
															fontWeight: '600'
														}}>
															{__('File', 'versatile-toolkit')}
														</th>
														<th style={{
															padding: '12px 8px',
															textAlign: 'left',
															borderBottom: '2px solid #ddd',
															fontWeight: '600'
														}}>
															{__('Time', 'versatile-toolkit')}
														</th>
														<th style={{
															padding: '12px 8px',
															textAlign: 'center',
															borderBottom: '2px solid #ddd',
															fontWeight: '600',
															width: '60px'
														}}>
															{__('Details', 'versatile-toolkit')}
														</th>
													</tr>
												</thead>
												<tbody>
													{logContent.entries.map((entry, index) => (
														<tr
															key={entry.id}
															style={{
																borderBottom: '1px solid #eee',
																backgroundColor: index % 2 === 0 ? '#fff' : '#fafafa'
															}}
														>
															<td style={{
																padding: '12px 8px',
																verticalAlign: 'top'
															}}>
																<div style={{
																	display: 'flex',
																	alignItems: 'center',
																	gap: '6px'
																}}>
																	<span>{getSeverityIcon(entry.severity)}</span>
																	<span style={{
																		color: getSeverityColor(entry.severity),
																		fontWeight: '500',
																		fontSize: '12px'
																	}}>
																		{entry.type}
																	</span>
																</div>
															</td>
															<td style={{
																padding: '12px 8px',
																verticalAlign: 'top',
																maxWidth: '400px'
															}}>
																<div style={{
																	overflow: 'hidden',
																	textOverflow: 'ellipsis',
																	whiteSpace: 'nowrap'
																}}>
																	{entry.message}
																</div>
															</td>
															<td style={{
																padding: '12px 8px',
																verticalAlign: 'top',
																fontSize: '12px',
																color: '#666',
																maxWidth: '200px'
															}}>
																{entry.file && (
																	<div style={{
																		overflow: 'hidden',
																		textOverflow: 'ellipsis',
																		whiteSpace: 'nowrap'
																	}}>
																		{entry.file.split('/').pop()}
																		{entry.line && `:${entry.line}`}
																	</div>
																)}
															</td>
															<td style={{
																padding: '12px 8px',
																verticalAlign: 'top',
																fontSize: '12px',
																color: '#666',
																whiteSpace: 'nowrap'
															}}>
																{formatLogTimestamp(entry.timestamp)}
															</td>
															<td style={{
																padding: '12px 8px',
																textAlign: 'center',
																verticalAlign: 'top'
															}}>
																<Button
																	variant="secondary"
																	size="small"
																	onClick={() => openDetailModal(entry)}
																	aria-label={__('View details for log entry', 'versatile-toolkit')}
																	title={__('View details', 'versatile-toolkit')}
																	style={{
																		minWidth: 'auto',
																		padding: '4px 8px',
																		fontSize: '12px'
																	}}
																>
																	👁️
																</Button>
															</td>
														</tr>
													))}
												</tbody>
											</table>
										</div>
										{renderPagination()}
									</>
								) : (
									<p>{__('Debug log is empty.', 'versatile-toolkit')}</p>
								)}
							</>
						) : (
							<p>{__('No debug log content available.', 'versatile-toolkit')}</p>
						)}
					</CardBody>
				</Card>
			)}

			{!status?.enabled && (
				<Card style={{ marginTop: '20px' }}>
					<CardBody>
						<Notice status="info" isDismissible={false}>
							<p>{__('Debug logging is currently disabled. Enable it above to start collecting debug information.', 'versatile-toolkit')}</p>
							<p>{__('When enabled, WordPress will log errors, warnings, and debug information to help you troubleshoot issues.', 'versatile-toolkit')}</p>
						</Notice>
					</CardBody>
				</Card>
			)}

			{/* Detail Modal */}
			{isModalOpen && selectedEntry && (
				<div
					style={{
						position: 'fixed',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						backgroundColor: 'rgba(0, 0, 0, 0.5)',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						zIndex: 999999,
						padding: '20px'
					}}
					onClick={closeDetailModal}
				>
					<div
						style={{
							backgroundColor: '#fff',
							borderRadius: '8px',
							boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
							width: '100%',
							maxWidth: '600px',
							maxHeight: '80vh',
							overflow: 'hidden',
							display: 'flex',
							flexDirection: 'column'
						}}
						onClick={(e) => e.stopPropagation()}
					>
						{/* Header */}
						<div style={{
							padding: '20px 20px 0 20px',
							borderBottom: '1px solid #ddd'
						}}>
							<div style={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
								marginBottom: '16px'
							}}>
								<div style={{
									display: 'flex',
									alignItems: 'center',
									gap: '8px'
								}}>
									{getSeverityIcon(selectedEntry.severity)}
									<span style={{
										color: getSeverityColor(selectedEntry.severity),
										fontWeight: '600',
										fontSize: '16px'
									}}>
										{selectedEntry.type}
									</span>
								</div>
								<Button
									variant="tertiary"
									size="small"
									onClick={closeDetailModal}
									style={{ 
										padding: '8px',
										minWidth: 'auto',
										fontSize: '16px'
									}}
								>
									✕
								</Button>
							</div>
						</div>

						{/* Content */}
						<div style={{
							padding: '20px',
							overflow: 'auto',
							flex: 1
						}}>
							<div style={{ marginBottom: '20px' }}>
								<h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600', color: '#1e1e1e' }}>
									{__('Message:', 'versatile-toolkit')}
								</h4>
								<div style={{
									background: '#f6f7f7',
									border: '1px solid #ddd',
									borderRadius: '4px',
									padding: '12px',
									fontSize: '14px',
									lineHeight: '1.5',
									wordBreak: 'break-word'
								}}>
									{selectedEntry.message}
								</div>
							</div>

							<div style={{ marginBottom: '20px' }}>
								<h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600', color: '#1e1e1e' }}>
									{__('Raw Log Entry:', 'versatile-toolkit')}
								</h4>
								<div style={{
									background: '#f6f7f7',
									border: '1px solid #ddd',
									borderRadius: '4px',
									padding: '12px',
									fontSize: '12px',
									fontFamily: 'monospace',
									lineHeight: '1.4',
									maxHeight: '150px',
									overflow: 'auto',
									whiteSpace: 'pre-wrap',
									wordBreak: 'break-word'
								}}>
									{selectedEntry.raw_line}
								</div>
							</div>

							{selectedEntry.file && (
								<div style={{ marginBottom: '20px' }}>
									<h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600', color: '#1e1e1e' }}>
										{__('File Location:', 'versatile-toolkit')}
									</h4>
									<div style={{
										background: '#f6f7f7',
										border: '1px solid #ddd',
										borderRadius: '4px',
										padding: '12px',
										fontSize: '13px',
										fontFamily: 'monospace',
										wordBreak: 'break-all'
									}}>
										{selectedEntry.file}
										{selectedEntry.line && (
											<span style={{ color: '#666' }}> (Line: {selectedEntry.line})</span>
										)}
									</div>
								</div>
							)}

							{selectedEntry.timestamp && (
								<div style={{ marginBottom: '20px' }}>
									<h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600', color: '#1e1e1e' }}>
										{__('Timestamp:', 'versatile-toolkit')}
									</h4>
									<div style={{
										background: '#f6f7f7',
										border: '1px solid #ddd',
										borderRadius: '4px',
										padding: '12px',
										fontSize: '13px'
									}}>
										{formatLogTimestamp(selectedEntry.timestamp)}
									</div>
								</div>
							)}

							{selectedEntry.stack_trace && (
								<div style={{ marginBottom: '20px' }}>
									<h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600', color: '#1e1e1e' }}>
										{__('Stack Trace:', 'versatile-toolkit')}
									</h4>
									<div style={{
										background: '#f6f7f7',
										border: '1px solid #ddd',
										borderRadius: '4px',
										padding: '12px',
										fontSize: '12px',
										fontFamily: 'monospace',
										lineHeight: '1.4',
										maxHeight: '200px',
										overflow: 'auto',
										whiteSpace: 'pre-wrap',
										wordBreak: 'break-word'
									}}>
										{selectedEntry.stack_trace}
									</div>
								</div>
							)}
						</div>

						{/* Footer */}
						<div style={{
							padding: '16px 20px',
							borderTop: '1px solid #ddd',
							textAlign: 'right'
						}}>
							<Button
								variant="primary"
								onClick={closeDetailModal}
							>
								{__('Close', 'versatile-toolkit')}
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default DebugLog;