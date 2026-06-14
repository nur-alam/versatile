import config from '@/config';

export const redirectUrl = `${config.site_url}/wp-admin/admin.php?page=versatile`;

// Response Type
export type VersatileResponseType<T = any> = {
	status_code: number;
	message: string;
	data: T;
	errors?: Record<string, string[]>;
};

export type ServiceItem = {
	label: string;
	enable: boolean;
	path: string;
	description: string;
	menus: Record<
		string,
		{
			slug: string;
			label: string;
		}
	>;
};

export type ServiceListType = {
	[key: string]: ServiceItem;
};

// smtp service
export const emailProviderOptions = ['smtp', 'ses', 'gmail'] as const;
export type EmailProviderOptionsType = typeof emailProviderOptions[number];
export const emailProviderOptionsMap: { label: string; value: EmailProviderOptionsType }[] = [
	{ label: 'SMTP', value: 'smtp' },
	{ label: 'Amazon SES', value: 'ses' },
	{ label: 'Google Gmail', value: 'gmail' },
];

// smtp security options
export const smtpSecurityOptions = ['none', 'ssl', 'tls'] as const;
export type SmtpSecurityOptionsType = typeof smtpSecurityOptions[number];
export const smtpSecurityOptionsMap: { label: string; value: SmtpSecurityOptionsType }[] = [
	{ label: 'None', value: 'none' },
	{ label: 'SSL', value: 'ssl' },
	{ label: 'TLS', value: 'tls' },
];

// smtp port options
export const smtpPortOptions = ['25', '465', '587'] as const;
export type SmtpPortOptionsType = typeof smtpPortOptions[number];
export const smtpPortOptionsMap: { label: string; value: SmtpPortOptionsType }[] = [
	{ label: '25', value: '25' },
	{ label: '465', value: '465' },
	{ label: '587', value: '587' },
];

// AWS SES Regions
export type AwsSesRegionOptionsType =
	| 'us-east-1'
	| 'us-east-2'
	| 'us-west-1'
	| 'us-west-2'
	| 'eu-west-1'
	| 'eu-central-1'
	| 'ap-south-1'
	| 'ap-southeast-1'
	| 'ap-southeast-2'
	| 'ap-northeast-1';
// export type AwsSesRegionOptionsMapType = { value: AwsSesRegionOptionsType; label: string };

export const awsSesRegionOptionsMap: { value: AwsSesRegionOptionsType; label: string }[] = [
	{ value: 'us-east-1', label: 'US East (N. Virginia)' },
	{ value: 'us-east-2', label: 'US East (Ohio)' },
	{ value: 'us-west-1', label: 'US West (N. California)' },
	{ value: 'us-west-2', label: 'US West (Oregon)' },
	{ value: 'eu-west-1', label: 'EU (Ireland)' },
	{ value: 'eu-central-1', label: 'EU (Frankfurt)' },
	{ value: 'ap-south-1', label: 'Asia Pacific (Mumbai)' },
	{ value: 'ap-southeast-1', label: 'Asia Pacific (Singapore)' },
	{ value: 'ap-southeast-2', label: 'Asia Pacific (Sydney)' },
	{ value: 'ap-northeast-1', label: 'Asia Pacific (Tokyo)' },
];
