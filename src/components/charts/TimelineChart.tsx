import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import { TimelineStats } from '@/types/advisory';
import { format, parseISO } from 'date-fns';

interface TimelineChartProps {
  data: TimelineStats[];
}

export function TimelineChart({ data }: TimelineChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const date = format(parseISO(label), 'MMM d, yyyy');
      return (
        <div className="glass rounded-lg px-3 py-2 shadow-xl">
          <p className="text-sm font-medium text-foreground mb-1">{date}</p>
          <div className="space-y-0.5">
            {payload[0].payload.critical > 0 && (
              <p className="text-xs text-severity-critical">Critical: {payload[0].payload.critical}</p>
            )}
            {payload[0].payload.high > 0 && (
              <p className="text-xs text-severity-high">High: {payload[0].payload.high}</p>
            )}
            {payload[0].payload.medium > 0 && (
              <p className="text-xs text-severity-medium">Medium: {payload[0].payload.medium}</p>
            )}
            {payload[0].payload.low > 0 && (
              <p className="text-xs text-severity-low">Low: {payload[0].payload.low}</p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass rounded-xl p-5 h-[280px]">
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
        Advisory Timeline
      </h3>
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.4} />
              <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 14%)" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 10 }}
            axisLine={{ stroke: 'hsl(217, 33%, 18%)' }}
            tickLine={false}
            tickFormatter={(value) => format(parseISO(value), 'MMM d')}
          />
          <YAxis
            tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="count"
            stroke="hsl(217, 91%, 60%)"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorCount)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
