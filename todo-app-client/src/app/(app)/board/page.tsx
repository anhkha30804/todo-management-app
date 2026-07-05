import { Header } from '@/components/layout/Header'

export default function BoardPage() {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <Header title="Board" />
      <main className="flex-1 overflow-auto p-6">
        <p className="text-muted-foreground text-sm">Kanban board coming soon...</p>
      </main>
    </div>
  )
}
