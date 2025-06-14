import { useState, useCallback } from 'react';
import { evaluateExpression, CalculationResult } from '@/lib/calculator-engine';
import { useToast } from "@/hooks/use-toast";

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
}

const MAX_HISTORY_LENGTH = 20;

export const useCalculatorLogic = () => {
  const [displayValue, setDisplayValue] = useState<string>('0');
  const [currentExpression, setCurrentExpression] = useState<string>('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isRadians, setIsRadians] = useState<boolean>(true);
  const [overwriteDisplay, setOverwriteDisplay] = useState<boolean>(true); // True if next digit should overwrite display
  const [expectingOperator, setExpectingOperator] = useState<boolean>(false); // True after a number/constant/paren_close, expecting operator or equals
  
  const { toast } = useToast();

  const showCalculationError = (message: string) => {
    toast({
      variant: "destructive",
      title: "Calculation Error",
      description: message,
    });
  };

  const handleCalculation = useCallback(() => {
    if (!currentExpression) return;

    // Prevent trailing operators before calculation
    const lastChar = currentExpression.trim().slice(-1);
    const isLastCharOperator = ['+', '-', '*', '/', '%', '^'].includes(lastChar);
    const expressionToEvaluate = isLastCharOperator ? currentExpression.slice(0, -1) : currentExpression;
    
    // Auto-close parentheses if needed
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
      setCurrentExpression(''); // Optionally clear expression on error
      setOverwriteDisplay(true);
      setExpectingOperator(false);
    } else if (value !== null) {
      const resultStr = parseFloat(value.toPrecision(12)).toString(); // Precision and remove trailing zeros
      setDisplayValue(resultStr);
      
      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        expression: finalExpression,
        result: resultStr,
      };
      setHistory(prev => [newHistoryItem, ...prev].slice(0, MAX_HISTORY_LENGTH));
      setCurrentExpression(resultStr); // Result becomes start of new expression
      setOverwriteDisplay(true);
      setExpectingOperator(true);
    }
  }, [currentExpression, isRadians, toast]);

  const handleInput = useCallback((inputValue: string, type: string) => {
    setDisplayValue(prevDisplay => {
      setCurrentExpression(prevExpression => {
        if (type === 'control') {
          switch (inputValue) {
            case 'AC':
              setExpectingOperator(false);
              setOverwriteDisplay(true);
              setCurrentExpression(''); // Clear expression string
              return '0'; // Display resets to 0
            case 'DEL':
              if (prevDisplay === 'Error' || overwriteDisplay) {
                 setExpectingOperator(false);
                 setOverwriteDisplay(true);
                 setCurrentExpression('');
                 return '0';
              }
              const newDisplay = prevDisplay.length > 1 ? prevDisplay.slice(0, -1) : '0';
              // More robust DEL: remove last entered part from expression
              // This is a simplified version. A robust solution would track "tokens" or use a more complex string manipulation.
              let newExpression = prevExpression;
              // If displayValue was the last thing added to expression, remove it.
              if (prevExpression.endsWith(prevDisplay)) {
                newExpression = prevExpression.substring(0, prevExpression.length - prevDisplay.length);
              } else { 
                // Fallback: just remove last char of expression if not matching display (e.g. operator)
                newExpression = prevExpression.length > 0 ? prevExpression.slice(0,-1) : '';
              }


              if (newDisplay === '0') {
                setOverwriteDisplay(true);
                setExpectingOperator(false);
                 if(newExpression === "") setExpectingOperator(false);
                 else {
                    const lastCharExp = newExpression.trim().slice(-1);
                    if (!['+', '-', '*', '/', '%', '^', '('].includes(lastCharExp)) {
                        setExpectingOperator(true);
                    } else {
                        setExpectingOperator(false);
                    }
                 }
              } else {
                 const lastCharDisp = newDisplay.trim().slice(-1);
                 if (!['+', '-', '*', '/', '%', '^', '('].includes(lastCharDisp)) {
                    setExpectingOperator(true);
                 } else {
                    setExpectingOperator(false);
                 }
              }
              setCurrentExpression(newExpression); 
              return newDisplay;
          }
        }
        
        if (prevDisplay === 'Error') { // Clear error on new input
            prevDisplay = '0';
            prevExpression = '';
            setOverwriteDisplay(true);
            setExpectingOperator(false);
        }

        switch (type) {
          case 'digit':
            setExpectingOperator(true);
            if (overwriteDisplay || prevDisplay === '0') {
              setOverwriteDisplay(false);
              // If prevExpression ends with a number that was a result, replace it instead of appending
              const matchResult = prevExpression.match(/(-?\d*\.?\d+)$/);
              if (matchResult && parseFloat(matchResult[0]) === parseFloat(prevDisplay) && overwriteDisplay) {
                 setCurrentExpression(prevExpression.substring(0, prevExpression.length - matchResult[0].length) + inputValue);
              } else {
                 setCurrentExpression(prevExpression + inputValue);
              }
              return inputValue;
            }
            setCurrentExpression(prevExpression + inputValue);
            return prevDisplay + inputValue;
          case 'decimal':
            setExpectingOperator(false); // after decimal, can type more digits
            if (overwriteDisplay) {
              setOverwriteDisplay(false);
              setCurrentExpression(prevExpression + '0.');
              return '0.';
            }
            if (!prevDisplay.includes('.')) {
              setCurrentExpression(prevExpression + '.');
              return prevDisplay + '.';
            }
            return prevDisplay; // Do nothing if decimal already exists
          case 'operator':
            setExpectingOperator(false);
            setOverwriteDisplay(true); // Next input will be a new number
            const lastCharExp = prevExpression.trim().slice(-1);
            const isLastCharExpOperator = ['+', '-', '*', '/', '%', '**'].includes(lastCharExp);
            if (isLastCharExpOperator && prevExpression.length > 0) { 
                // Replace last operator if it's a double (like ** for pow)
                if (prevExpression.endsWith('**') && inputValue !== '**') {
                     setCurrentExpression(prevExpression.slice(0, -2) + inputValue);
                } else if (prevExpression.endsWith(lastCharExp) && lastCharExp !== inputValue) {
                     setCurrentExpression(prevExpression.slice(0, -1) + inputValue);
                } else if (!prevExpression.endsWith(inputValue)) {
                    setCurrentExpression(prevExpression + inputValue);
                }
            } else if (prevExpression === '' && inputValue === '-') { // Allow negative sign at start
                setCurrentExpression(inputValue);
                setOverwriteDisplay(false); // Allow digits after negative sign
            }
             else if (prevExpression !== '' || !isLastCharExpOperator) {
                setCurrentExpression(prevExpression + inputValue);
            }
            return prevDisplay; 
          case 'function': 
            setExpectingOperator(false);
            setOverwriteDisplay(true); 
             if (expectingOperator && prevExpression.length > 0 && !['(','+','-','*','/','%','^'].includes(prevExpression.trim().slice(-1))) {
                setCurrentExpression(prevExpression + '*' + inputValue);
            } else {
                setCurrentExpression(prevExpression + inputValue);
            }
            return inputValue.replace('(',''); 
          case 'constant': 
            setExpectingOperator(true);
            setOverwriteDisplay(true); 
            const constNumericValue = (inputValue === "Math.PI" ? Math.PI : Math.E);
            const constDisplay = parseFloat(constNumericValue.toPrecision(10)).toString();
             if (expectingOperator && prevExpression.length > 0 && !['(','+','-','*','/','%','^'].includes(prevExpression.trim().slice(-1))) {
                 setCurrentExpression(prevExpression + '*' + inputValue);
            } else {
                setCurrentExpression(prevExpression + inputValue);
            }
            return constDisplay;
          case 'parenthesis':
            if (inputValue === '(') {
              setExpectingOperator(false);
              setOverwriteDisplay(true); // Expecting a number or function after (
              const lastChar = prevExpression.trim().slice(-1);
              if (prevExpression.length > 0 && !['(','+','-','*','/','%','^'].includes(lastChar)) {
                // auto-multiply if a number/constant/paren_close is before '('
                setCurrentExpression(prevExpression + '*' + inputValue);
              } else {
                setCurrentExpression(prevExpression + inputValue);
              }
            } else { // ')'
              setExpectingOperator(true); 
              setCurrentExpression(prevExpression + inputValue);
            }
            // Display doesn't really change for parens themselves, expression does.
            // We might show the current number, or if overwriteDisplay is true, the parenthesis itself.
            return overwriteDisplay ? inputValue : prevDisplay;
          case 'equals':
            handleCalculation();
            return prevDisplay; 
          case 'mode': 
            setIsRadians(val => !val);
            return prevDisplay;
          case 'sign':
            if (prevDisplay !== '0' && prevDisplay !== 'Error') {
              let newDisplayValueStr = '';
              let newCurrentExpressionStr = '';

              if (overwriteDisplay || prevDisplay === currentExpression) { 
                newDisplayValueStr = (parseFloat(prevDisplay) * -1).toString();
                newCurrentExpressionStr = newDisplayValueStr; // Entire expression becomes the negated number
                setOverwriteDisplay(true); 
              } else { 
                  // Find the last number entered in the expression to negate it
                  // This regex finds the last sequence of digits, possibly with a decimal or leading minus
                  const match = prevExpression.match(/(-?\d*\.?\d+)$/);
                  if (match) {
                    const lastNumberStr = match[0];
                    const startOfLastNum = prevExpression.length - lastNumberStr.length;
                    const charBeforeLastNum = startOfLastNum > 0 ? prevExpression[startOfLastNum-1] : null;

                    if (lastNumberStr.startsWith('-')) { // if it's already negative
                        newDisplayValueStr = lastNumberStr.substring(1);
                        // if it was like '(-5', it becomes '(5'
                        // if it was like '3*-5', it becomes '3*5'
                        newCurrentExpressionStr = prevExpression.substring(0, startOfLastNum) + newDisplayValueStr;
                    } else { // if it's positive
                        newDisplayValueStr = '-' + lastNumberStr;
                        // if it was like '(5', it becomes '(-5'
                        // if it was like '3*5', it becomes '3*-5'
                        // if it was '5', it becomes '-5'
                        // If the char before was an operator or '(', just prepend '-'
                        if (startOfLastNum === 0 || ['(','+','*','/','%','^'].includes(charBeforeLastNum!)) {
                             newCurrentExpressionStr = prevExpression.substring(0, startOfLastNum) + newDisplayValueStr;
                        } else if (charBeforeLastNum === '-') { // if it was like '3-5', it becomes '3+5'
                             newDisplayValueStr = lastNumberStr; // make it positive
                             newCurrentExpressionStr = prevExpression.substring(0, startOfLastNum -1) + '+' + newDisplayValueStr;
                        }
                         else { // Default case, e.g. first number
                             newCurrentExpressionStr = prevExpression.substring(0, startOfLastNum) + newDisplayValueStr;
                        }
                    }
                    
                  } else { // Should not happen if display is not 0/Error
                    newDisplayValueStr = (parseFloat(prevDisplay) * -1).toString();
                    newCurrentExpressionStr = newDisplayValueStr;
                  }
                  setOverwriteDisplay(false); // Keep typing the number
              }
              setCurrentExpression(newCurrentExpressionStr);
              return newDisplayValueStr;
            }
            return prevDisplay;
        }
        return prevDisplay; 
      });
      return prevDisplay; 
    });
  }, [overwriteDisplay, expectingOperator, handleCalculation, isRadians]);


  const recallFromHistory = (item: HistoryItem) => {
    setDisplayValue(item.result);
    setCurrentExpression(item.result); // Start new calculation from old result
    setOverwriteDisplay(true);
    setExpectingOperator(true);
  };
  
  const clearHistoryHandler = () => {
    setHistory([]);
  };

  const copyToClipboard = async () => {
    if (displayValue && displayValue !== 'Error') {
      try {
        await navigator.clipboard.writeText(displayValue);
        toast({ title: "Copied", description: `${displayValue} copied to clipboard.` });
      } catch (err) {
        toast({ variant: "destructive", title: "Copy Failed", description: "Could not copy to clipboard." });
      }
    }
  };

  return {
    displayValue,
    currentExpression, 
    history,
    isRadians,
    handleInput,
    recallFromHistory,
    clearHistory: clearHistoryHandler,
    copyToClipboard,
  };
};
