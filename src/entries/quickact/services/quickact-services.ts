import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { __ } from '@wordpress/i18n';
import { fetchUtil } from '@/utils/request-utils';
import config from '@/config';
import { VersatileResponseType } from '@/utils/versatile-declaration';
import { AnyObject } from '@/utils/utils';

export type QuickactPluginItem = {
	file: string;
	name: string;
	version: string;
	is_active: boolean;
};

export type QuickactThemeItem = {
	stylesheet: string;
	name: string;
	version: string;
	is_active: boolean;
};

const quickactRequest = async <T = any>(payload: AnyObject) => {
	const res = await fetchUtil<T>(config.ajax_url, { body: payload });
	return res;
};

export const getQuickactPlugins = async () => {
	const response = await quickactRequest<QuickactPluginItem[]>({
		action: 'versatile_quickact_plugins_list',
	});
	return response.data || [];
};

export const getQuickactThemes = async () => {
	const response = await quickactRequest<QuickactThemeItem[]>({
		action: 'versatile_quickact_themes_list',
	});
	return response.data || [];
};

export const useQuickactServices = () => {
	return useMutation({
		mutationFn: async (payload: AnyObject) => {
			const res = await quickactRequest(payload);
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
