import config from '@/config';

export const redirectUrl = `${config.site_url}/wp-admin/admin.php?page=tukitaki`;

// Response Type
export type TukitakiResponseType = {
	status_code: number;
	message: string;
	data: any;
	errors?: Record<string, string[]>;
};
