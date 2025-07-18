import config from '@/config';
import { useMutation, useQuery } from '@tanstack/react-query';
import { TukitakiResponseType } from '@/utils/tukitaki-declaration';
import { fetchPostUtil, fetchUtil } from '@/utils/request-utils';
import toast from 'react-hot-toast';
import { __ } from '@wordpress/i18n';
import { AnyObject } from '@/utils/utils';

export const useGetMoodInfo = () => {
	return useQuery<TukitakiResponseType>({
		queryKey: ['getMoodInfo'],
		queryFn: async (payload: AnyObject) => {
			payload.action = 'tukitaki_get_mood_info';
			const res = await fetchUtil(config.ajax_url, { body: payload });
			return res;
		},
		staleTime: 5000,
	});
};

export const useGetServiceList = () => {
	return useQuery<TukitakiResponseType>({
		queryKey: ['getServiceList'],
		queryFn: async (payload: AnyObject) => {
			payload.action = 'tukitaki_get_service_list';
			const res = await fetchUtil(config.ajax_url, { body: payload });
			return res;
		},
		staleTime: 5000,
	});
};

export const useGetEnableServiceList = () => {
	return useQuery<TukitakiResponseType>({
		queryKey: ['getEnableServiceList'],
		queryFn: async (payload: AnyObject) => {
			payload.action = 'tukitaki_get_enable_service_list';
			const res = await fetchUtil(config.ajax_url, { body: payload });
			return res;
		},
		staleTime: 5000,
	});
};

export const useUpdateMaintenanceMood = () => {
	return useMutation({
		mutationFn: async (payload: AnyObject) => {
			payload.action = 'tukitaki_update_maintenance_mood';
			const res = await fetchUtil(config.ajax_url, {
				body: payload,
			});
			return res;
		},
		onSuccess: (response: TukitakiResponseType) => {
			toast.success(response.message ?? __('Maintenance Mood info updated!', 'tukitaki'));
		},
		onError: (error: any) => {
			toast.error(error.message ?? __('Failed while updating maintenance mood', 'tukitaki'));
		},
	});
};

export const useUpdateComingsoonMood = () => {
	return useMutation({
		mutationFn: async (payload: AnyObject) => {
			payload.action = 'tukitaki_update_comingsoon_mood';
			const res = await fetchUtil(config.ajax_url, {
				body: payload,
			});
			return res;
		},
		onSuccess: (response: TukitakiResponseType) => {
			toast.success(response.message ?? __('Comingsoon Mood info updated!', 'tukitaki'));
		},
		onError: (error: any) => {
			toast.error(error.message ?? __('Failed while updating Comingsoon mood', 'tukitaki'));
		},
	});
};

export const useUpdateServiceStatus = () => {
	return useMutation({
		mutationFn: async (payload: AnyObject) => {
			payload.action = 'tukitaki_update_service_status';
			const res = await fetchUtil(config.ajax_url, {
				body: payload,
			});
			return res;
		},
		onSuccess: (response: TukitakiResponseType) => {
			toast.success(response.message ?? __('Service status updated!', 'tukitaki'));
		},
		onError: (error: any) => {
			toast.error(error.message ?? __('Failed to update service status', 'tukitaki'));
		},
	});
};
