import {
  BarChart,
  Bar, 
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { NumericKey, StringKey } from '../../schemas/chart.types';

type BarChartProps<T> = {
  data: T[];
  dataKey: NumericKey<T>;
  nameKey: StringKey<T>;
  colors: string[];
  layout?: "horizontal" | "vertical";
  tooltipLabel?: string;
  customFormatter?: (value: number | string | undefined, name: string | undefined, props: { payload?: Record<string, unknown> }) => [string, string];
}

type TooltipProps = {
  active?: boolean;
  payload?: readonly {
    color: string;
    name: string;
    value: number | string;
    payload?: Record<string, unknown>;
  }[];
  label?: string | number;
  customFormatter?: (value: number | string | undefined, name: string | undefined, props: { payload?: Record<string, unknown> }) => [string, string];
  tooltipLabel?: string;
};

const CustomTooltip = ({ active, payload, label, customFormatter, tooltipLabel }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface rounded-lg shadow-lg p-3">
        <p className="text-primary font-medium mb-1">
          {label}
        </p>
          {payload.map((entry, index: number) => {
            if (customFormatter && entry.payload) {
              const [formattedValue, formattedName] = customFormatter(
                entry.value,
                entry.name,
                { payload: entry.payload }
              );
            
              return (
                <p key={index} className="text-primary text-sm">
                  <span style={{ color: entry.color }}/>
                  <span className='text-secondary'>
                    {formattedName}: {formattedValue}
                  </span>
                </p>
              );
            }
            
            const displayLabel = tooltipLabel || entry.name;
            return (
              <p key={index} className="text-primary text-sm">
                <span style={{ color: entry.color }}/>
                <span className='text-secondary'>
                  {displayLabel}: {entry.value}
                </span>
              </p>
            );
          })}
        </div>
      );
    }
  return null;
};

export default function BarChartData<T>({
  data,
  dataKey,
  nameKey,
  colors,
  layout = "horizontal",
  tooltipLabel,
  customFormatter,
}: BarChartProps<T>) {
  const isVertical = layout === "vertical";

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout={layout}>
        <CartesianGrid 
          strokeDasharray="3 3" 
          className="stroke-slate-200 dark:stroke-slate-700"
        />
        {isVertical ? (
          <>
            <XAxis 
              type="number"
              stroke="currentColor"
              className="text-slate-600 dark:text-slate-400"
            />
            <YAxis
              type="category"
              dataKey={nameKey as string}
              width={120}
              stroke="currentColor"
              className="text-slate-600 dark:text-slate-400"
            />
          </>
        ) : (
          <>
            <XAxis 
              dataKey={nameKey as string}
              stroke="currentColor"
              className="text-slate-600 dark:text-slate-400"
            />
            <YAxis
              stroke="currentColor"
              className="text-slate-600 dark:text-slate-400"
            />
          </>
        )}
        <Tooltip 
          content={(props) => (
            <CustomTooltip 
              {...props} 
              customFormatter={customFormatter}
              tooltipLabel={tooltipLabel}
            />
          )}
          cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }}
        />
        <Bar dataKey={dataKey as string} radius={isVertical ? [0, 8, 8, 0] : [8, 8, 0, 0]}>
          {data.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={colors[index % colors.length]}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}