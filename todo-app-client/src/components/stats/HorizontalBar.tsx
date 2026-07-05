import { cn } from '@/lib/utils'

interface HorizontalBarProps {
  label: string
  value: number
  total: number
  barColor: string
  badgeClass?: string
}

export function HorizontalBar({ label, value, total, barColor, badgeClass }: HorizontalBarProps) {
  const pct = total === 0 ? 0 : Math.round((value / total) * 100)

  return (
    <div className="flex items-center gap-3">
      <span
        className={cn(
          'text-[10px] font-semibold px-1.5 py-0.5 rounded w-16 text-center shrink-0',
          badgeClass
        )}
      >
        {label}
      </span>
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: barColor }}
        />
      </div>
      <span className="text-xs font-semibold text-foreground w-6 text-right tabular-nums shrink-0">
        {value}
      </span>
    </div>
  )
}
