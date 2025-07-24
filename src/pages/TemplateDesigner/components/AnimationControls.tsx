import React, { useState, useCallback } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Slider } from '../../../components/ui/slider';
import { Switch } from '../../../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';

interface AnimationConfig {
  name: string;
  duration: number;
  delay: number;
  timingFunction: string;
  iterationCount: string;
  direction: string;
  fillMode: string;
  playState: string;
}

interface AnimationControlsProps {
  value: AnimationConfig;
  onChange: (value: AnimationConfig) => void;
}

const ANIMATION_PRESETS = [
  { name: 'fadeIn', keyframes: 'fadeIn', label: 'Fade In' },
  { name: 'fadeOut', keyframes: 'fadeOut', label: 'Fade Out' },
  { name: 'slideInLeft', keyframes: 'slideInLeft', label: 'Slide In Left' },
  { name: 'slideInRight', keyframes: 'slideInRight', label: 'Slide In Right' },
  { name: 'slideInUp', keyframes: 'slideInUp', label: 'Slide In Up' },
  { name: 'slideInDown', keyframes: 'slideInDown', label: 'Slide In Down' },
  { name: 'bounceIn', keyframes: 'bounceIn', label: 'Bounce In' },
  { name: 'zoomIn', keyframes: 'zoomIn', label: 'Zoom In' },
  { name: 'zoomOut', keyframes: 'zoomOut', label: 'Zoom Out' },
  { name: 'rotateIn', keyframes: 'rotateIn', label: 'Rotate In' },
  { name: 'pulse', keyframes: 'pulse', label: 'Pulse' },
  { name: 'shake', keyframes: 'shake', label: 'Shake' },
  { name: 'wobble', keyframes: 'wobble', label: 'Wobble' },
  { name: 'flip', keyframes: 'flip', label: 'Flip' },
  { name: 'heartBeat', keyframes: 'heartBeat', label: 'Heart Beat' }
];

