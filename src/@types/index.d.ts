/* eslint-disable @typescript-eslint/no-explicit-any */
export type {};

declare module '*.png';
declare module '*.svg';
declare module '*.jpeg';
declare module '*.jpg';

declare global {
	const wp: any;
	interface Window {
		wp: any;
		ajaxurl: string;
		_versatileObject: {
			user_id: Int;
			site_url: string;
			admin_url: string;
			ajax_url: string;
			rest_url: string;
			nonce_key: string;
			nonce_value: string;
			wp_rest_nonce: string;
		};
	}
}
