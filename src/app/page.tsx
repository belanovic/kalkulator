
"use client";

import React from 'react';
import CalculatorDisplay from '@/components/calculator/calculator-display';
import ScientificKeypad from '@/components/calculator/scientific-keypad';
import CalculationHistory from '@/components/calculator/calculation-history';
import { useCalculatorLogic } from '@/hooks/use-calculator-logic';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  const {
    displayValue,
    currentExpression,
    history,
    isRadians,
    handleInput,
    recallFromHistory,
    clearHistory,
    copyToClipboard,
  } = useCalculatorLogic();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-muted/50 font-body">
      <div className="w-full flex flex-col items-center">
        <Card className="shadow-2xl rounded-xl overflow-hidden w-full h-[calc(100vh_-_4rem)] sm:h-[calc(100vh_-_4rem)] max-h-[600px] md:h-[550px] lg:h-[600px]">
          <div className="flex flex-col md:flex-row h-full">
            {/* Calculator main area: display and keypad */}
            <div className="flex flex-col md:flex-1 md:w-2/3 lg:w-3/4 h-[65%] md:h-full">
              <CalculatorDisplay 
                mainDisplay={displayValue} 
                expressionDisplay={currentExpression}
                onCopy={copyToClipboard} 
              />
              <ScientificKeypad 
                onButtonClick={handleInput} 
                isRadians={isRadians} 
              />
            </div>
            
            <Separator orientation="vertical" className="hidden md:block mx-0 h-auto" />
            
            {/* History area - ensure it takes up its allocated space */}
            <div className="md:w-1/3 lg:w-1/4 h-[35%] md:h-full overflow-hidden">
              <CalculationHistory 
                history={history} 
                onRecall={recallFromHistory} 
                onClear={clearHistory}
                className="border-l-0 md:border-l"
              />
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
