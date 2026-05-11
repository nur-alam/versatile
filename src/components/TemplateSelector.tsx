import ErrorBoundary from '@/components/ErrorBoundary';
import { SkeletonCard } from '@/components/SkeletonCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import config from '@/config';
import { ComingsoonMoodFormValues, MaintenanceMoodFormValues } from '@/utils/schema-validation';
import { __ } from '@wordpress/i18n';
import { Check, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useModalInteractions } from '../hooks/useModalInteractions';
import { TemplateLoader } from './loader';

type TemplateType = 'maintenance' | 'comingsoon';

interface Template {
	id: string;
	name: string;
	description: string;
}

type FormValueMap = {
	maintenance: MaintenanceMoodFormValues;
	comingsoon: ComingsoonMoodFormValues;
};

interface TemplateSelectorProps<T extends TemplateType> {
	selectedTemplate: string;
	onTemplateSelect: (templateId: string) => void;
	type: T;
	formData?: FormValueMap[T];
	getFormData: () => FormValueMap[T];
}

// Define available templates
const templates: Template[] = [
	{
		id: 'classic',
		name: __('Classic', 'versatile-toolkit'),
		description: __('Clean and professional design with centered content', 'versatile-toolkit'),
	},
	{
		id: 'modern',
		name: __('Modern', 'versatile-toolkit'),
		description: __('Sleek design with gradient backgrounds and modern typography', 'versatile-toolkit'),
	},
	{
		id: 'minimal',
		name: __('Minimal', 'versatile-toolkit'),
		description: __('Simple and elegant with focus on content', 'versatile-toolkit'),
	},
	{
		id: 'creative',
		name: __('Creative', 'versatile-toolkit'),
		description: __('Bold design with creative layouts and animations', 'versatile-toolkit'),
	},
	{
		id: 'corporate',
		name: __('Corporate', 'versatile-toolkit'),
		description: __('Professional business design with elegant typography', 'versatile-toolkit'),
	},
	{
		id: 'neon',
		name: __('Neon', 'versatile-toolkit'),
		description: __('Cyberpunk-inspired design with glowing neon effects', 'versatile-toolkit'),
	},
];

const templatePreviewAction = (type: TemplateType) => {
	if ('maintenance' === type) {
		return 'versatile_maintenance_template_preview';
	}
	return 'versatile_comingsoon_template_preview';
};

