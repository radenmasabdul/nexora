import { Card } from '@/components/ui/card'
import type { LucideIcon } from 'lucide-react'

type CardRoleProps = {
  title: string
  value: number | string
  icon: LucideIcon
  iconBg: string
  iconColor: string
}

export default function CardRole({
  title,
  value,
  icon: Icon,
  iconBg,
  iconColor,
}: CardRoleProps) {
  return (
    <Card className="bg-surface rounded-xl shadow-sm border border-default p-5">
      <div className="flex items-center gap-3">
        <div className={`p-3 rounded-lg ${iconBg}`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>

        <div>
          <p className="text-sm text-primary">{title}</p>
          <p className="text-2xl font-bold text-primary">{value}</p>
        </div>
      </div>
    </Card>
  )
}