import React, { useState, useMemo } from 'react';
import { Search, Type, Image, Square, MousePointer, Clock, Share2, Mail, Layout, Minus, Divide, Video, Star, Phone } from 'lucide-react';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { Separator } from '../../../components/ui/separator';
import { TemplateElement } from '../types';

interface ElementPaletteProps {}

interface ElementType {
  id: string;
  type: string;
  name: string;
  icon: React.ReactNode;
  category: string;
  defaultProperties: Record<string, any>;
  defaultSize: { width: number; height: number };
}

const elementTypes: ElementType[] = [
  // Text Elements
  {
    id: 'heading',
    type: 'heading',
    name: 'Heading',
    icon: <Type className="h-4 w-4" />,
    category: 'Text',
    defaultProperties: {
      content: 'Heading Text',
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#1f2937',
      textAlign: 'center',
      backgroundColor: 'transparent',
      padding: '8px',
      border: 'none',
      borderRadius: '0px',
    },
    defaultSize: { width: 300, height: 60 },
  },
  {
    id: 'paragraph',
    type: 'paragraph',
    name: 'Paragraph',
    icon: <Type className="h-4 w-4" />,
    category: 'Text',
    defaultProperties: {
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      fontSize: '16px',
      color: '#4b5563',
      lineHeight: '1.5',
      backgroundColor: 'transparent',
      padding: '8px',
      border: 'none',
      borderRadius: '0px',
      textAlign: 'left',
    },
    defaultSize: { width: 400, height: 80 },
  },
  {
    id: 'text',
    type: 'text',
    name: 'Text',
    icon: <Type className="h-4 w-4" />,
    category: 'Text',
    defaultProperties: {
      content: 'Text Element',
      fontSize: '16px',
      fontWeight: 'normal',
      color: '#374151',
      backgroundColor: 'transparent',
      padding: '8px',
      border: 'none',
      borderRadius: '0px',
      textAlign: 'left',
    },
    defaultSize: { width: 200, height: 40 },
  },

  // Media Elements
  {
    id: 'image',
    type: 'image',
    name: 'Image',
    icon: <Image className="h-4 w-4" />,
    category: 'Media',
    defaultProperties: {
      src: '',
      alt: 'Image',
      borderRadius: '0px',
      backgroundColor: 'transparent',
      border: 'none',
    },
    defaultSize: { width: 200, height: 150 },
  },

  // Layout Elements
  {
    id: 'container',
    type: 'container',
    name: 'Container',
    icon: <Square className="h-4 w-4" />,
    category: 'Layout',
    defaultProperties: {
      backgroundColor: 'transparent',
      border: '2px dashed #d1d5db',
      borderRadius: '8px',
      padding: '16px',
    },
    defaultSize: { width: 300, height: 200 },
  },
  {
    id: 'spacer',
    type: 'spacer',
    name: 'Spacer',
    icon: <Layout className="h-4 w-4" />,
    category: 'Layout',
    defaultProperties: {
      backgroundColor: '#f3f4f6',
      border: '1px solid #d1d5db',
    },
    defaultSize: { width: 100, height: 50 },
  },
  {
    id: 'divider',
    type: 'divider',
    name: 'Divider',
    icon: <Minus className="h-4 w-4" />,
    category: 'Layout',
    defaultProperties: {
      backgroundColor: 'transparent',
      color: '#d1d5db',
      orientation: 'horizontal',
    },
    defaultSize: { width: 200, height: 2 },
  },

  // Interactive Elements
  {
    id: 'button',
    type: 'button',
    name: 'Button',
    icon: <MousePointer className="h-4 w-4" />,
    category: 'Interactive',
    defaultProperties: {
      content: 'Click Me',
      fontSize: '16px',
      fontFamily: 'Arial',
      color: '#ffffff',
      backgroundColor: '#3b82f6',
      borderRadius: '6px',
      border: 'none',
    },
    defaultSize: { width: 120, height: 40 },
  },

  // Dynamic Elements
  {
    id: 'countdown',
    type: 'countdown',
    name: 'Countdown Timer',
    icon: <Clock className="h-4 w-4" />,
    category: 'Dynamic',
    defaultProperties: {
      targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      format: 'days:hours:minutes:seconds',
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#1f2937',
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: '0px',
      padding: '16px',
    },
    defaultSize: { width: 400, height: 80 },
  },

  // Social Elements
  {
    id: 'social-links',
    type: 'social-links',
    name: 'Social Links',
    icon: <Share2 className="h-4 w-4" />,
    category: 'Social',
    defaultProperties: {
      platforms: ['facebook', 'twitter', 'instagram'],
      iconSize: '24px',
      spacing: '12px',
      backgroundColor: 'transparent',
      padding: '8px',
    },
    defaultSize: { width: 200, height: 50 },
  },

  {
    id: 'newsletter-signup',
    type: 'newsletter',
    name: 'Newsletter Signup',
    icon: <Mail className="h-4 w-4" />,
    category: 'Social',
    defaultProperties: {
      title: 'Stay Updated',
      description: 'Get notified when we launch!',
      placeholder: 'Enter your email',
      buttonText: 'Subscribe',
      backgroundColor: '#f8fafc',
      borderRadius: '8px',
      padding: '20px',
    },
    defaultSize: { width: 350, height: 150 },
  },
  {
    id: 'phone-contact',
    type: 'contact',
    name: 'Phone Contact',
    icon: <Phone className="h-4 w-4" />,
    category: 'Social',
    defaultProperties: {
      phone: '+1 (555) 123-4567',
      label: 'Call us:',
      fontSize: '16px',
      color: '#1f2937',
      linkColor: '#3b82f6',
    },
    defaultSize: { width: 200, height: 40 },
  },
  // Additional Media Elements
  {
    id: 'video',
    type: 'video',
    name: 'Video',
    icon: <Video className="h-4 w-4" />,
    category: 'Media',
    defaultProperties: {
      src: '',
      poster: '',
      controls: true,
      autoplay: false,
      borderRadius: '8px',
      backgroundColor: '#000000',
    },
    defaultSize: { width: 400, height: 225 },
  },
  {
    id: 'logo',
    type: 'logo',
    name: 'Logo',
    icon: <Star className="h-4 w-4" />,
    category: 'Media',
    defaultProperties: {
      src: '',
      alt: 'Company Logo',
      maxWidth: '200px',
      backgroundColor: 'transparent',
    },
    defaultSize: { width: 200, height: 80 },
  },
  // Additional Dynamic Elements
  {
    id: 'progress-bar',
    type: 'progress',
    name: 'Progress Bar',
    icon: <Divide className="h-4 w-4" />,
    category: 'Dynamic',
    defaultProperties: {
      progress: 75,
      backgroundColor: '#e5e7eb',
      fillColor: '#3b82f6',
      height: '8px',
      borderRadius: '4px',
      showLabel: true,
    },
    defaultSize: { width: 300, height: 30 },
  },
];

