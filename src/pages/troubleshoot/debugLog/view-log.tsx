import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"

import { DebugRow } from '@/services/debug-log-services';
import { __ } from '@wordpress/i18n';

export const ViewLog = ({ row }: { row: DebugRow }) => {
	const { type, message, raw_line, severity, timestamp } = row;
	return <div className="flex gap-1">
		<Dialog>
			<DialogTrigger asChild>
				<Button
					size="sm"
					variant="ghost"
					aria-label={`View ${row.type}'s log`}
					className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50"
				>
					<Eye className="h-4 w-4" />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Warning Type: {row.type}</DialogTitle>
					<DialogDescription className='mt-2 hidden'>
						{row.timestamp}
					</DialogDescription>
				</DialogHeader>
				<div className="max-h-[70vh] overflow-auto bg-[#e5e5e5] p-3 my-2">
					<span>{raw_line}</span>
				</div>
				<DialogFooter className="sm:justify-end">
					<DialogClose asChild>
						<Button type="button" variant="secondary">
							{__('Close', 'versatile-toolkit')}
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	</div>
}