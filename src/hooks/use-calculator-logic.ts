
import { useState, useCallback, useEffect } from 'react';
import { evaluateExpression } from '@/lib/calculator-engine';
import { useToast } from "@/hooks/use-toast"; // Corrected path

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
}

const MAX_HISTORY_LENGTH = 20;
const MAX_INPUT_LENGTH = 100; // Max length for display and expression

export const useCalculatorLogic = () => {
  const [displayValue, setDisplayValue] = useState<string>('0');
  const [currentExpression, setCurrentExpression] = useState<string>('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isRadians, setIsRadians] = useState<boolean>(true);
  const [overwriteDisplay, setOverwriteDisplay] = useState<boolean>(true);
  const [lastInputWasEquals, setLastInputWasEquals] = useState<boolean>(false);

  const { toast } = useToast();

  const showCalculationError = (message: string) => {
    toast({
      variant: "destructive",
      title: "Error",
      description: message,
      duration: 3000,
    });
  };

  const addToHistory = (expression: string, result: string) => {
    const newHistoryItem: HistoryItem = {
      id: Date.now().toString(),
      expression,
      result,
    };
    setHistory(prev => [newHistoryItem, ...prev].slice(0, MAX_HISTORY_LENGTH));
  };
  
  const handleCalculation = useCallback(() => {
    if (!currentExpression || currentExpression === "Error") {
        setDisplayValue("0");
        setCurrentExpression("");
        setOverwriteDisplay(true);
        setLastInputWasEquals(false);
        return;
    }

    let expressionToEvaluate = currentExpression;

    // Prevent trailing operators except after E for scientific notation
    const lastChar = expressionToEvaluate.trim().slice(-1);
    const secondLastChar = expressionToEvaluate.trim().slice(-2, -1);
    if (['+', '*', '/', '%', '^', '.'].includes(lastChar) && secondLastChar !== 'E' && lastChar !== 'E') {
      expressionToEvaluate = expressionToEvaluate.slice(0, -1);
    }
    
    // Auto-close parentheses
    let openParens = (expressionToEvaluate.match(/\(/g) || []).length;
    let closeParens = (expressionToEvaluate.match(/\)/g) || []).length;
    let finalExpression = expressionToEvaluate;
    while (openParens > closeParens) {
      finalExpression += ')';
      closeParens++;
    }

    const { value, error } = evaluateExpression(finalExpression, isRadians);

    if (error) {
      showCalculationError(error);
      setDisplayValue('Error');
      // setCurrentExpression(''); // Keep expression for user to see/fix
      setOverwriteDisplay(true);
      setLastInputWasEquals(true); // Treat error like an equals for next input
    } else if (value !== null) {
      const resultStr = parseFloat(value.toPrecision(12)).toString();
      setDisplayValue(resultStr);
      addToHistory(finalExpression, resultStr);
      setCurrentExpression(resultStr);
      setOverwriteDisplay(true);
      setLastInputWasEquals(true);
    }
  }, [currentExpression, isRadians, toast]);


  const handleInput = useCallback((inputValue: string, type: string) => {
    if (currentExpression.length > MAX_INPUT_LENGTH && type !== 'control' && type !== 'equals' && type !== 'mode') {
        showCalculationError("Max input length reached.");
        return;
    }

    if (displayValue === "Error" && type !== 'control' && inputValue !== "AC" && inputValue !== "DEL") {
        // If display is "Error", only AC/DEL should work initially.
        // Any other input should clear the error and start fresh.
        setDisplayValue("0");
        setCurrentExpression("");
        setOverwriteDisplay(true);
        setLastInputWasEquals(false);
        // Now, re-process the input if it wasn't AC/DEL
        if (type === 'digit') { // Example: if '7' was pressed while 'Error' showing
             setDisplayValue(inputValue);
             setCurrentExpression(inputValue);
             setOverwriteDisplay(false);
             setLastInputWasEquals(false);
             return;
        }
        // For other types, it might need more specific handling or just clear and wait for next input
    }


    switch (type) {
      case 'digit':
        if (lastInputWasEquals || overwriteDisplay || displayValue === '0') {
          setDisplayValue(inputValue);
          setCurrentExpression(prev => (lastInputWasEquals ? "" : prev) + inputValue);
          setOverwriteDisplay(false);
        } else {
          setDisplayValue(prev => prev + inputValue);
          setCurrentExpression(prev => prev + inputValue);
        }
        setLastInputWasEquals(false);
        break;

      case 'decimal':
        if (lastInputWasEquals || overwriteDisplay) {
          setDisplayValue('0.');
          setCurrentExpression(prev => (lastInputWasEquals ? "" : prev) + '0.');
          setOverwriteDisplay(false);
        } else if (!displayValue.includes('.')) {
          setDisplayValue(prev => prev + '.');
          setCurrentExpression(prev => prev + '.');
        }
        setLastInputWasEquals(false);
        break;

      case 'operator':
        if (currentExpression === '' && inputValue === '-') { // Allow starting with negative
          setDisplayValue('-');
          setCurrentExpression('-');
          setOverwriteDisplay(false);
        } else if (currentExpression !== '' && currentExpression !== '-') {
           const lastChar = currentExpression.slice(-1);
           // Avoid double operators unless it's for power (**) or part of scientific notation (e.g., E-)
            if (['+','-','*','/','%','.'].includes(lastChar) && !(lastChar === '*' && inputValue === '*') && !( (currentExpression.toUpperCase().endsWith('E') && inputValue === '-')) ) {
                // Replace last operator if it's not for power
                setCurrentExpression(prev => prev.slice(0,-1) + inputValue);
            } else {
                setCurrentExpression(prev => prev + inputValue);
            }
          setDisplayValue(inputValue); // Show the operator
          setOverwriteDisplay(true);
        }
        setLastInputWasEquals(false);
        break;
      
      case 'function': // e.g. sin(, cos(, sqrt(
      case 'constant': // e.g. Math.PI, Math.E
      case 'parenthesis':
        const isOpeningFunctionOrParen = inputValue.endsWith('(') || inputValue === '(';
        const isConstant = type === 'constant';

        if (lastInputWasEquals) {
          setCurrentExpression(inputValue);
          setDisplayValue(isConstant ? parseFloat(eval(inputValue).toPrecision(10)).toString() : inputValue.replace('(',''));
        } else {
          const lastChar = currentExpression.slice(-1);
          // Auto-multiply if previous was a number, constant, or closing parenthesis
          if (currentExpression && !['+','-','*','/','%','^','(','.'].includes(lastChar) && (isOpeningFunctionOrParen || isConstant)) {
            setCurrentExpression(prev => prev + '*' + inputValue);
          } else {
            setCurrentExpression(prev => prev + inputValue);
          }
          setDisplayValue(isConstant ? parseFloat(eval(inputValue).toPrecision(10)).toString() : inputValue.replace('(',''));
        }
        setOverwriteDisplay(true); // After a function/constant/paren, expect a new number or another function/paren
        if (inputValue === '(' || inputValue.endsWith('(')) setOverwriteDisplay(false); // for functions like sin( and (
        if (inputValue === ')') setOverwriteDisplay(true); // After ), expect operator or equals

        setLastInputWasEquals(false);
        break;

      case 'equals':
        handleCalculation();
        break;

      case 'control':
        if (inputValue === 'AC') {
          setDisplayValue('0');
          setCurrentExpression('');
          setOverwriteDisplay(true);
          setLastInputWasEquals(false);
        } else if (inputValue === 'DEL') {
          if (lastInputWasEquals || displayValue === "Error") { // After equals or if error, DEL acts like AC
            setDisplayValue('0');
            setCurrentExpression('');
            setOverwriteDisplay(true);
            setLastInputWasEquals(false);
          } else if (displayValue.length > 0) {
            const newDisplay = displayValue.slice(0, -1) || '0';
            setDisplayValue(newDisplay);
            // More robustly remove the part from currentExpression that corresponds to displayValue
            // This is simplified; a token-based approach would be better.
            if(currentExpression.endsWith(displayValue)){
                setCurrentExpression(prev => prev.substring(0, prev.length - displayValue.length) + newDisplay);
            } else {
                 // If displayValue is not the end of expression (e.g. after operator), remove last char of expression
                 setCurrentExpression(prev => prev.slice(0, -1));
            }
            if (newDisplay === '0') setOverwriteDisplay(true);

          }
        }
        break;
      
      case 'mode':
        setIsRadians(prev => !prev);
        setLastInputWasEquals(false); // Mode change shouldn't affect this
        break;

      case 'sign':
        if (displayValue !== '0' && displayValue !== "Error" && !lastInputWasEquals && !overwriteDisplay) {
            // Try to negate the current number being input
            // This is complex if not tracking tokens.
            // Simplification: if displayValue is just a number, negate it.
            const num = parseFloat(displayValue);
            if (!isNaN(num)) {
                const negatedDisplay = (-num).toString();
                // Find and replace the displayValue at the end of currentExpression
                if (currentExpression.endsWith(displayValue)) {
                    setCurrentExpression(prev => prev.substring(0, prev.length - displayValue.length) + negatedDisplay);
                    setDisplayValue(negatedDisplay);
                }
            }
        } else if (currentExpression && !lastInputWasEquals) {
            // If overwriteDisplay is true (e.g. after an operator or function), start a new negative number
            setDisplayValue('-');
            setCurrentExpression(prev => prev + '-');
            setOverwriteDisplay(false);
        }
        setLastInputWasEquals(false);
        break;

      default:
        break;
    }
  }, [displayValue, currentExpression, isRadians, overwriteDisplay, lastInputWasEquals, handleCalculation, showCalculationError]);


  const recallFromHistory = (item: HistoryItem) => {
    setDisplayValue(item.result);
    setCurrentExpression(item.result);
    setOverwriteDisplay(true);
    setLastInputWasEquals(true); // So next digit/operator starts new calculation
  };
  
  const clearHistoryHandler = () => {
    setHistory([]);
  };

  const copyToClipboard = async () => {
    if (displayValue && displayValue !== 'Error') {
      try {
        await navigator.clipboard.writeText(displayValue);
        toast({ title: "Copied", description: `${displayValue} copied to clipboard.`, duration: 2000 });
      } catch (err) {
        showCalculationError("Could not copy to clipboard.");
      }
    }
  };
  
  // Update expression for display purposes, not for evaluation logic
  const expressionForDisplay = currentExpression
    .replace(/Math\.PI/g, 'π')
    .replace(/Math\.E/g, 'e')
    .replace(/\*\*/g, '^');


  return {
    displayValue,
    currentExpression: expressionForDisplay, // Use the display-friendly version
    history,
    isRadians,
    handleInput,
    recallFromHistory,
    clearHistory: clearHistoryHandler,
    copyToClipboard,
  };
};
