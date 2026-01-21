import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type CardChartProps = {
    title: string;
    description?: string;
    children: React.ReactNode;
}

export default function CardChart({ title, description, children }: CardChartProps) {
  return (
    <Card className='bg-surface'>
      <CardHeader>
        <CardTitle className='text-primary'>{title}</CardTitle>
        {description && (
          <CardDescription className='text-secondary'>{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  )
}