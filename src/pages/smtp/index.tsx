import { Button } from '@/components/ui/button';
import { __ } from '@wordpress/i18n';
import { PlusIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Smtp = () => {
	const navigate = useNavigate();
	return (
		<div className="vt-py-4 vt-space-y-6 vt-mt-4">
			<div className='vt-flex vt-justify-between vt-items-center'>
				<h2 className='vt-text-lg vt-font-medium'>{__('SMTP Dashboard', 'versatile-toolkit')}</h2>
				<Button size='sm' className='vt-gap-x-2' onClick={() => navigate('/smtp/connection/add')}>
					<PlusIcon className='vt-w-5 vt-h-5' />
					{__('Add Connection', 'versatile-toolkit')}
				</Button>
			</div>
		</div>
	)
}

export default Smtp