import { Header } from '@/components/layout/Header'

export default function OverviewPage() {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <Header title="Overview" />
      <main className="flex-1 overflow-auto p-6">
        <p className="text-muted-foreground text-sm">Overview coming soon...</p>
      </main>
    </div>
  )
}
