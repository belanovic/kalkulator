
import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CalculatorDisplayProps {
  mainDisplay: string;
  expressionDisplay?: string;
  onCopy: () => void;
}

const CalculatorDisplay: React.FC<CalculatorDisplayProps> = ({ mainDisplay, expressionDisplay, onCopy }) => {
  return (
    <div className="bg-card/80 dark:bg-neutral-800/80 p-4 rounded-t-lg shadow-inner relative min-h-[120px] flex flex-col justify-end text-right overflow-hidden">
      {/* Always render this ScrollArea to maintain consistent height, even if expressionDisplay is empty */}
      <ScrollArea className="h-8 w-full mb-1">
        <p className="text-sm text-muted-foreground break-all whitespace-nowrap px-2" aria-label="Current expression">
          {expressionDisplay || "\u00A0"} {/* Use non-breaking space for true emptiness to maintain line height */}
        </p>
      </ScrollArea>
      
      <ScrollArea className="h-14 w-full">
        <p 
          className="text-4xl lg:text-5xl font-headline font-semibold text-primary break-all whitespace-nowrap px-2"
          aria-live="polite"
          aria-label={`Current value: ${mainDisplay}`}
          data-testid="calculator-display"
        >
          {mainDisplay || "0"}
        </p>
      </ScrollArea>
      <Button
        variant="ghost"
        size="icon"
        onClick={onCopy}
        className="absolute top-2 right-2 text-muted-foreground hover:text-primary h-8 w-8"
        aria-label="Copy result to clipboard"
      >
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default CalculatorDisplay;
