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
    <div className={`inline-flex items-center p-1 bg-[#181818] rounded-full border border-[#282828] ${className}`}>
      {options.map((opt) => {
        const isActive = opt.value === value;
        return (
          <button
            key={String(opt.value)}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`inline-flex items-center gap-1.5 rounded-full font-bold uppercase tracking-[1px] transition-all duration-150 select-none cursor-pointer ${
              size === 'sm' ? 'px-3 py-1 text-[11px]' : 'px-4 py-1.5 text-xs'
            } ${
              isActive
                ? 'bg-white text-black shadow-sm'
                : 'text-[#b3b3b3] hover:text-white hover:bg-[#242424]'
            }`}
          >
            {opt.icon && <span className="inline-flex shrink-0">{opt.icon}</span>}
            <span>{opt.label}</span>
            {opt.count !== undefined && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full tabular-nums font-mono ${
                  isActive ? 'bg-[#e0e0e0] text-black' : 'bg-[#242424] text-[#b3b3b3]'
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
      className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-150 border select-none cursor-pointer ${
        active
          ? 'bg-white text-black border-white'
          : 'bg-[#242424] text-white border-[#333333] hover:border-[#4d4d4d] hover:bg-[#2a2a2a]'
      }`}
    >
      <span>{label}</span>
      {count !== undefined && (
        <span
          className={`text-[10px] px-1.5 py-0.2 rounded-full tabular-nums font-mono ${
            active ? 'bg-[#e0e0e0] text-black' : 'bg-[#181818] text-[#b3b3b3]'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
};
