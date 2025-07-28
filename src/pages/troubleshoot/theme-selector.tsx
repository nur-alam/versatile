"use client"

import React, { useEffect, useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useGetThemeList } from "@/services/versatile-services"
import { __ } from "@wordpress/i18n"

type typeThemeList = {
	slug: string
	label: string
}

type Props = {
	selectedTheme: string
	onChange: (value: string) => void
}

export default function ThemeSelector({ selectedTheme, onChange }: Props) {
	const [themeList, setThemeList] = useState<typeThemeList[]>([])
	const [open, setOpen] = useState(false)

	const { data: themeListData } = useGetThemeList()

	useEffect(() => {
		if (themeListData) {
			setThemeList(themeListData.data)
		}
	}, [themeListData])

	const handleSelect = (value: string) => {
		onChange(value)
		setOpen(false)
	}

	const selectedThemeData = themeList.find((theme) => theme.slug === selectedTheme)

	return (
		<div>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						role="combobox"
						aria-expanded={open}
						className="w-full justify-between min-h-[2.5rem] h-auto p-3 bg-transparent"
					>
						<div className="flex flex-wrap gap-1 flex-1 text-left">
							{selectedThemeData ? (
								<span className="font-medium">{selectedThemeData.label}</span>
							) : (
								<span className="text-muted-foreground">{__('Select a theme...', 'versatile-toolkit')}</span>
							)}
						</div>
						<ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-full p-0" align="start">
					<Command>
						<CommandInput placeholder="Search theme..." />
						<CommandList>
							<CommandEmpty>No theme found.</CommandEmpty>
							<CommandGroup>
								{themeList.map((theme) => (
									<CommandItem
										key={theme.slug}
										value={theme.label}
										onSelect={() => handleSelect(theme.slug)}
									>
										<Check
											className={cn(
												"mr-2 h-4 w-4",
												selectedTheme === theme.slug ? "opacity-100" : "opacity-0"
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
	)
}