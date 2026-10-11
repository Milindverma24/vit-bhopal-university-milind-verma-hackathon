import React from 'react';
import { Search, X } from 'lucide-react';

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
        <label htmlFor={inputId} className="block text-sm font-medium text-black mb-1.5">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <input
          id={inputId}
          className={`w-full bg-[#efefef] text-black text-sm rounded-lg px-4 py-3 min-h-[44px] border border-[#d9d9d9] placeholder-[#767676] focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all ${error ? 'border-black ring-1 ring-black' : ''} ${suffix ? 'pr-12' : ''} ${className}`}
          {...props}
        />
        {suffix && (
          <span className="absolute right-3.5 text-xs font-medium text-[#767676] select-none">
            {suffix}
          </span>
        )}
      </div>
      {error && <p className="text-xs text-black font-semibold mt-1.5 flex items-center gap-1">⚠️ {error}</p>}
      {!error && helperText && <p className="text-xs text-[#5e5e5e] mt-1.5">{helperText}</p>}
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
        <label htmlFor={areaId} className="block text-sm font-medium text-black mb-1.5">
          {label}
        </label>
      )}
      <textarea
        id={areaId}
        className={`w-full bg-[#efefef] text-black text-sm rounded-lg p-4 border border-[#d9d9d9] placeholder-[#767676] focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all resize-y min-h-[100px] ${error ? 'border-black ring-1 ring-black' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-black font-semibold mt-1.5 flex items-center gap-1">⚠️ {error}</p>}
      {!error && helperText && <p className="text-xs text-[#5e5e5e] mt-1.5">{helperText}</p>}
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
        <label htmlFor={selectId} className="block text-sm font-medium text-black mb-1.5">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`w-full bg-[#efefef] text-black text-sm rounded-lg px-4 py-3 min-h-[44px] border border-[#d9d9d9] focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {helperText && <p className="text-xs text-[#5e5e5e] mt-1.5">{helperText}</p>}
    </div>
  );
};

export const SearchInput: React.FC<{
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
}> = ({ value, onChange, placeholder = 'Search intelligence, tickers, headlines...', className = '' }) => {
  return (
    <div className={`relative flex items-center ${className}`}>
      <Search className="w-4 h-4 text-[#767676] absolute left-3.5 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#efefef] text-black text-sm rounded-full pl-10 pr-9 py-2 min-h-[40px] border border-[#d9d9d9] placeholder-[#767676] focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-3 text-[#767676] hover:text-black transition-colors"
          title="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
