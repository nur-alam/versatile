import { useState, useMemo } from 'react';
import { useModalInteractions } from '../hooks/useModalInteractions';
import { __ } from '@wordpress/i18n';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import config from '@/config';
import { TemplateLoader } from './loader';
import SkeletonLoader from '@components/loader/SkeletonLoader';
import { Skeleton } from '@/components/ui/skeleton';
import { SkeletonCard } from '@/components/SkeletonCard';
import ErrorBoundary from '@/components/ErrorBoundary';
import { ComingsoonMoodFormValues, MaintenanceMoodFormValues } from '@/utils/schema-validation';
import { useEffect } from 'react';

type TemplateType = 'maintenance' | 'comingsoon';

interface Template {
  id: string;
  name: string;
  description: string;
}

type FormValueMap = {
  maintenance: MaintenanceMoodFormValues,
  comingsoon: ComingsoonMoodFormValues
}

interface TemplateSelectorProps<T extends TemplateType> {
  selectedTemplate: string;
  onTemplateSelect: (templateId: string) => void;
  type: T;
  formData?: FormValueMap[T]
  getFormData: () => FormValueMap[T],
}

// Define available templates
const templates: Template[] = [
  {
    id: 'classic',
    name: __('Classic', 'versatile-toolkit'),
    description: __('Clean and professional design with centered content', 'versatile-toolkit')
  },
  {
    id: 'modern',
    name: __('Modern', 'versatile-toolkit'),
    description: __('Sleek design with gradient backgrounds and modern typography', 'versatile-toolkit')
  },
  {
    id: 'minimal',
    name: __('Minimal', 'versatile-toolkit'),
    description: __('Simple and elegant with focus on content', 'versatile-toolkit')
  },
  {
    id: 'creative',
    name: __('Creative', 'versatile-toolkit'),
    description: __('Bold design with creative layouts and animations', 'versatile-toolkit')
  },
  {
    id: 'corporate',
    name: __('Corporate', 'versatile-toolkit'),
    description: __('Professional business design with elegant typography', 'versatile-toolkit')
  },
  {
    id: 'neon',
    name: __('Neon', 'versatile-toolkit'),
    description: __('Cyberpunk-inspired design with glowing neon effects', 'versatile-toolkit')
  }
];

const templatePreviewAction = (type: TemplateType) => {
  if ('maintenance' === type) {
    return 'versatile_maintenance_template_preview';
  }
  return 'versatile_comingsoon_template_preview';
}

