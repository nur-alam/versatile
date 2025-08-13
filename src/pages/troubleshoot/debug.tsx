import { __ } from '@wordpress/i18n';	
	
const Debug = () => {
	return (
		<div>
			<h1>{__('Debug', 'versatile-toolkit')}</h1>
			<p>{__('This is the debug page', 'versatile-toolkit')}</p>
		</div>
	);
}

export default Debug;