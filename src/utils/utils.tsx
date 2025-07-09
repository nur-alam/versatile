import config from "@/config";
import { TriggerResponseType } from "./trigger-declaration";

export function getSlugFromUrl(url: string = '', slug: string = 'page'): string {
	if (url && slug) {
		const _url = new URL(url);
		return _url.searchParams.get(slug) || '';
	}
	return '';
}

// Useful for mock api call
export const wait = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

export interface AnyObject {
	[x: string]: any;
}
type Method = 'POST' | 'PUT' | 'PATCH' | 'DELETE';
const isFileOrBlob = (value: unknown): value is File | Blob => {
	return value instanceof File || value instanceof Blob;
};
const isString = (value: unknown): value is string => {
	return typeof value === 'string';
}
const isBoolean = (value: unknown): value is boolean => {
	return typeof value === 'boolean';
};
const isNumber = (value: unknown): value is number => {
	return typeof value === 'number';
}

export const convertToFormData = (values: AnyObject) => {
	const formData = new FormData();

	for (const key of Object.keys(values)) {
		const value = (values as AnyObject)[key];

		if (Array.isArray(value)) {
			value.forEach((item, index) => {
				if (isFileOrBlob(item) || isString(item)) {
					formData.append(`${key}[${index}]`, item);
				} else if (isBoolean(item) || isNumber(item)) {
					formData.append(`${key}[${index}]`, item.toString());
				} else if (typeof item === 'object' && item !== null) {
					formData.append(`${key}[${index}]`, JSON.stringify(item));
				} else {
					formData.append(`${key}[${index}]`, item);
				}
			});
		} else {
			if (isFileOrBlob(value) || isString(value)) {
				formData.append(key, value);
			} else if (isBoolean(value)) {
				formData.append(key, value.toString());
			} else if (isNumber(value)) {
				formData.append(key, `${value}`);
			} else if (typeof value === 'object' && value !== null) {
				formData.append(key, JSON.stringify(value));
			} else {
				formData.append(key, value);
			}
		}
	}

	return formData;
};


export const getProviderFullName = (provider: string): string => {
	const providerMap: { [key: string]: string } = {
		'ses': 'Amazon SES',
		'smtp': 'SMTP',
		'sendgrid': 'SendGrid',
		'mailgun': 'Mailgun',
		'postmark': 'Postmark',
		'sparkpost': 'SparkPost',
		'mailchimp': 'Mailchimp',
		'sendinblue': 'Sendinblue',
		'gmail': 'Gmail',
		'outlook': 'Microsoft Outlook',
		'yahoo': 'Yahoo Mail',
	};

	return providerMap[provider.toLowerCase()] || provider;
};

export const copyToClipboard = (text: string) => {
	return new Promise<void>((resolve, reject) => {
		if (navigator.clipboard && window.isSecureContext) {
			navigator.clipboard
				.writeText(text)
				.then(() => resolve())
				.catch((error) => reject(error));
		} else {
			const textarea = document.createElement('textarea');
			textarea.value = text;
			document.body.appendChild(textarea);
			textarea.select();

			try {
				// if navigator.clipboard is not available, use document.execCommand('copy')
				document.execCommand('copy');
				resolve();
			} catch (error) {
				reject(error);
			} finally {
				document.body.removeChild(textarea); // Clean up
			}
		}
	});
};