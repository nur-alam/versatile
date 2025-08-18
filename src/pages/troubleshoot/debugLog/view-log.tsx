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

import { DebugRow } from './debug-log';

export const ViewLog = ({ row }: { row: DebugRow }) => {
	return <div className="flex gap-1">
		<Dialog>
			<DialogTrigger asChild>
				<Button
					size="sm"
					variant="ghost"
					aria-label={`View ${row.name}'s log`}
					className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50"
				>
					<Eye className="h-4 w-4" />
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Details {row.name}</DialogTitle>
					<DialogDescription className='mt-2 hidden'>
						{row.email}
					</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col gap-2">
					<div>
						<strong>Email</strong>: <span>{row.email}</span>
					</div>
					<div>
						<strong>Role</strong>: <span>{row.role}</span>
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