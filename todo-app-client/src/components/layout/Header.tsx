'use client'

interface HeaderProps {
  title: string
  right?: React.ReactNode
}

export function Header({ title, right }: HeaderProps) {
  return (
    <header className="h-(--header-height) border-b border-border bg-card flex items-center justify-between px-6 pl-14 md:pl-6 sticky top-0 z-10 shrink-0">
      <h1 className="text-base font-semibold text-foreground">{title}</h1>
      {right && <div className="flex items-center gap-2">{right}</div>}
    </header>
  )
}
