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
}

const TemplateSelector = ({ selectedTemplate, onTemplateSelect, type }: TemplateSelectorProps) => {
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
              {/* Template Thumbnail */}
              <div className="relative mb-3">
                <img
                  src={template.thumbnail}
                  alt={template.name}
                  className="w-full h-32 object-cover rounded-md bg-gray-100"
                  onError={(e) => {
                    // Fallback to placeholder if image doesn't exist
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyOCIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OTk5OSI+VGVtcGxhdGU8L3RleHQ+PC9zdmc+';
                  }}
                />

                {/* Selected Indicator */}
                {selectedTemplate === template.id && (
                  <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
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
                  src={`${config.ajax_url}?action=versatile_preview_template&versatile_nonce=${config.nonce_value}&template_id=${previewTemplate}&type=${type}`}
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