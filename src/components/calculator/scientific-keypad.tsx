
import React from 'react';
import KeypadButton from './keypad-button';
import { calculatorButtonsLayout, type ButtonConfig } from './buttons.config';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils'; // Ensure cn is imported

interface ScientificKeypadProps {
  onButtonClick: (value: string, type: string) => void;
  isRadians: boolean;
}

const ScientificKeypad: React.FC<ScientificKeypadProps> = ({ onButtonClick, isRadians }) => {
  return (
    <div className="p-2 bg-background rounded-b-lg shadow-lg flex-1 flex flex-col h-full">
      <div className="flex justify-end mb-1 pr-1">
        <Badge variant={isRadians ? "default" : "secondary"} className="text-xs px-2 py-1">
          {isRadians ? 'RAD' : 'DEG'}
        </Badge>
      </div>
      <div className="grid grid-cols-5 gap-1.5 flex-grow h-full"> {/* Reduced gap for tighter fit */}
        {calculatorButtonsLayout.flat().map((btnConfig: ButtonConfig) => (
          <KeypadButton
            key={btnConfig.id}
            label={btnConfig.label}
            buttonValue={btnConfig.value}
            buttonType={btnConfig.type}
            onButtonClick={onButtonClick}
            variant={btnConfig.variant || 'secondary'} // Default to secondary if not specified
            className={cn('h-full', btnConfig.className)} // Ensure buttons take full height of grid cell
            ariaLabel={btnConfig.ariaLabel}
          />
        ))}
      </div>
    </div>
  );
};

export default ScientificKeypad;
