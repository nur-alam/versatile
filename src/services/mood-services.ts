import config from '@/config';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { VersatileResponseType } from '@/utils/versatile-declaration';
import { fetchUtil } from '@/utils/request-utils';
import toast from 'react-hot-toast';
import { __ } from '@wordpress/i18n';
import { AnyObject } from '@/utils/utils';

export const useGetMoodInfo = () => {
	return useQuery<VersatileResponseType>({
		queryKey: ['getMoodInfo'],
		queryFn: async (payload: AnyObject) => {
			payload.action = 'versatile_get_mood_info';
			const res = await fetchUtil(config.ajax_url, { body: payload });
			return res;
		},
		staleTime: 5000,
	});
};

export const useGetServiceList = () => {
	return useQuery<VersatileResponseType>({
		queryKey: ['getServiceList'],
		queryFn: async (payload: AnyObject) => {
			payload.action = 'versatile_get_service_list';
			const res = await fetchUtil(config.ajax_url, { body: payload });
			return res;
		},
		staleTime: 5000,
	});
};

export const useGetEnableServiceList = () => {
	return useQuery<VersatileResponseType>({
		queryKey: ['getEnableServiceList'],
		queryFn: async (payload: AnyObject) => {
			payload.action = 'versatile_get_enable_service_list';
			const res = await fetchUtil(config.ajax_url, { body: payload });
			return res;
		},
		staleTime: 5000,
	});
};

export const useUpdateMaintenanceMood = () => {
	const queryClient = useQueryClient();
	
	return useMutation({
		mutationFn: async (payload: AnyObject) => {
			payload.action = 'versatile_update_maintenance_mood';
			const res = await fetchUtil(config.ajax_url, {
				body: payload,
			});
			return res;
		},
		onSuccess: (response: VersatileResponseType) => {
			toast.success(response.message ?? __('Maintenance Mood info updated!', 'verstaile-toolkit'));
			// Invalidate and refetch mood info
			queryClient.invalidateQueries({ queryKey: ['getMoodInfo'] });
		},
		onError: (error: any) => {
			toast.error(error.message ?? __('Failed while updating maintenance mood', 'verstaile-toolkit'));
		},
	});
};

export const useUpdateComingsoonMood = () => {
	const queryClient = useQueryClient();
	
	return useMutation({
		mutationFn: async (payload: AnyObject) => {
			payload.action = 'versatile_update_comingsoon_mood';
			const res = await fetchUtil(config.ajax_url, {
				body: payload,
			});
			return res;
		},
		onSuccess: (response: VersatileResponseType) => {
			toast.success(response.message ?? __('Comingsoon Mood info updated!', 'verstaile-toolkit'));
			// Invalidate and refetch mood info
			queryClient.invalidateQueries({ queryKey: ['getMoodInfo'] });
		},
		onError: (error: any) => {
			toast.error(error.message ?? __('Failed while updating Comingsoon mood', 'verstaile-toolkit'));
		},
	});
};

export const useUpdateServiceStatus = () => {
	return useMutation({
		mutationFn: async (payload: AnyObject) => {
			payload.action = 'versatile_update_service_status';
			const res = await fetchUtil(config.ajax_url, {
				body: payload,
			});
			return res;
		},
		onSuccess: (response: VersatileResponseType) => {
			toast.success(response.message ?? __('Service status updated!', 'verstaile-toolkit'));
		},
		onError: (error: any) => {
			toast.error(error.message ?? __('Failed to update service status', 'verstaile-toolkit'));
		},
	});
};
