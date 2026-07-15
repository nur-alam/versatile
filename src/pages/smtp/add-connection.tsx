import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { __ } from '@wordpress/i18n';
import DefaultSmtp from '@pages/smtp/provider/default-smtp';
import AwsSes from '@pages/smtp/provider/aws-ses';
import Gmail from '@pages/smtp/provider/gmail';
import { useState } from 'react';
import RouteBack from '@/components/atom/route-back';
import { SmtpSecurityOptionsType, EmailProviderOptionsType } from '@/utils/versatile-declaration';

const AddConnection = () => {

	const [selectedProvider, setSelectedProvider] = useState<EmailProviderOptionsType>('smtp');

	return (
		<Card className="vt-w-full vt-max-w-[1000px] vt-shadow-lg vt-p-6 vt-mt-6 vt-min-h-[500px]">
			<div className="vt-flex vt-justify-between vt-items-center vt-mb-8">
				<CardTitle>{__('Add Connection', 'versatile-toolkit')}</CardTitle>
				<RouteBack link="/smtp" />
			</div>
			<div>
				<Tabs
					value={selectedProvider}
					className="vt-flex vt-gap-6"
					onValueChange={(value) => setSelectedProvider(value as EmailProviderOptionsType)}
					defaultValue="smtp"
				>
					<TabsList className="vt-flex vt-flex-col vt-h-fit vt-w-48 vt-bg-muted vt-p-2 vt-rounded-lg">
						<TabsTrigger value="smtp" className="vt-w-full vt-flex vt-justify-start vt-items-center vt-gap-2 vt-p-2.5">
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
								<rect width="20" height="16" x="2" y="4" rx="2" />
								<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
							</svg>
							{__('SMTP', 'versatile-toolkit')}
						</TabsTrigger>
						<TabsTrigger value="ses" className="vt-w-full vt-flex vt-justify-start vt-items-center vt-gap-2 vt-p-2.5">
							<svg width="25" height="25" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
								<g clip-path="url(#clip0_214_10729)">
									<path d="M80 0H0V80H80V0Z" fill="url(#paint0_linear_214_10729)" />
									<path fill-rule="evenodd" clip-rule="evenodd" d="M57 60.9999C57 59.3738 55.626 57.9998 54 57.9998C52.374 57.9998 51 59.3738 51 60.9999C51 62.6259 52.374 63.9999 54 63.9999C55.626 63.9999 57 62.6259 57 60.9999ZM40 59.9999C38.374 59.9999 37 61.3739 37 62.9999C37 64.6259 38.374 66 40 66C41.626 66 43 64.6259 43 62.9999C43 61.3739 41.626 59.9999 40 59.9999ZM26 57.9998C24.374 57.9998 23 59.3738 23 60.9999C23 62.6259 24.374 63.9999 26 63.9999C27.626 63.9999 29 62.6259 29 60.9999C29 59.3738 27.626 57.9998 26 57.9998ZM28.605 42.9996H51.395L43.739 36.1104L40.649 38.7585C40.463 38.9195 40.23 38.9995 39.999 38.9995C39.768 38.9995 39.535 38.9195 39.349 38.7585L36.26 36.1104L28.605 42.9996ZM27 28.1733V41.7545L34.729 34.7984L27 28.1733ZM51.297 26.9993H28.703L39.999 36.6824L51.297 26.9993ZM53 41.7545V28.1733L45.271 34.7974L53 41.7545ZM59 60.9999C59 63.7099 56.71 66 54 66C51.29 66 49 63.7099 49 60.9999C49 58.6308 50.75 56.5838 53 56.1058V52.9997H41V58.1058C43.25 58.5838 45 60.6309 45 62.9999C45 65.71 42.71 68 40 68C37.29 68 35 65.71 35 62.9999C35 60.6309 36.75 58.5838 39 58.1058V52.9997H27V56.1058C29.25 56.5838 31 58.6308 31 60.9999C31 63.7099 28.71 66 26 66C23.29 66 21 63.7099 21 60.9999C21 58.6308 22.75 56.5838 25 56.1058V51.9997C25 51.4477 25.447 50.9997 26 50.9997H39V44.9996H26C25.447 44.9996 25 44.5516 25 43.9996V25.9993C25 25.4472 25.447 24.9992 26 24.9992H54C54.553 24.9992 55 25.4472 55 25.9993V43.9996C55 44.5516 54.553 44.9996 54 44.9996H41V50.9997H54C54.553 50.9997 55 51.4477 55 51.9997V56.1058C57.25 56.5838 59 58.6308 59 60.9999ZM68 39.9995C68 45.9066 66.177 51.5597 62.727 56.3448L61.104 55.1748C64.307 50.7317 66 45.4846 66 39.9995C66 25.6642 54.337 14 40.001 14C25.664 14 14 25.6642 14 39.9995C14 45.4846 15.693 50.7317 18.896 55.1748L17.273 56.3448C13.823 51.5597 12 45.9066 12 39.9995C12 24.5612 24.561 12 39.999 12C55.438 12 68 24.5612 68 39.9995Z" fill="white" />
								</g>
								<defs>
									<linearGradient id="paint0_linear_214_10729" x1="0" y1="8000" x2="8000" y2="0" gradientUnits="userSpaceOnUse">
										<stop stop-color="#3334B9" />
										<stop offset="1" stop-color="#4E74F4" />
									</linearGradient>
									<clipPath id="clip0_214_10729">
										<rect width="80" height="80" fill="white" />
									</clipPath>
								</defs>
							</svg>
							{__('Amazon SES', 'versatile-toolkit')}
						</TabsTrigger>
						<TabsTrigger value="gmail" className="vt-w-full vt-flex vt-justify-start vt-items-center vt-gap-2 vt-p-2.5">
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
								<rect width="20" height="16" x="2" y="4" rx="2" />
								<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
							</svg>
							{__('Google Gmail', 'versatile-toolkit')}
						</TabsTrigger>
					</TabsList>
					<div className="vt-flex-1 vt-border-l vt-pl-6">
						<TabsContent value="smtp">
							<DefaultSmtp selectedProvider={selectedProvider} />
						</TabsContent>
						<TabsContent value="ses">
							<AwsSes selectedProvider={selectedProvider} />
						</TabsContent>
						<TabsContent value="gmail">
							<Gmail selectedProvider={selectedProvider} />
						</TabsContent>
					</div>
				</Tabs>
			</div>
		</Card>
	)
}

export default AddConnection;
