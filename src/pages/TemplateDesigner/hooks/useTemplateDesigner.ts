import { useState, useCallback, useRef, useEffect } from 'react';
import { CustomTemplate, TemplateElement, DesignerState } from '../types';
import { templateApi } from '../services/templateApi';
import toast from 'react-hot-toast';

const createEmptyTemplate = (mode: 'maintenance' | 'comingsoon'): CustomTemplate => ({
  name: `New ${mode} Template`,
  description: '',
  type: mode,
  elements: [],
  canvas: {
    width: 1200,
    height: 800,
    background: {
      type: 'color',
      value: '#ffffff'
    }
  },
  settings: {},
  isActive: false
});

export const useTemplateDesigner = (templateId?: string, mode: 'maintenance' | 'comingsoon' = 'maintenance') => {
  const [state, setState] = useState<DesignerState>({
    template: createEmptyTemplate(mode),
    selectedElement: null,
    draggedElement: null,
    history: [],
    historyIndex: -1,
    isGridVisible: true,
    isLayersVisible: false,
    zoom: 1
  });

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load template on mount
  useEffect(() => {
    if (templateId) {
      loadTemplate(templateId);
    } else {
      // Initialize with empty template
      const emptyTemplate = createEmptyTemplate(mode);
      setState(prev => ({
        ...prev,
        template: emptyTemplate,
        history: [emptyTemplate],
        historyIndex: 0
      }));
    }
  }, [templateId, mode]);

  const loadTemplate = async (id: string) => {
    try {
      const template = await templateApi.getTemplate(id);
      setState(prev => ({
        ...prev,
        template,
        history: [template],
        historyIndex: 0
      }));
    } catch (error) {
      console.error('Failed to load template:', error);
      toast.error('Failed to load template');
    }
  };

  const addToHistory = useCallback((template: CustomTemplate) => {
    setState(prev => {
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      newHistory.push({ ...template });
      
      // Limit history to 50 items
      if (newHistory.length > 50) {
        newHistory.shift();
      }
      
      return {
        ...prev,
        history: newHistory,
        historyIndex: newHistory.length - 1
      };
    });
  }, []);

  const selectElement = useCallback((element: TemplateElement | null) => {
    setState(prev => ({
      ...prev,
      selectedElement: element
    }));
  }, []);

  const updateElement = useCallback((id: string, updates: Partial<TemplateElement>) => {
    setState(prev => {
      const updatedTemplate = {
        ...prev.template,
        elements: prev.template.elements.map(el =>
          el.id === id ? { ...el, ...updates } : el
        )
      };
      
      addToHistory(updatedTemplate);
      
      return {
        ...prev,
        template: updatedTemplate,
        selectedElement: prev.selectedElement?.id === id 
          ? { ...prev.selectedElement, ...updates }
          : prev.selectedElement
      };
    });
  }, [addToHistory]);

  const addElement = useCallback((element: TemplateElement) => {
    setState(prev => {
      const updatedTemplate = {
        ...prev.template,
        elements: [...prev.template.elements, element]
      };
      
      addToHistory(updatedTemplate);
      
      return {
        ...prev,
        template: updatedTemplate,
        selectedElement: element
      };
    });
  }, [addToHistory]);

  const removeElement = useCallback((id: string) => {
    setState(prev => {
      const updatedTemplate = {
        ...prev.template,
        elements: prev.template.elements.filter(el => el.id !== id)
      };
      
      addToHistory(updatedTemplate);
      
      return {
        ...prev,
        template: updatedTemplate,
        selectedElement: prev.selectedElement?.id === id ? null : prev.selectedElement
      };
    });
  }, [addToHistory]);

  const setDraggedElement = useCallback((element: TemplateElement | null) => {
    setState(prev => ({
      ...prev,
      draggedElement: element
    }));
  }, []);

  const undo = useCallback(() => {
    setState(prev => {
      if (prev.historyIndex > 0) {
        const newIndex = prev.historyIndex - 1;
        return {
          ...prev,
          template: prev.history[newIndex],
          historyIndex: newIndex,
          selectedElement: null
        };
      }
      return prev;
    });
  }, []);

  const redo = useCallback(() => {
    setState(prev => {
      if (prev.historyIndex < prev.history.length - 1) {
        const newIndex = prev.historyIndex + 1;
        return {
          ...prev,
          template: prev.history[newIndex],
          historyIndex: newIndex,
          selectedElement: null
        };
      }
      return prev;
    });
  }, []);

  const saveTemplate = useCallback(async () => {
    try {
      const savedTemplate = await templateApi.saveTemplate(state.template);
      setState(prev => ({
        ...prev,
        template: savedTemplate
      }));
      toast.success('Template saved successfully');
    } catch (error) {
      console.error('Failed to save template:', error);
      toast.error('Failed to save template');
    }
  }, [state.template]);

  // Auto-save functionality
  const autoSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      saveTemplate();
    }, 5000); // Auto-save after 5 seconds of inactivity
  }, [saveTemplate]);

  // Trigger auto-save when template changes
  useEffect(() => {
    if (state.template.id) {
      autoSave();
    }
    
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [state.template, autoSave]);

  const previewTemplate = useCallback(() => {
    // Open preview in new window/modal
    const previewWindow = window.open('', '_blank', 'width=1200,height=800');
    if (previewWindow) {
      templateApi.generatePreview(state.template).then((html: string) => {
        previewWindow.document.write(html);
        previewWindow.document.close();
      });
    }
  }, [state.template]);

  const toggleGrid = useCallback(() => {
    setState(prev => ({
      ...prev,
      isGridVisible: !prev.isGridVisible
    }));
  }, []);

  const toggleLayers = useCallback(() => {
    setState(prev => ({
      ...prev,
      isLayersVisible: !prev.isLayersVisible
    }));
  }, []);

  const setZoom = useCallback((zoom: number) => {
    setState(prev => ({
      ...prev,
      zoom: Math.max(0.1, Math.min(3, zoom))
    }));
  }, []);

  return {
    template: state.template,
    selectedElement: state.selectedElement,
    draggedElement: state.draggedElement,
    canUndo: state.historyIndex > 0,
    canRedo: state.historyIndex < state.history.length - 1,
    isGridVisible: state.isGridVisible,
    isLayersVisible: state.isLayersVisible,
    zoom: state.zoom,
    selectElement,
    updateElement,
    addElement,
    removeElement,
    setDraggedElement,
    undo,
    redo,
    saveTemplate,
    previewTemplate,
    toggleGrid,
    toggleLayers,
    setZoom
  };
};