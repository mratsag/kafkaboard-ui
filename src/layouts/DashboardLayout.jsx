import { Outlet } from 'react-router-dom'
import { ClusterSidebar } from '../components/ClusterSidebar'
import { Footer } from '../components/Footer'

export function DashboardLayout(props) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-stone-950 text-stone-900 dark:text-stone-100">
      <div className="kb-app-background absolute inset-0" />
      <div className="kb-app-grid absolute inset-0 opacity-20" />

      <main className="relative min-h-0 flex-1">
        <div className="mx-auto flex h-full min-h-0 max-w-[1600px] gap-6 px-6 py-6">
          <ClusterSidebar {...props} />
          <section className="min-h-0 flex-1 overflow-y-auto pr-2">
            <Outlet />
          </section>
        </div>
      </main>
      <div className="relative">
        <Footer inverted />
      </div>
    </div>
  )
}
