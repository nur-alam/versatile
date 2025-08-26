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
	console.log('full row', row);
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
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Warning Type: {row.severity}</DialogTitle>
					<DialogDescription className='mt-2 hidden'>
						{row.timestamp}
					</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col gap-2">
					<div>
						<strong>Description</strong>: <span>{row.message}</span>
					</div>
					<div>
						<strong>Role</strong>: <span>{row.type}</span>
					</div>
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