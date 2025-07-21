import { useState } from 'react';
import { __ } from '@wordpress/i18n';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import config from '@/config';

interface Template {
  id: string;
  name: string;
  description: string;
  preview: string;
  thumbnail: string;
}

interface TemplateSelectorProps {
  selectedTemplate: string;
  onTemplateSelect: (templateId: string) => void;
  type: 'maintenance' | 'comingsoon';
  formData?: any; // Current form data for live preview
}

const TemplateSelector = ({ selectedTemplate, onTemplateSelect, type, formData }: TemplateSelectorProps) => {
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  // Define available templates
  const templates: Template[] = [
    {
      id: 'classic',
      name: __('Classic', 'versatile'),
      description: __('Clean and professional design with centered content', 'versatile'),
      preview: '/wp-content/plugins/versatile/assets/images/templates/classic-preview.png',
      thumbnail: '/wp-content/plugins/versatile/assets/images/templates/classic-thumb.png'
    },
    {
      id: 'modern',
      name: __('Modern', 'versatile'),
      description: __('Sleek design with gradient backgrounds and modern typography', 'versatile'),
      preview: '/wp-content/plugins/versatile/assets/images/templates/modern-preview.png',
      thumbnail: '/wp-content/plugins/versatile/assets/images/templates/modern-thumb.png'
    },
    {
      id: 'minimal',
      name: __('Minimal', 'versatile'),
      description: __('Simple and elegant with focus on content', 'versatile'),
      preview: '/wp-content/plugins/versatile/assets/images/templates/minimal-preview.png',
      thumbnail: '/wp-content/plugins/versatile/assets/images/templates/minimal-thumb.png'
    },
    {
      id: 'creative',
      name: __('Creative', 'versatile'),
      description: __('Bold design with creative layouts and animations', 'versatile'),
      preview: '/wp-content/plugins/versatile/assets/images/templates/creative-preview.png',
      thumbnail: '/wp-content/plugins/versatile/assets/images/templates/creative-thumb.png'
    },
    {
      id: 'corporate',
      name: __('Corporate', 'versatile'),
      description: __('Professional business design with elegant typography', 'versatile'),
      preview: '/wp-content/plugins/versatile/assets/images/templates/corporate-preview.png',
      thumbnail: '/wp-content/plugins/versatile/assets/images/templates/corporate-thumb.png'
    },
    {
      id: 'neon',
      name: __('Neon', 'versatile'),
      description: __('Cyberpunk-inspired design with glowing neon effects', 'versatile'),
      preview: '/wp-content/plugins/versatile/assets/images/templates/neon-preview.png',
      thumbnail: '/wp-content/plugins/versatile/assets/images/templates/neon-thumb.png'
    }
  ];

  const handleTemplateSelect = (templateId: string) => {
    onTemplateSelect(templateId);
  };

  const handlePreview = (templateId: string) => {
    setPreviewTemplate(templateId);
    setIsPreviewLoading(true);
  };

  const closePreview = () => {
    setPreviewTemplate(null);
    setIsPreviewLoading(false);
  };





  return (
    <div className="space-y-4">
      <div className="flex gap-4 overflow-x-auto p-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {templates.map((template) => (
          <Card
            key={template.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg flex-shrink-0 w-64 ${selectedTemplate === template.id
              ? 'ring-2 ring-blue-500 shadow-lg'
              : 'hover:ring-1 hover:ring-gray-300'
              }`}
            onClick={() => handleTemplateSelect(template.id)}
          >
            <CardContent className="p-4">
              {/* Template Preview */}
              <div className="relative mb-3">
                <div className="w-full h-32 rounded-md overflow-hidden border relative">
                  {/* Template-specific preview design */}
                  {template.id === 'classic' && (
                    <div className="w-full h-full relative"
                      style={formData?.background_image ? {
                        backgroundImage: `url(${formData.background_image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      } : {
                        backgroundColor: '#f9fafb'
                      }}>
                      {/* Content container with white background like actual template */}
                      <div className="absolute inset-0 flex items-center justify-center p-2">
                        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 text-center max-w-[90%] border">
                          {formData?.logo && (
                            <div className="mb-2">
                              <img src={formData.logo} alt="Logo" className="w-12 h-8 object-contain mx-auto" />
                            </div>
                          )}
                          <h3 className="text-xs font-semibold text-gray-800 mb-1 leading-tight">
                            {formData?.title || 'We\'ll be back soon!'}
                          </h3>
                          <p className="text-xs text-gray-600 leading-tight mb-1">
                            {formData?.subtitle || 'Our site is currently undergoing scheduled maintenance.'}
                          </p>
                          <p className="text-xs text-gray-500 leading-tight">
                            {formData?.description ? formData.description.substring(0, 50) + '...' : 'Thank you for your patience.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {template.id === 'modern' && (
                    <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center relative overflow-hidden"
                      style={formData?.background_image ? {
                        backgroundImage: `linear-gradient(135deg, rgba(147, 51, 234, 0.85), rgba(37, 99, 235, 0.85)), url(${formData.background_image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      } : {}}>
                      {/* Decorative elements */}
                      <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
                      <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/5 rounded-full translate-y-6 -translate-x-6"></div>
                      
                      <div className="text-center text-white p-3 relative z-10">
                        {formData?.logo && (
                          <div className="mb-2">
                            <img src={formData.logo} alt="Logo" className="w-10 h-6 object-contain mx-auto brightness-0 invert" />
                          </div>
                        )}
                        <h3 className="text-sm font-bold mb-1 tracking-wide">
                          {formData?.title || 'Coming Soon'}
                        </h3>
                        <p className="text-xs opacity-90 leading-tight mb-1">
                          {formData?.subtitle || 'Something amazing is coming'}
                        </p>
                        <div className="w-8 h-px bg-white/50 mx-auto"></div>
                      </div>
                    </div>
                  )}

                  {template.id === 'minimal' && (
                    <div className="w-full h-full bg-white flex items-center justify-center relative"
                      style={formData?.background_image ? {
                        backgroundImage: `url(${formData.background_image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      } : {}}>
                      {formData?.background_image && <div className="absolute inset-0 bg-white/95"></div>}
                      
                      {/* Minimal design with subtle border accent */}
                      <div className="text-center relative z-10 p-4 border-l-2 border-gray-200">
                        {formData?.logo && (
                          <div className="mb-3">
                            <img src={formData.logo} alt="Logo" className="w-8 h-5 object-contain mx-auto opacity-80" />
                          </div>
                        )}
                        <h3 className="text-sm font-light text-gray-900 mb-2 tracking-wide">
                          {formData?.title || 'Maintenance'}
                        </h3>
                        <div className="w-12 h-px bg-gray-300 mx-auto mb-2"></div>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          {formData?.subtitle || 'Be right back'}
                        </p>
                      </div>
                    </div>
                  )}

                  {template.id === 'creative' && (
                    <div className="w-full h-full bg-gradient-to-r from-pink-400 via-red-500 to-yellow-500 flex items-center justify-center relative"
                      style={formData?.background_image ? {
                        backgroundImage: `linear-gradient(90deg, rgba(244, 114, 182, 0.8), rgba(239, 68, 68, 0.8), rgba(234, 179, 8, 0.8)), url(${formData.background_image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      } : {}}>
                      <div className="text-center text-white p-2 transform -rotate-2">
                        {formData?.logo && (
                          <img src={formData.logo} alt="Logo" className="w-8 h-6 object-contain mx-auto mb-1 brightness-0 invert" />
                        )}
                        <h3 className="text-xs font-black uppercase mb-1 tracking-wide">
                          {formData?.title || 'Under Construction'}
                        </h3>
                        <p className="text-xs font-semibold leading-tight">
                          {formData?.subtitle || 'Something cool is brewing!'}
                        </p>
                      </div>
                    </div>
                  )}

                  {template.id === 'corporate' && (
                    <div className="w-full h-full bg-slate-50 flex items-center justify-center relative"
                      style={formData?.background_image ? {
                        backgroundImage: `url(${formData.background_image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      } : {}}>
                      {formData?.background_image && <div className="absolute inset-0 bg-slate-50/90"></div>}
                      
                      {/* Corporate style with professional layout */}
                      <div className="bg-white/95 backdrop-blur-sm rounded-sm shadow-sm border border-slate-200 p-3 text-center relative z-10 max-w-[85%]">
                        {formData?.logo && (
                          <div className="mb-2 pb-2 border-b border-slate-100">
                            <img src={formData.logo} alt="Logo" className="w-12 h-7 object-contain mx-auto" />
                          </div>
                        )}
                        <h3 className="text-xs font-semibold text-slate-800 mb-1 uppercase tracking-wide">
                          {formData?.title || 'Scheduled Maintenance'}
                        </h3>
                        <p className="text-xs text-slate-600 leading-tight mb-1">
                          {formData?.subtitle || 'Professional service update'}
                        </p>
                        <div className="w-8 h-px bg-slate-300 mx-auto mt-2"></div>
                      </div>
                    </div>
                  )}

                  {template.id === 'neon' && (
                    <div className="w-full h-full bg-black flex items-center justify-center relative"
                      style={formData?.background_image ? {
                        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${formData.background_image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      } : {}}>
                      <div className="text-center p-2">
                        {formData?.logo && (
                          <img src={formData.logo} alt="Logo" className="w-8 h-6 object-contain mx-auto mb-1 brightness-0 invert" />
                        )}
                        <h3 className="text-xs font-bold text-cyan-400 mb-1" style={{ textShadow: '0 0 5px currentColor' }}>
                          {formData?.title || 'SYSTEM OFFLINE'}
                        </h3>
                        <p className="text-xs text-green-400 leading-tight font-mono">
                          {formData?.subtitle || '> Initializing...'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Selected Indicator */}
                {selectedTemplate === template.id && (
                  <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1 z-10">
                    <Check size={16} />
                  </div>
                )}
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
                    {selectedTemplate === template.id ? __('Selected', 'versatile') : __('Select', 'versatile')}
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
                    {__('Preview', 'versatile')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Template Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-11/12 h-5/6 max-w-6xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">
                {__('Template Preview', 'versatile')} - {templates.find(t => t.id === previewTemplate)?.name}
              </h3>
              <Button type="button" variant="ghost" size="sm" onClick={closePreview}>
                ×
              </Button>
            </div>

            <div className="flex-1 p-4">
              <div className="w-full h-full border rounded-lg overflow-hidden bg-gray-50 relative">
                {isPreviewLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                      <p className="text-gray-600">{__('Loading template preview...', 'versatile')}</p>
                    </div>
                  </div>
                )}
                <iframe
                  src={`${config.ajax_url}?action=versatile_preview_template&versatile_nonce=${config.nonce_value}&template_id=${previewTemplate}&type=${type}${formData ? `&preview_data=${encodeURIComponent(JSON.stringify(formData))}` : ''}`}
                  className="w-full h-full border-0"
                  title={__('Template Preview', 'versatile')}
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
                      closePreview();
                    }
                  }}
                >
                  {__('Use This Template', 'versatile')}
                </Button>
                <Button type="button" variant="outline" onClick={closePreview}>
                  {__('Close', 'versatile')}
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