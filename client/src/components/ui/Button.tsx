import { ButtonHTMLAttributes, forwardRef } from "react";
import "./Button.css";

type Variant = "primary" | "secondary" | "danger" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", isLoading, disabled, className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`btn btn-${variant} ${className ?? ""}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? "Please wait..." : children}
      </button>
    );
  }
);

Button.displayName = "Button";
