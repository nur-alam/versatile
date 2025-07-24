import React, { useState, useCallback, useEffect } from 'react';
import { AlertTriangle, Check, Eye, EyeOff, Code } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { Switch } from '../../../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';

interface ValidationError {
  line: number;
  message: string;
  severity: 'error' | 'warning';
}

interface CustomCSSEditorProps {
  value: string;
  onChange: (value: string) => void;
  elementId?: string;
}

const CustomCSSEditor: React.FC<CustomCSSEditorProps> = ({ 
  value, 
  onChange, 
  elementId 
}) => {
  const [css, setCss] = useState(value || '');
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isValid, setIsValid] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [autoValidate, setAutoValidate] = useState(true);

  // CSS validation function
  const validateCSS = useCallback((cssText: string): ValidationError[] => {
    const errors: ValidationError[] = [];
    const lines = cssText.split('\n');

    // Basic CSS validation rules
    const dangerousProperties = [
      'position: fixed',
      'position: absolute',
      'z-index: 999',
      'overflow: hidden',
      'display: none',
      'visibility: hidden'
    ];

    const restrictedSelectors = [
      'body',
      'html',
      '*',
      'document',
      'window'
    ];

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      // Skip empty lines and comments
      if (!trimmedLine || trimmedLine.startsWith('/*') || trimmedLine.startsWith('//')) {
        return;
      }

      // Check for dangerous properties
      dangerousProperties.forEach(prop => {
        if (trimmedLine.toLowerCase().includes(prop.toLowerCase())) {
          errors.push({
            line: index + 1,
            message: `Potentially dangerous property: ${prop}`,
            severity: 'warning'
          });
        }
      });

      // Check for restricted selectors
      restrictedSelectors.forEach(selector => {
        if (trimmedLine.includes(selector + ' {') || trimmedLine.includes(selector + '{')) {
          errors.push({
            line: index + 1,
            message: `Restricted selector: ${selector}`,
            severity: 'error'
          });
        }
      });

      // Check for unclosed braces
      const openBraces = (trimmedLine.match(/{/g) || []).length;
      const closeBraces = (trimmedLine.match(/}/g) || []).length;
      if (openBraces !== closeBraces && (openBraces > 0 || closeBraces > 0)) {
        // This is a simple check - in reality, braces can span multiple lines
        // A more sophisticated parser would be needed for complete validation
      }

      // Check for malformed properties
      if (trimmedLine.includes(':') && !trimmedLine.includes('{') && !trimmedLine.includes('}')) {
        const colonIndex = trimmedLine.indexOf(':');
        const semicolonIndex = trimmedLine.indexOf(';');
        
        if (semicolonIndex === -1 && !trimmedLine.endsWith('}')) {
          errors.push({
            line: index + 1,
            message: 'Missing semicolon',
            severity: 'warning'
          });
        }

        // Check for valid property names (basic check)
        const property = trimmedLine.substring(0, colonIndex).trim();
        if (property && !/^[a-zA-Z-]+$/.test(property)) {
          errors.push({
            line: index + 1,
            message: `Invalid property name: ${property}`,
            severity: 'error'
          });
        }
      }

      // Check for JavaScript injection attempts
      const jsPatterns = [
        'javascript:',
        'eval(',
        'function(',
        'setTimeout(',
        'setInterval(',
        'document.',
        'window.',
        'alert(',
        'confirm(',
        'prompt('
      ];

      jsPatterns.forEach(pattern => {
        if (trimmedLine.toLowerCase().includes(pattern.toLowerCase())) {
          errors.push({
            line: index + 1,
            message: `Potential JavaScript injection: ${pattern}`,
            severity: 'error'
          });
        }
      });
    });

    return errors;
  }, []);

  // Sanitize CSS by removing dangerous content
  const sanitizeCSS = useCallback((cssText: string): string => {
    let sanitized = cssText;

    // Remove JavaScript-related content
    const jsPatterns = [
      /javascript:/gi,
      /eval\s*\(/gi,
      /function\s*\(/gi,
      /setTimeout\s*\(/gi,
      /setInterval\s*\(/gi,
      /document\./gi,
      /window\./gi,
      /alert\s*\(/gi,
      /confirm\s*\(/gi,
      /prompt\s*\(/gi
    ];

    jsPatterns.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '/* REMOVED */');
    });

    // Remove @import statements (potential security risk)
    sanitized = sanitized.replace(/@import[^;]+;/gi, '/* @import removed */');

    // Remove expression() (IE-specific, potential XSS)
    sanitized = sanitized.replace(/expression\s*\([^)]*\)/gi, '/* expression removed */');

    return sanitized;
  }, []);

  // Handle CSS changes
  const handleCSSChange = useCallback((newCSS: string) => {
    setCss(newCSS);
    
    if (autoValidate) {
      const validationErrors = validateCSS(newCSS);
      setErrors(validationErrors);
      setIsValid(validationErrors.filter(e => e.severity === 'error').length === 0);
    }
  }, [autoValidate, validateCSS]);

  // Apply CSS changes
  const applyCSSChanges = useCallback(() => {
    const sanitizedCSS = sanitizeCSS(css);
    const validationErrors = validateCSS(sanitizedCSS);
    
    setErrors(validationErrors);
    const hasErrors = validationErrors.filter(e => e.severity === 'error').length > 0;
    setIsValid(!hasErrors);
    
    if (!hasErrors) {
      onChange(sanitizedCSS);
    }
  }, [css, sanitizeCSS, validateCSS, onChange]);

  // Auto-apply changes with debouncing
  useEffect(() => {
    if (autoValidate) {
      const timeoutId = setTimeout(() => {
        applyCSSChanges();
      }, 500);
      
      return () => clearTimeout(timeoutId);
    }
  }, [css, autoValidate, applyCSSChanges]);

  // CSS snippets for common use cases
  const cssSnippets = [
    {
      name: 'Box Shadow',
      css: 'box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);'
    },
    {
      name: 'Rounded Corners',
      css: 'border-radius: 8px;'
    },
    {
      name: 'Gradient Background',
      css: 'background: linear-gradient(45deg, #ff6b6b, #4ecdc4);'
    },
    {
      name: 'Text Shadow',
      css: 'text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);'
    },
    {
      name: 'Transform Scale',
      css: 'transform: scale(1.05);\ntransition: transform 0.3s ease;'
    },
    {
      name: 'Flex Center',
      css: 'display: flex;\njustify-content: center;\nalign-items: center;'
    }
  ];

  return (
    <div className="space-y-4">
      <Tabs defaultValue="editor" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="snippets">Snippets</TabsTrigger>
        </TabsList>
        
        <TabsContent value="editor" className="space-y-4">
          {/* Editor Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={autoValidate}
                  onCheckedChange={setAutoValidate}
                />
                <Label className="text-xs">Auto-validate</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  checked={showPreview}
                  onCheckedChange={setShowPreview}
                />
                <Label className="text-xs">Preview</Label>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {isValid ? (
                <div className="flex items-center text-green-600">
                  <Check className="h-4 w-4 mr-1" />
                  <span className="text-xs">Valid</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  <span className="text-xs">Errors</span>
                </div>
              )}
              
              {!autoValidate && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={applyCSSChanges}
                  className="h-7 text-xs"
                >
                  Apply
                </Button>
              )}
            </div>
          </div>

          {/* CSS Editor */}
          <div>
            <Label className="text-xs font-medium">Custom CSS</Label>
            <Textarea
              value={css}
              onChange={(e) => handleCSSChange(e.target.value)}
              placeholder={elementId ? 
                `/* Styles for element #${elementId} */\ncolor: #333;\nfont-size: 16px;\npadding: 10px;` :
                '/* Add your custom CSS here */\ncolor: #333;\nfont-size: 16px;'
              }
              className="mt-1 font-mono text-xs"
              rows={12}
            />
          </div>

          {/* Validation Errors */}
          {errors.length > 0 && (
            <div className="space-y-2">
              {errors.map((error, index) => (
                <Alert key={index} variant={error.severity === 'error' ? 'destructive' : 'default'}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    <strong>Line {error.line}:</strong> {error.message}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          )}

          {/* Preview */}
          {showPreview && css && (
            <div>
              <Label className="text-xs font-medium">Preview</Label>
              <div className="mt-1 p-4 border rounded bg-gray-50">
                <div 
                  className="w-full h-20 bg-white border rounded flex items-center justify-center"
                  style={{ 
                    cssText: isValid ? css : undefined 
                  }}
                >
                  <span className="text-sm text-gray-600">Preview Element</span>
                </div>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="snippets" className="space-y-4">
          <div>
            <Label className="text-xs font-medium">CSS Snippets</Label>
            <div className="grid grid-cols-1 gap-2 mt-2">
              {cssSnippets.map((snippet, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newCSS = css + (css ? '\n\n' : '') + snippet.css;
                    handleCSSChange(newCSS);
                  }}
                  className="justify-start h-auto p-3"
                >
                  <div className="text-left">
                    <div className="font-medium text-xs">{snippet.name}</div>
                    <div className="text-xs text-gray-500 font-mono mt-1">
                      {snippet.css.split('\n')[0]}
                      {snippet.css.includes('\n') && '...'}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomCSSEditor;