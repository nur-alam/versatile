import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { __ } from '@wordpress/i18n';
import { fetchUtil } from '@/utils/request-utils';
import config from '@/config';
import { VersatileResponseType } from '@/utils/versatile-declaration';
import { AnyObject } from '@/utils/utils';

export type QuickpickPluginItem = {
	file: string;
	name: string;
	version: string;
	is_active: boolean;
};

export type QuickpickThemeItem = {
	stylesheet: string;
	name: string;
	version: string;
	is_active: boolean;
};

const quickpickRequest = async <T = any>(payload: AnyObject) => {
	const res = await fetchUtil<T>(config.ajax_url, { body: payload });
	return res;
};

export const getQuickpickPlugins = async () => {
	const response = await quickpickRequest<QuickpickPluginItem[]>({
		action: 'versatile_quickpick_plugins_list',
	});
	return response.data || [];
};

export const getQuickpickThemes = async () => {
	const response = await quickpickRequest<QuickpickThemeItem[]>({
		action: 'versatile_quickpick_themes_list',
	});
	return response.data || [];
};

export const useQuickpickServices = () => {
	return useMutation({
		mutationFn: async (payload: AnyObject) => {
			const res = await quickpickRequest(payload);
			return res;
		},
		onSuccess: (response: VersatileResponseType) => {
			toast.success(response.message || __('Quick action completed successfully!', 'versatile-toolkit'));
		},
		onError: (error: any) => {
			toast.error(error.message || __('Quick action failed', 'versatile-toolkit'));
		},
	});
};