const TIMING_FUNCTIONS = [
  { value: 'ease', label: 'Ease' },
  { value: 'ease-in', label: 'Ease In' },
  { value: 'ease-out', label: 'Ease Out' },
  { value: 'ease-in-out', label: 'Ease In Out' },
  { value: 'linear', label: 'Linear' },
  { value: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', label: 'Custom Ease' },
  { value: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)', label: 'Ease In Quad' },
  { value: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', label: 'Ease Out Quad' }
];

const FILL_MODES = [
  { value: 'none', label: 'None' },
  { value: 'forwards', label: 'Forwards' },
  { value: 'backwards', label: 'Backwards' },
  { value: 'both', label: 'Both' }
];

const DIRECTIONS = [
  { value: 'normal', label: 'Normal' },
  { value: 'reverse', label: 'Reverse' },
  { value: 'alternate', label: 'Alternate' },
  { value: 'alternate-reverse', label: 'Alternate Reverse' }
];

const AnimationControls: React.FC<AnimationControlsProps> = ({ value, onChange }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [customKeyframes, setCustomKeyframes] = useState('');

  const updateAnimation = useCallback((updates: Partial<AnimationConfig>) => {
    onChange({ ...value, ...updates });
  }, [value, onChange]);

  const generateAnimationCSS = useCallback(() => {
    if (!value.name) return 'none';
    
    return `${value.name} ${value.duration}s ${value.timingFunction} ${value.delay}s ${value.iterationCount} ${value.direction} ${value.fillMode} ${value.playState}`;
  }, [value]);

  const playAnimation = () => {
    setIsPlaying(true);
    updateAnimation({ playState: 'running' });
    
    // Auto-pause after one iteration if not infinite
    if (value.iterationCount !== 'infinite') {
      setTimeout(() => {
        setIsPlaying(false);
        updateAnimation({ playState: 'paused' });
      }, (value.duration + value.delay) * 1000);
    }
  };

  const pauseAnimation = () => {
    setIsPlaying(false);
    updateAnimation({ playState: 'paused' });
  };

  const resetAnimation = () => {
    setIsPlaying(false);
    updateAnimation({ playState: 'paused' });
    // Force re-render by briefly changing the animation name
    setTimeout(() => {
      updateAnimation({ playState: 'running' });
    }, 50);
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="presets" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="presets">Presets</TabsTrigger>
          <TabsTrigger value="custom">Custom</TabsTrigger>
        </TabsList>
        
        <TabsContent value="presets" className="space-y-4">
          {/* Animation Preset Selection */}
          <div>
            <Label className="text-xs font-medium">Animation</Label>
            <Select 
              value={value.name} 
              onValueChange={(name) => updateAnimation({ name })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select animation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {ANIMATION_PRESETS.map((preset) => (
                  <SelectItem key={preset.name} value={preset.name}>
                    {preset.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Preview */}
          {value.name && (
            <div>
              <Label className="text-xs font-medium">Preview</Label>
              <div className="flex items-center justify-center h-20 border rounded mt-1 bg-gray-50">
                <div 
                  className="w-8 h-8 bg-blue-500 rounded"
                  style={{ 
                    animation: isPlaying ? generateAnimationCSS() : 'none'
                  }}
                />
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="custom" className="space-y-4">
          {/* Custom Keyframes */}
          <div>
            <Label className="text-xs font-medium">Custom Keyframes</Label>
            <textarea
              value={customKeyframes}
              onChange={(e) => setCustomKeyframes(e.target.value)}
              placeholder="@keyframes myAnimation {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}"
              className="w-full h-32 mt-1 p-2 text-xs font-mono border rounded resize-none"
            />
          </div>
          
          <div>
            <Label className="text-xs font-medium">Animation Name</Label>
            <Input
              value={value.name}
              onChange={(e) => updateAnimation({ name: e.target.value })}
              placeholder="myAnimation"
              className="mt-1 text-xs"
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Animation Controls */}
      {value.name && (
        <>
          <div className="flex items-center justify-center space-x-2 py-2 border-t border-b">
            <Button
              variant="ghost"
              size="sm"
              onClick={playAnimation}
              disabled={isPlaying}
              className="h-8"
            >
              <Play className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={pauseAnimation}
              disabled={!isPlaying}
              className="h-8"
            >
              <Pause className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetAnimation}
              className="h-8"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          {/* Duration */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs font-medium">Duration</Label>
              <span className="text-xs text-gray-500">{value.duration}s</span>
            </div>
            <Slider
              value={[value.duration]}
              onValueChange={([duration]) => updateAnimation({ duration })}
              min={0.1}
              max={10}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Delay */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs font-medium">Delay</Label>
              <span className="text-xs text-gray-500">{value.delay}s</span>
            </div>
            <Slider
              value={[value.delay]}
              onValueChange={([delay]) => updateAnimation({ delay })}
              min={0}
              max={5}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Timing Function */}
          <div>
            <Label className="text-xs font-medium">Timing Function</Label>
            <Select 
              value={value.timingFunction} 
              onValueChange={(timingFunction) => updateAnimation({ timingFunction })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIMING_FUNCTIONS.map((func) => (
                  <SelectItem key={func.value} value={func.value}>
                    {func.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Iteration Count */}
          <div>
            <Label className="text-xs font-medium">Repeat</Label>
            <div className="flex items-center space-x-2 mt-1">
              <Select 
                value={value.iterationCount === 'infinite' ? 'infinite' : 'finite'} 
                onValueChange={(type) => updateAnimation({ 
                  iterationCount: type === 'infinite' ? 'infinite' : '1' 
                })}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="finite">Finite</SelectItem>
                  <SelectItem value="infinite">Infinite</SelectItem>
                </SelectContent>
              </Select>
              
              {value.iterationCount !== 'infinite' && (
                <Input
                  type="number"
                  value={value.iterationCount}
                  onChange={(e) => updateAnimation({ iterationCount: e.target.value })}
                  min={1}
                  max={100}
                  className="w-20 text-xs"
                />
              )}
            </div>
          </div>

          {/* Direction */}
          <div>
            <Label className="text-xs font-medium">Direction</Label>
            <Select 
              value={value.direction} 
              onValueChange={(direction) => updateAnimation({ direction })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DIRECTIONS.map((dir) => (
                  <SelectItem key={dir.value} value={dir.value}>
                    {dir.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Fill Mode */}
          <div>
            <Label className="text-xs font-medium">Fill Mode</Label>
            <Select 
              value={value.fillMode} 
              onValueChange={(fillMode) => updateAnimation({ fillMode })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FILL_MODES.map((mode) => (
                  <SelectItem key={mode.value} value={mode.value}>
                    {mode.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* CSS Output */}
          <div>
            <Label className="text-xs font-medium">CSS Output</Label>
            <Input
              value={generateAnimationCSS()}
              readOnly
              className="mt-1 text-xs font-mono bg-gray-50"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default AnimationControls;