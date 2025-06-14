
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface KeypadButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string | React.ReactNode;
  buttonValue: string;
  buttonType: string;
  onButtonClick: (value: string, type: string) => void;
  variant?: "default" | "secondary" | "destructive" | "outline" | "ghost" | "link" | "accent" | "primary";
  className?: string;
  ariaLabel?: string;
}

const KeypadButton: React.FC<KeypadButtonProps> = ({
  label,
  buttonValue,
  buttonType,
  onButtonClick,
  variant = 'secondary', // Default variant
  className,
  ariaLabel,
  ...props
}) => {
  
  let buttonStyle = "";
  // Specific styling for primary and accent variants, otherwise use ShadCN's variant prop
  if (variant === "accent") {
    buttonStyle = "bg-accent text-accent-foreground hover:bg-accent/90";
  } else if (variant === "primary") {
     buttonStyle = "bg-primary text-primary-foreground hover:bg-primary/90";
  }

  return (
    <Button
      variant={variant === "accent" || variant === "primary" ? "default" : variant}
      className={cn(
        'text-lg md:text-xl font-medium h-12 md:h-14 w-full shadow-md active:shadow-inner active:scale-95 transition-all duration-150 ease-in-out focus:ring-2 focus:ring-ring focus:ring-offset-1 flex items-center justify-center p-0', // Added flex centering and p-0
        (buttonType === 'digit' || buttonType === 'decimal') && !(variant === "primary" || variant === "accent") ? 'bg-card hover:bg-muted text-foreground' : '',
        buttonType === 'operator' && !(variant === "primary" || variant === "accent") ? 'bg-muted hover:bg-secondary text-primary' : '',
        buttonType === 'function' && !(variant === "primary" || variant === "accent") ? 'bg-card hover:bg-muted/80 text-foreground' : '',
        buttonType === 'parenthesis' && !(variant === "primary" || variant === "accent") ? 'bg-card hover:bg-muted/80 text-foreground' : '',
        buttonType === 'constant' && !(variant === "primary" || variant === "accent") ? 'bg-card hover:bg-muted/80 text-foreground' : '',
        buttonStyle, // Apply primary/accent styles
        className
      )}
      onClick={() => onButtonClick(buttonValue, buttonType)}
      aria-label={ariaLabel || (typeof label === 'string' ? label : buttonValue)}
      {...props}
    >
      {label}
    </Button>
  );
};

export default KeypadButton;
