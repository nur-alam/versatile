import ErrorBoundary from '@/components/ErrorBoundary';
import Quickact from '@/entries/quickact/Quickact';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';

const root = ReactDOM.createRoot(document.getElementById('vt-quickact-container') as HTMLElement);
const toasterRootElementId = 'vt-quickact-toaster-root';

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
			console.error('Quickact Plugin Root Error:', error, errorInfo);
		}}
	>
		<QueryClientProvider client={queryClient}>
			<Quickact />
		</QueryClientProvider>
	</ErrorBoundary>,
);

let toasterRootElement = document.getElementById(toasterRootElementId);
if (!toasterRootElement) {
	toasterRootElement = document.createElement('div');
	toasterRootElement.id = toasterRootElementId;
	document.body.appendChild(toasterRootElement);
}

const toasterRoot = ReactDOM.createRoot(toasterRootElement);
toasterRoot.render(
	<Toaster
		position="bottom-right"
		containerClassName="vt-quickact-toaster"
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
	/>,
);
