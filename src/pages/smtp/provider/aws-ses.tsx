import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { __ } from '@wordpress/i18n';
import React from 'react';
import { EmailProviderOptionsType } from '@/utils/versatile-declaration';

const AwsSes = ({ selectedProvider }: { selectedProvider: EmailProviderOptionsType }) => {
	return (
		<div className="vt-flex vt-justify-center">
			<Card className="vt-w-full vt-h-full">
				<CardHeader>
					<CardTitle>{__('Amazon SES', 'versatile-toolkit')}</CardTitle>
				</CardHeader>
			</Card>
		</div>
	)
}

export default AwsSes;
