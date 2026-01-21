import { 
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import type { NumericKey, StringKey } from '../../schemas/chart.types';

type LineChartProps<T> = {
    data: T[];
    dataKey: NumericKey<T>;
    nameKey: StringKey<T>;
    color: string;
    label?: string;
};

type TooltipProps = {
  active?: boolean;
  payload?: readonly {
    color: string;
    name: string;
    value: number | string;
    payload?: Record<string, unknown>;
  }[];
  label?: string | number;
};

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface rounded-lg shadow-lg p-3">
        <p className="text-primary font-medium mb-1">
          {label}
        </p>
        {payload.map((entry, index: number) => (
          <p key={index} className="text-primary text-sm">
            <span style={{ color: entry.color }}/>
            <span className='text-secondary'>
              {entry.name}: {entry.value}
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function LineChartData<T>({ data, dataKey, nameKey, color, label }: LineChartProps<T>) {
    const displayLabel = label || (typeof dataKey === 'string' 
      ? dataKey.charAt(0).toUpperCase() + dataKey.slice(1) 
      : String(dataKey));
    
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            className="stroke-slate-200 dark:stroke-slate-700"
          />
          <XAxis 
            dataKey={nameKey as string}
            stroke="currentColor"
            className="text-slate-600 dark:text-slate-400"
          />
          <YAxis
            stroke="currentColor"
            className="text-slate-600 dark:text-slate-400"
          />
          <Tooltip 
            content={<CustomTooltip />}
            cursor={{ stroke: 'rgba(148, 163, 184, 0.3)' }}
          />
          <Legend 
            wrapperStyle={{
              color: 'currentColor'
            }}
            iconType="line"
          />
          <Line 
            type="monotone" 
            dataKey={dataKey as string}
            name={displayLabel}
            stroke={color} 
            activeDot={{ r: 8 }} 
            dot={{ fill: color, r: 4 }}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    );
}