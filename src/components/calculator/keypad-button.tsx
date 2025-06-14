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
  variant = 'secondary',
  className,
  ariaLabel,
  ...props
}) => {
  
  let buttonStyle = "";
  if (variant === "accent") {
    buttonStyle = "bg-accent text-accent-foreground hover:bg-accent/90";
  } else if (variant === "primary") {
     buttonStyle = "bg-primary text-primary-foreground hover:bg-primary/90";
  }


  return (
    <Button
      variant={variant === "accent" || variant === "primary" ? "default" : variant}
      className={cn(
        'text-lg md:text-xl font-medium h-16 w-full shadow-md active:shadow-inner active:scale-95 transition-all duration-150 ease-in-out focus:ring-2 focus:ring-ring focus:ring-offset-1',
        buttonType === 'digit' || buttonType === 'decimal' ? 'bg-card hover:bg-muted' : '',
        buttonType === 'operator' ? 'bg-muted hover:bg-secondary text-primary' : '',
        buttonStyle,
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
