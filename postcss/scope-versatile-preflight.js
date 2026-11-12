/**
 * Tailwind Preflight is a global reset (*, button, img, headings, …).
 * Loaded on every wp-admin screen, it strips borders and button styles
 * outside the plugin. Rewrite those selectors so they match only:
 *   #versatile-root, #vt-quickact-container, and .vt-ui (portaled UI).
 *
 * :where() keeps specificity at the original Preflight level so vt-* utilities
 * still win. :root / .dark tokens and .vt-* rules are left alone.
 */

const SCOPE = ':where(#versatile-root, #vt-quickact-container, .vt-ui)';
const APP_SCOPE = ':where(#versatile-root, .vt-ui)';

const scopeVersatilePreflight = () => {
	const leave = (selector) =>
		selector.includes('.vt-') ||
		selector.includes('#versatile-root') ||
		selector.includes('#vt-quickact') ||
		selector.includes(':is(') ||
		selector === ':root' ||
		selector.startsWith(':root ') ||
		selector.startsWith(':root,') ||
		selector.startsWith(':root.') ||
		selector.startsWith(':root:') ||
		selector === '.dark' ||
		selector.startsWith('.dark ') ||
		selector.startsWith('.dark,') ||
		selector.startsWith('.dark.') ||
		selector.startsWith('.dark:');

	const scopeSelector = (selector) => {
		if (selector === 'body') {
			return ['#versatile-root'];
		}
		if (selector === 'html' || selector === ':host') {
			return [APP_SCOPE];
		}
		if (selector === '*') {
			return [SCOPE, `${SCOPE} *`];
		}
		if (selector === '::before' || selector === '::after' || selector === '::backdrop') {
			return [`${SCOPE}${selector}`, `${SCOPE} *${selector}`];
		}
		return [`${SCOPE} ${selector}`];
	};

	return {
		postcssPlugin: 'scope-versatile-preflight',
		Rule(rule) {
			const parent = rule.parent;
			if (parent && parent.type === 'atrule' && /keyframes$/i.test(parent.name)) {
				return;
			}

			const next = [];
			for (const selector of rule.selectors) {
				if (leave(selector)) {
					next.push(selector);
				} else {
					next.push(...scopeSelector(selector));
				}
			}
			rule.selectors = [...new Set(next)];
		},
	};
};

scopeVersatilePreflight.postcss = true;

module.exports = scopeVersatilePreflight;
