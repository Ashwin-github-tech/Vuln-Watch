import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'critical' | 'high' | 'medium' | 'low' | 'primary';
  className?: string;
}

const variantStyles = {
  default: 'border-border/50',
  critical: 'border-severity-critical/30 bg-severity-critical/5',
  high: 'border-severity-high/30 bg-severity-high/5',
  medium: 'border-severity-medium/30 bg-severity-medium/5',
  low: 'border-severity-low/30 bg-severity-low/5',
  primary: 'border-primary/30 bg-primary/5',
};

const iconStyles = {
  default: 'text-muted-foreground',
  critical: 'text-severity-critical',
  high: 'text-severity-high',
  medium: 'text-severity-medium',
  low: 'text-severity-low',
  primary: 'text-primary',
};

const valueStyles = {
  default: 'text-foreground',
  critical: 'text-severity-critical',
  high: 'text-severity-high',
  medium: 'text-severity-medium',
  low: 'text-severity-low',
  primary: 'text-primary',
};

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'glass rounded-xl p-5 animate-fade-in transition-all duration-300 hover:scale-[1.02]',
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            {title}
          </p>
          <p className={cn('text-3xl font-bold tabular-nums', valueStyles[variant])}>
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <p
              className={cn(
                'text-xs font-medium',
                trend.isPositive ? 'text-severity-low' : 'text-severity-critical'
              )}
            >
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% from last week
            </p>
          )}
        </div>
        {Icon && (
          <div className={cn('p-2 rounded-lg bg-muted/50', iconStyles[variant])}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </div>
  );
}