const TemplateSelector = <T extends TemplateType>({
	selectedTemplate,
	onTemplateSelect,
	type,
	formData,
	getFormData,
}: TemplateSelectorProps<T>) => {
	const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);
	const [isPreviewLoading, setIsPreviewLoading] = useState(false);

	// Order templates only on first render - put selected template first
	const [orderedTemplates] = useState(() => {
		const selectedIndex = templates.findIndex((template) => template.id === selectedTemplate);
		if (selectedIndex === -1) {
			return templates;
		}

		const selectedTemplateObj = templates[selectedIndex];
		const remainingTemplates = templates.filter((_, index) => index !== selectedIndex);

		return [selectedTemplateObj, ...remainingTemplates];
	});

	const handleTemplateSelect = (templateId: string) => {
		onTemplateSelect(templateId);
	};

	const handlePreview = (templateId: string) => {
		setPreviewTemplate(templateId);
		setIsPreviewLoading(true);
	};

	const onClose = () => {
		setPreviewTemplate(null);
		setIsPreviewLoading(false);
	};

	const formDataString = useMemo(() => {
		let latestFormData = getFormData();
		return latestFormData ? JSON.stringify(latestFormData) : '';
	}, [formData]);

	// Add timeout for loading overlays
	useEffect(() => {
		const timer = setTimeout(() => {
			const loadingOverlays = document.querySelectorAll('.vt-iframe-loading');
			loadingOverlays.forEach((overlay) => {
				const htmlOverlay = overlay as HTMLElement;
				if (htmlOverlay.style.display !== 'none') {
					console.warn('Template preview timed out, hiding loading overlay');
					htmlOverlay.style.display = 'none';
				}
			});
		}, 3000); // 1000ms second timeout

		return () => clearTimeout(timer);
	}, [formDataString]);

	const { handleBackdropClick } = useModalInteractions({
		isOpen: !!previewTemplate,
		onClose,
	});

	return (
		<div className="vt-space-y-4">
			<div className="vt-flex vt-gap-4 vt-overflow-x-auto vt-p-2 vt-scrollbar-thin vt-scrollbar-thumb-gray-300 vt-scrollbar-track-gray-100">
				{orderedTemplates.map((template) => (
					<ErrorBoundary
						key={template.id}
						fallback={
							<Card className="vt-cursor-pointer vt-flex-shrink-0 vt-w-64 vt-border-red-200 vt-bg-red-50">
								<CardContent className="vt-p-4">
									<div className="vt-w-full vt-h-32 vt-rounded-md vt-bg-red-100 vt-flex vt-items-center vt-justify-center">
										<p className="vt-text-red-600 vt-text-sm">
											{__('Template Error', 'versatile-toolkit')}
										</p>
									</div>
									<h3 className="vt-font-medium vt-mt-2 vt-text-red-700">{template.name}</h3>
									<p className="vt-text-sm vt-text-red-600">
										{__('Failed to load template', 'versatile-toolkit')}
									</p>
								</CardContent>
							</Card>
						}
					>
						<Card
							className={`vt-cursor-pointer vt-transition-all vt-duration-200 hover:vt-shadow-lg vt-flex-shrink-0 vt-w-64 ${selectedTemplate === template.id
									? 'vt-ring-2 vt-ring-blue-500 vt-shadow-lg'
									: 'hover:vt-ring-1 hover:vt-ring-gray-300'
								}`}
							onClick={() => handleTemplateSelect(template.id)}
						>
							<CardContent>
								{/* Template Live Preview */}
								<div className="vt-relative vt-mb-3">
									<div className="vt-w-full vt-h-32 vt-rounded-md vt-bg-gray-100 vt-overflow-hidden vt-border vt-relative">
										{/* Temporary fallback to static preview while debugging iframe issues */}
										<div className="vt-w-full vt-h-full vt-flex vt-items-center vt-justify-center vt-bg-gradient-to-br vt-from-blue-50 vt-to-indigo-100">
											<div className="vt-text-center vt-p-4">
												<div className="vt-text-2xl vt-mb-2">
													{template.id === 'classic' && '📄'}
													{template.id === 'modern' && '🎨'}
													{template.id === 'minimal' && '✨'}
													{template.id === 'creative' && '🎭'}
													{template.id === 'corporate' && '🏢'}
													{template.id === 'neon' && '⚡'}
												</div>
												<p className="vt-text-xs vt-font-medium vt-text-gray-700">
													{template.name}
												</p>
												<p className="vt-text-xs vt-text-gray-500 vt-mt-1">
													{formData?.title || 'Preview'}
												</p>
												{formData?.background_image && (
													<div className="vt-absolute vt-inset-0 vt-opacity-20">
														<img
															src={formData.background_image}
															alt=""
															className="vt-w-full vt-h-full vt-object-cover"
														/>
													</div>
												)}
											</div>
										</div>
										{/* Hidden iframe for future use when backend is fixed */}
										<ErrorBoundary
											fallback={null} // Silent fallback since we already have a static preview
											onError={(error) => {
												console.error(`Template preview error for ${template.id}:`, error);
												// Hide loading overlay on error
												const loadingOverlay = document.querySelector(
													`.template-${template.id} .vt-iframe-loading`,
												) as HTMLElement;
												if (loadingOverlay) {
													loadingOverlay.style.display = 'none';
												}
											}}
										>
											<iframe
												key={`${template.id}-${formDataString}`}
												src={`${config.ajax_url}?action=${templatePreviewAction(type)}&versatile_nonce=${config.nonce_value}&template_id=${template.id}&type=${type}&preview_mode=thumbnail${formData ? `&preview_data=${encodeURIComponent(formDataString)}` : ''}`}
												className="vt-w-full vt-h-full vt-border-0 vt-pointer-events-none vt-absolute vt-top-0 vt-left-0 vt-hidden"
												title={`${template.name} Preview`}
												style={{
													transform: 'scale(0.25)',
													transformOrigin: 'top left',
													width: '400%',
													height: '400%',
												}}
												onLoad={(e) => {
													console.log(`Template ${template.id} loaded successfully - switching to iframe`);
													const iframe = e.currentTarget;
													const staticPreview = iframe.parentElement?.querySelector(
														'div:not(.vt-iframe-loading)',
													) as HTMLElement;
													if (staticPreview && iframe) {
														staticPreview.style.display = 'none';
														iframe.classList.remove('vt-hidden');
													}
													const loadingOverlay = iframe.parentElement?.querySelector(
														'.vt-iframe-loading',
													) as HTMLElement;
													if (loadingOverlay) {
														loadingOverlay.style.display = 'none';
													}
												}}
												onError={(e) => {
													console.error(
														`Failed to load preview for template: ${template.id} - using static fallback`,
													);
													const loadingOverlay = e.currentTarget.parentElement?.querySelector(
														'.vt-iframe-loading',
													) as HTMLElement;
													if (loadingOverlay) {
														loadingOverlay.style.display = 'none';
													}
												}}
											/>
										</ErrorBoundary>
									</div>

									{/* Selected Indicator */}
									{selectedTemplate === template.id && (
										<div className="vt-absolute vt-top-2 vt-right-2 vt-bg-blue-500 vt-text-white vt-rounded-full vt-p-1 vt-z-10">
											<Check size={16} />
										</div>
									)}

									{/* Loading Overlay */}
									<div className="vt-absolute vt-inset-0 vt-bg-gray-100 vt-flex vt-items-center vt-justify-center vt-rounded-md vt-iframe-loading">
										<SkeletonCard />
									</div>
								</div>

								{/* Template Info */}
								<div className="vt-space-y-2">
									<h4 className="vt-font-semibold vt-text-sm">{template.name}</h4>
									<p className="vt-text-xs vt-text-gray-600 vt-line-clamp-2">
										{template.description}
									</p>

									{/* Action Buttons */}
									<div className="vt-flex vt-gap-2 vt-pt-2">
										<Button
											type="button"
											size="sm"
											variant={selectedTemplate === template.id ? 'default' : 'outline'}
											onClick={(e) => {
												e.stopPropagation();
												handleTemplateSelect(template.id);
											}}
											className="vt-flex-1 vt-text-xs"
										>
											{selectedTemplate === template.id
												? __('Selected', 'versatile-toolkit')
												: __('Select', 'versatile-toolkit')}
										</Button>

										<Button
											type="button"
											size="sm"
											variant="ghost"
											onClick={(e) => {
												e.stopPropagation();
												handlePreview(template.id);
											}}
											className="vt-text-xs"
										>
											{__('Preview', 'versatile-toolkit')}
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					</ErrorBoundary>
				))}
			</div>

			{/* Template Preview Modal */}
			{previewTemplate && (
				<div
					className="vt-template-preview-wrapper vt-fixed vt-inset-x-0 vt--top-[15px] vt-bottom-0 vt-z-[99999] vt-flex vt-items-center vt-justify-center vt-bg-black vt-bg-opacity-85"
					onClick={handleBackdropClick}
				>
					<div className="vt-bg-white vt-rounded-lg vt-shadow-xl vt-w-11/12 vt-h-5/6 vt-max-w-6xl vt-flex vt-flex-col">
						<div className="vt-flex vt-items-center vt-justify-between vt-p-4 vt-border-b">
							<h3 className="vt-text-lg vt-font-semibold">
								{templates.find((t) => t.id === previewTemplate)?.name} -{' '}
								{__(` Template Preview`, 'versatile-toolkit')}
							</h3>
							<Button type="button" variant="ghost" size="sm" onClick={onClose}>
								<X size={16} />
							</Button>
						</div>

						<div className="vt-flex-1 vt-p-4">
							<div className="vt-w-full vt-h-full vt-border vt-rounded-lg vt-overflow-hidden vt-bg-gray-50 vt-relative">
								{isPreviewLoading && <TemplateLoader />}
								<iframe
									src={`${config.ajax_url}?action=${templatePreviewAction(type)}&versatile_nonce=${config.nonce_value}&template_id=${previewTemplate}&type=${type}&preview_mode=thumbnail&preview_data=${encodeURIComponent(JSON.stringify(getFormData()))}`}
									className="vt-w-full vt-h-full vt-border-0"
									title={__('Template Preview', 'versatile-toolkit')}
									onLoad={() => setIsPreviewLoading(false)}
									style={{ display: isPreviewLoading ? 'none' : 'block' }}
								/>
							</div>
						</div>

						<div className="vt-p-4 vt-border-t vt-bg-gray-50 vt-flex vt-justify-between vt-items-center">
							<p className="vt-text-sm vt-text-gray-600">
								{templates.find((t) => t.id === previewTemplate)?.description}
							</p>
							<div className="vt-flex vt-gap-2">
								<Button type="button" variant="outline" onClick={onClose}>
									{__('Close', 'versatile-toolkit')}
								</Button>
								<Button
									type="button"
									onClick={() => {
										if (previewTemplate) {
											handleTemplateSelect(previewTemplate);
											onClose();
										}
									}}
								>
									{__('Use This Template', 'versatile-toolkit')}
								</Button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default TemplateSelector;
