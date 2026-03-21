import { Outlet } from 'react-router-dom'
import { ClusterSidebar } from '../components/ClusterSidebar'
import { Footer } from '../components/Footer'

export function DashboardLayout(props) {
  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <main className="min-h-0 flex-1">
        <div className="mx-auto flex h-full min-h-0 max-w-[1600px] gap-6 px-6 py-6">
          <ClusterSidebar {...props} />
          <section className="min-h-0 flex-1 overflow-y-auto pr-2">
            <Outlet />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
