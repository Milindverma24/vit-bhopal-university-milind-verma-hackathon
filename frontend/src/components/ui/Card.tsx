import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'standard' | 'soft' | 'dark' | 'elevated';
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'standard',
  hoverEffect = false,
  className = '',
  ...props
}) => {
  let baseStyle = 'rounded-[8px] p-6 transition-all duration-200 text-white';
  
  if (variant === 'standard') {
    baseStyle += ' bg-[#181818] border border-[#282828] shadow-[0_4px_12px_rgba(0,0,0,0.2)]';
  } else if (variant === 'soft') {
    baseStyle += ' bg-[#1f1f1f] border border-[#282828]';
  } else if (variant === 'dark') {
    baseStyle += ' bg-[#121212] border border-[#282828]';
  } else if (variant === 'elevated') {
    baseStyle += ' bg-[#242424] border border-[#333333] shadow-[0_8px_24px_rgba(0,0,0,0.5)]';
  }

  if (hoverEffect) {
    baseStyle += ' hover:bg-[#222222] hover:border-[#383838] hover:shadow-[0_8px_16px_rgba(0,0,0,0.4)]';
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
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-[#282828] ${className}`}>
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">{title}</h3>
          {tag && (
            <span className="text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full bg-[#1f1f1f] text-[#b3b3b3] border border-[#333333]">
              {tag}
            </span>
          )}
        </div>
        {description && (
          <p className="text-xs text-[#b3b3b3] mt-1 max-w-2xl leading-relaxed">{description}</p>
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
}> = ({ title, value, subValue, description, badge, icon, className = '' }) => {
  return (
    <div className={`group bg-[#181818] rounded-[8px] p-6 border border-[#282828] hover:border-[#383838] hover:bg-[#202020] hover:shadow-[0_8px_16px_rgba(0,0,0,0.4)] transition-all duration-200 flex flex-col justify-between ${className}`}>
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-bold uppercase tracking-[1.4px] text-[#b3b3b3]">{title}</span>
        {icon && <div className="text-[#b3b3b3] group-hover:text-[#1ed760] transition-colors p-1.5 rounded-full bg-[#1f1f1f]">{icon}</div>}
      </div>
      
      <div className="my-3">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-3xl font-bold tracking-tight text-white tabular-nums">
            {value}
          </span>
          {subValue && (
            <span className="text-xs font-mono font-medium text-[#b3b3b3] tabular-nums">
              {subValue}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 text-xs text-[#b3b3b3] pt-3 border-t border-[#282828] flex-wrap">
        <span className="text-[11px] text-[#b3b3b3] leading-snug line-clamp-1">{description || 'Current period baseline'}</span>
        {badge && <div className="shrink-0">{badge}</div>}
      </div>
    </div>
  );
};

export const SectionContainer: React.FC<{
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}> = ({ title, subtitle, action, children, className = '' }) => {
  return (
    <section className={`space-y-4 ${className}`}>
      {(title || action) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
          <div>
            {title && <h2 className="text-lg sm:text-xl font-bold tracking-tight text-black">{title}</h2>}
            {subtitle && <p className="text-xs text-[#5e5e5e] mt-0.5">{subtitle}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </section>
  );
};
