import { z } from 'zod';
import { awsSesRegionOptions, emailProviderOptions, smtpPortOptions, smtpSecurityOptions } from '../versatile-declaration';

export const smtpConfigSchema = z.object({
	provider: z.enum(emailProviderOptions, { message: 'Invalid email provider' }),
	fromName: z.string().min(1, { message: 'From name is required' }),
	fromEmail: z.string().min(1, { message: 'From email is required' }),
	smtpHost: z.string().min(1, { message: 'SMTP host is required' }),
	smtpPort: z.enum(smtpPortOptions, { message: 'Invalid port' }),
	smtpSecurity: z.enum(smtpSecurityOptions, { message: 'Invalid security type' }),
	smtpUsername: z.string().min(1, { message: 'SMTP username is required' }),
	smtpPassword: z.string().min(1, { message: 'SMTP password is required' }),
});

export type SmtpConfigFormValues = z.infer<typeof smtpConfigSchema>;

export const awsSesConfigSchema = z.object({
	provider: z.enum(emailProviderOptions, { message: 'Invalid email provider' }),
	accessKeyId: z.string().min(1, { message: 'Access key ID is required' }),
	secretAccessKey: z.string().min(1, { message: 'Secret access key is required' }),
	region: z.enum(awsSesRegionOptions, { message: 'Region is required' }),
	fromName: z.string().min(1, { message: 'From name is required' }),
	fromEmail: z.string().email({ message: 'Valid from email is required' }),
});

export type AwsSesConfigFormValues = z.infer<typeof awsSesConfigSchema>;

export const gmailConfigSchema = z.object({
	provider: z.enum(emailProviderOptions, { message: 'Invalid email provider' }),
	clientId: z.string().min(1, { message: 'Client ID is required' }),
	clientSecret: z.string().min(1, { message: 'Client secret is required' }),
	fromName: z.string().min(1, { message: 'From name is required' }),
	fromEmail: z.string().email({ message: 'Valid from email is required' }),
});

export type GmailConfigFormValues = z.infer<typeof gmailConfigSchema>;
