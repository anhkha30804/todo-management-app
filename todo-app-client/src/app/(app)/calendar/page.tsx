import { Header } from '@/components/layout/Header'

export default function CalendarPage() {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <Header title="Calendar" />
      <main className="flex-1 overflow-auto p-6">
        <p className="text-muted-foreground text-sm">Calendar coming soon...</p>
      </main>
    </div>
  )
}
