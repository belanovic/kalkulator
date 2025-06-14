
import React from 'react';
import { Divide, X, Minus, Plus, Trash2, Delete, Pi, Equal } from 'lucide-react'; // Sigma, Info, HelpCircle, CornerDownLeft, RotateCcw, Percent removed for simplicity/availability

export type ButtonConfig = {
  id: string;
  label: string | React.ReactNode;
  value: string;
  type: 'digit' | 'operator' | 'function' | 'constant' | 'control' | 'decimal' | 'equals' | 'parenthesis' | 'mode' | 'sign';
  className?: string;
  ariaLabel?: string;
  variant?: "default" | "secondary" | "destructive" | "outline" | "ghost" | "accent" | "primary";
};

export const calculatorButtonsLayout: ButtonConfig[][] = [
  // Row 1
  [
    { id: 'clear', label: 'AC', value: 'AC', type: 'control', ariaLabel: 'All Clear', variant: 'accent' },
    { id: 'sign', label: '+/-', value: '+/-', type: 'sign', ariaLabel: 'Toggle Sign', variant: 'secondary' },
    { id: 'mode', label: 'Rad/Deg', value: 'mode', type: 'mode', ariaLabel: 'Toggle Radian/Degree Mode', variant: 'secondary', className: "text-xs px-1" },
    { id: 'lpar', label: '(', value: '(', type: 'parenthesis', ariaLabel: 'Open Parenthesis' },
    { id: 'rpar', label: ')', value: ')', type: 'parenthesis', ariaLabel: 'Close Parenthesis' },
  ],
  // Row 2
  [
    { id: 'sin', label: 'sin', value: 'sin(', type: 'function', ariaLabel: 'Sine' },
    { id: 'seven', label: '7', value: '7', type: 'digit' },
    { id: 'eight', label: '8', value: '8', type: 'digit' },
    { id: 'nine', label: '9', value: '9', type: 'digit' },
    { id: 'divide', label: <Divide size={20}/>, value: '/', type: 'operator', ariaLabel: 'Divide', variant:'secondary' },
  ],
  // Row 3
  [
    { id: 'cos', label: 'cos', value: 'cos(', type: 'function', ariaLabel: 'Cosine' },
    { id: 'four', label: '4', value: '4', type: 'digit' },
    { id: 'five', label: '5', value: '5', type: 'digit' },
    { id: 'six', label: '6', value: '6', type: 'digit' },
    { id: 'multiply', label: <X size={20}/>, value: '*', type: 'operator', ariaLabel: 'Multiply', variant:'secondary' },
  ],
  // Row 4
  [
    { id: 'tan', label: 'tan', value: 'tan(', type: 'function', ariaLabel: 'Tangent' },
    { id: 'one', label: '1', value: '1', type: 'digit' },
    { id: 'two', label: '2', value: '2', type: 'digit' },
    { id: 'three', label: '3', value: '3', type: 'digit' },
    { id: 'subtract', label: <Minus size={20}/>, value: '-', type: 'operator', ariaLabel: 'Subtract', variant:'secondary' },
  ],
  // Row 5:
  [
    { id: 'pow', label: 'xʸ', value: '**', type: 'operator', ariaLabel: 'Exponent' },
    { id: 'zero', label: '0', value: '0', type: 'digit', className: 'col-span-2' },
    { id: 'decimal', label: '.', value: '.', type: 'decimal', ariaLabel: 'Decimal Point' },
    { id: 'add', label: <Plus size={20}/>, value: '+', type: 'operator', ariaLabel: 'Add', variant:'secondary' },
  ],
  // Row 6:
  [
    { id: 'sqrt', label: '√x', value: 'sqrt(', type: 'function', ariaLabel: 'Square Root' },
    { id: 'pi', label: <Pi size={20}/>, value: 'Math.PI', type: 'constant', ariaLabel: 'Pi' },
    { id: 'e', label: 'e', value: 'Math.E', type: 'constant', ariaLabel: 'Euler\'s number' },
    { id: 'equals', label: <Equal size={20}/>, value: '=', type: 'equals', ariaLabel: 'Equals', variant: 'primary', className: 'col-span-2' },
  ],
   // Row 7: (Moved some functions here for a 5-column layout on keypad)
  [
    { id: 'log', label: 'log', value: 'log(', type: 'function', ariaLabel: 'Log base 10' },
    { id: 'ln', label: 'ln', value: 'ln(', type: 'function', ariaLabel: 'Natural Log' },
    { id: 'asin', label: 'asin', value: 'arcsin(', type: 'function', ariaLabel: 'Arcsine' },
    { id: 'acos', label: 'acos', value: 'arccos(', type: 'function', ariaLabel: 'Arccosine' },
    { id: 'atan', label: 'atan', value: 'arctan(', type: 'function', ariaLabel: 'Arctangent' },
  ],
];
