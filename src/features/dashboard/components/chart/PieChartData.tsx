import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import type { NumericKey, StringKey } from "../../schemas/chart.types"

type PieChartProps<T> = {
  data: T[];
  dataKey: NumericKey<T>;
  nameKey: StringKey<T>;
  colors: string[];
};

export default function PieChartData<T>({
  data,
  dataKey,
  nameKey,
  colors,
}: PieChartProps<T>) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data as unknown as Array<Record<string, string | number>>}
          dataKey={dataKey as string}
          nameKey={nameKey as string}
          cx="50%"
          cy="50%"
          outerRadius={80}
          label={({ name, percent }) =>
            `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
          }
        >
          {data.map((_, index: number) => (
            <Cell
              key={index}
              fill={colors[index % colors.length]}
            />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}