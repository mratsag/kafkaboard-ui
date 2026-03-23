import { Outlet } from 'react-router-dom'
import { Footer } from '../components/Footer'

export function AuthLayout() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-stone-950">
      <div className="kb-app-background absolute inset-0" />
      <div className="kb-app-grid absolute inset-0 opacity-20" />

      <main className="relative flex flex-1">
        <Outlet />
      </main>
      <div className="relative">
        <Footer inverted />
      </div>
    </div>
  )
}