const TemplateSelector = <T extends TemplateType>({ selectedTemplate, onTemplateSelect, type, formData, getFormData }: TemplateSelectorProps<T>) => {
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  // Order templates only on first render - put selected template first
  const [orderedTemplates] = useState(() => {
    const selectedIndex = templates.findIndex(template => template.id === selectedTemplate);
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
      const loadingOverlays = document.querySelectorAll('.iframe-loading');
      loadingOverlays.forEach(overlay => {
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
    onClose
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-4 overflow-x-auto p-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {orderedTemplates.map((template) => (
          <ErrorBoundary
            key={template.id}
            fallback={
              <Card className="cursor-pointer flex-shrink-0 w-64 border-red-200 bg-red-50">
                <CardContent className="p-4">
                  <div className="w-full h-32 rounded-md bg-red-100 flex items-center justify-center">
                    <p className="text-red-600 text-sm">{__('Template Error', 'versatile-toolkit')}</p>
                  </div>
                  <h3 className="font-medium mt-2 text-red-700">{template.name}</h3>
                  <p className="text-sm text-red-600">{__('Failed to load template', 'versatile-toolkit')}</p>
                </CardContent>
              </Card>
            }
          >
            <Card
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg flex-shrink-0 w-64 ${selectedTemplate === template.id
                ? 'ring-2 ring-blue-500 shadow-lg'
                : 'hover:ring-1 hover:ring-gray-300'
                }`}
              onClick={() => handleTemplateSelect(template.id)}
            >
              <CardContent className="p-4">
                {/* Template Live Preview */}
                <div className="relative mb-3">
                  <div className="w-full h-32 rounded-md bg-gray-100 overflow-hidden border relative">
                    {/* Temporary fallback to static preview while debugging iframe issues */}
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                      <div className="text-center p-4">
                        <div className="text-2xl mb-2">
                          {template.id === 'classic' && '📄'}
                          {template.id === 'modern' && '🎨'}
                          {template.id === 'minimal' && '✨'}
                          {template.id === 'creative' && '🎭'}
                          {template.id === 'corporate' && '🏢'}
                          {template.id === 'neon' && '⚡'}
                        </div>
                        <p className="text-xs font-medium text-gray-700">{template.name}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formData?.title || 'Preview'}
                        </p>
                        {formData?.background_image && (
                          <div className="absolute inset-0 opacity-20">
                            <img
                              src={formData.background_image}
                              alt=""
                              className="w-full h-full object-cover"
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
                        const loadingOverlay = document.querySelector(`.template-${template.id} .iframe-loading`) as HTMLElement;
                        if (loadingOverlay) {
                          loadingOverlay.style.display = 'none';
                        }
                      }}
                    >
                      <iframe
                        key={`${template.id}-${formDataString}`}
                        src={`${config.ajax_url}?action=${templatePreviewAction(type)}&versatile_nonce=${config.nonce_value}&template_id=${template.id}&type=${type}&preview_mode=thumbnail${formData ? `&preview_data=${encodeURIComponent(formDataString)}` : ''}`}
                        className="w-full h-full border-0 pointer-events-none absolute top-0 left-0 hidden"
                        title={`${template.name} Preview`}
                        style={{
                          transform: 'scale(0.25)',
                          transformOrigin: 'top left',
                          width: '400%',
                          height: '400%'
                        }}
                        onLoad={(e) => {
                          // console.log(`Template ${template.id} loaded successfully - switching to iframe`);
                          const iframe = e.currentTarget;
                          const staticPreview = iframe.parentElement?.querySelector('div:not(.iframe-loading)') as HTMLElement;
                          if (staticPreview && iframe) {
                            staticPreview.style.display = 'none';
                            iframe.classList.remove('hidden');
                          }
                          const loadingOverlay = iframe.parentElement?.querySelector('.iframe-loading') as HTMLElement;
                          if (loadingOverlay) {
                            loadingOverlay.style.display = 'none';
                          }
                        }}
                        onError={(e) => {
                          console.error(`Failed to load preview for template: ${template.id} - using static fallback`);
                          const loadingOverlay = e.currentTarget.parentElement?.querySelector('.iframe-loading') as HTMLElement;
                          if (loadingOverlay) {
                            loadingOverlay.style.display = 'none';
                          }
                        }}
                      />
                    </ErrorBoundary>
                  </div>

                  {/* Selected Indicator */}
                  {selectedTemplate === template.id && (
                    <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1 z-10">
                      <Check size={16} />
                    </div>
                  )}

                  {/* Loading Overlay */}
                  <div className="absolute inset-0 bg-gray-100 flex items-center justify-center rounded-md iframe-loading">
                    <SkeletonCard />
                  </div>
                </div>

                {/* Template Info */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">{template.name}</h4>
                  <p className="text-xs text-gray-600 line-clamp-2">{template.description}</p>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      type="button"
                      size="sm"
                      variant={selectedTemplate === template.id ? "default" : "outline"}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTemplateSelect(template.id);
                      }}
                      className="flex-1 text-xs"
                    >
                      {selectedTemplate === template.id ? __('Selected', 'versatile-toolkit') : __('Select', 'versatile-toolkit')}
                    </Button>

                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreview(template.id);
                      }}
                      className="text-xs"
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
        <div className="template-preview-wrapper fixed inset-0 z-[99999] flex items-center justify-center bg-black bg-opacity-50"
          onClick={handleBackdropClick}
        >
          <div className="bg-white rounded-lg shadow-xl w-11/12 h-5/6 max-w-6xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">
                {templates.find(t => t.id === previewTemplate)?.name} - {__(` Template Preview`, 'versatile-toolkit')}
              </h3>
              <Button type="button" variant="ghost" size="sm" onClick={onClose}>
                <X size={16} />
              </Button>
            </div>

            <div className="flex-1 p-4">
              <div className="w-full h-full border rounded-lg overflow-hidden bg-gray-50 relative">
                {isPreviewLoading && (
                  <TemplateLoader />
                )}
                <iframe
                  src={`${config.ajax_url}?action=${templatePreviewAction(type)}&versatile_nonce=${config.nonce_value}&template_id=${previewTemplate}&type=${type}&preview_mode=thumbnail&preview_data=${encodeURIComponent(JSON.stringify(getFormData()))}`}
                  className="w-full h-full border-0"
                  title={__('Template Preview', 'versatile-toolkit')}
                  onLoad={() => setIsPreviewLoading(false)}
                  style={{ display: isPreviewLoading ? 'none' : 'block' }}
                />
              </div>
            </div>

            <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                {templates.find(t => t.id === previewTemplate)?.description}
              </p>
              <div className="flex gap-2">
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
                <Button type="button" variant="outline" onClick={onClose}>
                  {__('Close', 'versatile-toolkit')}
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