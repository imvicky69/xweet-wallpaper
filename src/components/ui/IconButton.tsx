import React from "react";

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg";
  variant?: "surface" | "primary" | "ghost" | "secondary";
  label: string;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ children, size = "md", variant = "surface", label, className = "", ...props }, ref) => {
    const sizeMap = {
      sm: "h-9 w-9 text-xs",
      md: "h-11 w-11 text-sm",
      lg: "h-13 w-13 text-base",
    };

    const variantMap = {
      surface: "bg-surface border border-border text-foreground hover:border-primary hover:text-primary",
      primary: "bg-primary border border-primary text-primary-foreground hover:bg-primary-hover",
      ghost: "bg-transparent border border-transparent text-foreground hover:bg-secondary/50",
      secondary: "bg-secondary border border-border text-secondary-foreground hover:bg-secondary/80",
    };

    return (
      <button
        ref={ref}
        aria-label={label}
        title={label}
        className={`inline-flex items-center justify-center rounded-none transition-colors duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${sizeMap[size]} ${variantMap[variant]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";
