import React from 'react';

export interface Option<T extends string | number> {
  label: string;
  value: T;
  count?: number;
  icon?: React.ReactNode;
}

export interface SegmentedControlProps<T extends string | number> {
  options: Option<T>[];
  value: T;
  onChange: (val: T) => void;
  size?: 'sm' | 'md';
  className?: string;
}

export function SegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
  size = 'md',
  className = ''
}: SegmentedControlProps<T>) {
  return (
    <div className={`inline-flex items-center p-1 bg-[#efefef] rounded-full border border-[#d9d9d9] ${className}`}>
      {options.map((opt) => {
        const isActive = opt.value === value;
        return (
          <button
            key={String(opt.value)}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`inline-flex items-center gap-1.5 rounded-full font-medium transition-all duration-150 select-none ${
              size === 'sm' ? 'px-3 py-1 text-xs' : 'px-4 py-1.5 text-sm'
            } ${
              isActive
                ? 'bg-black text-white shadow-sm'
                : 'text-[#5e5e5e] hover:text-black hover:bg-[#e2e2e2]'
            }`}
          >
            {opt.icon && <span className="inline-flex shrink-0">{opt.icon}</span>}
            <span>{opt.label}</span>
            {opt.count !== undefined && (
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-full tabular-nums ${
                  isActive ? 'bg-[#282828] text-white' : 'bg-[#d9d9d9] text-[#5e5e5e]'
                }`}
              >
                {opt.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export interface FilterChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
  count?: number;
}

export const FilterChip: React.FC<FilterChipProps> = ({
  label,
  active,
  onClick,
  count
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-150 border select-none ${
        active
          ? 'bg-black text-white border-black shadow-sm'
          : 'bg-[#efefef] text-[#5e5e5e] border-[#d9d9d9] hover:border-black hover:text-black'
      }`}
    >
      <span>{label}</span>
      {count !== undefined && (
        <span
          className={`text-[10px] px-1.5 py-0.2 rounded-full tabular-nums ${
            active ? 'bg-[#282828] text-white' : 'bg-[#d9d9d9] text-black'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
};
