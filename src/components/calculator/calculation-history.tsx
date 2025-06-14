
import React from 'react';
import type { HistoryItem } from '@/hooks/use-calculator-logic';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CalculationHistoryProps {
  history: HistoryItem[];
  onRecall: (item: HistoryItem) => void;
  onClear: () => void;
  className?: string;
}

const CalculationHistory: React.FC<CalculationHistoryProps> = ({ history, onRecall, onClear, className }) => {
  return (
    <Card className={cn("w-full h-full flex flex-col shadow-lg rounded-lg overflow-hidden", className)}>
      <CardHeader className="p-3 border-b sticky top-0 bg-card z-10">
        <CardTitle className="text-md font-semibold text-primary flex items-center justify-between">
          History
          {history.length > 0 && (
            <Button variant="ghost" size="sm" onClick={onClear} aria-label="Clear history" className="h-7 w-7 p-0">
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-grow overflow-hidden">
        <ScrollArea className="h-full p-1">
          {history.length === 0 ? (
            <p className="text-xs text-muted-foreground p-4 text-center">No history yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {history.map((item) => (
                <li key={item.id} className="hover:bg-muted/30 transition-colors duration-150 group">
                  <button 
                    onClick={() => onRecall(item)} 
                    className="w-full text-left focus:outline-none focus:ring-1 focus:ring-accent rounded p-2"
                    aria-label={`Recall ${item.expression} equals ${item.result}`}
                  >
                    <p className="text-xs text-muted-foreground truncate group-hover:text-foreground">{item.expression}</p>
                    <p className="text-sm font-medium text-primary group-hover:text-accent truncate ">= {item.result}</p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </CardContent>
       {history.length > 0 && (
         <CardFooter className="p-2 border-t justify-center sticky bottom-0 bg-card z-10">
            <p className="text-xs text-muted-foreground">Click an item to recall</p>
         </CardFooter>
       )}
    </Card>
  );
};

export default CalculationHistory;
