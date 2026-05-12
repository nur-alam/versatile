import { type ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/** Must match `prefix` in tailwind.config.js */
const TAILWIND_CLASS_PREFIX = 'vt-';

/**
 * tailwind-merge v3's `prefix` option matches Tailwind v4 (`vt-:` + utility). With Tailwind v3
 * prefixed classes (`vt-h-9`), every class is treated as external and conflicting utilities are
 * not merged — so e.g. `vt-h-6` on `Input` never overrides `vt-h-9` from the component defaults.
 */
const customTwMerge = extendTailwindMerge({
	experimentalParseClassName: ({ className, parseClassName }) => {
		const parsed = parseClassName(className);
		if (parsed.isExternal) {
			return parsed;
		}
		const { baseClassName } = parsed;
		if (baseClassName.startsWith(TAILWIND_CLASS_PREFIX)) {
			return {
				...parsed,
				baseClassName: baseClassName.slice(TAILWIND_CLASS_PREFIX.length),
			};
		}
		return parsed;
	},
});

export function cn(...inputs: ClassValue[]) {
	return customTwMerge(clsx(inputs));
}
