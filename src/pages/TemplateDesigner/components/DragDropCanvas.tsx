import React, { useRef, useCallback, useState, useEffect } from 'react';
import { TemplateElement, Template, Position } from '../types';

interface DragDropCanvasProps {
  template: Template | null;
  selectedElement: TemplateElement | null;
  isGridVisible: boolean;
  zoom: number;
  onSelectElement: (element: TemplateElement | null) => void;
  onUpdateElement: (elementId: string, updates: Partial<TemplateElement>) => void;
  onRemoveElement: (elementId: string) => void;
  onAddElement: (element: TemplateElement) => void;
}

interface AlignmentGuide {
  type: 'vertical' | 'horizontal';
  position: number;
  elements: string[];
}

const DragDropCanvas: React.FC<DragDropCanvasProps> = ({
  template,
  selectedElement,
  isGridVisible,
  zoom,
  onSelectElement,
  onUpdateElement,
  onRemoveElement,
  onAddElement
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 });
  const [draggedElementId, setDraggedElementId] = useState<string | null>(null);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [alignmentGuides, setAlignmentGuides] = useState<AlignmentGuide[]>([]);
  const [showAlignmentGuides, setShowAlignmentGuides] = useState(false);
  const [multiSelectMode, setMultiSelectMode] = useState(false);
  const [selectedElements, setSelectedElements] = useState<string[]>([]);

  // Canvas drop zone state
  const [isDropZoneActive, setIsDropZoneActive] = useState(false);

  // Grid and snapping configuration
  const GRID_SIZE = 10;
  const SNAP_THRESHOLD = 5;

  // Calculate alignment guides
  const calculateAlignmentGuides = useCallback((draggedElement: TemplateElement, newPosition: Position): AlignmentGuide[] => {
    if (!template?.elements) return [];

    const guides: AlignmentGuide[] = [];
    const otherElements = template.elements.filter(el => el.id !== draggedElement.id);

    otherElements.forEach(element => {
      // Vertical alignment guides
      const leftAlign = Math.abs(newPosition.x - element.position.x);
      const centerAlign = Math.abs((newPosition.x + draggedElement.size.width / 2) - (element.position.x + element.size.width / 2));
      const rightAlign = Math.abs((newPosition.x + draggedElement.size.width) - (element.position.x + element.size.width));

      if (leftAlign < SNAP_THRESHOLD) {
        guides.push({
          type: 'vertical',
          position: element.position.x,
          elements: [draggedElement.id, element.id]
        });
      }
      if (centerAlign < SNAP_THRESHOLD) {
        guides.push({
          type: 'vertical',
          position: element.position.x + element.size.width / 2,
          elements: [draggedElement.id, element.id]
        });
      }
      if (rightAlign < SNAP_THRESHOLD) {
        guides.push({
          type: 'vertical',
          position: element.position.x + element.size.width,
          elements: [draggedElement.id, element.id]
        });
      }

      // Horizontal alignment guides
      const topAlign = Math.abs(newPosition.y - element.position.y);
      const middleAlign = Math.abs((newPosition.y + draggedElement.size.height / 2) - (element.position.y + element.size.height / 2));
      const bottomAlign = Math.abs((newPosition.y + draggedElement.size.height) - (element.position.y + element.size.height));

      if (topAlign < SNAP_THRESHOLD) {
        guides.push({
          type: 'horizontal',
          position: element.position.y,
          elements: [draggedElement.id, element.id]
        });
      }
      if (middleAlign < SNAP_THRESHOLD) {
        guides.push({
          type: 'horizontal',
          position: element.position.y + element.size.height / 2,
          elements: [draggedElement.id, element.id]
        });
      }
      if (bottomAlign < SNAP_THRESHOLD) {
        guides.push({
          type: 'horizontal',
          position: element.position.y + element.size.height,
          elements: [draggedElement.id, element.id]
        });
      }
    });

    return guides;
  }, [template?.elements]);

  // Snap position to grid or alignment guides
  const snapPosition = useCallback((position: Position, element: TemplateElement): Position => {
    let snappedX = position.x;
    let snappedY = position.y;

    if (isGridVisible) {
      snappedX = Math.round(position.x / GRID_SIZE) * GRID_SIZE;
      snappedY = Math.round(position.y / GRID_SIZE) * GRID_SIZE;
    }

    // Check for alignment guide snapping
    const guides = calculateAlignmentGuides(element, { x: snappedX, y: snappedY });
    
    guides.forEach(guide => {
      if (guide.type === 'vertical') {
        const snapDistance = Math.abs(snappedX - guide.position);
        const centerSnapDistance = Math.abs((snappedX + element.size.width / 2) - guide.position);
        const rightSnapDistance = Math.abs((snappedX + element.size.width) - guide.position);
        
        if (snapDistance < SNAP_THRESHOLD) {
          snappedX = guide.position;
        } else if (centerSnapDistance < SNAP_THRESHOLD) {
          snappedX = guide.position - element.size.width / 2;
        } else if (rightSnapDistance < SNAP_THRESHOLD) {
          snappedX = guide.position - element.size.width;
        }
      } else if (guide.type === 'horizontal') {
        const snapDistance = Math.abs(snappedY - guide.position);
        const middleSnapDistance = Math.abs((snappedY + element.size.height / 2) - guide.position);
        const bottomSnapDistance = Math.abs((snappedY + element.size.height) - guide.position);
        
        if (snapDistance < SNAP_THRESHOLD) {
          snappedY = guide.position;
        } else if (middleSnapDistance < SNAP_THRESHOLD) {
          snappedY = guide.position - element.size.height / 2;
        } else if (bottomSnapDistance < SNAP_THRESHOLD) {
          snappedY = guide.position - element.size.height;
        }
      }
    });

    return { x: snappedX, y: snappedY };
  }, [isGridVisible, calculateAlignmentGuides]);

  // Handle element selection
  const handleElementClick = useCallback((element: TemplateElement, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (event.ctrlKey || event.metaKey) {
      // Multi-select mode
      setMultiSelectMode(true);
      setSelectedElements(prev => {
        if (prev.includes(element.id)) {
          return prev.filter(id => id !== element.id);
        } else {
          return [...prev, element.id];
        }
      });
    } else {
      // Single select mode
      setMultiSelectMode(false);
      setSelectedElements([]);
      onSelectElement(element);
    }
  }, [onSelectElement]);

  // Handle canvas click (deselect)
  const handleCanvasClick = useCallback((event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onSelectElement(null);
      setMultiSelectMode(false);
      setSelectedElements([]);
    }
  }, [onSelectElement]);

  // Handle drag and drop from element palette
  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    setIsDropZoneActive(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    // Only hide drop zone if leaving the canvas entirely
    if (!canvasRef.current?.contains(event.relatedTarget as Node)) {
      setIsDropZoneActive(false);
    }
  }, []);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDropZoneActive(false);

    try {
      const elementData = JSON.parse(event.dataTransfer.getData('application/json'));
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      
      if (!canvasRect) return;

      // Calculate drop position relative to canvas
      const x = (event.clientX - canvasRect.left) / zoom;
      const y = (event.clientY - canvasRect.top) / zoom;

      // Create new element with unique ID
      const newElement: TemplateElement = {
        ...elementData,
        id: `${elementData.type}_${Date.now()}`,
        position: { x, y }
      };

      onAddElement(newElement);
    } catch (error) {
      console.error('Failed to parse dropped element data:', error);
    }
  }, [onAddElement, zoom]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!selectedElement) return;

      const moveDistance = event.shiftKey ? GRID_SIZE : 1;
      let newPosition = { ...selectedElement.position };

      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          newPosition.y = Math.max(0, newPosition.y - moveDistance);
          break;
        case 'ArrowDown':
          event.preventDefault();
          newPosition.y += moveDistance;
          break;
        case 'ArrowLeft':
          event.preventDefault();
          newPosition.x = Math.max(0, newPosition.x - moveDistance);
          break;
        case 'ArrowRight':
          event.preventDefault();
          newPosition.x += moveDistance;
          break;
        case 'Delete':
        case 'Backspace':
          event.preventDefault();
          onRemoveElement(selectedElement.id);
          return;
        case 'Escape':
          event.preventDefault();
          onSelectElement(null);
          return;
        default:
          return;
      }

      if (isGridVisible) {
        newPosition = snapPosition(newPosition, selectedElement);
      }

      onUpdateElement(selectedElement.id, { position: newPosition });
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedElement, isGridVisible, snapPosition, onUpdateElement, onRemoveElement, onSelectElement]);

  // Handle element dragging
  const handleElementMouseDown = useCallback((element: TemplateElement, event: React.MouseEvent) => {
    if (event.button !== 0) return; // Only left click
    
    event.preventDefault();
    event.stopPropagation();
    
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return;

    setIsDragging(true);
    setDraggedElementId(element.id);
    setDragStart({ 
      x: (event.clientX - canvasRect.left) / zoom - element.position.x, 
      y: (event.clientY - canvasRect.top) / zoom - element.position.y 
    });
    setShowAlignmentGuides(true);
    onSelectElement(element);
  }, [onSelectElement, zoom]);

  // Handle resize handle mouse down
  const handleResizeMouseDown = useCallback((element: TemplateElement, handle: string, event: React.MouseEvent) => {
    if (event.button !== 0) return; // Only left click
    
    event.preventDefault();
    event.stopPropagation();
    
    setIsResizing(true);
    setDraggedElementId(element.id);
    setResizeHandle(handle);
    setDragStart({ x: event.clientX, y: event.clientY });
    onSelectElement(element);
  }, [onSelectElement]);

  // Handle mouse move for dragging and resizing
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if ((!isDragging && !isResizing) || !draggedElementId || !canvasRef.current) return;

      const canvasRect = canvasRef.current.getBoundingClientRect();
      
      if (isDragging) {
        // Handle dragging
        const element = template?.elements.find(el => el.id === draggedElementId);
        if (!element) return;

        const rawX = (event.clientX - canvasRect.left) / zoom - dragStart.x;
        const rawY = (event.clientY - canvasRect.top) / zoom - dragStart.y;

        // Apply snapping
        const snappedPosition = snapPosition({ x: rawX, y: rawY }, element);

        // Ensure element stays within canvas bounds
        const canvasWidth = (template?.canvas?.width || canvasRect.width) / zoom;
        const canvasHeight = (template?.canvas?.height || canvasRect.height) / zoom;
        
        snappedPosition.x = Math.max(0, Math.min(snappedPosition.x, canvasWidth - element.size.width));
        snappedPosition.y = Math.max(0, Math.min(snappedPosition.y, canvasHeight - element.size.height));

        // Update alignment guides
        const guides = calculateAlignmentGuides(element, snappedPosition);
        setAlignmentGuides(guides);

        onUpdateElement(draggedElementId, {
          position: snappedPosition
        });
      } else if (isResizing && resizeHandle) {
        // Handle resizing
        const element = template?.elements.find(el => el.id === draggedElementId);
        if (!element) return;

        const deltaX = (event.clientX - dragStart.x) / zoom;
        const deltaY = (event.clientY - dragStart.y) / zoom;
        
        let newWidth = element.size.width;
        let newHeight = element.size.height;
        let newX = element.position.x;
        let newY = element.position.y;

        // Minimum sizes
        const minWidth = 20;
        const minHeight = 20;

        switch (resizeHandle) {
          case 'nw':
            newWidth = Math.max(minWidth, element.size.width - deltaX);
            newHeight = Math.max(minHeight, element.size.height - deltaY);
            newX = element.position.x + (element.size.width - newWidth);
            newY = element.position.y + (element.size.height - newHeight);
            break;
          case 'ne':
            newWidth = Math.max(minWidth, element.size.width + deltaX);
            newHeight = Math.max(minHeight, element.size.height - deltaY);
            newY = element.position.y + (element.size.height - newHeight);
            break;
          case 'sw':
            newWidth = Math.max(minWidth, element.size.width - deltaX);
            newHeight = Math.max(minHeight, element.size.height + deltaY);
            newX = element.position.x + (element.size.width - newWidth);
            break;
          case 'se':
            newWidth = Math.max(minWidth, element.size.width + deltaX);
            newHeight = Math.max(minHeight, element.size.height + deltaY);
            break;
          case 'n':
            newHeight = Math.max(minHeight, element.size.height - deltaY);
            newY = element.position.y + (element.size.height - newHeight);
            break;
          case 's':
            newHeight = Math.max(minHeight, element.size.height + deltaY);
            break;
          case 'w':
            newWidth = Math.max(minWidth, element.size.width - deltaX);
            newX = element.position.x + (element.size.width - newWidth);
            break;
          case 'e':
            newWidth = Math.max(minWidth, element.size.width + deltaX);
            break;
        }

        // Snap to grid if enabled
        if (isGridVisible) {
          newWidth = Math.round(newWidth / GRID_SIZE) * GRID_SIZE;
          newHeight = Math.round(newHeight / GRID_SIZE) * GRID_SIZE;
          newX = Math.round(newX / GRID_SIZE) * GRID_SIZE;
          newY = Math.round(newY / GRID_SIZE) * GRID_SIZE;
        }

        // Ensure element stays within canvas bounds
        const canvasWidth = (template?.canvas?.width || canvasRect.width) / zoom;
        const canvasHeight = (template?.canvas?.height || canvasRect.height) / zoom;
        
        newX = Math.max(0, Math.min(newX, canvasWidth - newWidth));
        newY = Math.max(0, Math.min(newY, canvasHeight - newHeight));

        onUpdateElement(draggedElementId, {
          size: { width: newWidth, height: newHeight },
          position: { x: newX, y: newY }
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setDraggedElementId(null);
      setResizeHandle(null);
      setShowAlignmentGuides(false);
      setAlignmentGuides([]);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, draggedElementId, dragStart, resizeHandle, isGridVisible, onUpdateElement, template, zoom, snapPosition, calculateAlignmentGuides]);

  // Render grid overlay
  const renderGrid = () => {
    if (!isGridVisible) return null;

    const scaledGridSize = GRID_SIZE * zoom;
    const opacity = Math.min(1, Math.max(0.1, zoom));

    return (
      <div className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full">
          <defs>
            <pattern
              id="grid"
              width={scaledGridSize}
              height={scaledGridSize}
              patternUnits="userSpaceOnUse"
            >
              <path
                d={`M ${scaledGridSize} 0 L 0 0 0 ${scaledGridSize}`}
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="0.5"
                opacity={opacity}
              />
            </pattern>
            <pattern
              id="majorGrid"
              width={scaledGridSize * 5}
              height={scaledGridSize * 5}
              patternUnits="userSpaceOnUse"
            >
              <path
                d={`M ${scaledGridSize * 5} 0 L 0 0 0 ${scaledGridSize * 5}`}
                fill="none"
                stroke="#d1d5db"
                strokeWidth="1"
                opacity={opacity}
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <rect width="100%" height="100%" fill="url(#majorGrid)" />
        </svg>
      </div>
    );
  };

  // Render alignment guides
  const renderAlignmentGuides = () => {
    if (!showAlignmentGuides || alignmentGuides.length === 0) return null;

    return (
      <div className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full">
          {alignmentGuides.map((guide, index) => (
            <line
              key={index}
              x1={guide.type === 'vertical' ? guide.position * zoom : 0}
              y1={guide.type === 'vertical' ? 0 : guide.position * zoom}
              x2={guide.type === 'vertical' ? guide.position * zoom : '100%'}
              y2={guide.type === 'vertical' ? '100%' : guide.position * zoom}
              stroke="#3b82f6"
              strokeWidth="1"
              strokeDasharray="4 4"
              opacity="0.8"
            />
          ))}
        </svg>
      </div>
    );
  };

  // Render template elements
  const renderElements = () => {
    if (!template?.elements) return null;

    return template.elements.map((element) => {
      const isSelected = selectedElement?.id === element.id;
      
      return (
        <div
          key={element.id}
          className={`absolute cursor-move select-none ${
            isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
          }`}
          style={{
            left: element.position.x,
            top: element.position.y,
            width: element.size.width,
            height: element.size.height,
            zIndex: isSelected ? 1000 : element.properties.zIndex || 1,
          }}
          onClick={(e) => handleElementClick(element, e)}
          onMouseDown={(e) => handleElementMouseDown(element, e)}
        >
          {/* Element content based on type */}
          {element.type === 'text' && (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{
                fontSize: element.properties.fontSize || '16px',
                fontFamily: element.properties.fontFamily || 'Arial',
                color: element.properties.color || '#000000',
                backgroundColor: element.properties.backgroundColor || 'transparent',
                textAlign: element.properties.textAlign || 'left',
                padding: element.properties.padding || '8px',
                border: element.properties.border || 'none',
                borderRadius: element.properties.borderRadius || '0px',
              }}
            >
              {element.properties.content || 'Text Element'}
            </div>
          )}
          
          {element.type === 'image' && (
            <div
              className="w-full h-full bg-gray-200 border-2 border-dashed border-gray-400 flex items-center justify-center"
              style={{
                borderRadius: element.properties.borderRadius || '0px',
              }}
            >
              {element.properties.src ? (
                <img
                  src={element.properties.src}
                  alt={element.properties.alt || 'Image'}
                  className="w-full h-full object-cover"
                  style={{
                    borderRadius: element.properties.borderRadius || '0px',
                  }}
                />
              ) : (
                <span className="text-gray-500 text-sm">Image Placeholder</span>
              )}
            </div>
          )}
          
          {element.type === 'button' && (
            <button
              className="w-full h-full"
              style={{
                fontSize: element.properties.fontSize || '14px',
                fontFamily: element.properties.fontFamily || 'Arial',
                color: element.properties.color || '#ffffff',
                backgroundColor: element.properties.backgroundColor || '#3b82f6',
                border: element.properties.border || 'none',
                borderRadius: element.properties.borderRadius || '4px',
                cursor: 'pointer',
              }}
            >
              {element.properties.content || 'Button'}
            </button>
          )}
          
          {element.type === 'heading' && (
            <div
              className="w-full h-full flex items-center"
              style={{
                fontSize: element.properties.fontSize || '32px',
                fontFamily: element.properties.fontFamily || 'Arial',
                fontWeight: element.properties.fontWeight || 'bold',
                color: element.properties.color || '#000000',
                backgroundColor: element.properties.backgroundColor || 'transparent',
                textAlign: element.properties.textAlign || 'left',
                padding: element.properties.padding || '8px',
                border: element.properties.border || 'none',
                borderRadius: element.properties.borderRadius || '0px',
              }}
            >
              {element.properties.content || 'Heading'}
            </div>
          )}
          
          {element.type === 'paragraph' && (
            <div
              className="w-full h-full"
              style={{
                fontSize: element.properties.fontSize || '16px',
                fontFamily: element.properties.fontFamily || 'Arial',
                color: element.properties.color || '#000000',
                backgroundColor: element.properties.backgroundColor || 'transparent',
                textAlign: element.properties.textAlign || 'left',
                padding: element.properties.padding || '8px',
                border: element.properties.border || 'none',
                borderRadius: element.properties.borderRadius || '0px',
                lineHeight: element.properties.lineHeight || '1.5',
              }}
            >
              {element.properties.content || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}
            </div>
          )}
          
          {element.type === 'container' && (
            <div
              className="w-full h-full border-2 border-dashed border-gray-300 flex items-center justify-center"
              style={{
                backgroundColor: element.properties.backgroundColor || 'transparent',
                border: element.properties.border || '2px dashed #d1d5db',
                borderRadius: element.properties.borderRadius || '0px',
                padding: element.properties.padding || '16px',
              }}
            >
              <span className="text-gray-500 text-sm">Container</span>
            </div>
          )}
          
          {element.type === 'spacer' && (
            <div
              className="w-full h-full bg-gray-100 border border-gray-300 flex items-center justify-center"
              style={{
                backgroundColor: element.properties.backgroundColor || '#f3f4f6',
                border: element.properties.border || '1px solid #d1d5db',
              }}
            >
              <span className="text-gray-400 text-xs">Spacer</span>
            </div>
          )}
          
          {element.type === 'divider' && (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{
                backgroundColor: element.properties.backgroundColor || 'transparent',
              }}
            >
              <div
                style={{
                  width: element.properties.orientation === 'vertical' ? '2px' : '100%',
                  height: element.properties.orientation === 'vertical' ? '100%' : '2px',
                  backgroundColor: element.properties.color || '#d1d5db',
                }}
              />
            </div>
          )}
          
          {element.type === 'countdown' && (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{
                fontSize: element.properties.fontSize || '24px',
                fontFamily: element.properties.fontFamily || 'Arial',
                color: element.properties.color || '#000000',
                backgroundColor: element.properties.backgroundColor || 'transparent',
                border: element.properties.border || 'none',
                borderRadius: element.properties.borderRadius || '0px',
                padding: element.properties.padding || '16px',
              }}
            >
              <div className="text-center">
                <div className="font-bold">00:00:00:00</div>
                <div className="text-sm opacity-75">Days:Hours:Min:Sec</div>
              </div>
            </div>
          )}
          
          {element.type === 'social-links' && (
            <div
              className="w-full h-full flex items-center justify-center gap-2"
              style={{
                backgroundColor: element.properties.backgroundColor || 'transparent',
                padding: element.properties.padding || '8px',
              }}
            >
              <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white text-sm">f</div>
              <div className="w-8 h-8 bg-blue-400 rounded flex items-center justify-center text-white text-sm">t</div>
              <div className="w-8 h-8 bg-pink-500 rounded flex items-center justify-center text-white text-sm">i</div>
            </div>
          )}

          {element.type === 'newsletter' && (
            <div
              className="w-full h-full p-4 border border-gray-200 rounded"
              style={{
                backgroundColor: element.properties.backgroundColor || '#f8fafc',
                borderRadius: element.properties.borderRadius || '8px',
                padding: element.properties.padding || '20px',
              }}
            >
              <div className="text-center">
                <h3 className="font-semibold mb-2">{element.properties.title || 'Stay Updated'}</h3>
                <p className="text-sm text-gray-600 mb-3">{element.properties.description || 'Get notified when we launch!'}</p>
                <div className="flex gap-2">
                  <input 
                    type="email" 
                    placeholder={element.properties.placeholder || 'Enter your email'} 
                    className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                    disabled
                  />
                  <button className="px-4 py-2 bg-blue-500 text-white rounded text-sm">
                    {element.properties.buttonText || 'Subscribe'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {element.type === 'contact' && (
            <div
              className="w-full h-full flex items-center"
              style={{
                fontSize: element.properties.fontSize || '16px',
                color: element.properties.color || '#1f2937',
                backgroundColor: element.properties.backgroundColor || 'transparent',
                padding: element.properties.padding || '8px',
              }}
            >
              <span className="mr-2">{element.properties.label || 'Call us:'}</span>
              <a 
                href={`tel:${element.properties.phone || '+1 (555) 123-4567'}`}
                className="underline"
                style={{ color: element.properties.linkColor || '#3b82f6' }}
              >
                {element.properties.phone || '+1 (555) 123-4567'}
              </a>
            </div>
          )}

          {element.type === 'video' && (
            <div
              className="w-full h-full bg-black flex items-center justify-center"
              style={{
                borderRadius: element.properties.borderRadius || '8px',
                backgroundColor: element.properties.backgroundColor || '#000000',
              }}
            >
              {element.properties.src ? (
                <video
                  src={element.properties.src}
                  poster={element.properties.poster}
                  controls={element.properties.controls}
                  autoPlay={element.properties.autoplay}
                  className="w-full h-full object-cover"
                  style={{
                    borderRadius: element.properties.borderRadius || '8px',
                  }}
                />
              ) : (
                <span className="text-white text-sm">Video Placeholder</span>
              )}
            </div>
          )}

          {element.type === 'logo' && (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{
                backgroundColor: element.properties.backgroundColor || 'transparent',
              }}
            >
              {element.properties.src ? (
                <img
                  src={element.properties.src}
                  alt={element.properties.alt || 'Company Logo'}
                  className="max-w-full max-h-full object-contain"
                  style={{
                    maxWidth: element.properties.maxWidth || '200px',
                  }}
                />
              ) : (
                <div className="border-2 border-dashed border-gray-400 w-full h-full flex items-center justify-center">
                  <span className="text-gray-500 text-sm">Logo Placeholder</span>
                </div>
              )}
            </div>
          )}

          {element.type === 'progress' && (
            <div
              className="w-full h-full flex flex-col justify-center"
              style={{
                backgroundColor: element.properties.backgroundColor || 'transparent',
                padding: element.properties.padding || '8px',
              }}
            >
              {element.properties.showLabel && (
                <div className="text-sm mb-2 text-center">
                  {element.properties.progress || 75}%
                </div>
              )}
              <div
                className="w-full rounded"
                style={{
                  height: element.properties.height || '8px',
                  backgroundColor: element.properties.backgroundColor || '#e5e7eb',
                  borderRadius: element.properties.borderRadius || '4px',
                }}
              >
                <div
                  className="h-full rounded"
                  style={{
                    width: `${element.properties.progress || 75}%`,
                    backgroundColor: element.properties.fillColor || '#3b82f6',
                    borderRadius: element.properties.borderRadius || '4px',
                  }}
                />
              </div>
            </div>
          )}

          {/* Selection handles */}
          {isSelected && (
            <>
              {/* Corner resize handles */}
              <div 
                className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 border border-white cursor-nw-resize rounded-sm"
                onMouseDown={(e) => handleResizeMouseDown(element, 'nw', e)}
              />
              <div 
                className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 border border-white cursor-ne-resize rounded-sm"
                onMouseDown={(e) => handleResizeMouseDown(element, 'ne', e)}
              />
              <div 
                className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 border border-white cursor-sw-resize rounded-sm"
                onMouseDown={(e) => handleResizeMouseDown(element, 'sw', e)}
              />
              <div 
                className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 border border-white cursor-se-resize rounded-sm"
                onMouseDown={(e) => handleResizeMouseDown(element, 'se', e)}
              />
              
              {/* Edge resize handles */}
              <div 
                className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-2 bg-blue-500 border border-white cursor-n-resize rounded-sm"
                onMouseDown={(e) => handleResizeMouseDown(element, 'n', e)}
              />
              <div 
                className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-2 bg-blue-500 border border-white cursor-s-resize rounded-sm"
                onMouseDown={(e) => handleResizeMouseDown(element, 's', e)}
              />
              <div 
                className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-2 h-3 bg-blue-500 border border-white cursor-w-resize rounded-sm"
                onMouseDown={(e) => handleResizeMouseDown(element, 'w', e)}
              />
              <div 
                className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-3 bg-blue-500 border border-white cursor-e-resize rounded-sm"
                onMouseDown={(e) => handleResizeMouseDown(element, 'e', e)}
              />
              
              {/* Element info tooltip */}
              <div className="absolute -top-8 left-0 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                {element.type} ({Math.round(element.size.width)}×{Math.round(element.size.height)})
              </div>
              
              {/* Delete button */}
              <button
                className="absolute -top-8 -right-8 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveElement(element.id);
                }}
                title="Delete element"
              >
                ×
              </button>
              
              {/* Duplicate button */}
              <button
                className="absolute -top-8 -right-16 w-6 h-6 bg-green-500 text-white rounded-full text-xs hover:bg-green-600 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  const duplicatedElement: TemplateElement = {
                    ...element,
                    id: `${element.type}_${Date.now()}`,
                    position: {
                      x: element.position.x + 20,
                      y: element.position.y + 20
                    }
                  };
                  onAddElement(duplicatedElement);
                }}
                title="Duplicate element"
              >
                ⧉
              </button>
            </>
          )}
        </div>
      );
    });
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div
        ref={canvasRef}
        className={`relative w-full h-full bg-white ${
          isDropZoneActive ? 'bg-blue-50 border-2 border-blue-300 border-dashed' : ''
        } ${isDragging ? 'cursor-grabbing' : 'cursor-default'}`}
        onClick={handleCanvasClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: 'top left',
          backgroundImage: template?.canvas?.background?.type === 'image' 
            ? `url(${template.canvas.background.value})` 
            : undefined,
          backgroundColor: template?.canvas?.background?.type === 'color' 
            ? template.canvas.background.value 
            : '#ffffff',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          width: template?.canvas?.width || '100%',
          height: template?.canvas?.height || '100%',
        }}
      >
        {/* Grid overlay */}
        {renderGrid()}
        
        {/* Alignment guides */}
        {renderAlignmentGuides()}
        
        {/* Template elements */}
        {renderElements()}
        
        {/* Drop zone indicator */}
        {isDropZoneActive && (
          <div className="absolute inset-0 border-2 border-dashed border-blue-400 bg-blue-50 bg-opacity-50 pointer-events-none flex items-center justify-center">
            <span className="text-blue-600 font-medium">Drop element here</span>
          </div>
        )}
        
        {/* Multi-selection indicator */}
        {multiSelectMode && selectedElements.length > 0 && (
          <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded text-sm">
            {selectedElements.length} elements selected
          </div>
        )}
        
        {/* Canvas info */}
        <div className="absolute bottom-4 right-4 bg-gray-800 text-white px-3 py-1 rounded text-sm opacity-75">
          {template?.canvas?.width || 1200} × {template?.canvas?.height || 800} | Zoom: {Math.round(zoom * 100)}%
        </div>
      </div>
    </div>
  );
};

export default DragDropCanvas;