'use client';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useGetThemeList } from '@/services/versatile-services';
import { __ } from '@wordpress/i18n';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useEffect, useState } from 'react';

type typeThemeList = {
	slug: string;
	label: string;
};

type Props = {
	selectedTheme: string;
	onChange: (value: string) => void;
};

export default function ThemeSelector({ selectedTheme, onChange }: Props) {
	const [themeList, setThemeList] = useState<typeThemeList[]>([]);
	const [open, setOpen] = useState(false);

	const { data: themeListData } = useGetThemeList();

	useEffect(() => {
		if (themeListData) {
			setThemeList(themeListData.data);
		}
	}, [themeListData]);

	const handleSelect = (value: string) => {
		onChange(value);
		setOpen(false);
	};

	const selectedThemeData = themeList.find((theme) => theme.slug === selectedTheme);

	return (
		<div>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						role="combobox"
						aria-expanded={open}
						className="vt-w-full vt-justify-between min-h-[2.5rem] vt-h-auto vt-p-3 vt-bg-transparent"
					>
						<div className="vt-flex vt-flex-wrap vt-gap-1 vt-flex-1 vt-text-left">
							{selectedThemeData ? (
								<span className="vt-font-medium">{selectedThemeData.label}</span>
							) : (
								<span className="vt-text-muted-foreground">
									{__('Select a theme...', 'versatile-toolkit')}
								</span>
							)}
						</div>
						<ChevronsUpDown className="vt-h-4 vt-w-4 vt-shrink-0 vt-opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="vt-w-full vt-p-0" align="start">
					<Command>
						<CommandInput placeholder={__('Search theme...', 'versatile-toolkit')} />
						<CommandList>
							<CommandEmpty>{__('No theme found.', 'versatile-toolkit')}</CommandEmpty>
							<CommandGroup>
								{themeList.map((theme) => (
									<CommandItem
										key={theme.slug}
										value={theme.label}
										onSelect={() => handleSelect(theme.slug)}
									>
										<Check
											className={cn(
												'vt-mr-2 vt-h-4 vt-w-4',
												selectedTheme === theme.slug ? 'vt-opacity-100' : 'vt-opacity-0',
											)}
										/>
										{theme.label}
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		</div>
	);
}
