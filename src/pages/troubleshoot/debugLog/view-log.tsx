import { Button } from '@/components/ui/button';
import { Check, Copy, Eye } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

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
import { copyToClipboard } from '@/utils/utils';
import { __ } from '@wordpress/i18n';

export const ViewLog = ({ row }: { row: DebugRow }) => {
	const { raw_line } = row;
	const [rowCopied, setRowCopied] = useState(false);
	const [dialogCopied, setDialogCopied] = useState(false);

	const copyLog = async (markCopied: (copied: boolean) => void) => {
		try {
			await copyToClipboard(raw_line);
			markCopied(true);
			toast.success(__('Log copied to clipboard', 'versatile-toolkit'));
			window.setTimeout(() => markCopied(false), 2000);
		} catch {
			toast.error(__('Failed to copy log', 'versatile-toolkit'));
		}
	};

	return (
		<div className="vt-flex vt-gap-1">
			<Button
				size="icon"
				variant="ghost"
				aria-label={__('Copy log', 'versatile-toolkit')}
				title={rowCopied ? __('Copied', 'versatile-toolkit') : __('Copy log', 'versatile-toolkit')}
				className="hover:vt-bg-blue-100 hover:vt-text-blue-900"
				onClick={() => copyLog(setRowCopied)}
			>
				{rowCopied ? <Check className="vt-h-4 vt-w-4" /> : <Copy className="vt-h-4 vt-w-4" />}
			</Button>
			<Dialog>
				<DialogTrigger asChild>
					<Button
						size="icon"
						variant="ghost"
						aria-label={`View ${row.type}'s log`}
						className="hover:vt-bg-blue-100 hover:vt-text-blue-900"
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
						<Button type="button" variant="outline" onClick={() => copyLog(setDialogCopied)}>
							{dialogCopied ? (
								<Check className="vt-mr-2 vt-h-4 vt-w-4" />
							) : (
								<Copy className="vt-mr-2 vt-h-4 vt-w-4" />
							)}
							{dialogCopied ? __('Copied', 'versatile-toolkit') : __('Copy', 'versatile-toolkit')}
						</Button>
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
