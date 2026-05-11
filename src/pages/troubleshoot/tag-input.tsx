import { ButtonLoader } from '@/components/loader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAddMyIp } from '@/services/versatile-services';
import { ipv4Regex } from '@/utils/schema-validation';
import { __ } from '@wordpress/i18n';
import { X } from 'lucide-react';
import { useState, type FocusEvent, type KeyboardEvent } from 'react';
import toast from 'react-hot-toast';

type Props = {
	tags: string[];
	onChange: (value: string[]) => void;
};

export default function TaggedInput({ tags, onChange }: Props) {
	const [inputValue, setInputValue] = useState('');
	const [inputError, setInputError] = useState<string | null>(null);

	const addTag = () => {
		const trimmed = inputValue.trim();
		if (!trimmed) return;
		if (!ipv4Regex.test(trimmed)) {
			setInputError(__('Invalid IP address', 'versatile-toolkit'));
			return;
		}
		if (!tags.includes(trimmed)) {
			onChange([...tags, trimmed]);
			setInputValue('');
			setInputError(null);
		}
	};

	const removeTag = (tagToRemove: string) => {
		onChange(tags.filter((tag) => tag !== tagToRemove));
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			addTag();
		}
	};

	const handleBlur = (_e: FocusEvent<HTMLInputElement>) => {
		addTag();
	};

	const useAddMyIpMutation = useAddMyIp();

	const addMyIp = async () => {
		const { data } = await useAddMyIpMutation.mutateAsync({});
		const ip = data?.ip;

		if (tags.includes(ip)) {
			toast.success(__('System Ip already added!', 'versatile-toolkit'));
			return;
		}

		if (!tags.includes(ip) && ip) {
			onChange([...tags, ip]);
			toast.success(__('System Ip address added', 'versatile-toolkit'));
		}
	};

	return (
		<>
			<div className="vt-relative">
				<Input
					type="text"
					placeholder={__('Enter IP address', 'versatile-toolkit')}
					value={inputValue}
					onChange={(e) => {
						setInputValue(e.target.value);
						if (inputError) setInputError(null);
					}}
					onKeyDown={handleKeyDown}
					onBlur={handleBlur}
				/>
				<Button
					type="button"
					size="xs"
					className="vt-absolute vt-right-1 vt-top-1/2 -vt-translate-y-1/2"
					onClick={addMyIp}
				>
					<ButtonLoader
						isLoading={useAddMyIpMutation.isPending}
						loadingText={__('Add My IP', 'versatile-toolkit')}
						size="xs"
					>{__('Add My IP', 'versatile-toolkit')}</ButtonLoader>
				</Button>
			</div>
			{inputError && <p className="vt-text-red-500 vt-text-sm vt-mt-1">{inputError}</p>}
			<div className="vt-flex vt-flex-wrap vt-gap-2 vt-mt-2">
				{tags.map((tag) => (
					<Badge key={tag} variant="default" className="vt-flex vt-items-center vt-gap-1">
						{tag}
						<Button
							type="button"
							variant="ghost"
							size="xs"
							className='vt-h-min !vt-px-[1px] !vt-py-[1px]'
							onClick={() => removeTag(tag)}
							aria-label={__('Remove IP address', 'versatile-toolkit')}
						>
							<X size={12} aria-hidden />
							<span className="vt-sr-only">{__('Remove', 'versatile-toolkit')}</span>
						</Button>
					</Badge>
				))}
			</div>
		</>
	);
}
