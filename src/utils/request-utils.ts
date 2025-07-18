import config from '@/config';
import { TukitakiResponseType } from '@utils/tukitaki-declaration';
import { AnyObject, convertToFormData } from '@utils/utils';

type FetchUtilOptions = {
	body?: AnyObject;
	headers?: Record<string, string>;
	method?: 'POST' | 'GET' | 'PUT' | 'DELETE' | 'PATCH';
};

type optionsType = Omit<RequestInit, 'body'> & { body?: AnyObject };

export async function fetchUtil(endpoint: string, options: optionsType): Promise<TukitakiResponseType> {
	const { wp_rest_nonce, nonce_key, nonce_value } = config;
	let url = `${endpoint}`;

	const method = options.method?.toUpperCase() || 'POST';

	const headers: HeadersInit = {
		'X-WP-Nonce': wp_rest_nonce,
		...(options.headers || {}),
	};

	const fetchOptions: RequestInit = {
		method,
		headers,
	};

	if (['GET', 'DELETE'].includes(method)) {
		const params = new URLSearchParams(options?.body as Record<string, string>);
		params.append(nonce_key, nonce_value);
		url += `?${params.toString()}`;
	} else if (options.body) {
		const formData = convertToFormData(options.body);
		formData.append(nonce_key, nonce_value);
		fetchOptions.body = formData;
	}

	try {
		const apiResponse = await fetch(url, fetchOptions);
		const response = (await apiResponse.json()) as TukitakiResponseType;

		if (response.status_code === 200) {
			return response;
		} else {
			throw new Error(response.message);
		}
	} catch (error: any) {
		throw new Error(error?.message || 'fetch request error!!');
	}
}

export async function fetchPostUtil(endpoint: string, options: optionsType): Promise<TukitakiResponseType> {
	const { wp_rest_nonce, nonce_key, nonce_value } = config;
	const url = `${endpoint}`;

	// Create a new options object that matches RequestInit
	const fetchOptions: optionsType = {
		method: options.method || 'POST',
		headers: {
			'X-WP-Nonce': wp_rest_nonce,
			...(options.headers || {}),
		},
		body: options.body,
	};

	if (options.body) {
		const formData = convertToFormData(options.body);
		formData.append(nonce_key, nonce_value);
		fetchOptions.body = formData;
	}

	try {
		const apiResponse = await fetch(url, fetchOptions as RequestInit);

		const response = (await apiResponse.json()) as TukitakiResponseType;

		if (response.status_code === 200) {
			return response;
		} else {
			throw new Error(response.message);
		}
	} catch (error: any) {
		throw new Error(error?.message || 'fetch request error!!');
	}
}
