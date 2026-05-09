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
} from '@/components/ui/dialog';

import { DebugRow } from '@/services/debug-log-services';
import { getLogTypeColor } from '@/utils/log-type-utils';
import { __ } from '@wordpress/i18n';

export const ViewLog = ({ row }: { row: DebugRow }) => {
	const { raw_line } = row;
	return (
		<div className="vt-flex vt-gap-1">
			<Dialog>
				<DialogTrigger asChild>
					<Button
						size="sm"
						variant="link"
						aria-label={`View ${row.type}'s log`}
						className="vt-p-0 vt-text-blue-600 hover:vt-bg-blue-100"
					>
						<Eye className="vt-h-4 vt-w-4" />
					</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							Warning Type: <span className={getLogTypeColor(row.type)}>{row.type}</span>
						</DialogTitle>
						<DialogDescription className="vt-mt-2 vt-hidden">{row.timestamp}</DialogDescription>
					</DialogHeader>
					<div className="vt-max-h-[70vh] vt-overflow-auto vt-bg-[#e5e5e5] vt-p-3 vt-my-2">
						<pre className="vt-whitespace-pre-wrap vt-font-mono vt-text-base">{raw_line}</pre>
					</div>
					<DialogFooter className="sm:vt-justify-end">
						<DialogClose asChild>
							<Button type="button" variant="secondary">
								{__('Close', 'versatile-toolkit')}
							</Button>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};
