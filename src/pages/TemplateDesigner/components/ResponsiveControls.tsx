import React, { useState, useCallback } from 'react';
import { Monitor, Tablet, Smartphone, Eye, EyeOff, Copy, Trash2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Switch } from '../../../components/ui/switch';
import { Slider } from '../../../components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { ResponsiveBreakpoint } from '../types';

interface ResponsiveProperty {
  property: string;
  desktop?: any;
  tablet?: any;
  mobile?: any;
}

interface ResponsiveControlsProps {
  properties: Record<string, any>;
  responsiveProperties: Record<string, ResponsiveProperty>;
  onUpdateProperty: (property: string, value: any, breakpoint?: string) => void;
  onUpdateResponsiveProperty: (property: string, breakpoint: string, value: any) => void;
}

const BREAKPOINTS: ResponsiveBreakpoint[] = [
  { name: 'desktop', width: 1200, icon: Monitor },
  { name: 'tablet', width: 768, icon: Tablet },
  { name: 'mobile', width: 480, icon: Smartphone }
];

const RESPONSIVE_PROPERTIES = [
  {
    category: 'Typography',
    properties: [
      { key: 'fontSize', label: 'Font Size', type: 'number', unit: 'px', min: 8, max: 72 },
      { key: 'lineHeight', label: 'Line Height', type: 'number', min: 0.8, max: 3, step: 0.1 },
      { key: 'letterSpacing', label: 'Letter Spacing', type: 'number', unit: 'px', min: -2, max: 10, step: 0.1 }
    ]
  },
  {
    category: 'Layout',
    properties: [
      { key: 'width', label: 'Width', type: 'number', unit: 'px', min: 0, max: 2000 },
      { key: 'height', label: 'Height', type: 'number', unit: 'px', min: 0, max: 2000 },
      { key: 'padding', label: 'Padding', type: 'number', unit: 'px', min: 0, max: 100 },
      { key: 'margin', label: 'Margin', type: 'number', unit: 'px', min: 0, max: 100 }
    ]
  },
  {
    category: 'Position',
    properties: [
      { key: 'position', label: 'Position', type: 'select', options: [
        { label: 'Static', value: 'static' },
        { label: 'Relative', value: 'relative' },
        { label: 'Absolute', value: 'absolute' },
        { label: 'Fixed', value: 'fixed' }
      ]},
      { key: 'display', label: 'Display', type: 'select', options: [
        { label: 'Block', value: 'block' },
        { label: 'Inline', value: 'inline' },
        { label: 'Inline Block', value: 'inline-block' },
        { label: 'Flex', value: 'flex' },
        { label: 'Grid', value: 'grid' },
        { label: 'None', value: 'none' }
      ]}
    ]
  },
  {
    category: 'Visibility',
    properties: [
      { key: 'visible', label: 'Visible', type: 'boolean' },
      { key: 'opacity', label: 'Opacity', type: 'slider', min: 0, max: 1, step: 0.1 }
    ]
  }
];

