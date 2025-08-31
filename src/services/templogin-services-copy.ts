import config from '@/config';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { VersatileResponseType } from '@/utils/versatile-declaration';
import toast from 'react-hot-toast';
import { __ } from '@wordpress/i18n';

// Types
export interface TempLogin {
    id: number;
    token: string;
    role: string;
    display_name: string;
    email?: string;
    expires_at: string;
    redirect_url?: string;
    language?: string;
    created_at: string;
    last_login?: string;
    login_count: number;
    is_active: boolean;
    login_url: string;
}

export interface TempLoginCreateData {
    display_name: string;
    email?: string;
    role: string;
    expires_at: string;
    redirect_url?: string;
    language?: string;
}

export interface TempLoginSearchParams {
    page?: number;
    perPage?: number;
    search?: string;
    role?: string;
    status?: 'active' | 'expired' | 'all';
    sortKey?: string;
    order?: string;
}

export interface TempLoginListData {
    current_page: number;
    temp_logins: TempLogin[];
    per_page: number;
    total_entries: number;
    total_pages: number;
}

export interface TempLoginActivity {
    id: number;
    temp_login_id: number;
    action: string;
    description: string;
    ip_address: string;
    user_agent: string;
    created_at: string;
}

export interface TempLoginActivityData {
    current_page: number;
    activities: TempLoginActivity[];
    per_page: number;
    total_entries: number;
    total_pages: number;
}

export interface ExpirationOption {
    value: string;
    label: string;
}

