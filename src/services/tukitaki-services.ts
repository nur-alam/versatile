import config from '@/config';
import { useMutation, useQuery } from '@tanstack/react-query';
import { TukitakiResponseType } from '@/utils/tukitaki-declaration';
import { fetchPostUtil, fetchUtil } from '@/utils/requestUtils';
import toast from 'react-hot-toast';
import { __ } from '@wordpress/i18n';
import { AnyObject } from '@/utils/utils';

export const useGetPluginList = () => {
	return useQuery<TukitakiResponseType>({
		queryKey: ['getPluginList'],
		queryFn: async (payload: AnyObject) => {
			payload.action = 'tukitaki_plugin_list';
			const res = await fetchUtil(config.ajax_url, {
				body: payload,
			});
			return res;
		},
		staleTime: 5000,
	});
};

export const useGetDisablePluginList = () => {
	return useQuery<TukitakiResponseType>({
		queryKey: ['getDisablePluginList'],
		queryFn: async (payload: AnyObject) => {
			payload.action = 'tukitaki_get_disable_plugin_list';
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
			payload.action = 'tukitaki_save_disable_plugin_list';
			const res = await fetchUtil(config.ajax_url, {
				body: payload,
			});
			return res;
		},
		onSuccess: (response: TukitakiResponseType) => {
			toast.success(response.message ?? __('Plugin disabled successfully!', 'tukitaki'));
		},
		onError: (error: any) => {
			toast.error(error.message ?? __('Failed to disable plugin', 'tukitaki'));
		},
	});
};

export const useAddMyIp = () => {
	return useMutation({
		mutationFn: async (payload: AnyObject) => {
			payload.action = 'tukitaki_add_my_ip';
			const res = await fetchPostUtil(config.ajax_url, {
				body: payload,
			});
			return res;
		},
		onSuccess: (response: TukitakiResponseType) => {
			// toast.success(response.message ?? __('IP added successfully!', 'tukitaki'));
		},
		onError: (error: any) => {
			toast.error(error.message ?? __('Failed to add IP', 'tukitaki'));
		},
	});
}