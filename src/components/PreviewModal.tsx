import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { __ } from '@wordpress/i18n';
import { ExternalLink, X } from 'lucide-react';

interface PreviewModalProps {
  type: 'maintenance' | 'comingsoon';
  disabled?: boolean;
}

const PreviewModal = ({ type, disabled = false }: PreviewModalProps) => {
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

    return `${ajaxUrl}?action=${action}&versatile_nonce=${nonce}`;
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={handlePreview}
        disabled={disabled}
        className="flex items-center gap-2"
      >
        <ExternalLink size={16} />
        {type === 'maintenance'
          ? __('Preview Maintenance Page', 'verstaile-toolkit')
          : __('Preview Coming Soon Page', 'verstaile-toolkit')
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
                  ? __('Maintenance Page Preview', 'verstaile-toolkit')
                  : __('Coming Soon Page Preview', 'verstaile-toolkit')
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
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                      <p className="text-gray-600">{__('Loading preview...', 'verstaile-toolkit')}</p>
                    </div>
                  </div>
                )}
                <iframe
                  src={getPreviewUrl()}
                  className="w-full h-full border-0"
                  title={type === 'maintenance' ? __('Maintenance Preview', 'verstaile-toolkit') : __('Coming Soon Preview', 'verstaile-toolkit')}
                  onLoad={() => setIsLoading(false)}
                  style={{ display: isLoading ? 'none' : 'block' }}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t bg-gray-50 rounded-b-lg">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  {__('This is how your page will look to visitors.', 'verstaile-toolkit')}
                </p>
                <Button onClick={handleClose} variant="outline">
                  {__('Close Preview', 'verstaile-toolkit')}
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