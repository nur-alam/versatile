import config from '@/config';
import { useMutation, useQuery } from '@tanstack/react-query';
import { VersatileResponseType } from '@/utils/versatile-declaration';
import { fetchPostUtil, fetchUtil } from '@/utils/request-utils';
import toast from 'react-hot-toast';
import { __ } from '@wordpress/i18n';
import { AnyObject } from '@/utils/utils';

export const useGetPluginList = () => {
	return useQuery<VersatileResponseType>({
		queryKey: ['getPluginList'],
		queryFn: async (payload: AnyObject) => {
			payload.action = 'versatile_plugin_list';
			const res = await fetchUtil(config.ajax_url, {
				body: payload,
			});
			return res;
		},
		staleTime: 5000,
	});
};

export const useGetDisablePluginList = () => {
	return useQuery<VersatileResponseType>({
		queryKey: ['getDisablePluginList'],
		queryFn: async (payload: AnyObject) => {
			payload.action = 'versatile_get_disable_plugin_list';
			const res = await fetchUtil(config.ajax_url, {
				body: payload,
			});
			return res;
		},
		staleTime: 5000,
	});
};

export const useDisablePlugin = () => {
	return useMutation({
		mutationFn: async (payload: AnyObject) => {
			payload.action = 'versatile_save_disable_plugin_list';
			const res = await fetchUtil(config.ajax_url, {
				body: payload,
			});
			return res;
		},
		onSuccess: (response: VersatileResponseType) => {
			toast.success(response.message ?? __('Plugin disabled successfully!', 'versatile'));
		},
		onError: (error: any) => {
			toast.error(error.message ?? __('Failed to disable plugin', 'versatile'));
		},
	});
};

export const useAddMyIp = () => {
	return useMutation({
		mutationFn: async (payload: AnyObject) => {
			payload.action = 'versatile_add_my_ip';
			const res = await fetchPostUtil(config.ajax_url, {
				body: payload,
			});
			return res;
		},
		onSuccess: (response: VersatileResponseType) => {
			// toast.success(response.message ?? __('IP added successfully!', 'versatile'));
		},
		onError: (error: any) => {
			toast.error(error.message ?? __('Failed to add IP', 'versatile'));
		},
	});
}