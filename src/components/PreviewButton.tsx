import React from 'react';
import { Button } from '@/components/ui/button';
import { __ } from '@wordpress/i18n';
import { ExternalLink } from 'lucide-react';

interface PreviewButtonProps {
  type: 'maintenance' | 'comingsoon';
  disabled?: boolean;
}

const PreviewButton = ({ type, disabled = false }: PreviewButtonProps) => {
  const handlePreview = () => {
    // Get the site URL and create preview URL with nonce
    const siteUrl = window._versatileObject?.site_url || window.location.origin;
    const nonce = window._versatileObject?.nonce_value;

    if (!nonce) {
      alert(__('Security nonce not found. Please refresh the page and try again.', 'versatile-toolkit'));
      return;
    }

    const previewUrl = `${siteUrl}?versatile_preview=${type}&nonce=${nonce}`;

    // Open preview in new tab
    window.open(previewUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handlePreview}
      disabled={disabled}
      className="flex items-center gap-2"
    >
      <ExternalLink size={16} />
      {type === 'maintenance'
        ? __('Preview', 'versatile-toolkit') 
        : __('Preview', 'versatile-toolkit')
      }
    </Button>
  );
};

export default PreviewButton;