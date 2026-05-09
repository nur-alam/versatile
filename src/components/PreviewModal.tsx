import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { __ } from '@wordpress/i18n';
import { Eye, X } from 'lucide-react';
import TemplateLoader from '@components/loader/TemplateLoader';
import config from '@/config';
import { useModalInteractions } from '../hooks/useModalInteractions';

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

  const getPreviewUrl = () => {
    const ajaxUrl = config?.ajax_url;
    const nonce = config?.nonce_value;
    const action = type === 'maintenance' ? 'versatile_preview_maintenance' : 'versatile_preview_comingsoon';

    const preview_data = JSON.stringify(getFormData());
    return `${ajaxUrl}?action=${action}&versatile_nonce=${nonce}&type=${type}&preview_data=${encodeURIComponent(preview_data)}`;
  };

  const { handleBackdropClick } = useModalInteractions({
    isOpen,
    onClose: handleClose
  });

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={handlePreview}
        disabled={disabled}
        className="vt-flex vt-items-center vt-gap-2 vt-border-gray-400"
      >
        <Eye size={16} />
        {type === 'maintenance'
          ? __('Preview', 'versatile-toolkit')
          : __('Preview', 'versatile-toolkit')
        }
      </Button>

      {isOpen && (
        <div
          className="vt-fixed vt-inset-x-0 vt-bottom-0 vt--top-[15px] vt-z-[999999] vt-flex vt-items-center vt-justify-center vt-bg-black vt-bg-opacity-85"
          onClick={handleBackdropClick}
        >
          <div className="vt-bg-white vt-rounded-lg vt-shadow-xl vt-w-11/12 vt-h-5/6 vt-max-w-6xl vt-flex vt-flex-col">
            {/* Header */}
            <div className="vt-flex vt-items-center vt-justify-between vt-p-4 vt-border-b">
              <h3 className="vt-text-lg vt-font-semibold">
                {type === 'maintenance'
                  ? __('Maintenance Page Preview', 'versatile-toolkit')
                  : __('Coming Soon Page Preview', 'versatile-toolkit')
                }
              </h3>
							<Button type="button" variant="ghost" size="sm" onClick={handleClose}>
								<X size={16} />
              </Button>
            </div>

            {/* Content */}
            <div className="vt-flex-1 vt-p-4">
              <div className="vt-w-full vt-h-full vt-border vt-rounded-lg vt-overflow-hidden vt-bg-gray-50">
                {isLoading && (
                  <TemplateLoader />
                )}
                <iframe
                  src={getPreviewUrl()}
                  className="vt-w-full vt-h-full vt-border-0"
                  title={type === 'maintenance' ? __('Maintenance Preview', 'versatile-toolkit') : __('Coming Soon Preview', 'versatile-toolkit')}
                  onLoad={() => setIsLoading(false)}
                  style={{ display: isLoading ? 'none' : 'block' }}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="vt-p-4 vt-border-t vt-bg-gray-50 vt-rounded-b-lg">
              <div className="vt-flex vt-justify-between vt-items-center">
                <p className="vt-text-sm vt-text-gray-600">
                  {__('This is how your page will look to visitors.', 'versatile-toolkit')}
                </p>
                <Button onClick={handleClose} variant="outline">
                  {__('Close Preview', 'versatile-toolkit')}
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