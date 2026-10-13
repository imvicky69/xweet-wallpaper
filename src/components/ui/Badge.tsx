import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "muted" | "primary" | "secondary" | "outline";
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "muted",
  className = "",
  ...props
}) => {
  const variantStyles = {
    muted: "bg-muted/50 border-border text-muted-foreground",
    primary: "bg-primary text-primary-foreground border-primary",
    secondary: "bg-secondary text-secondary-foreground border-border",
    outline: "bg-transparent text-muted-foreground border-border",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[11px] font-mono tracking-wider uppercase rounded-none border ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
