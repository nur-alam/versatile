import { __ } from '@wordpress/i18n';

export const isDateExpired = (expiresAt: string): boolean => {
	return new Date(expiresAt) < new Date();
};

// convert to Date utility function
export const formatExpirationDate = (expiresAt: string) => {
	const date = new Date(expiresAt);
	const now = new Date();
	if (date < now) {
		return __('Expired', 'versatile-toolkit');
	}
	return date.toLocaleString();
};

export const getExpirationTimestamp = (option: string) => {
	const now = new Date();

	const timeMap: { [key: string]: number } = {
		'1_hour': 60 * 60 * 1000,
		'3_hours': 3 * 60 * 60 * 1000,
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

	const timeToAdd = timeMap[option] || 0;
	return new Date(now.getTime() + timeToAdd).toString();
};

export const getTimeRemaining = (expiresAt: string) => {
	const expires = new Date(expiresAt);
	const now = new Date();
	const diff = expires.getTime() - now.getTime();
	if (diff <= 0) {
		return __('Expired', 'versatile-toolkit');
	}
	const days = Math.floor(diff / (1000 * 60 * 60 * 24));
	const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
	if (days > 0) {
		return `${days}d ${hours}h ${minutes}m remaining`;
	} else if (hours > 0) {
		return `${hours}h ${minutes}m remaining`;
	} else {
		return `${minutes}m remaining`;
	}
};

export const getTimeAgo = (date: string) => {
	const now = new Date();
	const then = new Date(date);
	const diff = now.getTime() - then.getTime();
	const days = Math.floor(diff / (1000 * 60 * 60 * 24));
	const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
	if (days > 0) {
		return `${days}d ${hours}h ${minutes}m ago`;
	} else if (hours > 0) {
		return `${hours}h ${minutes}m ago`;
	} else {
		return `${minutes}m ago`;
	}
}
