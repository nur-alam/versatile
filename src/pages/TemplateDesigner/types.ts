export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface TemplateElement {
  id: string;
  type: ElementType;
  position: Position;
  size: Size;
  properties: Record<string, any>;
  styles: Record<string, any>;
  content?: string;
}

export interface CustomTemplate {
  id?: string;
  name: string;
  description?: string;
  type: 'maintenance' | 'comingsoon' | 'both';
  elements: TemplateElement[];
  canvas: {
    width: number;
    height: number;
    background: {
      type: 'color' | 'image' | 'gradient';
      value: string;
    };
  };
  styles?: string;
  settings?: Record<string, any>;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Alias for backward compatibility
export type Template = CustomTemplate;

export type ElementType = 
  | 'text'
  | 'heading'
  | 'paragraph'
  | 'image'
  | 'button'
  | 'container'
  | 'spacer'
  | 'divider'
  | 'countdown'
  | 'social-links'
  | 'contact-form'
  | 'newsletter'
  | 'contact'
  | 'video'
  | 'logo'
  | 'progress'
  | 'icon';

export interface ElementCategory {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  elements: ElementDefinition[];
}

export interface ElementDefinition {
  id: string;
  type: ElementType;
  name: string;
  icon: React.ComponentType<any>;
  defaultProperties: Record<string, any>;
  defaultStyles: Record<string, any>;
  defaultSize: Size;
}

export interface DesignerState {
  template: CustomTemplate;
  selectedElement: TemplateElement | null;
  draggedElement: TemplateElement | null;
  history: CustomTemplate[];
  historyIndex: number;
  isGridVisible: boolean;
  isLayersVisible: boolean;
  zoom: number;
}

export interface PropertyControl {
  type: 'text' | 'number' | 'color' | 'select' | 'checkbox' | 'slider' | 'textarea';
  label: string;
  key: string;
  options?: Array<{ label: string; value: any }>;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
}

export interface ResponsiveBreakpoint {
  name: string;
  width: number;
  icon: React.ComponentType<any>;
}

export interface TemplateDesignerContextType {
  state: DesignerState;
  actions: {
    selectElement: (element: TemplateElement | null) => void;
    updateElement: (id: string, updates: Partial<TemplateElement>) => void;
    addElement: (element: TemplateElement) => void;
    removeElement: (id: string) => void;
    setDraggedElement: (element: TemplateElement | null) => void;
    undo: () => void;
    redo: () => void;
    saveTemplate: () => Promise<void>;
    previewTemplate: () => void;
    toggleGrid: () => void;
    toggleLayers: () => void;
    setZoom: (zoom: number) => void;
  };
}