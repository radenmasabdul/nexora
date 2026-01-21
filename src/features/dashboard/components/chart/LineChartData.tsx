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
};

export default function LineChartData<T>({ data, dataKey, nameKey, color }: LineChartProps<T>) {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={nameKey as string} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey={dataKey as string} stroke={color} activeDot={{ r: 8 }} dot={{ fill: '#3b82f6', r: 4 }}/>
            </LineChart>
        </ResponsiveContainer>
    );
}