// API Functions
export const tempLoginApi = {
    // Get all temporary logins with pagination and filters
    getTempLogins: async (params: TempLoginSearchParams): Promise<TempLoginListData> => {
        const urlParams = new URLSearchParams({
            action: 'versatile_get_temp_logins',
            versatile_nonce: config.nonce_value,
            page: String(params.page || 1),
            per_page: String(params.perPage || 10),
            search: String(params.search || '').trim(),
            role: String(params.role || '').trim(),
            status: String(params.status || 'all').trim(),
            sortKey: String(params.sortKey || '').trim(),
            order: String(params.order || '').trim(),
        });

        const response = await fetch(`${config.ajax_url}?${urlParams}`);
        console.log('response',response);
        const data = await response.json() as VersatileResponseType<TempLoginListData>;

        console.log('datat',data);

        if (data.status_code !== 200) {
            throw new Error(data.message || 'Failed to get temporary logins');
        }

        return data.data;
    },

    // Create new temporary login
    createTempLogin: async (loginData: TempLoginCreateData): Promise<TempLogin> => {
        const params = new URLSearchParams({
            action: 'versatile_create_temp_login',
            versatile_nonce: config.nonce_value,
            display_name: loginData.display_name,
            email: loginData.email || '',
            role: loginData.role,
            expires_at: loginData.expires_at,
            redirect_url: loginData.redirect_url || '',
            language: loginData.language || '',
        });

        const response = await fetch(config.ajax_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params,
        });

        const data = await response.json() as VersatileResponseType<TempLogin>;

        if (data.status_code !== 200) {
            throw new Error(data.message || 'Failed to create temporary login');
        }

        return data.data;
    },

    // Update temporary login
    updateTempLogin: async (id: number, loginData: Partial<TempLoginCreateData>): Promise<TempLogin> => {
        const params = new URLSearchParams({
            action: 'versatile_update_temp_login',
            versatile_nonce: config.nonce_value,
            id: String(id),
            display_name: loginData.display_name || '',
            email: loginData.email || '',
            role: loginData.role || '',
            expires_at: loginData.expires_at || '',
            redirect_url: loginData.redirect_url || '',
            language: loginData.language || '',
        });

        const response = await fetch(config.ajax_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params,
        });

        const data = await response.json() as VersatileResponseType<TempLogin>;

        if (data.status_code !== 200) {
            throw new Error(data.message || 'Failed to update temporary login');
        }

        return data.data;
    },

    // Delete temporary login
    deleteTempLogin: async (id: number): Promise<void> => {
        const params = new URLSearchParams({
            action: 'versatile_delete_temp_login',
            versatile_nonce: config.nonce_value,
            id: String(id),
        });

        const response = await fetch(config.ajax_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params,
        });

        const data = await response.json() as VersatileResponseType<void>;

        if (data.status_code !== 200) {
            throw new Error(data.message || 'Failed to delete temporary login');
        }
    },

    // Toggle temporary login status (activate/deactivate)
    toggleTempLogin: async (id: number, isActive: boolean): Promise<TempLogin> => {
        const params = new URLSearchParams({
            action: 'versatile_toggle_temp_login',
            versatile_nonce: config.nonce_value,
            id: String(id),
            is_active: String(isActive),
        });

        const response = await fetch(config.ajax_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params,
        });

        const data = await response.json() as VersatileResponseType<TempLogin>;

        if (data.status_code !== 200) {
            throw new Error(data.message || 'Failed to toggle temporary login status');
        }

        return data.data;
    },

    // Get temporary login activity logs
    getTempLoginActivity: async (tempLoginId: number, params: { page?: number; perPage?: number }): Promise<TempLoginActivityData> => {
        const urlParams = new URLSearchParams({
            action: 'versatile_get_temp_login_activity',
            versatile_nonce: config.nonce_value,
            temp_login_id: String(tempLoginId),
            page: String(params.page || 1),
            per_page: String(params.perPage || 10),
        });

        const response = await fetch(`${config.ajax_url}?${urlParams}`);
        const data = await response.json() as VersatileResponseType<TempLoginActivityData>;

        if (data.status_code !== 200) {
            throw new Error(data.message || 'Failed to get temporary login activity');
        }

        return data.data;
    },

    // Get available WordPress roles
    getAvailableRoles: async (): Promise<{ [key: string]: string }> => {
        const params = new URLSearchParams({
            action: 'versatile_get_available_roles',
            versatile_nonce: config.nonce_value,
        });

        const response = await fetch(`${config.ajax_url}?${params}`);
        const data = await response.json() as VersatileResponseType<{ [key: string]: string }>;

        if (data.status_code !== 200) {
            throw new Error(data.message || 'Failed to get available roles');
        }

        return data.data;
    },

    // Get expiration options
    getExpirationOptions: (): ExpirationOption[] => {
        return [
            { value: '1_hour', label: __('1 Hour', 'versatile-toolkit') },
            { value: '6_hours', label: __('6 Hours', 'versatile-toolkit') },
            { value: '12_hours', label: __('12 Hours', 'versatile-toolkit') },
            { value: '1_day', label: __('1 Day', 'versatile-toolkit') },
            { value: '3_days', label: __('3 Days', 'versatile-toolkit') },
            { value: '1_week', label: __('1 Week', 'versatile-toolkit') },
            { value: '2_weeks', label: __('2 Weeks', 'versatile-toolkit') },
            { value: '1_month', label: __('1 Month', 'versatile-toolkit') },
            { value: '3_months', label: __('3 Months', 'versatile-toolkit') },
            { value: '6_months', label: __('6 Months', 'versatile-toolkit') },
            { value: '1_year', label: __('1 Year', 'versatile-toolkit') },
            { value: 'custom', label: __('Custom Date', 'versatile-toolkit') },
        ];
    },

    // Copy login URL to clipboard
    copyLoginUrl: async (loginUrl: string): Promise<void> => {
        try {
            await navigator.clipboard.writeText(loginUrl);
        } catch (error) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = loginUrl;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
            } catch (execError) {
                throw new Error('Copy failed');
            }
            document.body.removeChild(textArea);
        }
    },
};

// React Query Hooks
export const useTempLogins = (params: TempLoginSearchParams) => {
    return useQuery({
        queryKey: ['tempLogins', params],
        queryFn: () => tempLoginApi.getTempLogins(params),
        staleTime: 30000, // Consider data stale after 30 seconds
    });
};

