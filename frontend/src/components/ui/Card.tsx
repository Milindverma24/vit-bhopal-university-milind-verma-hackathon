import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'standard' | 'soft' | 'dark' | 'elevated';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'standard',
  className = '',
  ...props
}) => {
  // 16px border-radius required by Section 3.2 and Section 8
  let baseStyle = 'rounded-2xl p-6 transition-all duration-150';
  
  if (variant === 'standard') {
    baseStyle += ' bg-white border border-[#d9d9d9] text-black';
  } else if (variant === 'soft') {
    baseStyle += ' bg-[#efefef] border border-[#d9d9d9] text-black';
  } else if (variant === 'dark') {
    baseStyle += ' bg-black border border-black text-white';
  } else if (variant === 'elevated') {
    baseStyle += ' bg-white border border-[#d9d9d9] shadow-[0_4px_16px_rgba(0,0,0,0.08)] text-black';
  }

  return (
    <div className={`${baseStyle} ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{
  title: string;
  description?: string;
  action?: React.ReactNode;
  tag?: string;
  className?: string;
}> = ({ title, description, action, tag, className = '' }) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-[#d9d9d9] ${className}`}>
      <div>
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-black tracking-tight">{title}</h3>
          {tag && (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#efefef] text-[#5e5e5e] border border-[#d9d9d9]">
              {tag}
            </span>
          )}
        </div>
        {description && (
          <p className="text-xs text-[#5e5e5e] mt-0.5 max-w-2xl">{description}</p>
        )}
      </div>
      {action && <div className="flex items-center gap-2 shrink-0">{action}</div>}
    </div>
  );
};

export const MetricCard: React.FC<{
  title: string;
  value: string | number;
  subValue?: string;
  description?: string;
  badge?: React.ReactNode;
  trend?: 'positive' | 'negative' | 'neutral';
  icon?: React.ReactNode;
  className?: string;
}> = ({ title, value, subValue, description, badge, trend, icon, className = '' }) => {
  return (
    <div className={`bg-white rounded-2xl p-5 border border-[#d9d9d9] flex flex-col justify-between ${className}`}>
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-medium text-[#5e5e5e]">{title}</span>
        {icon && <div className="text-black">{icon}</div>}
      </div>
      
      <div className="my-3">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold tracking-tight text-black tabular-nums">
            {value}
          </span>
          {subValue && (
            <span className="text-xs font-medium text-[#767676] tabular-nums">
              {subValue}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 text-xs text-[#767676] pt-2 border-t border-[#f3f3f3]">
        <span className="truncate">{description || 'Current period baseline'}</span>
        {badge}
      </div>
    </div>
  );
};
