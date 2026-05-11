import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { __ } from '@wordpress/i18n';

// declare global {
//   interface Window {
//     wp: {
//       media: (options: any) => {
//         open: () => void;
//         on: (event: string, callback: (attachment: any) => void) => void;
//       };
//     };
//   }
// }

interface MediaUploaderProps {
  value?: string;
  onChange: (url: string, id: number) => void;
  buttonText?: string;
  allowedTypes?: string[];
  multiple?: boolean;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({
  value = '',
  onChange,
  buttonText = __('Upload Image', 'versatile-toolkit'),
  allowedTypes = ['image'],
  multiple = false
}) => {
  const [imageUrl, setImageUrl] = useState<string>(value);
  const [imageId, setImageId] = useState<number>(0);

  useEffect(() => {
    setImageUrl(value);
  }, [value]);

  const openMediaUploader = () => {
    // Check if WordPress media library is available
    if (typeof window.wp === 'undefined' || !window.wp.media) {
      console.error('WordPress media library not available');
      return;
    }

    const mediaUploader = window.wp.media({
      title: __('Select Image', 'versatile-toolkit'), 
      button: {
        text: __('Use this image', 'versatile-toolkit')
      },
      multiple: multiple,
      library: {
        type: allowedTypes
      }
    });

    mediaUploader.on('select', () => {
      const attachment = mediaUploader.state().get('selection').first().toJSON();
      
      setImageUrl(attachment.url);
      setImageId(attachment.id);
      onChange(attachment.url, attachment.id);
    });

    mediaUploader.open();
  };

  const removeImage = () => {
    setImageUrl('');
    setImageId(0);
    onChange('', 0);
  };

  return (
    <div className="vt-space-y-4">
      <div className="vt-flex vt-gap-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={openMediaUploader}
        >
          {buttonText}
        </Button>
        
        {imageUrl && (
          <Button 
            type="button" 
            variant="destructive" 
            size="sm"
            onClick={removeImage}
          >
            {__('Remove', 'versatile-toolkit')} 
          </Button>
        )}
      </div>

      {imageUrl && (
        <div className="vt-mt-4">
          <div className="vt-border vt-rounded-lg vt-p-2 vt-inline-block vt-bg-gray-50">
            <img 
              src={imageUrl} 
              alt={__('Preview', 'versatile-toolkit')} 
              className="vt-max-w-xs vt-max-h-32 vt-object-cover vt-rounded"
            />
          </div>
          <p className="vt-text-sm vt-text-gray-600 vt-mt-2">
            {__('Image selected', 'versatile-toolkit')}
          </p>
        </div>
      )}
    </div>
  );
};

export default MediaUploader