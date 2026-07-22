import config from '@/config';
import { fetchUtil } from '@/utils/request-utils';
import { AnyObject } from '@/utils/utils';
import { EmailProviderOptionsType, VersatileResponseType } from '@/utils/versatile-declaration';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { __ } from '@wordpress/i18n';
import toast from 'react-hot-toast';

// export type EmailConnection = {
// 	provider: 'smtp' | 'ses' | 'gmail';
// 	provider_label: string;
// 	email: string;
// 	created_at: string;
// 	from_name: string;
// };

export interface ConnectionType {
	fromEmail: string;
	fromName: string;
	provider: EmailProviderOptionsType;
	smtpHost?: string;
	smtpPort?: string;
	smtpSecurity?: string;
	smtpUsername?: string;
	smtpPassword?: string;
	accessKeyId?: string;
	secretAccessKey?: string;
	region?: string;
	clientId?: string;
	clientSecret?: string;
	createdAt: string;
}

const updateSmtpConfig = async (payload: AnyObject) => {
	payload.action = 'update_smtp_config';
	const res = await fetchUtil(config.ajax_url, {
		body: payload,
	});
	return res;
};

const getEmailConnections = async () => {
	return fetchUtil<ConnectionType[]>(config.ajax_url, {
		method: 'GET',
		body: {
			action: 'get_email_connections',
		},
	});
};

export const useUpdateSmtpConfig = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateSmtpConfig,
		onSuccess: (response: VersatileResponseType) => {
			queryClient.invalidateQueries({ queryKey: ['get-email-connections'] });
			console.log('updateSmtpConfig success response', response);
			toast.success(response.message ?? __('SMTP config updated!', 'versatile-toolkit'));
		},
		onError: (error: any) => {
			console.log('updateSmtpConfig error', error);
			toast.error(error.message ?? __('Failed to update SMTP config', 'versatile-toolkit'));
		},
	});
};

export const useGetEmailConnections = () => {
	return useQuery({
		queryKey: ['get-email-connections'],
		queryFn: getEmailConnections,
	});
};
