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
  
  const customTooltipFormatter = (
    value: number | undefined,
    _name: string | undefined,
    props: { payload?: Record<string, unknown> }
  ) => {
    if (value === undefined || !props.payload) return ["", ""];
    
    const itemName = props.payload[nameKey as string];
    const label = tooltipLabel || (dataKey as string);
    
    return [`${value}`, `${itemName}, ${label}`];
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout={layout}>
        <CartesianGrid strokeDasharray="3 3" />
          {isVertical ? (
            <>
              <XAxis type="number" />
              <YAxis
                type="category"
                dataKey={nameKey as string}
                width={120}
              />
            </>
            ) : (
            <>
              <XAxis dataKey={nameKey as string} />
              <YAxis />
            </>
          )}
          <Tooltip formatter={customFormatter || customTooltipFormatter}/>
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