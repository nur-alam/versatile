import config from '@/config';
import { fetchUtil } from '@/utils/request-utils';
import { CreateTemploginFormValues } from '@/utils/schema-validation';
import { formatExpirationDate, getExpirationTimestamp } from '@/utils/date-utils';
import { VersatileResponseType } from '@/utils/versatile-declaration';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { __ } from '@wordpress/i18n';
import toast from 'react-hot-toast';
import { isDateExpired } from '@/utils/date-utils';

export interface TempLogin {
	id: number;
	user_id: number;
	display_name: string;
	email: string;
	role: string;
	expires_at: string;
	redirect_url: string;
	ip_address: string;
    login_count: number;
    login_url: string;
	last_login: string;
	is_active: boolean;
	created_at: string;
	updated_at: string;
}

export interface TempLoginListData {
	temp_logins: TempLogin[];
	page: number;
	per_page: number;
	total_entries: number;
	total_pages: number;
}

export interface TempLoginListQueryParams {
	page: number;
	per_page: number;
	search?: string;
	role?: string;
	status?: 'active' | 'expired' | 'all' | '';
	is_active?: boolean;
	order?: 'asc' | 'desc' | '';
	orderby?: keyof TempLogin | '';
}

export const tempLoginApi = {
	// get available roles
	getAvailableRoles: async () => {
		const payload = { action: 'versatile_get_available_roles' };
		const response = await fetchUtil<{ [key: string]: string }[]>(config.ajax_url, { body: payload });

		if (200 !== response.status_code) {
			throw new Error(response.message || __('Failed to get available roles', 'versatile-toolkit'));
		}

		return response.data;
	},

	// create temp login
	createTempLogin: async (data: CreateTemploginFormValues) => {
		const payload = {
			action: 'versatile_create_temp_login',
			...data,
			expires_at: formatExpirationDate(getExpirationTimestamp(data.expires_at)),
		};
        console.log('payload', payload);
        const response = await fetchUtil(config.ajax_url, { body: payload });
        console.log('response', response);
		if (200 !== response.status_code) {
			throw new Error(response.message || __('Failed to create temporary login', 'versatile-toolkit'));
		}
		return response as VersatileResponseType;
	},

	// get temp login list
	getTempLoginList: async (params: TempLoginListQueryParams) => {
		const payload = {
			action: 'versatile_get_temp_login_list',
			...params,
        };
		const response = await fetchUtil<TempLoginListData>(config.ajax_url, { body: payload });
		if (200 !== response.status_code) {
			throw new Error(response.message || __('Failed to get temporary login list', 'versatile-toolkit'));
		}
		return response.data;
	},

    // Toggle temporary login status (activate/deactivate)
    toggleTempLoginStatus: async (params: { id: number; is_active: boolean }) => {
        const payload = {
            action: 'versatile_toggle_temp_login_status',
            ...params,
        };
        const response = await fetchUtil(config.ajax_url, { body: payload });
        if (200 !== response.status_code) {
            throw new Error(response.message || __('Failed to toggle temporary login status', 'versatile-toolkit'));
        }
        return response as VersatileResponseType;
    },

    // Delete temporary login
    deleteTempLogin: async (params: { id: number }) => {
        const payload = {
            action: 'versatile_delete_temp_login',
            ...params,
        };
        const response = await fetchUtil(config.ajax_url, { body: payload });
        if (200 !== response.status_code) {
            throw new Error(response.message || __('Failed to delete temporary login', 'versatile-toolkit'));
        }
        return response as VersatileResponseType;
    },
	
};

export const useAvailableRoles = () => {
	return useQuery({
		queryKey: ['available-roles'],
		queryFn: tempLoginApi.getAvailableRoles,
		// staleTime: 1000 * 60 * 5, // Consider data stale after 5 mins
		refetchOnWindowFocus: false,
	});
};

export const useCreateTempLogin = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: tempLoginApi.createTempLogin,
        onSuccess: (data: VersatileResponseType) => {
            // Invalidate and refetch debug log status
			queryClient.invalidateQueries({ queryKey: ['get-temp-logins'] });
			toast.success(data.message || __('Temporary login created successfully', 'versatile-toolkit'));
		},
		onError: (error: Error) => {
			toast.error(error.message || __('Error: while creating temporary login', 'versatile-toolkit'));
		},
	});
};

export const useGetTempLoginList = (params: TempLoginListQueryParams) => {
	return useQuery({
		queryKey: ['get-temp-logins', params],
		queryFn: () => tempLoginApi.getTempLoginList(params),
		// staleTime: 1000 * 60 * 5, // Consider data stale after 5 mins
		refetchOnWindowFocus: false,
	});
};

export const useToggleTempLoginStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (params: { id: number; is_active: boolean }) => tempLoginApi.toggleTempLoginStatus(params),
        onSuccess: (data: VersatileResponseType) => {
            // Invalidate and refetch temp login list
            queryClient.invalidateQueries({ queryKey: ['get-temp-logins'] });
            toast.success(data.message || __('Temporary login status updated successfully', 'versatile-toolkit'));
        },
        onError: (error: Error) => {
            toast.error(error.message || __('Error: while updating temporary login status', 'versatile-toolkit'));
        },
    });
};

export const useDeleteTempLogin = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (params: { id: number }) => tempLoginApi.deleteTempLogin(params),
        onSuccess: (data: VersatileResponseType) => {
            // Invalidate and refetch temp login list
            queryClient.invalidateQueries({ queryKey: ['get-temp-logins'] });
            toast.success(data.message || __('Temporary login deleted successfully', 'versatile-toolkit'));
        },
        onError: (error: Error) => {
            toast.error(error.message || __('Error: while deleting temporary login', 'versatile-toolkit'));
        },
    });
};
