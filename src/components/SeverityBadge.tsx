import { Severity } from '@/types/advisory';
import { cn } from '@/lib/utils';

interface SeverityBadgeProps {
  severity: Severity;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const severityConfig: Record<Severity, { bg: string; text: string; glow: string }> = {
  Critical: {
    bg: 'bg-severity-critical',
    text: 'text-white',
    glow: 'shadow-[0_0_12px_hsl(var(--severity-critical)/0.5)]',
  },
  High: {
    bg: 'bg-severity-high',
    text: 'text-white',
    glow: 'shadow-[0_0_12px_hsl(var(--severity-high)/0.5)]',
  },
  Medium: {
    bg: 'bg-severity-medium',
    text: 'text-black',
    glow: 'shadow-[0_0_12px_hsl(var(--severity-medium)/0.4)]',
  },
  Low: {
    bg: 'bg-severity-low',
    text: 'text-white',
    glow: 'shadow-[0_0_12px_hsl(var(--severity-low)/0.4)]',
  },
};

const sizeConfig = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
};

export function SeverityBadge({ severity, size = 'md', className }: SeverityBadgeProps) {
  const config = severityConfig[severity];

  return (
    <span
      className={cn(
        'inline-flex items-center font-semibold rounded-md uppercase tracking-wide',
        config.bg,
        config.text,
        config.glow,
        sizeConfig[size],
        className
      )}
    >
      {severity}
    </span>
  );
}
