import { Navigate } from 'react-router-dom'
import { isAdminAuthed } from './adminAuth'
import AdminShell from './AdminShell'

// Trava o /admin: só renderiza o painel se a sessão de admin estiver autenticada.
export default function RequireAdmin() {
  return isAdminAuthed() ? <AdminShell /> : <Navigate to="/admin/login" replace />
}
