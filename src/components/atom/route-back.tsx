import { MoveLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const routeBack = ({ link = '/' }: { link?: string }) => {
	return (
		<>
			<Link
				to={link}
				className="vt-flex vt-items-center vt-justify-center vt-text-slate-700 vt-bg-slate-200 hover:vt-bg-slate-300 vt-px-2 vt-rounded-sm vt-transition-colors"
			>
				<MoveLeft className="vt-w-4" />
			</Link>
		</>
	);
};

export default routeBack;
