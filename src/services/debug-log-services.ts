import config from '@/config';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { VersatileResponseType } from '@/utils/versatile-declaration';
import { fetchUtil } from '@/utils/request-utils';
import toast from 'react-hot-toast';
import { __ } from '@wordpress/i18n';

// Types
export interface DebugLogStatus {
    enabled: boolean;
    file_exists: boolean;
    file_size: number;
    file_size_formatted: string;
    last_modified: number;
}

export interface DebugLogFileInfo {
    exists: boolean;
    size: string;
    lastModified: string;
}

export interface DebugRow {
    id: number;
    type: string;
    message: string;
    severity: string;
    timestamp: string;
}

export interface DebugLogSearchParams {
    page?: number;
    perPage?: number;
    search?: string;
    sortKey?: string;
    order?: string;
}

export interface DebugLogData {
    current_page: number;
    entries: DebugRow[];
    per_page: number;
    total_lines: number;
    total_pages: number;
}

// API Functions
export const debugLogApi = {
    // Get debug log status
    getStatus: async (): Promise<DebugLogStatus> => {
        const params = new URLSearchParams({
            action: 'versatile_get_debug_log_status',
            versatile_nonce: config.nonce_value,
        });

        const response = await fetch(config.ajax_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params,
        });

        const data = await response.json() as VersatileResponseType<DebugLogStatus>;

        if (data.status_code !== 200) {
            throw new Error(data.message || 'Failed to get debug log status');
        }

        return data.data;
    },

    // Toggle debug logging
    toggleDebugLog: async (enable: boolean): Promise<boolean> => {
        const params = new URLSearchParams({
            action: 'versatile_toggle_debug_log',
            versatile_nonce: config.nonce_value,
            enable: enable.toString(),
        });

        const response = await fetch(config.ajax_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params,
        });

        const data = await response.json() as VersatileResponseType<boolean>;

        if (data.status_code !== 200) {
            throw new Error(data.message || 'Failed to toggle debug log');
        }

        return data.data;
    },

    // Clear debug log
    clearLog: async (): Promise<void> => {
        const params = new URLSearchParams({
            action: 'versatile_clear_debug_log',
            versatile_nonce: config.nonce_value,
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
            throw new Error(data.message || 'Failed to clear debug log');
        }
    },

    // Download debug log
    downloadLog: async (): Promise<void> => {
        const params = new URLSearchParams({
            action: 'versatile_download_debug_log',
            versatile_nonce: config.nonce_value,
        });

        const downloadUrl = `${config.ajax_url}?${params}`;
        window.open(downloadUrl, '_blank');

        // Return a resolved promise since the download is initiated
        return Promise.resolve();
    },

    // Refresh debug log status
    refreshStatus: async (): Promise<DebugLogStatus> => {
        const params = new URLSearchParams({
            action: 'versatile_refresh_debug_log',
            versatile_nonce: config.nonce_value,
        });

        const response = await fetch(config.ajax_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params,
        });

        const data = await response.json() as VersatileResponseType<DebugLogStatus>;

        if (data.status_code !== 200) {
            throw new Error(data.message || 'Failed to refresh debug log status');
        }

        return data.data;
    },

    // Load debug log content with pagination
    loadLogContent: async ({ page, perPage, search, sortKey, order }: DebugLogSearchParams): Promise<{ data: DebugRow[], total: number, totalPages: number }> => {
        try {
            const params = new URLSearchParams({
                action: 'versatile_get_debug_log_content',
                versatile_nonce: config.nonce_value,
                page: String(page),
                per_page: String(perPage),
                search: String(search || '').trim(),
                sortKey: String(sortKey || '').trim(),
                order: String(order?.trim()?.toLowerCase() || ''),
            });

            const response = await fetch(`${config.ajax_url}?${params}`);
            const responseData = await response.json() as VersatileResponseType<DebugLogData>;

            if (responseData.status_code === 200) {
                const data = responseData.data as DebugLogData;
                return {
                    data: data.entries,
                    total: data?.total_lines,
                    totalPages: data?.total_pages
                };
            } else {
                throw new Error(responseData.message || 'Error fetching debug log content');
            }
        } catch (error: any) {
            throw new Error(error?.message || 'Unknown error fetching debug log content');
        }
    },
};

// React Query Hooks
export const useDebugLogStatus = () => {
    return useQuery({
        queryKey: ['debugLogStatus'],
        queryFn: debugLogApi.getStatus,
        refetchInterval: 30000, // Refetch every 30 seconds
        staleTime: 10000, // Consider data stale after 10 seconds
    });
};

export const useToggleDebugLog = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: debugLogApi.toggleDebugLog,
        onSuccess: (data, variables) => {
            // Invalidate and refetch debug log status
            queryClient.invalidateQueries({ queryKey: ['debugLogStatus'] });

            // Show success message
            const action = variables ? 'enabled' : 'disabled';
            toast.success(__(`Debug logging ${action} successfully`, 'versatile-toolkit'));
        },
        onError: (error: Error) => {
            toast.error(error.message || __('Failed to toggle debug logging', 'versatile-toolkit'));
        },
    });
};

export const useClearDebugLog = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: debugLogApi.clearLog,
        onSuccess: () => {
            // Invalidate and refetch debug log status and content
            queryClient.invalidateQueries({ queryKey: ['debugLogStatus'] });
            // queryClient.invalidateQueries({ queryKey: ['debugLogContent'] });
            // debugLogApi.loadLogContent({
            //     page: 1,
            //     perPage: 10,
            //     search: '',
            //     sortKey: '',
            //     order: '',
            // });

            toast.success(__('Debug log cleared successfully', 'versatile-toolkit'));
        },
        onError: (error: Error) => {
            toast.error(error.message || __('Failed to clear debug log', 'versatile-toolkit'));
        },
    });
};

export const useDownloadDebugLog = () => {
    return useMutation({
        mutationFn: debugLogApi.downloadLog,
        onSuccess: () => {
            toast.success(__('Debug log download started', 'versatile-toolkit'));
        },
        onError: (error: Error) => {
            toast.error(error.message || __('Failed to download debug log', 'versatile-toolkit'));
        },
    });
};

// Utility functions
export const formatFileInfo = (status: DebugLogStatus): DebugLogFileInfo => {
    const lastModified = status.file_exists && status.last_modified > 0
        ? new Date(status.last_modified * 1000).toLocaleString()
        : 'Never';

    return {
        exists: status.file_exists,
        size: status.file_size_formatted,
        lastModified,
    };
};