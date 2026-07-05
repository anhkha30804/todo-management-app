'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, BarChart2, Calendar, CheckSquare, X, Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const navItems = [
  { label: 'Overview', href: '/overview', icon: LayoutDashboard },
  { label: 'Board', href: '/board', icon: CheckSquare },
  { label: 'Stats', href: '/stats', icon: BarChart2 },
  { label: 'Calendar', href: '/calendar', icon: Calendar }
]

function NavContent({ pathname, onClose }: { pathname: string; onClose?: () => void }) {
  return (
    <>
      <div className="h-(--header-height) flex items-center justify-between px-5 border-b border-border shrink-0">
        <span className="font-semibold text-base text-foreground tracking-tight">todo.</span>
        {onClose && (
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground md:hidden"
          >
            <X size={18} />
          </button>
        )}
      </div>
      <nav className="flex-1 py-4 pl-10 pr-4 flex flex-col gap-0.5 overflow-y-auto">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-md text-sm transition-colors',
                active
                  ? 'bg-sidebar-accent text-sidebar-primary font-semibold border-l-2 border-sidebar-primary rounded-l-none'
                  : 'text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground'
              )}
            >
              <Icon size={16} />
              {label}
            </Link>
          )
        })}
      </nav>
    </>
  )
}

export function Sidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-(--sidebar-width) h-screen border-r border-border bg-sidebar sticky top-0 shrink-0">
        <NavContent pathname={pathname} />
      </aside>

      {/* Mobile toggle button */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-3 left-4 z-40 p-2 rounded-md bg-background border border-border text-foreground"
      >
        <Menu size={18} />
      </button>

      {/* Mobile overlay */}
      {open && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/40" onClick={() => setOpen(false)} />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          'md:hidden fixed top-0 left-0 z-50 flex flex-col w-(--sidebar-width) h-screen bg-sidebar border-r border-border transition-transform duration-200',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <NavContent pathname={pathname} onClose={() => setOpen(false)} />
      </aside>
    </>
  )
}
