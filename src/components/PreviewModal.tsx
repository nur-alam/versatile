import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { __ } from '@wordpress/i18n';
import { Eye, X } from 'lucide-react';
import TemplateLoader from '@components/loader/TemplateLoader';

interface PreviewModalProps {
  type: 'maintenance' | 'comingsoon';
  disabled?: boolean;
  getFormData?: any;
}

const PreviewModal = ({ type, disabled = false, getFormData }: PreviewModalProps) => {

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePreview = () => {
    setIsOpen(true);
    setIsLoading(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsLoading(false);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only close if clicking on the backdrop itself, not on the modal content
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const getPreviewUrl = () => {
    const ajaxUrl = window._versatileObject?.ajax_url;
    const nonce = window._versatileObject?.nonce_value;
    const action = type === 'maintenance' ? 'versatile_preview_maintenance' : 'versatile_preview_comingsoon';

    const preview_data = JSON.stringify(getFormData());

    return `${ajaxUrl}?action=${action}&versatile_nonce=${nonce}&type=${type}&preview_data=${encodeURIComponent(preview_data)}`;
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={handlePreview}
        disabled={disabled}
        className="flex items-center gap-2 border-gray-400"
      >
        <Eye size={16} />
        {type === 'maintenance'
          ? __('Preview', 'versatile')
          : __('Preview', 'versatile')
        }
      </Button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={handleBackdropClick}
        >
          <div className="bg-white rounded-lg shadow-xl w-11/12 h-5/6 max-w-6xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">
                {type === 'maintenance'
                  ? __('Maintenance Page Preview', 'versatile')
                  : __('Coming Soon Page Preview', 'versatile')
                }
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="h-8 w-8 p-0"
              >
                <X size={16} />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 p-4">
              <div className="w-full h-full border rounded-lg overflow-hidden bg-gray-50">
                {isLoading && (
                  <TemplateLoader />
                )}
                <iframe
                  src={getPreviewUrl()}
                  className="w-full h-full border-0"
                  title={type === 'maintenance' ? __('Maintenance Preview', 'versatile') : __('Coming Soon Preview', 'versatile')}
                  onLoad={() => setIsLoading(false)}
                  style={{ display: isLoading ? 'none' : 'block' }}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t bg-gray-50 rounded-b-lg">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  {__('This is how your page will look to visitors.', 'versatile')}
                </p>
                <Button onClick={handleClose} variant="outline">
                  {__('Close Preview', 'versatile')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PreviewModal;