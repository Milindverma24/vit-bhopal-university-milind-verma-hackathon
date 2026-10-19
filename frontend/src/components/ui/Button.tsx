import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'subtle' | 'dark' | 'outline' | 'floating';
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
  const baseStyles = 'inline-flex items-center justify-center font-bold uppercase tracking-[1.4px] rounded-full whitespace-nowrap transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1ed760] focus-visible:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed select-none cursor-pointer active:scale-[0.98]';

  let sizeStyles = 'text-xs sm:text-sm px-6 py-3 min-h-[44px] gap-2';
  if (size === 'sm') {
    sizeStyles = 'text-[11px] sm:text-xs px-4 py-2 min-h-[36px] gap-1.5';
  } else if (size === 'lg') {
    sizeStyles = 'text-sm sm:text-base px-8 py-3.5 min-h-[50px] gap-2.5';
  }

  let variantStyles = 'bg-[#1ed760] text-black hover:bg-[#1fdf64] hover:scale-[1.02] active:bg-[#1db954] shadow-[0_4px_12px_rgba(30,215,96,0.2)] border-0'; // primary
  if (variant === 'secondary') {
    variantStyles = 'bg-[#1f1f1f] text-white border border-[#4d4d4d] hover:border-white hover:bg-[#282828] active:bg-[#181818]';
  } else if (variant === 'subtle') {
    variantStyles = 'bg-[#181818] text-[#b3b3b3] hover:text-white hover:bg-[#252525] border border-transparent active:bg-[#1f1f1f]';
  } else if (variant === 'dark') {
    variantStyles = 'bg-[#1f1f1f] text-white border border-[#4d4d4d] hover:border-white hover:bg-[#282828]';
  } else if (variant === 'outline') {
    variantStyles = 'bg-transparent text-white border border-[#7c7c7c] hover:border-white hover:bg-[#1f1f1f]';
  } else if (variant === 'floating') {
    variantStyles = 'bg-[#1ed760] text-black shadow-[0_8px_24px_rgba(0,0,0,0.5)] hover:scale-105 active:scale-95';
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
          {children && <span>{children}</span>}
        </>
      )}
    </button>
  );
};
