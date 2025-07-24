import React, { useState, useCallback } from 'react';
import { Plus, Trash2, Move } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Slider } from '../../../components/ui/slider';

interface GradientStop {
  id: string;
  color: string;
  position: number;
}

interface GradientEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const GradientEditor: React.FC<GradientEditorProps> = ({ value, onChange }) => {
  const [gradientType, setGradientType] = useState<'linear' | 'radial'>('linear');
  const [angle, setAngle] = useState(90);
  const [stops, setStops] = useState<GradientStop[]>([
    { id: '1', color: '#ff0000', position: 0 },
    { id: '2', color: '#0000ff', position: 100 }
  ]);

  // Parse existing gradient value
  React.useEffect(() => {
    if (value && value.includes('gradient')) {
      try {
        // Simple parsing for linear gradients
        if (value.includes('linear-gradient')) {
          setGradientType('linear');
          const angleMatch = value.match(/(\d+)deg/);
          if (angleMatch) {
            setAngle(parseInt(angleMatch[1]));
          }
        } else if (value.includes('radial-gradient')) {
          setGradientType('radial');
        }

        // Extract color stops (simplified)
        const colorMatches = value.match(/#[0-9a-fA-F]{6}|rgb\([^)]+\)|rgba\([^)]+\)/g);
        if (colorMatches && colorMatches.length >= 2) {
          const newStops = colorMatches.slice(0, 4).map((color, index) => ({
            id: (index + 1).toString(),
            color,
            position: (index / (colorMatches.length - 1)) * 100
          }));
          setStops(newStops);
        }
      } catch (error) {
        console.warn('Failed to parse gradient:', error);
      }
    }
  }, [value]);

  const generateGradientCSS = useCallback(() => {
    const sortedStops = [...stops].sort((a, b) => a.position - b.position);
    const stopStrings = sortedStops.map(stop => `${stop.color} ${stop.position}%`);
    
    if (gradientType === 'linear') {
      return `linear-gradient(${angle}deg, ${stopStrings.join(', ')})`;
    } else {
      return `radial-gradient(circle, ${stopStrings.join(', ')})`;
    }
  }, [gradientType, angle, stops]);

  const updateGradient = useCallback(() => {
    const css = generateGradientCSS();
    onChange(css);
  }, [generateGradientCSS, onChange]);

  React.useEffect(() => {
    updateGradient();
  }, [updateGradient]);

  const addStop = () => {
    const newStop: GradientStop = {
      id: Date.now().toString(),
      color: '#ffffff',
      position: 50
    };
    setStops([...stops, newStop]);
  };

  const removeStop = (id: string) => {
    if (stops.length > 2) {
      setStops(stops.filter(stop => stop.id !== id));
    }
  };

  const updateStop = (id: string, updates: Partial<GradientStop>) => {
    setStops(stops.map(stop => 
      stop.id === id ? { ...stop, ...updates } : stop
    ));
  };

  return (
    <div className="space-y-4">
      {/* Gradient Type */}
      <div>
        <Label className="text-xs font-medium">Gradient Type</Label>
        <Select value={gradientType} onValueChange={(value: 'linear' | 'radial') => setGradientType(value)}>
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="linear">Linear</SelectItem>
            <SelectItem value="radial">Radial</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Angle (for linear gradients) */}
      {gradientType === 'linear' && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-xs font-medium">Angle</Label>
            <span className="text-xs text-gray-500">{angle}°</span>
          </div>
          <Slider
            value={[angle]}
            onValueChange={([value]) => setAngle(value)}
            min={0}
            max={360}
            step={1}
            className="w-full"
          />
        </div>
      )}

      {/* Preview */}
      <div>
        <Label className="text-xs font-medium">Preview</Label>
        <div 
          className="w-full h-12 rounded border mt-1"
          style={{ background: generateGradientCSS() }}
        />
      </div>

      {/* Color Stops */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="text-xs font-medium">Color Stops</Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={addStop}
            className="h-6 px-2 text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add
          </Button>
        </div>
        
        <div className="space-y-2">
          {stops.map((stop, index) => (
            <div key={stop.id} className="flex items-center space-x-2 p-2 border rounded">
              <div className="flex items-center space-x-2 flex-1">
                <Input
                  type="color"
                  value={stop.color}
                  onChange={(e) => updateStop(stop.id, { color: e.target.value })}
                  className="w-8 h-6 p-0 border-0"
                />
                <Input
                  value={stop.color}
                  onChange={(e) => updateStop(stop.id, { color: e.target.value })}
                  className="flex-1 text-xs"
                  placeholder="#ffffff"
                />
                <div className="flex items-center space-x-1">
                  <Input
                    type="number"
                    value={stop.position}
                    onChange={(e) => updateStop(stop.id, { position: parseInt(e.target.value) || 0 })}
                    min={0}
                    max={100}
                    className="w-16 text-xs"
                  />
                  <span className="text-xs text-gray-500">%</span>
                </div>
              </div>
              
              {stops.length > 2 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeStop(stop.id)}
                  className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CSS Output */}
      <div>
        <Label className="text-xs font-medium">CSS Output</Label>
        <Input
          value={generateGradientCSS()}
          readOnly
          className="mt-1 text-xs font-mono bg-gray-50"
        />
      </div>
    </div>
  );
};

export default GradientEditor;