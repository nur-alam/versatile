import { type ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const customTwMerge = extendTailwindMerge({
	prefix: 'vt-',
});

export function cn(...inputs: ClassValue[]) {
	return customTwMerge(clsx(inputs));
}
