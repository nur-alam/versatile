import React, { useState, useCallback, useEffect } from 'react';
import { Settings, Type, Palette, Layout, Eye, Trash2, ChevronDown, ChevronRight, Sliders } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Separator } from '../../../components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Slider } from '../../../components/ui/slider';
import { Switch } from '../../../components/ui/switch';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../../components/ui/collapsible';
import { TemplateElement, PropertyControl } from '../types';

interface PropertyPanelProps {
  selectedElement: TemplateElement | null;
  onUpdateElement: (elementId: string, updates: Partial<TemplateElement>) => void;
  onDeleteElement?: (elementId: string) => void;
}

const PropertyPanel: React.FC<PropertyPanelProps> = ({
  selectedElement,
  onUpdateElement,
  onDeleteElement
}) => {
  const [activeTab, setActiveTab] = useState('content');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    typography: true,
    spacing: true,
    background: true,
    border: true,
    effects: false
  });

  // Real-time preview updates with debouncing
  const [previewValues, setPreviewValues] = useState<Record<string, any>>({});

  useEffect(() => {
    if (selectedElement) {
      setPreviewValues(selectedElement.properties);
    }
  }, [selectedElement]);

  const updateProperty = useCallback((property: string, value: any, immediate = false) => {
    if (!selectedElement) return;
    
    if (immediate) {
      onUpdateElement(selectedElement.id, {
        properties: {
          ...selectedElement.properties,
          [property]: value
        }
      });
    } else {
      // Update preview immediately
      setPreviewValues(prev => ({ ...prev, [property]: value }));
      
      // Debounced update to actual element
      const timeoutId = setTimeout(() => {
        onUpdateElement(selectedElement.id, {
          properties: {
            ...selectedElement.properties,
            [property]: value
          }
        });
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [selectedElement, onUpdateElement]);

  const updateStyle = useCallback((property: string, value: any) => {
    if (!selectedElement) return;
    
    onUpdateElement(selectedElement.id, {
      styles: {
        ...selectedElement.styles,
        [property]: value
      }
    });
  }, [selectedElement, onUpdateElement]);

  const updatePosition = useCallback((axis: 'x' | 'y', value: number) => {
    if (!selectedElement) return;
    
    onUpdateElement(selectedElement.id, {
      position: {
        ...selectedElement.position,
        [axis]: value
      }
    });
  }, [selectedElement, onUpdateElement]);

  const updateSize = useCallback((dimension: 'width' | 'height', value: number) => {
    if (!selectedElement) return;
    
    onUpdateElement(selectedElement.id, {
      size: {
        ...selectedElement.size,
        [dimension]: value
      }
    });
  }, [selectedElement, onUpdateElement]);

  const toggleSection = useCallback((section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  }, []);

  // Property control components
  const PropertySection: React.FC<{
    title: string;
    icon: React.ReactNode;
    sectionKey: string;
    children: React.ReactNode;
  }> = ({ title, icon, sectionKey, children }) => (
    <Collapsible
      open={expandedSections[sectionKey]}
      onOpenChange={() => toggleSection(sectionKey)}
    >
      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2">
          {icon}
          <span className="font-medium text-sm">{title}</span>
        </div>
        {expandedSections[sectionKey] ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent className="px-3 pb-3">
        <div className="space-y-3">
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );

  const ColorInput: React.FC<{
    label: string;
    value: string;
    onChange: (value: string) => void;
    property: string;
  }> = ({ label, value, onChange, property }) => (
    <div>
      <Label htmlFor={property} className="text-xs font-medium">{label}</Label>
      <div className="flex space-x-2 mt-1">
        <Input
          id={property}
          type="color"
          value={value || '#000000'}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-8 p-1 border rounded"
        />
        <Input
          value={value || '#000000'}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="flex-1 text-xs"
        />
      </div>
    </div>
  );

  const NumberInput: React.FC<{
    label: string;
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
  }> = ({ label, value, onChange, min, max, step = 1, unit = 'px' }) => (
    <div>
      <Label className="text-xs font-medium">{label}</Label>
      <div className="flex items-center space-x-2 mt-1">
        <Input
          type="number"
          value={value || 0}
          onChange={(e) => onChange(parseInt(e.target.value) || 0)}
          min={min}
          max={max}
          step={step}
          className="flex-1 text-xs"
        />
        {unit && <span className="text-xs text-gray-500">{unit}</span>}
      </div>
    </div>
  );

  const SliderInput: React.FC<{
    label: string;
    value: number;
    onChange: (value: number) => void;
    min: number;
    max: number;
    step?: number;
    unit?: string;
  }> = ({ label, value, onChange, min, max, step = 1, unit = '' }) => (
    <div>
      <div className="flex items-center justify-between mb-2">
        <Label className="text-xs font-medium">{label}</Label>
        <span className="text-xs text-gray-500">{value}{unit}</span>
      </div>
      <Slider
        value={[value || min]}
        onValueChange={([newValue]) => onChange(newValue)}
        min={min}
        max={max}
        step={step}
        className="w-full"
      />
    </div>
  );

  const SelectInput: React.FC<{
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: Array<{ label: string; value: string }>;
  }> = ({ label, value, onChange, options }) => (
    <div>
      <Label className="text-xs font-medium">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="mt-1">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  const SwitchInput: React.FC<{
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
  }> = ({ label, checked, onChange }) => (
    <div className="flex items-center justify-between">
      <Label className="text-xs font-medium">{label}</Label>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );

  if (!selectedElement) {
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Properties</h2>
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <Settings className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-sm">
              Select an element to edit its properties
            </p>
          </div>
        </div>
      </div>
    );
  }

  const renderContentTab = () => {
    const currentValue = (key: string) => previewValues[key] ?? selectedElement.properties[key];

    switch (selectedElement.type) {
      case 'text':
      case 'heading':
      case 'paragraph':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="content" className="text-sm font-medium">Content</Label>
              <Textarea
                id="content"
                value={currentValue('content') || ''}
                onChange={(e) => updateProperty('content', e.target.value)}
                placeholder="Enter text content..."
                rows={3}
                className="mt-1"
              />
            </div>
            
            <PropertySection title="Typography" icon={<Type className="h-4 w-4" />} sectionKey="typography">
              <div className="grid grid-cols-2 gap-3">
                <NumberInput
                  label="Font Size"
                  value={parseInt(currentValue('fontSize')) || 16}
                  onChange={(value) => updateProperty('fontSize', `${value}px`)}
                  min={8}
                  max={72}
                  unit="px"
                />
                <SelectInput
                  label="Font Weight"
                  value={currentValue('fontWeight') || 'normal'}
                  onChange={(value) => updateProperty('fontWeight', value)}
                  options={[
                    { label: 'Light', value: '300' },
                    { label: 'Normal', value: 'normal' },
                    { label: 'Medium', value: '500' },
                    { label: 'Semi Bold', value: '600' },
                    { label: 'Bold', value: 'bold' },
                    { label: 'Extra Bold', value: '800' }
                  ]}
                />
              </div>

              <SelectInput
                label="Font Family"
                value={currentValue('fontFamily') || 'Arial'}
                onChange={(value) => updateProperty('fontFamily', value)}
                options={[
                  { label: 'Arial', value: 'Arial, sans-serif' },
                  { label: 'Helvetica', value: 'Helvetica, sans-serif' },
                  { label: 'Times New Roman', value: 'Times New Roman, serif' },
                  { label: 'Georgia', value: 'Georgia, serif' },
                  { label: 'Verdana', value: 'Verdana, sans-serif' },
                  { label: 'Courier New', value: 'Courier New, monospace' },
                  { label: 'Inter', value: 'Inter, sans-serif' },
                  { label: 'Roboto', value: 'Roboto, sans-serif' },
                  { label: 'Open Sans', value: 'Open Sans, sans-serif' }
                ]}
              />

              <div className="grid grid-cols-2 gap-3">
                <SelectInput
                  label="Text Align"
                  value={currentValue('textAlign') || 'left'}
                  onChange={(value) => updateProperty('textAlign', value)}
                  options={[
                    { label: 'Left', value: 'left' },
                    { label: 'Center', value: 'center' },
                    { label: 'Right', value: 'right' },
                    { label: 'Justify', value: 'justify' }
                  ]}
                />
                <NumberInput
                  label="Line Height"
                  value={parseFloat(currentValue('lineHeight')) || 1.5}
                  onChange={(value) => updateProperty('lineHeight', value)}
                  min={0.8}
                  max={3}
                  step={0.1}
                  unit=""
                />
              </div>

              <SliderInput
                label="Letter Spacing"
                value={parseFloat(currentValue('letterSpacing')) || 0}
                onChange={(value) => updateProperty('letterSpacing', `${value}px`)}
                min={-2}
                max={10}
                step={0.1}
                unit="px"
              />
            </PropertySection>
          </div>
        );

      case 'image':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="src" className="text-sm font-medium">Image URL</Label>
              <Input
                id="src"
                value={currentValue('src') || ''}
                onChange={(e) => updateProperty('src', e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="alt" className="text-sm font-medium">Alt Text</Label>
              <Input
                id="alt"
                value={currentValue('alt') || ''}
                onChange={(e) => updateProperty('alt', e.target.value)}
                placeholder="Image description"
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <SelectInput
                label="Object Fit"
                value={currentValue('objectFit') || 'cover'}
                onChange={(value) => updateProperty('objectFit', value)}
                options={[
                  { label: 'Cover', value: 'cover' },
                  { label: 'Contain', value: 'contain' },
                  { label: 'Fill', value: 'fill' },
                  { label: 'Scale Down', value: 'scale-down' },
                  { label: 'None', value: 'none' }
                ]}
              />
              <SelectInput
                label="Object Position"
                value={currentValue('objectPosition') || 'center'}
                onChange={(value) => updateProperty('objectPosition', value)}
                options={[
                  { label: 'Center', value: 'center' },
                  { label: 'Top', value: 'top' },
                  { label: 'Bottom', value: 'bottom' },
                  { label: 'Left', value: 'left' },
                  { label: 'Right', value: 'right' }
                ]}
              />
            </div>

            <SwitchInput
              label="Lazy Loading"
              checked={currentValue('loading') === 'lazy'}
              onChange={(checked) => updateProperty('loading', checked ? 'lazy' : 'eager')}
            />
          </div>
        );

      case 'button':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="content" className="text-sm font-medium">Button Text</Label>
              <Input
                id="content"
                value={currentValue('content') || ''}
                onChange={(e) => updateProperty('content', e.target.value)}
                placeholder="Button text"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="href" className="text-sm font-medium">Link URL</Label>
              <Input
                id="href"
                value={currentValue('href') || ''}
                onChange={(e) => updateProperty('href', e.target.value)}
                placeholder="https://example.com"
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <SelectInput
                label="Button Style"
                value={currentValue('variant') || 'primary'}
                onChange={(value) => updateProperty('variant', value)}
                options={[
                  { label: 'Primary', value: 'primary' },
                  { label: 'Secondary', value: 'secondary' },
                  { label: 'Outline', value: 'outline' },
                  { label: 'Ghost', value: 'ghost' },
                  { label: 'Link', value: 'link' }
                ]}
              />
              <SelectInput
                label="Size"
                value={currentValue('size') || 'default'}
                onChange={(value) => updateProperty('size', value)}
                options={[
                  { label: 'Small', value: 'sm' },
                  { label: 'Default', value: 'default' },
                  { label: 'Large', value: 'lg' }
                ]}
              />
            </div>

            <SwitchInput
              label="Open in New Tab"
              checked={currentValue('target') === '_blank'}
              onChange={(checked) => updateProperty('target', checked ? '_blank' : '_self')}
            />
          </div>
        );

      case 'countdown':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="targetDate" className="text-sm font-medium">Target Date</Label>
              <Input
                id="targetDate"
                type="datetime-local"
                value={currentValue('targetDate') ? 
                  new Date(currentValue('targetDate')).toISOString().slice(0, 16) : ''}
                onChange={(e) => updateProperty('targetDate', new Date(e.target.value).toISOString())}
                className="mt-1"
              />
            </div>
            
            <SelectInput
              label="Display Format"
              value={currentValue('format') || 'days:hours:minutes:seconds'}
              onChange={(value) => updateProperty('format', value)}
              options={[
                { label: 'Days:Hours:Minutes:Seconds', value: 'days:hours:minutes:seconds' },
                { label: 'Hours:Minutes:Seconds', value: 'hours:minutes:seconds' },
                { label: 'Minutes:Seconds', value: 'minutes:seconds' },
                { label: 'Days Only', value: 'days' },
                { label: 'Hours Only', value: 'hours' }
              ]}
            />

            <div className="grid grid-cols-2 gap-3">
              <SwitchInput
                label="Show Labels"
                checked={currentValue('showLabels') !== false}
                onChange={(checked) => updateProperty('showLabels', checked)}
              />
              <SwitchInput
                label="Auto Hide When Expired"
                checked={currentValue('autoHide') === true}
                onChange={(checked) => updateProperty('autoHide', checked)}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Expired Message</Label>
              <Input
                value={currentValue('expiredMessage') || 'Time\'s up!'}
                onChange={(e) => updateProperty('expiredMessage', e.target.value)}
                placeholder="Time's up!"
                className="mt-1"
              />
            </div>
          </div>
        );

      case 'social-links':
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Social Links</Label>
              <div className="space-y-2 mt-2">
                {['facebook', 'twitter', 'instagram', 'linkedin', 'youtube'].map((platform) => (
                  <div key={platform} className="flex items-center space-x-2">
                    <Label className="w-20 text-xs capitalize">{platform}</Label>
                    <Input
                      value={currentValue(`${platform}Url`) || ''}
                      onChange={(e) => updateProperty(`${platform}Url`, e.target.value)}
                      placeholder={`https://${platform}.com/username`}
                      className="flex-1 text-xs"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <SelectInput
                label="Icon Style"
                value={currentValue('iconStyle') || 'filled'}
                onChange={(value) => updateProperty('iconStyle', value)}
                options={[
                  { label: 'Filled', value: 'filled' },
                  { label: 'Outline', value: 'outline' },
                  { label: 'Rounded', value: 'rounded' }
                ]}
              />
              <NumberInput
                label="Icon Size"
                value={parseInt(currentValue('iconSize')) || 24}
                onChange={(value) => updateProperty('iconSize', `${value}px`)}
                min={16}
                max={64}
                unit="px"
              />
            </div>

            <SwitchInput
              label="Open in New Tab"
              checked={currentValue('openInNewTab') !== false}
              onChange={(checked) => updateProperty('openInNewTab', checked)}
            />
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">
              No content properties available for this element type.
            </p>
          </div>
        );
    }
  };

  const renderStyleTab = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="color">Text Color</Label>
          <div className="flex space-x-2">
            <Input
              id="color"
              type="color"
              value={selectedElement.properties.color || '#000000'}
              onChange={(e) => updateProperty('color', e.target.value)}
              className="w-12 h-8 p-1"
            />
            <Input
              value={selectedElement.properties.color || '#000000'}
              onChange={(e) => updateProperty('color', e.target.value)}
              placeholder="#000000"
              className="flex-1"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="backgroundColor">Background</Label>
          <div className="flex space-x-2">
            <Input
              id="backgroundColor"
              type="color"
              value={selectedElement.properties.backgroundColor || '#ffffff'}
              onChange={(e) => updateProperty('backgroundColor', e.target.value)}
              className="w-12 h-8 p-1"
            />
            <Input
              value={selectedElement.properties.backgroundColor || '#ffffff'}
              onChange={(e) => updateProperty('backgroundColor', e.target.value)}
              placeholder="#ffffff"
              className="flex-1"
            />
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="border">Border</Label>
        <Input
          id="border"
          value={selectedElement.properties.border || 'none'}
          onChange={(e) => updateProperty('border', e.target.value)}
          placeholder="1px solid #000000"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="borderRadius">Border Radius</Label>
          <Input
            id="borderRadius"
            value={selectedElement.properties.borderRadius || '0px'}
            onChange={(e) => updateProperty('borderRadius', e.target.value)}
            placeholder="0px"
          />
        </div>
        
        <div>
          <Label htmlFor="padding">Padding</Label>
          <Input
            id="padding"
            value={selectedElement.properties.padding || '0px'}
            onChange={(e) => updateProperty('padding', e.target.value)}
            placeholder="8px"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="boxShadow">Box Shadow</Label>
        <Input
          id="boxShadow"
          value={selectedElement.properties.boxShadow || 'none'}
          onChange={(e) => updateProperty('boxShadow', e.target.value)}
          placeholder="0 2px 4px rgba(0,0,0,0.1)"
        />
      </div>
    </div>
  );

  const renderLayoutTab = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="x">X Position</Label>
          <Input
            id="x"
            type="number"
            value={selectedElement.position.x}
            onChange={(e) => updatePosition('x', parseInt(e.target.value) || 0)}
          />
        </div>
        
        <div>
          <Label htmlFor="y">Y Position</Label>
          <Input
            id="y"
            type="number"
            value={selectedElement.position.y}
            onChange={(e) => updatePosition('y', parseInt(e.target.value) || 0)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="width">Width</Label>
          <Input
            id="width"
            type="number"
            value={selectedElement.size.width}
            onChange={(e) => updateSize('width', parseInt(e.target.value) || 0)}
          />
        </div>
        
        <div>
          <Label htmlFor="height">Height</Label>
          <Input
            id="height"
            type="number"
            value={selectedElement.size.height}
            onChange={(e) => updateSize('height', parseInt(e.target.value) || 0)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="zIndex">Z-Index</Label>
        <Input
          id="zIndex"
          type="number"
          value={selectedElement.properties.zIndex || 1}
          onChange={(e) => updateProperty('zIndex', parseInt(e.target.value) || 1)}
        />
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-900">Properties</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              // This would be handled by the parent component
              console.log('Delete element:', selectedElement.id);
            }}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-gray-600 capitalize">
          {selectedElement.type} Element
        </p>
      </div>

      {/* Properties Tabs */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 mx-4 mt-4">
            <TabsTrigger value="content" className="text-xs">
              <Type className="h-3 w-3 mr-1" />
              Content
            </TabsTrigger>
            <TabsTrigger value="style" className="text-xs">
              <Palette className="h-3 w-3 mr-1" />
              Style
            </TabsTrigger>
            <TabsTrigger value="layout" className="text-xs">
              <Layout className="h-3 w-3 mr-1" />
              Layout
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto p-4">
            <TabsContent value="content" className="mt-0">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Content Properties</CardTitle>
                </CardHeader>
                <CardContent>
                  {renderContentTab()}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="style" className="mt-0">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Style Properties</CardTitle>
                </CardHeader>
                <CardContent>
                  {renderStyleTab()}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="layout" className="mt-0">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Layout Properties</CardTitle>
                </CardHeader>
                <CardContent>
                  {renderLayoutTab()}
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Element Info */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-600 space-y-1">
          <div>ID: {selectedElement.id}</div>
          <div>Type: {selectedElement.type}</div>
          <div>
            Size: {selectedElement.size.width} × {selectedElement.size.height}
          </div>
          <div>
            Position: ({selectedElement.position.x}, {selectedElement.position.y})
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyPanel;