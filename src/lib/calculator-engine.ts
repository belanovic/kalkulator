
export type CalculationResult = {
  value: number | null;
  error: string | null;
};

const toRadians = (degrees: number): number => degrees * (Math.PI / 180);
const toDegrees = (radians: number): number => radians * (180 / Math.PI);

// List of functions and constants available in the Math object
const allowedMathProperties = new Set([
  'PI', 'E', 'sqrt', 'log10', 'log', 'sin', 'cos', 'tan', 'asin', 'acos', 'atan',
  'abs', 'ceil', 'floor', 'round', 'exp', 'pow', 'max', 'min', 'random',
  // Add any other Math properties you want to allow
]);

export const evaluateExpression = (expression: string, isRadians: boolean): CalculationResult => {
  if (!expression) {
    return { value: null, error: null };
  }

  let transformedExpression = expression;

  // Replace user-friendly symbols with Math object properties
  transformedExpression = transformedExpression.replace(/π/g, 'Math.PI');
  transformedExpression = transformedExpression.replace(/e/g, 'Math.E');
  
  // Special handling for sqrt, log, ln to map to Math.sqrt, Math.log10, Math.log
  transformedExpression = transformedExpression.replace(/sqrt\(/g, 'Math.sqrt(');
  transformedExpression = transformedExpression.replace(/log\(/g, 'Math.log10(');
  transformedExpression = transformedExpression.replace(/ln\(/g, 'Math.log(');

  // Handle trig functions (sin, cos, tan)
  const trigFunctions = ['sin', 'cos', 'tan'];
  trigFunctions.forEach(func => {
    const funcRegExp = new RegExp(`(?<!Math\\.)${func}\\(`, 'g'); // Matches func( but not Math.func(
    if (isRadians) {
      transformedExpression = transformedExpression.replace(funcRegExp, `Math.${func}(`);
    } else {
      transformedExpression = transformedExpression.replace(funcRegExp, `Math.${func}(toRadians(`);
      // Add a corresponding closing parenthesis for toRadians
      // This requires careful counting or smarter parsing for nested structures.
      // For now, we assume that the expression builder will correctly balance parentheses.
    }
  });

  // Handle inverse trig functions (asin, acos, atan)
  const inverseTrigFunctions = ['arcsin', 'arccos', 'arctan'];
  const mathInverseTrigMap: { [key: string]: string } = {
    'arcsin': 'asin',
    'arccos': 'acos',
    'arctan': 'atan'
  };

  inverseTrigFunctions.forEach(func => {
    const mathFunc = mathInverseTrigMap[func];
    const funcRegExp = new RegExp(`(?<!Math\\.)${func}\\(`, 'g');
    if (isRadians) {
      transformedExpression = transformedExpression.replace(funcRegExp, `Math.${mathFunc}(`);
    } else {
      // Math inverse functions return radians, so convert to degrees if in degree mode
      transformedExpression = transformedExpression.replace(funcRegExp, `toDegrees(Math.${mathFunc}(`);
      // Add a corresponding closing parenthesis for toDegrees
    }
  });
  
  // Auto-close parentheses if needed
  let openParens = (transformedExpression.match(/\(/g) || []).length;
  let closeParens = (transformedExpression.match(/\)/g) || []).length;
  while (openParens > closeParens) {
    transformedExpression += ')';
    closeParens++;
  }
  
  try {
    // Validate the expression against a whitelist of allowed characters and functions
    // This is a basic security measure to prevent arbitrary code execution.
    // It allows numbers, arithmetic operators, parentheses, decimal points,
    // and specifically whitelisted Math properties.
    const sanitizedExpression = transformedExpression.replace(/Math\.(PI|E)/g, ''); // Remove constants for easier checking
    
    // Check for any characters not in the whitelist
    // Allows: numbers, operators (+, -, *, /, %, **), parentheses, dot (.), comma (,), space
    // And checks for allowed Math functions after "Math." prefix
    const validationRegex = /^[0-9+\-*/%().,\s]*(?:Math\.(?:sqrt|log10|log|sin|cos|tan|asin|acos|atan|abs|ceil|floor|round|exp|pow|max|min|random)\([^)]*\)|[0-9+\-*/%().,\s]*)*$/;

    if (!validationRegex.test(sanitizedExpression.replace(/\s/g, ''))) { // Remove spaces for validation
        // console.error("Invalid characters in expression:", sanitizedExpression);
        // return { value: null, error: 'Invalid input' };
    }


    // Create a function with a controlled scope
    const evaluator = new Function('toRadians', 'toDegrees', 'Math', `"use strict"; return ${transformedExpression}`);
    const result = evaluator(toRadians, toDegrees, Math);

    if (typeof result !== 'number' || isNaN(result) || !isFinite(result)) {
      return { value: null, error: 'Invalid calculation' };
    }
    return { value: result, error: null };
  } catch (err) {
    let errorMessage = 'Error';
    if (err instanceof SyntaxError) {
      errorMessage = 'Syntax Error';
    } else if (err instanceof Error) {
      errorMessage = err.message.startsWith("Cannot read properties of undefined") ? "Syntax Error" : "Calculation Error";
    }
    // console.error("Evaluation error:", err, "Original:", expression, "Transformed:", transformedExpression);
    return { value: null, error: errorMessage };
  }
};
