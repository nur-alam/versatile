import React from 'react'
import { X } from "lucide-react";

// Add this mapping at the top of the file, after imports
const fieldNameMap: Record<string, string> = {
	to_email: 'To email',
	smtpHost: 'SMTP Host',
	smtpPort: 'SMTP Port',
	smtpSecurity: 'SMTP Security',
	smtpUsername: 'SMTP Username',
	smtpPassword: 'SMTP Password',
	fromName: 'From Name',
	fromEmail: 'From Email',
};

const ErrorToast = ({ errors }: { errors: Record<string, string[]> }) => {
	const processedErrors = Object.entries(errors || {}).map(([field, fieldErrors]) => {
		const fieldName = fieldNameMap[field] || field;
		return fieldErrors.map(error => error.replace(field, fieldName));
	}).flat();

	return (
		<div className="max-w-md w-full pointer-events-auto flex">
			<div className="flex-1">
				<div className="flex items-start">
					<div className="flex-shrink-0">
						<X className="h-6 w-6 text-red-400" aria-hidden="true" />
					</div>
					<div className="ml-3 flex-1">
						<p className="text-sm font-medium text-red-400">
							Validation failed
						</p>
						<div className="mt-1">
							{processedErrors.map((error, index) => (
								<p key={index} className="text-sm text-red-500">
									{index + 1}. {error}
								</p>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ErrorToast

