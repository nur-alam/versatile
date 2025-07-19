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
};

export type ServiceListType = {
	[key: string]: ServiceItem;
};