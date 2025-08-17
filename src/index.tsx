import ReactDOM from 'react-dom/client';
import { HashRouter, Route, Routes } from 'react-router-dom';

import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Dashboard from '@/pages/versatile';
import TroubleShoot from '@/pages/troubleshoot';
import Maintenance from '@pages/maintenance';
import Comingsoon from '@/pages/comingsoon';
import Header from '@/pages/Header';
import { RouteGuard } from '@/components/RouteGuard';
import ErrorBoundary from '@/components/ErrorBoundary';
import DebugLog from '@/pages/troubleshoot/debugLog/debug-log';
// import DebugLog from '@/pages/troubleshoot/debug-log';

const root = ReactDOM.createRoot(document.getElementById('versatile-root') as HTMLElement);

// QueryClient instance
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			retry: false,
		},
	},
});

root.render(
	<ErrorBoundary
		onError={(error, errorInfo) => {
			// Log to WordPress admin or external service
			console.error('Versatile Plugin Root Error:', error, errorInfo);
		}}
	>
		<QueryClientProvider client={queryClient}>
			<ErrorBoundary
				onError={(error, errorInfo) => {
					console.error('Query Client Error:', error, errorInfo);
				}}
			>
				<HashRouter>
					<ErrorBoundary
						onError={(error, errorInfo) => {
							console.error('Router Error:', error, errorInfo);
						}}
					>
						<Header />
						<Routes>
							<Route path="/" element={
								<ErrorBoundary>
									<Dashboard />
								</ErrorBoundary>
							} />
							<Route path="/troubleshoot" element={
								<RouteGuard>
									<ErrorBoundary>
										<TroubleShoot />
									</ErrorBoundary>
								</RouteGuard>
							} />
							<Route path="/maintenance" element={
								<RouteGuard>
									<ErrorBoundary>
										<Maintenance />
									</ErrorBoundary>
								</RouteGuard>
							} />
							<Route path="/comingsoon" element={
								<RouteGuard>
									<ErrorBoundary>
										<Comingsoon />
									</ErrorBoundary>
								</RouteGuard>
							} />
							<Route path="/troubleshoot/debug-log" element={
								<RouteGuard>
									<ErrorBoundary>
										<DebugLog />
									</ErrorBoundary>
								</RouteGuard>
							} />
						</Routes>

						<Toaster
							position="bottom-right"
							// position="bottom-center"
							containerClassName="!z-[9999999]"
							toastOptions={{
								duration: 5000,
								style: {
									background: '#fff',
									color: '#333',
									border: '1px solid #e5e7eb',
									padding: '16px',
									borderRadius: '8px',
									boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
								},
								success: {
									style: {
										background: '#f0fdf4',
										borderColor: '#86efac',
									},
								},
								error: {
									style: {
										background: '#fef2f2',
										borderColor: '#fecaca',
									},
								},
							}}
						/>
					</ErrorBoundary>
				</HashRouter>
			</ErrorBoundary>
		</QueryClientProvider>
	</ErrorBoundary>
);