import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { VendorStats } from '@/types/advisory';

interface VendorBarChartProps {
  data: VendorStats[];
}

export function VendorBarChart({ data }: VendorBarChartProps) {
  const sortedData = [...data].sort((a, b) => b.count - a.count).slice(0, 8);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass rounded-lg px-3 py-2 shadow-xl">
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="text-xs text-muted-foreground">
            {payload[0].value} advisories
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass rounded-xl p-5 h-[340px]">
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
        Advisories by Vendor
      </h3>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart
          data={sortedData}
          layout="vertical"
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <XAxis
            type="number"
            tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }}
            axisLine={{ stroke: 'hsl(217, 33%, 18%)' }}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="vendor"
            tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={100}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(217, 33%, 14%)' }} />
          <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={20}>
            {sortedData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={`hsl(217, 91%, ${60 - index * 5}%)`}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
