import config from '@/config';
import { useMutation, useQuery } from '@tanstack/react-query';
import { TukitakiResponseType } from '@/utils/tukitaki-declaration';
import { fetchPostUtil, fetchUtil } from '@/utils/requestUtils';
import toast from 'react-hot-toast';
import { __ } from '@wordpress/i18n';
import { AnyObject } from '@/utils/utils';

export const useUpdateMaintenanceMood = () => {
	return useMutation({
		mutationFn: async (payload: AnyObject) => {
			payload.action = 'tukitaki_update_maintenance_mood';
			const res = await fetchPostUtil(config.ajax_url, {
				body: payload,
			});
			return res;
		},
		onSuccess: (response: TukitakiResponseType) => {
			toast.success(response.message ?? __('Maintenance Mood info updated!', 'tukitaki'));
		},
		onError: (error: any) => {
			toast.error(error.message ?? __('Failed updating maintenance mood', 'tukitaki'));
		},
	});
};
