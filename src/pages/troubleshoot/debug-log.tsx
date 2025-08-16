import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { Button, Card, CardBody, CardHeader, Flex, FlexItem, Notice, Spinner, TextControl, SelectControl } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';
import config from '@/config';

interface DebugLogStatus {
	enabled: boolean;
	file_exists: boolean;
	file_size: number;
	file_size_formatted: string;
	last_modified: number | null;
}

interface DebugLogContent {
	content: string;
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
	const [perPage, setPerPage] = useState(50);
	const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
	const [autoRefresh, setAutoRefresh] = useState(false);

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
									value={perPage.toString()}
									options={[
										{ label: '25', value: '25' },
										{ label: '50', value: '50' },
										{ label: '100', value: '100' }
									]}
									onChange={handlePerPageChange}
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
								{logContent.total_lines > 0 ? (
									<>
										<div style={{ marginBottom: '15px', fontSize: '14px', color: '#666' }}>
											{__('Showing entries', 'versatile-toolkit')} {((logContent.current_page - 1) * logContent.per_page) + 1} - {Math.min(logContent.current_page * logContent.per_page, logContent.total_lines)} {__('of', 'versatile-toolkit')} {logContent.total_lines}
										</div>
										<pre style={{
											background: '#f6f7f7',
											border: '1px solid #ddd',
											borderRadius: '4px',
											padding: '15px',
											fontSize: '12px',
											lineHeight: '1.4',
											maxHeight: '500px',
											overflow: 'auto',
											whiteSpace: 'pre-wrap',
											wordBreak: 'break-word'
										}}>
											{logContent.content}
										</pre>
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
		</div>
	);
};

export default DebugLog;