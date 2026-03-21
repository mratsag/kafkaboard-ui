import { Navigate, Outlet, useLocation } from 'react-router-dom'

export function PrivateRoute({ token }) {
  const location = useLocation()

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
