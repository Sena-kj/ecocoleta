import { createBrowserRouter, Navigate } from 'react-router-dom'
import AppShell from './components/AppShell'
import Onboarding from './screens/Onboarding'
import Login from './screens/Login'
import Register from './screens/Register'
import MapHome from './screens/MapHome'
import PointDetail from './screens/PointDetail'
import CreateDisposal from './screens/CreateDisposal'
import QrCode from './screens/QrCode'
import History from './screens/History'
import Profile from './screens/Profile'
import Ranking from './screens/Ranking'
import Education from './screens/Education'
import Rewards from './screens/Rewards'
import RequireAdmin from './admin/RequireAdmin'
import AdminLogin from './admin/AdminLogin'
import AdminDashboard from './admin/AdminDashboard'
import AdminCatalog from './admin/AdminCatalog'
import AdminPartners from './admin/AdminPartners'
import AdminRedemptions from './admin/AdminRedemptions'

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/onboarding" replace /> },
  { path: '/onboarding', element: <Onboarding /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  {
    path: '/app',
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/app/map" replace /> },
      { path: 'map', element: <MapHome /> },
      { path: 'point/:id', element: <PointDetail /> },
      { path: 'disposal/new', element: <CreateDisposal /> },
      { path: 'qr/:id', element: <QrCode /> },
      { path: 'rewards', element: <Rewards /> },
      { path: 'history', element: <History /> },
      { path: 'profile', element: <Profile /> },
      { path: 'ranking', element: <Ranking /> },
      { path: 'education', element: <Education /> },
    ],
  },
  { path: '/admin/login', element: <AdminLogin /> },
  {
    path: '/admin',
    element: <RequireAdmin />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'catalog', element: <AdminCatalog /> },
      { path: 'partners', element: <AdminPartners /> },
      { path: 'redemptions', element: <AdminRedemptions /> },
    ],
  },
  { path: '*', element: <Navigate to="/onboarding" replace /> },
])
