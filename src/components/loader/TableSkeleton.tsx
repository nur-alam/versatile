export interface TableSkeletonColumn {
	key: string;
	label?: string;
}

export interface TableSkeletonProps {
	columns?: TableSkeletonColumn[];
	rows?: number;
	className?: string;
	animate?: boolean;
}

const DefaultColumns = Array.from({ length: 10 }, (_, index) => ({
	key: `column-${index}`,
	label: `Column ${index + 1}`,
}));

export function TableSkeleton({
	columns = DefaultColumns,
	rows = 10,
	className = '',
	animate = true,
}: TableSkeletonProps) {
	const getSkeletonForColumn = (columnType: string) => {
		switch (columnType) {
			case 'id':
				// Row number skeleton - small width
				return <div className="vt-h-4 vt-bg-slate-200 vt-rounded vt-w-6"></div>;

			case 'type':
				// Type badge skeleton - medium width with rounded corners
				return <div className="vt-h-6 vt-bg-slate-200 vt-rounded-full vt-w-16"></div>;

			case 'message':
				// Message skeleton - full width with multiple lines effect
				return (
					<div className="vt-space-y-2">
						<div className="vt-h-4 vt-bg-slate-200 vt-rounded vt-w-full"></div>
						<div className="vt-h-4 vt-bg-slate-200 vt-rounded vt-w-3/4"></div>
					</div>
				);

			case 'timestamp':
				// Timestamp skeleton - medium width
				return <div className="vt-h-4 vt-bg-slate-200 vt-rounded vt-w-32"></div>;

			case 'actions':
				// Action button skeleton - small button-like shape
				return <div className="vt-h-6 vt-bg-slate-200 vt-rounded-lg vt-w-[80%]"></div>;

			default:
				// Default skeleton for any other columns
				return <div className="vt-h-4 vt-bg-slate-200 vt-rounded vt-w-24"></div>;
		}
	};

	return (
		<>
			{Array.from({ length: rows }).map((_, index) => (
				<tr
					key={`skeleton-${index}`}
					className={`vt-border-t vt-border-slate-100 ${animate ? 'vt-animate-pulse' : ''} ${className}`}
				>
					{columns.map((col, colIndex) => (
						<td key={`skeleton-${index}-${colIndex}`} className="vt-px-4 vt-py-3">
							{getSkeletonForColumn(col.label || col.key)}
						</td>
					))}
				</tr>
			))}
		</>
	);
}
