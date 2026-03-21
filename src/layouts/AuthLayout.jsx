import { Outlet } from 'react-router-dom'
import { Footer } from '../components/Footer'

export function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      <main className="flex flex-1">
        <Outlet />
      </main>
      <Footer inverted />
    </div>
  )
}
