import { Header } from '@/components/layout/Header'

export default function StatsPage() {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <Header title="Stats" />
      <main className="flex-1 overflow-auto p-6">
        <p className="text-muted-foreground text-sm">Stats coming soon...</p>
      </main>
    </div>
  )
}
