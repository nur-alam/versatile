import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ErrorBoundary from '@/components/ErrorBoundary';
import Quickpick from '@/entries/quickpick/Quickpick';

const root = ReactDOM.createRoot(document.getElementById('versatile-quickpick-container') as HTMLElement);

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
			<Quickpick />
			<Toaster
				position="bottom-right"
				// position="bottom-center"
				containerClassName="!z-[9999999]"
				toastOptions={{
					duration: 50000,
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
		</QueryClientProvider>
	</ErrorBoundary>
);