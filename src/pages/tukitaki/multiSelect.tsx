import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
	Command,
	CommandGroup,
	CommandItem,
	CommandList,
	CommandInput,
	CommandEmpty,
} from "@/components/ui/command"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"

type Framework = {
	label: string
	value: string
}

const frameworks: Framework[] = [
	{ label: "Next.js", value: "nextjs" },
	{ label: "Remix", value: "remix" },
	{ label: "Vite", value: "vite" },
	{ label: "Nuxt", value: "nuxt" },
	{ label: "Vue", value: "vue" },
	{ label: "Svelte", value: "svelte" },
	{ label: "Angular", value: "angular" },
]

export default function MultiSelectFramework() {
	const [open, setOpen] = React.useState(false)
	const [selected, setSelected] = React.useState<Framework[]>([{ label: "React", value: "react" }])

	const toggleFramework = (framework: Framework) => {
		if (selected.find((f) => f.value === framework.value)) {
			setSelected(selected.filter((f) => f.value !== framework.value))
		} else {
			setSelected([...selected, framework])
		}
	}

	const removeFramework = (value: string) => {
		setSelected(selected.filter((f) => f.value !== value))
	}

	return (
		<div>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button variant="outline" role="combobox" className="w-[300px] justify-between">
						{selected.length > 0
							? "Select frameworks you like..."
							: "Select frameworks..."}
						<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-[300px] p-0">
					<Command>
						<CommandInput placeholder="Search frameworks..." />
						<CommandList>
							<CommandEmpty>No framework found.</CommandEmpty>
							<CommandGroup>
								{frameworks.map((framework) => (
									<CommandItem
										key={framework.value}
										onSelect={() => toggleFramework(framework)}
									>
										<div
											className={`mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary ${selected.find((f) => f.value === framework.value)
													? "bg-primary text-primary-foreground"
													: "opacity-50"
												}`}
										>
											{selected.find((f) => f.value === framework.value) && <Check className="h-4 w-4" />}
										</div>
										{framework.label}
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
			<div className="mt-4 flex flex-wrap gap-2">
				{selected.map((framework) => (
					<Badge key={framework.value} variant="default" className="flex items-center gap-1">
						{framework.label}
						<X
							className="h-3 w-3 cursor-pointer"
							onClick={() => removeFramework(framework.value)}
						/>
					</Badge>
				))}
			</div>
		</div>
	)
}