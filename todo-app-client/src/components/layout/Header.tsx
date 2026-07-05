'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface HeaderProps {
  title: string
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="h-(--header-height) border-b border-border bg-background flex items-center justify-between px-6 pl-14 md:pl-6 sticky top-0 z-10">
      <h1 className="text-base font-semibold text-foreground">{title}</h1>
      <div className="relative w-56">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search..." className="pl-8 h-8 text-sm bg-muted/50 border-none" />
      </div>
    </header>
  )
}
