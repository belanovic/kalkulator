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
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-background to-muted/50 font-body">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-4xl font-headline font-bold text-primary text-center mb-6">
          DetailCalc
        </h1>
        <Card className="shadow-2xl rounded-xl overflow-hidden">
          {/* Container for calculator and history. Fixed height and flex layout. */}
          <div className="flex flex-col md:flex-row h-[calc(100vh-10rem)] max-h-[550px] md:h-[550px]">
            {/* Calculator main area: display and keypad */}
            <div className="flex flex-col h-[65%] md:h-full md:flex-1 md:w-2/3 lg:w-3/4">
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
            {/* History area wrapper */}
            <div className="h-[35%] md:h-full w-full md:w-auto">
              <CalculationHistory 
                history={history} 
                onRecall={recallFromHistory} 
                onClear={clearHistory} 
              />
            </div>
          </div>
        </Card>
        <p className="text-center text-sm text-muted-foreground mt-6">
          A detailed scientific calculator.
        </p>
      </div>
    </main>
  );
}
