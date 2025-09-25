// Custom empty state icon component
export const EmptyStateIcon = ({ className }: { className?: string }) => (
	<svg
		className={className}
		viewBox="0 0 48 48"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<g opacity="0.6">
			{/* Folder/Container */}
			<path
				d="M8 12C8 10.8954 8.89543 10 10 10H18L22 14H38C39.1046 14 40 14.8954 40 16V34C40 35.1046 39.1046 36 38 36H10C8.89543 36 8 35.1046 8 34V12Z"
				stroke="currentColor"
				strokeWidth="2"
				fill="none"
			/>
			{/* Empty lines */}
			<path
				d="M14 22H20M14 26H24M14 30H18"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				opacity="0.4"
			/>
			{/* Search/magnifying glass */}
			<circle
				cx="32"
				cy="24"
				r="4"
				stroke="currentColor"
				strokeWidth="1.5"
				fill="none"
				opacity="0.5"
			/>
			<path
				d="M35 27L37 29"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				opacity="0.5"
			/>
		</g>
	</svg>
);