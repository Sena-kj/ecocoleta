import { Navigate } from 'react-router-dom'
import { isPartnerAuthed } from './partnerAuth'
import PartnerShell from './PartnerShell'

// Trava o /partner: só renderiza o painel se a sessão de parceiro estiver autenticada.
export default function RequirePartner() {
  return isPartnerAuthed() ? <PartnerShell /> : <Navigate to="/partner/login" replace />
}
