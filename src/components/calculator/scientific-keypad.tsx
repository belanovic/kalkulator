import React from 'react';
import KeypadButton from './keypad-button';
import { calculatorButtonsLayout, ButtonConfig } from './buttons.config.tsx';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ScientificKeypadProps {
  onButtonClick: (value: string, type: string) => void;
  isRadians: boolean;
}

const ScientificKeypad: React.FC<ScientificKeypadProps> = ({ onButtonClick, isRadians }) => {
  return (
    <div className="p-3 bg-background rounded-b-lg shadow-lg flex-1 flex flex-col">
      <div className="absolute top-4 left-4">
        <Badge variant={isRadians ? "default" : "secondary"} className="text-xs">
          {isRadians ? 'RAD' : 'DEG'}
        </Badge>
      </div>
      <div className="grid grid-cols-5 gap-2 h-full flex-grow">
        {calculatorButtonsLayout.flat().map((btnConfig: ButtonConfig) => (
          <KeypadButton
            key={btnConfig.id}
            label={btnConfig.label}
            buttonValue={btnConfig.value}
            buttonType={btnConfig.type}
            onButtonClick={onButtonClick}
            variant={btnConfig.variant || (btnConfig.type === 'digit' || btnConfig.type === 'decimal' ? 'secondary' : 'default')}
            className={cn('aspect-square h-auto', btnConfig.className)} 
            ariaLabel={btnConfig.ariaLabel}
          />
        ))}
      </div>
    </div>
  );
};

export default ScientificKeypad;