interface DraggableElementProps {
  element: ElementType;
  isFocused?: boolean;
  onFocus?: () => void;
}

const DraggableElement: React.FC<DraggableElementProps> = ({ element, isFocused = false, onFocus }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (event: React.DragEvent) => {
    setIsDragging(true);
    
    // Create element data for the canvas
    const elementData: TemplateElement = {
      id: `${element.type}_${Date.now()}`,
      type: element.type as any,
      properties: element.defaultProperties,
      size: element.defaultSize,
      position: { x: 0, y: 0 },
      styles: {},
      content: element.defaultProperties.content || '',
    };

    // Set drag data
    event.dataTransfer.setData('application/json', JSON.stringify(elementData));
    event.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      draggable
      tabIndex={0}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onFocus={onFocus}
      className={`
        flex items-center space-x-3 p-3 rounded-lg border transition-colors duration-150
        cursor-grab active:cursor-grabbing
        ${isDragging ? 'opacity-50' : ''}
        ${isFocused 
          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
        }
        focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500
      `}
      role="button"
      aria-label={`Drag ${element.name} to canvas`}
    >
      <div className="flex-shrink-0 text-gray-600">
        {element.icon}
      </div>
      <span className="text-sm font-medium text-gray-900 truncate">
        {element.name}
      </span>
    </div>
  );
};

