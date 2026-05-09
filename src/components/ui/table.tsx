import * as React from 'react';

import { cn } from '@/lib/utils';

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
	({ className, ...props }, ref) => (
		<div className="vt-relative vt-w-full vt-overflow-auto">
			<table ref={ref} className={cn('vt-w-full vt-caption-bottom vt-text-sm', className)} {...props} />
		</div>
	),
);
Table.displayName = 'Table';

const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
	({ className, ...props }, ref) => <thead ref={ref} className={cn('[&_tr]:vt-border-b', className)} {...props} />,
);
TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
	({ className, ...props }, ref) => (
		<tbody ref={ref} className={cn('[&_tr:last-child]:vt-border-0', className)} {...props} />
	),
);
TableBody.displayName = 'TableBody';

const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
	({ className, ...props }, ref) => (
		<tfoot
			ref={ref}
			className={cn('vt-border-t vt-bg-muted/50 vt-font-medium [&>tr]:last:vt-border-b-0', className)}
			{...props}
		/>
	),
);
TableFooter.displayName = 'TableFooter';

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
	({ className, ...props }, ref) => (
		<tr
			ref={ref}
			className={cn(
				'vt-border-b vt-transition-colors hover:vt-bg-muted/50 data-[state=selected]:vt-bg-muted',
				className,
			)}
			{...props}
		/>
	),
);
TableRow.displayName = 'TableRow';

const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
	({ className, ...props }, ref) => (
		<th
			ref={ref}
			className={cn(
				'vt-h-10 vt-px-2 vt-text-left vt-align-middle vt-font-medium vt-text-muted-foreground [&:has([role=checkbox])]:vt-pr-0 [&>[role=checkbox]]:vt-translate-y-[2px]',
				className,
			)}
			{...props}
		/>
	),
);
TableHead.displayName = 'TableHead';

const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
	({ className, ...props }, ref) => (
		<td
			ref={ref}
			className={cn(
				'vt-p-2 vt-align-middle [&:has([role=checkbox])]:vt-pr-0 [&>[role=checkbox]]:vt-translate-y-[2px]',
				className,
			)}
			{...props}
		/>
	),
);
TableCell.displayName = 'TableCell';

const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
	({ className, ...props }, ref) => (
		<caption ref={ref} className={cn('vt-mt-4 vt-text-sm vt-text-muted-foreground', className)} {...props} />
	),
);
TableCaption.displayName = 'TableCaption';

export { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow };
