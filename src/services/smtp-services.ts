import config from '@/config';
import { fetchUtil } from '@/utils/request-utils';
import { AnyObject } from '@/utils/utils';
import { VersatileResponseType } from '@/utils/versatile-declaration';
import { useMutation, useQuery } from '@tanstack/react-query';
import { __ } from '@wordpress/i18n';
import toast from 'react-hot-toast';

const updateSmtpConfig = async (payload: AnyObject) => {
	payload.action = 'update_smtp_config';
	const res = await fetchUtil(config.ajax_url, {
		body: payload,
	});
	return res;
};

export const useUpdateSmtpConfig = () => {
	return useMutation({
		mutationFn: updateSmtpConfig,
		onSuccess: (response: VersatileResponseType) => {
			console.log('updateSmtpConfig success response', response);
			toast.success(response.message ?? __('SMTP config updated!', 'versatile-toolkit'));
		},
		onError: (error: any) => {
			console.log('updateSmtpConfig error', error);
			toast.error(error.message ?? __('Failed to update SMTP config', 'versatile-toolkit'));
		},
	});
};
