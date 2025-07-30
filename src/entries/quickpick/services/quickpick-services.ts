import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { __ } from '@wordpress/i18n';
import { fetchUtil } from '@/utils/request-utils';
import config from '@/config';
import { VersatileResponseType } from '@/utils/versatile-declaration';
import { AnyObject } from '@/utils/utils';

export const useQuickpickServices = () => {
	return useMutation({
		mutationFn: async (payload: AnyObject) => {
			const res = await fetchUtil(config.ajax_url, { body: payload });
			return res;
		},
		onSuccess: (response: VersatileResponseType) => {
			toast.success(response.message || __('Permalinks have been reset successfully!', 'versatile-toolkit'));
		},
		onError: (error: any) => {
			toast.error(error.message || __('Failed to reset permalinks', 'versatile-toolkit'));
		},
	});
};