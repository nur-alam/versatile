import React from 'react';
import { Button } from '@/components/ui/button';
import { __ } from '@wordpress/i18n';
import { ExternalLink } from 'lucide-react';
import config from '@/config';

interface PreviewButtonProps {
  type: 'maintenance' | 'comingsoon';
  disabled?: boolean;
}

const PreviewButton = ({ type, disabled = false }: PreviewButtonProps) => {
  const handlePreview = () => {
    // Get the site URL and create preview URL with nonce
    const siteUrl = config?.site_url || window.location.origin;
    const nonce = config?.nonce_value;

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
      {__(`Preview as ${type}`, 'versatile-toolkit')} 
    </Button>
  );
};

export default PreviewButton;