import axios from 'axios';
import { CustomTemplate } from '../types';

const API_BASE = '/wp-admin/admin-ajax.php';

// Get WordPress nonce for security
const getNonce = () => {
  return (window as any).versatileTemplateDesigner?.nonce || '';
};

export const templateApi = {
  async getTemplate(id: string): Promise<CustomTemplate> {
    const response = await axios.post(API_BASE, {
      action: 'versatile_get_template',
      template_id: id,
      _wpnonce: getNonce()
    });
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.data || 'Failed to get template');
  },

  async saveTemplate(template: CustomTemplate): Promise<CustomTemplate> {
    const response = await axios.post(API_BASE, {
      action: 'versatile_save_template',
      template: template,
      _wpnonce: getNonce()
    });
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.data || 'Failed to save template');
  },

  async deleteTemplate(id: string): Promise<void> {
    const response = await axios.post(API_BASE, {
      action: 'versatile_delete_template',
      template_id: id,
      _wpnonce: getNonce()
    });
    
    if (!response.data.success) {
      throw new Error(response.data.data || 'Failed to delete template');
    }
  },

  async listTemplates(filters?: { type?: string; search?: string }): Promise<CustomTemplate[]> {
    const response = await axios.post(API_BASE, {
      action: 'versatile_list_templates',
      filters: filters || {},
      _wpnonce: getNonce()
    });
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.data || 'Failed to list templates');
  },

  async duplicateTemplate(id: string, name: string): Promise<CustomTemplate> {
    const response = await axios.post(API_BASE, {
      action: 'versatile_duplicate_template',
      template_id: id,
      name: name,
      _wpnonce: getNonce()
    });
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.data || 'Failed to duplicate template');
  },

  async generatePreview(template: CustomTemplate): Promise<string> {
    const response = await axios.post(API_BASE, {
      action: 'versatile_generate_preview',
      template: template,
      _wpnonce: getNonce()
    });
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.data || 'Failed to generate preview');
  },

  async exportTemplate(id: string): Promise<Blob> {
    const response = await axios.post(API_BASE, {
      action: 'versatile_export_template',
      template_id: id,
      _wpnonce: getNonce()
    }, {
      responseType: 'blob'
    });
    
    return response.data;
  },

  async importTemplate(file: File): Promise<CustomTemplate> {
    const formData = new FormData();
    formData.append('action', 'versatile_import_template');
    formData.append('template_file', file);
    formData.append('_wpnonce', getNonce());
    
    const response = await axios.post(API_BASE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.data || 'Failed to import template');
  }
};