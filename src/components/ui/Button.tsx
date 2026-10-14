import React from "react";
import Link from "next/link";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  href?: string;
  target?: string;
  rel?: string;
  download?: boolean | string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      href,
      target,
      rel,
      download,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-sans font-medium rounded-none tracking-normal transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

    const variantStyles = {
      primary:
        "bg-primary text-primary-foreground border-2 border-primary hover:bg-transparent hover:text-primary hover:border-primary hover:shadow-[0_4px_22px_rgba(36,75,56,0.28)] hover:-translate-y-0.5 active:translate-y-0 shadow-xs",
      secondary:
        "bg-surface text-primary border border-border hover:border-primary hover:bg-surface/80 hover:-translate-y-0.5 active:translate-y-0 shadow-xs",
      ghost:
        "bg-transparent text-foreground hover:bg-secondary/60 hover:text-secondary-foreground border border-transparent",
      outline:
        "bg-transparent text-foreground border border-border hover:border-foreground hover:-translate-y-0.5 active:translate-y-0",
    };

    const sizeStyles = {
      sm: "h-9 px-4 text-xs gap-1.5",
      md: "h-11 px-6 text-sm gap-2",
      lg: "h-13 px-8 text-base gap-2.5",
    };

    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

    if (href) {
      const isInternal = href.startsWith("/") || href.startsWith("#");
      if (isInternal) {
        return (
          <Link href={href} className={combinedClassName}>
            {isLoading ? (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
            ) : null}
            {children}
          </Link>
        );
      }
      return (
        <a
          href={href}
          target={target}
          rel={rel}
          download={download}
          className={combinedClassName}
        >
          {isLoading ? (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
          ) : null}
          {children}
        </a>
      );
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={combinedClassName}
        {...props}
      >
        {isLoading ? (
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
