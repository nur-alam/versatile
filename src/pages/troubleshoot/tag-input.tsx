"use client"

import { useState, type KeyboardEvent, type FocusEvent, ReactElement, ReactNode } from "react"
import { X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ipv4Regex } from '@/utils/schema-validation'
import { __ } from "@wordpress/i18n"
import { useAddMyIp } from "@/services/versatile-services"
import toast from "react-hot-toast"

type Props = {
	tags: string[]
	onChange: (value: string[]) => void
}

export default function TaggedInput({ tags, onChange }: Props) {
	const [inputValue, setInputValue] = useState("")
	const [inputError, setInputError] = useState<string | null>(null)

	const addTag = () => {
		const trimmed = inputValue.trim()
		if (!trimmed) return
		if (!ipv4Regex.test(trimmed)) {
			setInputError('Invalid IP address')
			return
		}
		if (!tags.includes(trimmed)) {
			onChange([...tags, trimmed])
			setInputValue("")
			setInputError(null)
		}
	}

	const removeTag = (tagToRemove: string) => {
		onChange(tags.filter((tag) => tag !== tagToRemove))
	}

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault()
			addTag()
		}
	}

	const handleBlur = (_e: FocusEvent<HTMLInputElement>) => {
		addTag()
	}

	const useAddMyIpMutation = useAddMyIp();

	const addMyIp = async () => {
		const { data,  } = await useAddMyIpMutation.mutateAsync({});
		const ip = data?.ip;

		if (tags.includes(ip)) {
			toast.success(__('System Ip already added!', 'trigger'));
			return;
		}

		if (!tags.includes(ip) && ip) {
			onChange([...tags, ip])
			toast.success(__('System Ip address added', 'trigger'));
		}
	}

	return (
		<div>
			<div className="relative">
				<Input
					type="text"
					placeholder="Type a tag and press Enter or click outside..."
					value={inputValue}
					onChange={(e) => {
						setInputValue(e.target.value)
						if (inputError) setInputError(null)
					}}
					onKeyDown={handleKeyDown}
					onBlur={handleBlur}
				/>
				<Button
					type="button"
					size="sm"
					className="absolute right-1 top-1/2 -translate-y-1/2 px-2 py-1 h-5"
					onClick={addMyIp}
				>
					{__('Add My IP', 'versatile')}
				</Button>
			</div>
			{inputError && (
				<p className="text-red-500 text-sm mt-1">{inputError}</p>
			)}
			<div className="flex flex-wrap gap-2 mt-2">
				{tags.map((tag) => (
					<Badge
						key={tag}
						variant="default"
						className="flex items-center gap-1"
					>
						{tag}
						<Button
							variant="ghost"
							size="sm"
							className="h-4 w-4 p-0"
							onClick={() => removeTag(tag)}
						>
							<X className="h-3 w-3" />
						</Button>
					</Badge>
				))}
			</div>
		</div>
	)
}