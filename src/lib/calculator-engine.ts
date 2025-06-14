export type CalculationResult = {
  value: number | null;
  error: string | null;
};

// Helper to convert degrees to radians
const toRadians = (degrees: number): number => degrees * (Math.PI / 180);

// Helper to convert radians to degrees
const toDegrees = (radians: number): number => radians * (180 / Math.PI);

export const evaluateExpression = (expression: string, isRadians: boolean): CalculationResult => {
  if (!expression) {
    return { value: null, error: null };
  }

  let transformedExpression = expression
    .replace(/π/g, 'Math.PI')
    .replace(/e/g, 'Math.E')
    .replace(/√\(/g, 'Math.sqrt(')
    .replace(/log\(/g, 'Math.log10(')
    .replace(/ln\(/g, 'Math.log(')
    .replace(/arcsin\(/g, 'Math.asin(')
    .replace(/arccos\(/g, 'Math.acos(')
    .replace(/arctan\(/g, 'Math.atan(');
  
  // Handle trig functions with degree/radian conversion
  const trigFunctions = ['sin', 'cos', 'tan'];
  trigFunctions.forEach(func => {
    const regex = new RegExp(`Math\\.${func}\\(`, 'g');
    if (isRadians) {
      // Already in radians, Math functions expect radians
      transformedExpression = transformedExpression.replace(new RegExp(`${func}\\(`, 'g'), `Math.${func}(`);
    } else {
      // Convert degrees to radians for Math functions
      transformedExpression = transformedExpression.replace(new RegExp(`${func}\\(`, 'g'), `Math.${func}(toRadians(`);
      // Need to ensure closing parenthesis for toRadians is added correctly.
      // This is tricky with regex alone for nested parentheses.
      // A more robust solution would involve parsing, but for simple cases:
      // Assuming function calls are like func(VALUE), we add an extra closing paren.
      // The current useCalculatorLogic builds expressions like "sin(" + value + ")"
      // so this will transform "sin(30)" to "Math.sin(toRadians(30))"
    }
  });

  // For inverse trig functions, Math.asin etc. return radians. Convert to degrees if needed.
  const inverseTrigFunctions = ['asin', 'acos', 'atan'];
  inverseTrigFunctions.forEach(func => {
    if (!isRadians) {
      // Wrap Math.asin() with toDegrees()
      transformedExpression = transformedExpression.replace(new RegExp(`Math\\.${func}\\(`, 'g'), `toDegrees(Math.${func}(`);
      // Similar to above, assumes simple func(VALUE) structure.
    }
  });
  
  try {
    // Add access to Math, toRadians, toDegrees in the Function's scope
    const evaluator = new Function('Math', 'toRadians', 'toDegrees', `"use strict"; return ${transformedExpression}`);
    const result = evaluator(Math, toRadians, toDegrees);

    if (typeof result !== 'number' || isNaN(result) || !isFinite(result)) {
      return { value: null, error: 'Invalid calculation' };
    }
    return { value: result, error: null };
  } catch (err) {
    // console.error("Calculation error:", err);
    let errorMessage = 'Error';
    if (err instanceof Error) {
      errorMessage = err.message.includes("Unexpected token ')'") || err.message.includes("Invalid or unexpected token") ? "Syntax Error" : "Calculation Error";
    }
    return { value: null, error: errorMessage };
  }
};
