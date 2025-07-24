import React, { useCallback, useEffect } from 'react';
import { DndContext, DragEndEvent, DragStartEvent, DragOverlay, closestCenter } from '@dnd-kit/core';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Save, Undo, Redo, Eye, Grid, Layers } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Separator } from '../../components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip';
import DragDropCanvas from './components/DragDropCanvas';
import ElementPalette from './components/ElementPalette';
import PropertyPanel from './components/PropertyPanel';
import { useTemplateDesigner } from './hooks/useTemplateDesigner';
import { TemplateElement } from './types';

interface TemplateDesignerProps {
  templateId?: string;
  mode?: 'maintenance' | 'comingsoon';
}

const TemplateDesigner: React.FC<TemplateDesignerProps> = ({ 
  templateId, 
  mode = 'maintenance' 
}) => {
  const {
    template,
    selectedElement,
    draggedElement,
    canUndo,
    canRedo,
    isGridVisible,
    isLayersVisible,
    zoom,
    saveTemplate,
    undo,
    redo,
    toggleGrid,
    toggleLayers,
    setZoom,
    selectElement,
    updateElement,
    addElement,
    removeElement,
    setDraggedElement,
    previewTemplate
  } = useTemplateDesigner(templateId, mode);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + S for save
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        saveTemplate();
      }
      
      // Ctrl/Cmd + Z for undo
      if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
        event.preventDefault();
        if (canUndo) undo();
      }
      
      // Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y for redo
      if (((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'Z') ||
          ((event.ctrlKey || event.metaKey) && event.key === 'y')) {
        event.preventDefault();
        if (canRedo) redo();
      }
      
      // Delete key for removing selected element
      if (event.key === 'Delete' && selectedElement) {
        event.preventDefault();
        removeElement(selectedElement.id);
      }
      
      // Escape key to deselect
      if (event.key === 'Escape') {
        event.preventDefault();
        selectElement(null);
      }
      
      // Ctrl/Cmd + G for grid toggle
      if ((event.ctrlKey || event.metaKey) && event.key === 'g') {
        event.preventDefault();
        toggleGrid();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [canUndo, canRedo, selectedElement, saveTemplate, undo, redo, removeElement, selectElement, toggleGrid]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    setDraggedElement(active.data.current as TemplateElement);
  }, [setDraggedElement]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && over.id === 'canvas') {
      const elementData = active.data.current as TemplateElement;
      
      // Calculate position relative to canvas
      const position = {
        x: event.delta.x,
        y: event.delta.y
      };
      
      addElement({
        ...elementData,
        position,
        id: `element_${Date.now()}`
      });
    }
    
    setDraggedElement(null);
  }, [addElement, setDraggedElement]);

  return (
    <TooltipProvider>
      <div className="h-screen flex flex-col bg-gray-50">
        {/* Header Toolbar */}
        <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-lg font-semibold text-gray-900">
              Template Designer
            </h1>
            <Separator orientation="vertical" className="h-6" />
            <span className="text-sm text-gray-500 capitalize">
              {mode} Mode
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Undo/Redo */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={undo}
                  disabled={!canUndo}
                  aria-label="Undo (Ctrl+Z)"
                >
                  <Undo className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={redo}
                  disabled={!canRedo}
                  aria-label="Redo (Ctrl+Shift+Z)"
                >
                  <Redo className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Redo (Ctrl+Shift+Z)</TooltipContent>
            </Tooltip>
            
            <Separator orientation="vertical" className="h-6" />
            
            {/* View Options */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isGridVisible ? "default" : "ghost"}
                  size="sm"
                  onClick={toggleGrid}
                  aria-label="Toggle Grid (Ctrl+G)"
                >
                  <Grid className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Toggle Grid (Ctrl+G)</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isLayersVisible ? "default" : "ghost"}
                  size="sm"
                  onClick={toggleLayers}
                  aria-label="Toggle Layers Panel"
                >
                  <Layers className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Toggle Layers Panel</TooltipContent>
            </Tooltip>
            
            <Separator orientation="vertical" className="h-6" />
            
            {/* Actions */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={previewTemplate}
                  aria-label="Preview Template"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Preview Template</TooltipContent>
            </Tooltip>
            
            <Button
              size="sm"
              onClick={saveTemplate}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Template
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <DndContext
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <PanelGroup direction="horizontal">
              {/* Element Palette */}
              <Panel defaultSize={20} minSize={15} maxSize={30}>
                <Card className="h-full rounded-none border-0 border-r">
                  <ElementPalette />
                </Card>
              </Panel>
              
              <PanelResizeHandle className="w-1 bg-gray-200 hover:bg-gray-300 transition-colors" />
              
              {/* Canvas Area */}
              <Panel defaultSize={60} minSize={40}>
                <div className="h-full bg-gray-100 relative">
                  <DragDropCanvas
                    template={template}
                    selectedElement={selectedElement}
                    isGridVisible={isGridVisible}
                    zoom={zoom}
                    onSelectElement={selectElement}
                    onUpdateElement={updateElement}
                    onRemoveElement={removeElement}
                    onAddElement={addElement}
                  />
                </div>
              </Panel>
              
              <PanelResizeHandle className="w-1 bg-gray-200 hover:bg-gray-300 transition-colors" />
              
              {/* Property Panel */}
              <Panel defaultSize={20} minSize={15} maxSize={30}>
                <Card className="h-full rounded-none border-0 border-l">
                  <PropertyPanel
                    selectedElement={selectedElement}
                    onUpdateElement={updateElement}
                  />
                </Card>
              </Panel>
            </PanelGroup>
            
            {/* Drag Overlay */}
            <DragOverlay>
              {draggedElement ? (
                <div className="bg-white border border-gray-300 rounded p-2 shadow-lg opacity-80">
                  {draggedElement.type}
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default TemplateDesigner;