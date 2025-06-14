import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CalculatorDisplayProps {
  mainDisplay: string;
  expressionDisplay?: string; // Optional secondary display for full expression
  onCopy: () => void;
}

const CalculatorDisplay: React.FC<CalculatorDisplayProps> = ({ mainDisplay, expressionDisplay, onCopy }) => {
  return (
    <div className="bg-card/50 dark:bg-neutral-800 p-4 rounded-t-lg shadow-inner relative min-h-[100px] flex flex-col justify-end text-right">
      {expressionDisplay && (
         <ScrollArea className="h-8 w-full mb-1">
          <p className="text-sm text-muted-foreground break-all whitespace-nowrap" aria-label="Current expression">
            {expressionDisplay}
          </p>
        </ScrollArea>
      )}
      <ScrollArea className="h-12 w-full">
        <p 
          className="text-4xl font-headline font-semibold text-primary break-all whitespace-nowrap" 
          aria-live="polite"
          aria-label={`Current value: ${mainDisplay}`}
          data-testid="calculator-display"
        >
          {mainDisplay}
        </p>
      </ScrollArea>
      <Button
        variant="ghost"
        size="icon"
        onClick={onCopy}
        className="absolute top-2 right-2 text-muted-foreground hover:text-primary"
        aria-label="Copy result to clipboard"
      >
        <Copy className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default CalculatorDisplay;
