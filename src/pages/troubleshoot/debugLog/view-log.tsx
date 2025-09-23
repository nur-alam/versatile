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
import { getLogTypeColor } from '@/utils/log-type-utils';



export const ViewLog = ({ row }: { row: DebugRow }) => {
	const { raw_line } = row;
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
					<DialogTitle>Warning Type: <span className={getLogTypeColor(row.type)}>{row.type}</span></DialogTitle>
					<DialogDescription className='mt-2 hidden'>
						{row.timestamp}
					</DialogDescription>
				</DialogHeader>
				<div className="max-h-[70vh] overflow-auto bg-[#e5e5e5] p-3 my-2">
					<pre className="whitespace-pre-wrap font-mono text-base">{raw_line}</pre>
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