import React from 'react';
import { Search, X, ChevronDown } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  suffix?: string;
}

export const TextInput: React.FC<InputProps> = ({
  label,
  helperText,
  error,
  suffix,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-bold text-[#b3b3b3] uppercase tracking-[1.4px] mb-2">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <input
          id={inputId}
          className={`w-full bg-[#1f1f1f] text-white text-sm rounded-[8px] px-4 py-3 min-h-[44px] border border-[#333333] placeholder-[#7c7c7c] focus:outline-none focus:border-[#1ed760] focus:ring-1 focus:ring-[#1ed760] transition-colors ${
            error ? 'border-[#f3727f] focus:ring-[#f3727f] focus:border-[#f3727f]' : 'hover:border-[#4d4d4d]'
          } ${suffix ? 'pr-12' : ''} ${className}`}
          {...props}
        />
        {suffix && (
          <span className="absolute right-3.5 text-xs font-mono font-medium text-[#b3b3b3] select-none">
            {suffix}
          </span>
        )}
      </div>
      {error && <p className="text-xs text-[#f3727f] font-medium mt-1.5 flex items-center gap-1">⚠️ {error}</p>}
      {!error && helperText && <p className="text-xs text-[#b3b3b3] mt-1.5">{helperText}</p>}
    </div>
  );
};

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  helperText,
  error,
  className = '',
  id,
  ...props
}) => {
  const areaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={areaId} className="block text-xs font-bold text-[#b3b3b3] uppercase tracking-[1.4px] mb-2">
          {label}
        </label>
      )}
      <textarea
        id={areaId}
        className={`w-full bg-[#1f1f1f] text-white text-sm rounded-[8px] p-4 border border-[#333333] placeholder-[#7c7c7c] focus:outline-none focus:border-[#1ed760] focus:ring-1 focus:ring-[#1ed760] transition-colors resize-y min-h-[112px] leading-relaxed ${
          error ? 'border-[#f3727f] focus:ring-[#f3727f] focus:border-[#f3727f]' : 'hover:border-[#4d4d4d]'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-[#f3727f] font-medium mt-1.5 flex items-center gap-1">⚠️ {error}</p>}
      {!error && helperText && <p className="text-xs text-[#b3b3b3] mt-1.5">{helperText}</p>}
    </div>
  );
};

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  options: { label: string; value: string | number }[];
}

export const SelectInput: React.FC<SelectProps> = ({
  label,
  helperText,
  options,
  className = '',
  id,
  ...props
}) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-bold text-[#b3b3b3] uppercase tracking-[1.4px] mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          className={`w-full bg-[#1f1f1f] text-white text-sm rounded-[8px] px-4 py-3 min-h-[44px] border border-[#333333] focus:outline-none focus:border-[#1ed760] focus:ring-1 focus:ring-[#1ed760] transition-colors appearance-none pr-10 cursor-pointer hover:border-[#4d4d4d] ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#181818] text-white">
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="w-4 h-4 text-[#b3b3b3] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
      {helperText && <p className="text-xs text-[#b3b3b3] mt-1.5">{helperText}</p>}
    </div>
  );
};

export interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value?: string;
  onChange?: (value: string) => void;
  onClear?: () => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  onClear,
  placeholder = 'What do you want to search?',
  className = '',
  ...props
}) => {
  return (
    <div className="relative flex items-center w-full">
      <Search className="w-4 h-4 text-[#b3b3b3] absolute left-4 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-[#1f1f1f] text-white text-sm rounded-full pl-11 pr-10 py-3 min-h-[44px] border border-[#333333] placeholder-[#7c7c7c] focus:outline-none focus:border-white focus:ring-2 focus:ring-white transition-all hover:border-[#4d4d4d] ${className}`}
        {...props}
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-3.5 text-[#b3b3b3] hover:text-white focus:outline-none p-1 rounded-full"
          aria-label="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