export const useCreateTempLogin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: tempLoginApi.createTempLogin,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tempLogins'] });
            toast.success(__('Temporary login created successfully', 'versatile-toolkit'));
        },
        onError: (error: Error) => {
            toast.error(error.message || __('Failed to create temporary login', 'versatile-toolkit'));
        },
    });
};

export const useUpdateTempLogin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<TempLoginCreateData> }) =>
            tempLoginApi.updateTempLogin(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tempLogins'] });
            toast.success(__('Temporary login updated successfully', 'versatile-toolkit'));
        },
        onError: (error: Error) => {
            toast.error(error.message || __('Failed to update temporary login', 'versatile-toolkit'));
        },
    });
};

export const useDeleteTempLogin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: tempLoginApi.deleteTempLogin,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tempLogins'] });
            toast.success(__('Temporary login deleted successfully', 'versatile-toolkit'));
        },
        onError: (error: Error) => {
            toast.error(error.message || __('Failed to delete temporary login', 'versatile-toolkit'));
        },
    });
};

export const useToggleTempLogin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
            tempLoginApi.toggleTempLogin(id, isActive),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['tempLogins'] });
            const status = variables.isActive ? 'activated' : 'deactivated';
            toast.success(__(`Temporary login ${status} successfully`, 'versatile-toolkit'));
        },
        onError: (error: Error) => {
            toast.error(error.message || __('Failed to toggle temporary login status', 'versatile-toolkit'));
        },
    });
};

export const useTempLoginActivity = (tempLoginId: number, params: { page?: number; perPage?: number }) => {
    return useQuery({
        queryKey: ['tempLoginActivity', tempLoginId, params],
        queryFn: () => tempLoginApi.getTempLoginActivity(tempLoginId, params),
        enabled: !!tempLoginId,
        staleTime: 30000,
    });
};

export const useAvailableRoles = () => {
    return useQuery({
        queryKey: ['availableRoles'],
        queryFn: tempLoginApi.getAvailableRoles,
        staleTime: 300000, // Consider data stale after 5 minutes
    });
};

export const useCopyLoginUrl = () => {
    return useMutation({
        mutationFn: tempLoginApi.copyLoginUrl,
        onSuccess: () => {
            toast.success(__('Login URL copied to clipboard', 'versatile-toolkit'));
        },
        onError: () => {
            toast.error(__('Failed to copy login URL', 'versatile-toolkit'));
        },
    });
};

// Utility functions
export const formatExpirationDate = (expiresAt: string): string => {
    const date = new Date(expiresAt);
    const now = new Date();

    if (date < now) {
        return __('Expired', 'versatile-toolkit');
    }

    return date.toLocaleString();
};

export const isExpired = (expiresAt: string): boolean => {
    return new Date(expiresAt) < new Date();
};

export const getExpirationTimestamp = (option: string, customDate?: string): string => {
    const now = new Date();

    if (option === 'custom' && customDate) {
        return new Date(customDate).toISOString();
    }

    const timeMap: { [key: string]: number } = {
        '1_hour': 60 * 60 * 1000,
        '6_hours': 6 * 60 * 60 * 1000,
        '12_hours': 12 * 60 * 60 * 1000,
        '1_day': 24 * 60 * 60 * 1000,
        '3_days': 3 * 24 * 60 * 60 * 1000,
        '1_week': 7 * 24 * 60 * 60 * 1000,
        '2_weeks': 14 * 24 * 60 * 60 * 1000,
        '1_month': 30 * 24 * 60 * 60 * 1000,
        '3_months': 90 * 24 * 60 * 60 * 1000,
        '6_months': 180 * 24 * 60 * 60 * 1000,
        '1_year': 365 * 24 * 60 * 60 * 1000,
    };

    const timeToAdd = timeMap[option] || timeMap['1_day'];
    return new Date(now.getTime() + timeToAdd).toISOString();
};