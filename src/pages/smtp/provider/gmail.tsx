import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { __ } from '@wordpress/i18n';
import React from 'react';

const Gmail = () => {
	return (
		<div className="vt-flex vt-justify-center">
			<Card className="vt-w-full vt-h-full">
				<CardHeader>
					<CardTitle>{__('Gmail', 'versatile-toolkit')}</CardTitle>
				</CardHeader>
			</Card>
		</div>
	)
}

export default Gmail;