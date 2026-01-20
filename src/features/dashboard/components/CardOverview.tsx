import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';

type CardOverviewProps = {
    title: string;
    value: number | string;
    description: string;
    icon: LucideIcon;
    borderColor: string;
    textColor?: string;
}

export default function CardOverview({ title, value, description, icon: Icon, borderColor, textColor = "text-slate-600", }: CardOverviewProps) {
  return (
    <Card className={`bg-white dark:bg-gray-800 border-l-4 ${borderColor}`}>
        <CardHeader className="pb-2">
            <CardDescription>{title}</CardDescription>
            <CardTitle className="text-3xl">{value}</CardTitle>
        </CardHeader>
        <CardContent>
            <div className={`flex items-center gap-2 text-sm ${textColor}`}>
                <Icon className="w-4 h-4" />
                <span>{description}</span>
            </div>
        </CardContent>
    </Card>
  )
}
