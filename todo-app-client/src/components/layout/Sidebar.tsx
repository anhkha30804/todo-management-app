'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, BarChart2, Calendar, CheckSquare, X, Menu, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'

const navItems = [
   { label: 'Overview', href: '/overview', icon: LayoutDashboard },
   { label: 'Board', href: '/board', icon: CheckSquare },
   { label: 'Stats', href: '/stats', icon: BarChart2 },
   { label: 'Calendar', href: '/calendar', icon: Calendar }
]

function NavContent({ pathname, onClose }: { pathname: string; onClose?: () => void }) {
   const { logout } = useAuth()

   return (
      <>
         <div className="h-(--header-height) flex items-center justify-between px-5 border-b border-border shrink-0">
            <span className="font-semibold text-base text-foreground tracking-tight">
               TodoBoard
            </span>
            {onClose && (
               <button
                  onClick={onClose}
                  className="text-muted-foreground hover:text-foreground md:hidden shrink-0"
               >
                  <X size={18} />
               </button>
            )}
         </div>
         <nav className="flex-1 py-8 pl-12 pr-0 flex flex-col gap-6 overflow-y-auto">
            {navItems.map(({ label, href, icon: Icon }) => {
               const active = pathname === href || pathname.startsWith(href + '/')
               return (
                  <Link
                     key={href}
                     href={href}
                     onClick={onClose}
                     className={cn(
                        'group flex items-center gap-4 py-2 pr-6 border-r-[3px] transition-all text-sm select-none',
                        active
                           ? 'border-r-teal-600 text-foreground font-semibold'
                           : 'border-r-transparent text-muted-foreground hover:text-foreground hover:font-semibold'
                     )}
                  >
                     <Icon
                        size={18}
                        strokeWidth={active ? 2.5 : 2}
                        className="transition-all group-hover:[stroke-width:2.5px]"
                     />
                     {label}
                  </Link>
               )
            })}
         </nav>

         {/* Logout button at the bottom */}
         <div className="p-5 border-t border-border flex flex-col gap-3 shrink-0">
            <button
               onClick={() => {
                  if (onClose) onClose()
                  logout()
               }}
               className="w-full flex items-center gap-3 py-2 px-3 rounded-lg text-sm text-red-500 hover:bg-red-500/5 transition-all cursor-pointer font-medium"
            >
               <LogOut size={16} />
               Sign Out
            </button>
         </div>
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
            <div
               className="md:hidden fixed inset-0 z-40 bg-black/40"
               onClick={() => setOpen(false)}
            />
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
