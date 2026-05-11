import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useGetPluginList } from '@/services/versatile-services';
import { __ } from '@wordpress/i18n';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { useEffect, useState } from 'react';

type typePluginList = {
	slug: string;
	label: string;
};

type Props = {
	selectedPlugin: string[];
	onChange: (value: string[]) => void;
};

export default function MultipleSelector({ selectedPlugin, onChange }: Props) {
	const [pluginList, setPluginList] = useState<typePluginList[]>([]);
	const [open, setOpen] = useState(false);

	const { data: pluginListData } = useGetPluginList();

	useEffect(() => {
		if (pluginListData) {
			setPluginList(pluginListData.data);
		}
	}, [pluginListData]);

	const handleSelect = (value: string) => {
		if (selectedPlugin.includes(value)) {
			onChange(selectedPlugin.filter((item) => item !== value));
		} else {
			onChange([...selectedPlugin, value]);
		}
	};

	const handleRemove = (value: string) => {
		onChange(selectedPlugin.filter((item) => item !== value));
	};

	const chosenPlugins = pluginList.filter((plugin) => selectedPlugin.includes(plugin.slug));
	const availablePlugins = pluginList.filter((plugin) => !selectedPlugin.includes(plugin.slug));

	return (
		<div>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						role="combobox"
						aria-expanded={open}
						className="vt-w-full vt-justify-between min-h-[2.5rem] vt-h-auto vt-p-2 vt-bg-transparent"
					>
						<div className="vt-flex vt-flex-wrap vt-gap-2 vt-flex-1">
							{chosenPlugins.map((item) => (
								<Badge key={item.slug} variant="default" className="vt-gap-1 vt-mb-1">
									{item.label}
									<Button
										variant="ghost"
										size="xs"
										className='vt-h-min !vt-px-[1px] !vt-py-[1px]'
										onClick={(e) => {
											e.preventDefault();
											e.stopPropagation();
											handleRemove(item.slug);
										}}
									>
										<X size={12} />
									</Button>
								</Badge>
							))}
							{chosenPlugins.length === 0 && (
								<span className="vt-text-muted-foreground">
									{__('Select plugins you like...', 'versatile-toolkit')}
								</span>
							)}
						</div>
						<ChevronsUpDown className="vt-h-4 vt-w-4 vt-shrink-0 vt-opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="vt-w-full" align="start">
					<Command>
						<CommandInput placeholder={__('Search plugin...', 'versatile-toolkit')} />
						<CommandList>
							<CommandEmpty>{__('No plugin found.', 'versatile-toolkit')}</CommandEmpty>
							<CommandGroup>
								{[...availablePlugins, ...chosenPlugins].map((plugin) => (
									<CommandItem
										key={plugin.slug}
										value={plugin.label}
										onSelect={() => handleSelect(plugin.slug)}
									>
										<Check
											className={cn(
												'vt-mr-2 vt-h-4 vt-w-4',
												selectedPlugin.includes(plugin.slug)
													? 'vt-opacity-100'
													: 'vt-opacity-0',
											)}
										/>
										{plugin.label}
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
