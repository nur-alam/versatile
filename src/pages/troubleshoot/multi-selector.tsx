"use client"

import React, { useEffect, useState } from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useGetPluginList } from "@/services/tukitaki-services"
import { __ } from "@wordpress/i18n"

type typePluginList = {
	slug: string
	label: string
}

type Props = {
	selectedPlugin: string[]
	onChange: (value: string[]) => void
}

export default function MultipleSelector({ selectedPlugin, onChange }: Props) {
	const [pluginList, setPluginList] = useState<typePluginList[]>([])
	const [open, setOpen] = useState(false)

	const { data: pluginListData } = useGetPluginList()

	useEffect(() => {
		if (pluginListData) {
			setPluginList(pluginListData.data)
		}
	}, [pluginListData])

	const handleSelect = (value: string) => {
		if (selectedPlugin.includes(value)) {
			onChange(selectedPlugin.filter((item) => item !== value))
		} else {
			onChange([...selectedPlugin, value])
		}
	}

	const handleRemove = (value: string) => {
		onChange(selectedPlugin.filter((item) => item !== value))
	}

	const chosenPlugins = pluginList.filter((plugin) => selectedPlugin.includes(plugin.slug))
	const availablePlugins = pluginList.filter((plugin) => !selectedPlugin.includes(plugin.slug))

	return (
		<div>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						role="combobox"
						aria-expanded={open}
						className="w-full justify-between min-h-[2.5rem] h-auto p-2 bg-transparent"
					>
						<div className="flex flex-wrap gap-1 flex-1">
							{chosenPlugins.map((item) => (
								<Badge key={item.slug} variant="default" className="mr-1 mb-1">
									{item.label}
									{/* <button
										className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
										onClick={(e) => {
											e.preventDefault()
											e.stopPropagation()
											handleRemove(item.slug)
										}}
									>
										<X className="h-3 w-3 text-white/50 hover:text-white/100" />
									</button> */}
									<Button
										variant="ghost"
										size="sm"
										className="h-4 w-4 p-0 ml-1"
										onClick={(e) => {
											e.preventDefault()
											e.stopPropagation()
											handleRemove(item.slug)
										}}
									>
										<X className="h-3 w-3" />
									</Button>
								</Badge>
							))}
							{chosenPlugins.length === 0 && (
								<span className="text-muted-foreground">{__('Select plugins you like...', 'tukitaki')}</span>
							)}
						</div>
						<ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-full p-0" align="start">
					<Command>
						<CommandInput placeholder="Search plugin..." />
						<CommandList>
							<CommandEmpty>No plugin found.</CommandEmpty>
							<CommandGroup>
								{[...availablePlugins, ...chosenPlugins].map((plugin) => (
									<CommandItem
										key={plugin.slug}
										value={plugin.label}
										onSelect={() => handleSelect(plugin.slug)}
									>
										<Check
											className={cn(
												"mr-2 h-4 w-4",
												selectedPlugin.includes(plugin.slug) ? "opacity-100" : "opacity-0"
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
	)
}