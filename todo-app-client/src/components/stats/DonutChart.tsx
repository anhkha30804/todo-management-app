interface Segment {
  value: number
  color: string
  label: string
}

interface DonutChartProps {
  segments: Segment[]
  total: number
  centerLabel?: string
  centerValue?: string | number
  size?: number
  thickness?: number
}

export function DonutChart({
  segments,
  total,
  centerLabel,
  centerValue,
  size = 160,
  thickness = 20
}: DonutChartProps) {
  const cx = size / 2
  const cy = size / 2
  const r = (size - thickness) / 2
  const circumference = 2 * Math.PI * r
  const gap = total === 0 ? 0 : 2

  let cumulativeOffset = 0

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {total === 0 ? (
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="var(--border)"
            strokeWidth={thickness}
          />
        ) : (
          segments.map((seg, i) => {
            const pct = seg.value / total
            const dashLength = Math.max(0, pct * circumference - gap)
            const offset = -(cumulativeOffset * circumference)
            cumulativeOffset += pct

            return (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke={seg.color}
                strokeWidth={thickness}
                strokeDasharray={`${dashLength} ${circumference}`}
                strokeDashoffset={offset}
                strokeLinecap="butt"
              />
            )
          })
        )}
      </svg>

      {(centerLabel || centerValue !== undefined) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {centerValue !== undefined && (
            <span className="text-2xl font-bold text-foreground leading-none">{centerValue}</span>
          )}
          {centerLabel && (
            <span className="text-[10px] text-muted-foreground mt-1 font-medium">
              {centerLabel}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