const ElementPalette: React.FC<ElementPaletteProps> = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [focusedElementIndex, setFocusedElementIndex] = useState<number>(-1);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(elementTypes.map(el => el.category)));
    return cats.sort();
  }, []);

  // Filter elements based on search and category
  const filteredElements = useMemo(() => {
    return elementTypes.filter(element => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === '' || 
                           element.name.toLowerCase().includes(searchLower) ||
                           element.type.toLowerCase().includes(searchLower) ||
                           element.category.toLowerCase().includes(searchLower) ||
                           // Search in default properties content
                           (element.defaultProperties.content && 
                            element.defaultProperties.content.toLowerCase().includes(searchLower));
      const matchesCategory = !selectedCategory || element.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  // Group elements by category
  const groupedElements = useMemo(() => {
    const groups: Record<string, ElementType[]> = {};
    filteredElements.forEach(element => {
      if (!groups[element.category]) {
        groups[element.category] = [];
      }
      groups[element.category].push(element);
    });
    return groups;
  }, [filteredElements]);

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (filteredElements.length === 0) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setFocusedElementIndex(prev => 
          prev < filteredElements.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setFocusedElementIndex(prev => 
          prev > 0 ? prev - 1 : filteredElements.length - 1
        );
        break;
      case 'Enter':
        event.preventDefault();
        if (focusedElementIndex >= 0 && focusedElementIndex < filteredElements.length) {
          // Trigger drag start for the focused element
          const element = filteredElements[focusedElementIndex];
          // This would need to be handled by the parent component
          console.log('Enter pressed on element:', element);
        }
        break;
      case 'Escape':
        setFocusedElementIndex(-1);
        break;
    }
  };

  // Reset focused index when search or category changes
  React.useEffect(() => {
    setFocusedElementIndex(-1);
  }, [searchTerm, selectedCategory]);

  return (
    <div className="h-full flex flex-col bg-white" onKeyDown={handleKeyDown}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Elements</h2>
        
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search elements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            aria-label="Search elements"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-1">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className="text-xs"
          >
            All
          </Button>
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="text-xs"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Elements List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" role="list">
        {Object.entries(groupedElements).map(([category, elements]) => (
          <div key={category}>
            <h3 className="text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">
              {category}
            </h3>
            <div className="space-y-2" role="group" aria-labelledby={`category-${category}`}>
              {elements.map((element, index) => {
                const globalIndex = filteredElements.findIndex(e => e.id === element.id);
                return (
                  <DraggableElement 
                    key={element.id} 
                    element={element}
                    isFocused={globalIndex === focusedElementIndex}
                    onFocus={() => setFocusedElementIndex(globalIndex)}
                  />
                );
              })}
            </div>
            {Object.keys(groupedElements).length > 1 && (
              <Separator className="mt-4" />
            )}
          </div>
        ))}
        
        {filteredElements.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <Search className="h-8 w-8 mx-auto" />
            </div>
            <p className="text-sm text-gray-500">
              No elements found matching your search.
            </p>
          </div>
        )}
      </div>

      {/* Help Text */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="space-y-1">
          <p className="text-xs text-gray-600">
            Drag elements onto the canvas to add them to your template.
          </p>
          <p className="text-xs text-gray-500">
            Use arrow keys to navigate, Enter to select, Esc to clear focus.
          </p>
          {filteredElements.length > 0 && (
            <p className="text-xs text-gray-500">
              {filteredElements.length} element{filteredElements.length !== 1 ? 's' : ''} available
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ElementPalette;