const ResponsiveControls: React.FC<ResponsiveControlsProps> = ({
  properties,
  responsiveProperties,
  onUpdateProperty,
  onUpdateResponsiveProperty
}) => {
  const [activeBreakpoint, setActiveBreakpoint] = useState<string>('desktop');
  const [showInheritedValues, setShowInheritedValues] = useState(true);

  const getCurrentValue = useCallback((property: string, breakpoint: string) => {
    const responsiveProp = responsiveProperties[property];
    if (responsiveProp && responsiveProp[breakpoint as keyof ResponsiveProperty] !== undefined) {
      return responsiveProp[breakpoint as keyof ResponsiveProperty];
    }
    
    // Fall back to base property value
    return properties[property];
  }, [properties, responsiveProperties]);

  const getInheritedValue = useCallback((property: string, breakpoint: string) => {
    const responsiveProp = responsiveProperties[property];
    if (!responsiveProp) return properties[property];

    // Check inheritance chain: mobile -> tablet -> desktop -> base
    switch (breakpoint) {
      case 'mobile':
        return responsiveProp.tablet ?? responsiveProp.desktop ?? properties[property];
      case 'tablet':
        return responsiveProp.desktop ?? properties[property];
      case 'desktop':
        return properties[property];
      default:
        return properties[property];
    }
  }, [properties, responsiveProperties]);

  const hasResponsiveOverride = useCallback((property: string, breakpoint: string) => {
    const responsiveProp = responsiveProperties[property];
    return responsiveProp && responsiveProp[breakpoint as keyof ResponsiveProperty] !== undefined;
  }, [responsiveProperties]);

  const copyFromBreakpoint = useCallback((fromBreakpoint: string, toBreakpoint: string) => {
    RESPONSIVE_PROPERTIES.forEach(category => {
      category.properties.forEach(prop => {
        const value = getCurrentValue(prop.key, fromBreakpoint);
        if (value !== undefined) {
          onUpdateResponsiveProperty(prop.key, toBreakpoint, value);
        }
      });
    });
  }, [getCurrentValue, onUpdateResponsiveProperty]);

  const clearBreakpointOverrides = useCallback((breakpoint: string) => {
    RESPONSIVE_PROPERTIES.forEach(category => {
      category.properties.forEach(prop => {
        if (hasResponsiveOverride(prop.key, breakpoint)) {
          onUpdateResponsiveProperty(prop.key, breakpoint, undefined);
        }
      });
    });
  }, [hasResponsiveOverride, onUpdateResponsiveProperty]);

  const renderPropertyControl = useCallback((prop: any, breakpoint: string) => {
    const currentValue = getCurrentValue(prop.key, breakpoint);
    const inheritedValue = getInheritedValue(prop.key, breakpoint);
    const hasOverride = hasResponsiveOverride(prop.key, breakpoint);
    const isInherited = !hasOverride && showInheritedValues;

    const updateValue = (value: any) => {
      if (breakpoint === 'desktop') {
        onUpdateProperty(prop.key, value);
      } else {
        onUpdateResponsiveProperty(prop.key, breakpoint, value);
      }
    };

    const clearOverride = () => {
      onUpdateResponsiveProperty(prop.key, breakpoint, undefined);
    };

    switch (prop.type) {
      case 'number':
        return (
          <div key={prop.key} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">{prop.label}</Label>
              <div className="flex items-center space-x-1">
                {isInherited && (
                  <span className="text-xs text-gray-400">inherited</span>
                )}
                {hasOverride && breakpoint !== 'desktop' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearOverride}
                    className="h-4 w-4 p-0 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                value={currentValue || inheritedValue || 0}
                onChange={(e) => updateValue(parseInt(e.target.value) || 0)}
                min={prop.min}
                max={prop.max}
                step={prop.step || 1}
                className={`flex-1 text-xs ${isInherited ? 'bg-gray-50 text-gray-600' : ''}`}
                disabled={isInherited}
              />
              {prop.unit && <span className="text-xs text-gray-500">{prop.unit}</span>}
            </div>
          </div>
        );

      case 'select':
        return (
          <div key={prop.key} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">{prop.label}</Label>
              <div className="flex items-center space-x-1">
                {isInherited && (
                  <span className="text-xs text-gray-400">inherited</span>
                )}
                {hasOverride && breakpoint !== 'desktop' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearOverride}
                    className="h-4 w-4 p-0 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
            <Select 
              value={currentValue || inheritedValue || prop.options[0]?.value} 
              onValueChange={updateValue}
              disabled={isInherited}
            >
              <SelectTrigger className={`text-xs ${isInherited ? 'bg-gray-50 text-gray-600' : ''}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {prop.options.map((option: any) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 'boolean':
        return (
          <div key={prop.key} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">{prop.label}</Label>
              <div className="flex items-center space-x-2">
                {isInherited && (
                  <span className="text-xs text-gray-400">inherited</span>
                )}
                <Switch
                  checked={currentValue ?? inheritedValue ?? true}
                  onCheckedChange={updateValue}
                  disabled={isInherited}
                />
                {hasOverride && breakpoint !== 'desktop' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearOverride}
                    className="h-4 w-4 p-0 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        );

      case 'slider':
        return (
          <div key={prop.key} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">{prop.label}</Label>
              <div className="flex items-center space-x-1">
                <span className="text-xs text-gray-500">
                  {currentValue ?? inheritedValue ?? prop.min}
                </span>
                {isInherited && (
                  <span className="text-xs text-gray-400">inherited</span>
                )}
                {hasOverride && breakpoint !== 'desktop' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearOverride}
                    className="h-4 w-4 p-0 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
            <Slider
              value={[currentValue ?? inheritedValue ?? prop.min]}
              onValueChange={([value]) => updateValue(value)}
              min={prop.min}
              max={prop.max}
              step={prop.step || 0.1}
              className={`w-full ${isInherited ? 'opacity-50' : ''}`}
              disabled={isInherited}
            />
          </div>
        );

      default:
        return null;
    }
  }, [getCurrentValue, getInheritedValue, hasResponsiveOverride, showInheritedValues, onUpdateProperty, onUpdateResponsiveProperty]);

  return (
    <div className="space-y-4">
      {/* Breakpoint Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          {BREAKPOINTS.map((breakpoint) => {
            const Icon = breakpoint.icon;
            return (
              <Button
                key={breakpoint.name}
                variant={activeBreakpoint === breakpoint.name ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveBreakpoint(breakpoint.name)}
                className="h-8 px-2"
              >
                <Icon className="h-4 w-4" />
                <span className="ml-1 text-xs capitalize">{breakpoint.name}</span>
              </Button>
            );
          })}
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            checked={showInheritedValues}
            onCheckedChange={setShowInheritedValues}
          />
          <Label className="text-xs">Show inherited</Label>
        </div>
      </div>

      {/* Breakpoint Info */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center justify-between">
            <span>
              {BREAKPOINTS.find(b => b.name === activeBreakpoint)?.name.charAt(0).toUpperCase() + 
               BREAKPOINTS.find(b => b.name === activeBreakpoint)?.name.slice(1)} Breakpoint
            </span>
            <span className="text-xs text-gray-500">
              {activeBreakpoint === 'desktop' ? '≥1200px' : 
               activeBreakpoint === 'tablet' ? '768px - 1199px' : 
               '≤767px'}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center space-x-2">
            {activeBreakpoint !== 'desktop' && (
              <>
                <Select
                  onValueChange={(fromBreakpoint) => copyFromBreakpoint(fromBreakpoint, activeBreakpoint)}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Copy from..." />
                  </SelectTrigger>
                  <SelectContent>
                    {BREAKPOINTS
                      .filter(b => b.name !== activeBreakpoint)
                      .map(breakpoint => (
                        <SelectItem key={breakpoint.name} value={breakpoint.name}>
                          Copy from {breakpoint.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => clearBreakpointOverrides(activeBreakpoint)}
                  className="text-xs"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Clear
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Responsive Properties */}
      <div className="space-y-4">
        {RESPONSIVE_PROPERTIES.map((category) => (
          <Card key={category.category}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">{category.category}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {category.properties.map((prop) => 
                renderPropertyControl(prop, activeBreakpoint)
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Preview Info */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Responsive Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-gray-600 space-y-1">
            <p>• Desktop: Default styles and overrides</p>
            <p>• Tablet: Inherits from desktop, with optional overrides</p>
            <p>• Mobile: Inherits from tablet/desktop, with optional overrides</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResponsiveControls;