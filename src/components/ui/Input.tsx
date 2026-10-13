import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ icon, className = "", ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        {icon ? (
          <span className="absolute left-3.5 text-muted-foreground pointer-events-none flex items-center justify-center">
            {icon}
          </span>
        ) : null}
        <input
          ref={ref}
          className={`h-11 w-full rounded-none border border-border bg-surface text-foreground font-sans text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors duration-150 ${
            icon ? "pl-10 pr-4" : "px-4"
          } ${className}`}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = "Input";
