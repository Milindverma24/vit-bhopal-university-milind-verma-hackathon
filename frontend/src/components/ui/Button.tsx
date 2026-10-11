import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'subtle' | 'dark' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  className = '',
  ...props
}) => {
  // Pill geometry (999px border radius) required by Principle 3 & Section 6 of DESIGN.md
  let baseStyles = 'inline-flex items-center justify-center font-medium rounded-full transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  let sizeStyles = 'text-sm px-5 py-2.5 min-h-[44px] gap-2';
  if (size === 'sm') {
    sizeStyles = 'text-xs px-3.5 py-1.5 min-h-[36px] gap-1.5';
  } else if (size === 'lg') {
    sizeStyles = 'text-base px-6 py-3 min-h-[48px] gap-2.5';
  }

  let variantStyles = 'bg-black text-white hover:bg-[#282828] active:bg-[#1f1f1f]'; // primary
  if (variant === 'secondary') {
    variantStyles = 'bg-white text-black border border-[#d9d9d9] hover:bg-[#f3f3f3] active:bg-[#e2e2e2]';
  } else if (variant === 'subtle') {
    variantStyles = 'bg-[#efefef] text-black hover:bg-[#e2e2e2] active:bg-[#d9d9d9]';
  } else if (variant === 'dark') {
    variantStyles = 'bg-white text-black hover:bg-[#f3f3f3] active:bg-[#e2e2e2]';
  } else if (variant === 'outline') {
    variantStyles = 'bg-transparent text-black border border-[#d9d9d9] hover:bg-[#efefef]';
  }

  return (
    <button
      disabled={disabled || loading}
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-current" />
          <span>{children}</span>
        </>
      ) : (
        <>
          {icon && <span className="inline-flex shrink-0">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};
