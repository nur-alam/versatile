import React from 'react';

export type LogType = 'PHP Fatal error' | 'PHP Error' | 'PHP Parse error' | 'PHP Warning' | 'PHP Notice' | 'debug' | string;

export const getLogTypeColor = (type: LogType): string => {
	switch (type) {
		case 'PHP Fatal error':
		case 'PHP Error':
		case 'PHP Parse error':
			return 'text-red-500';
		case 'PHP Warning':
			return 'text-yellow-500';
		case 'PHP Notice':
			return 'text-blue-500';
		case 'debug':
			return 'text-gray-500';
		default:
			return 'text-gray-500';
	}
};

export const getLogTypeLabel = (type: LogType): string => {
	switch (type) {
		case 'PHP Fatal error':
		case 'PHP Error':
		case 'PHP Parse error':
			return 'Error';
		case 'PHP Warning':
			return 'Warning';
		case 'PHP Notice':
			return 'Info';
		case 'debug':
			return 'Debug';
		default:
			return type;
	}
};

export const LogTypeDisplay = ({ type }: { type: LogType }) => {
	const color = getLogTypeColor(type);
	const label = getLogTypeLabel(type);
	
	return <span className={color}>{label}</span>;
};