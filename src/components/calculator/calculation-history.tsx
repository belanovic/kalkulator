import React from 'react';
import { HistoryItem } from '@/hooks/use-calculator-logic';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, RotateCcw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';


interface CalculationHistoryProps {
  history: HistoryItem[];
  onRecall: (item: HistoryItem) => void;
  onClear: () => void;
}

const CalculationHistory: React.FC<CalculationHistoryProps> = ({ history, onRecall, onClear }) => {
  return (
    <Card className="w-full md:w-1/3 lg:w-1/4 h-full flex flex-col shadow-lg rounded-lg">
      <CardHeader className="p-4 border-b">
        <CardTitle className="text-lg font-semibold text-primary flex items-center justify-between">
          History
          {history.length > 0 && (
            <Button variant="ghost" size="icon" onClick={onClear} aria-label="Clear history">
              <Trash2 className="h-5 w-5 text-destructive" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-grow overflow-hidden">
        <ScrollArea className="h-full p-1"> {/* Approximate height based on overall calculator size */}
          {history.length === 0 ? (
            <p className="text-sm text-muted-foreground p-4 text-center">No history yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {history.map((item) => (
                <li key={item.id} className="p-3 hover:bg-muted/50 transition-colors duration-150 group">
                  <button 
                    onClick={() => onRecall(item)} 
                    className="w-full text-left focus:outline-none focus:ring-1 focus:ring-accent rounded p-1"
                    aria-label={`Recall ${item.expression} equals ${item.result}`}
                  >
                    <p className="text-xs text-muted-foreground truncate group-hover:text-foreground">{item.expression}</p>
                    <p className="text-md font-medium text-primary group-hover:text-accent truncate ">= {item.result}</p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </CardContent>
       {history.length > 0 && (
         <CardFooter className="p-2 border-t justify-center">
            <p className="text-xs text-muted-foreground">Click an item to recall</p>
         </CardFooter>
       )}
    </Card>
  );
};

export default CalculationHistory;
