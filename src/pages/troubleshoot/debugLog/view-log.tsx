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
			<DialogContent className="">
				<DialogHeader>
					<DialogTitle>Warning Type: {row.type}</DialogTitle>
					<DialogDescription className='mt-2 hidden'>
						{row.timestamp}
					</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col gap-2 max-h-[70vh] overflow-auto">
					<strong>Description:</strong> <span>{raw_line}</span>
				</div>
				<DialogFooter className="sm:justify-end">
					<DialogClose asChild>
						<Button type="button" variant="secondary">
							Close
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	</div>
}