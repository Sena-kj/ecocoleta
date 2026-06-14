// Autenticação da área do parceiro — client-side (protótipo, sem backend).
// Análogo ao adminAuth: quando houver API real, trocar por verificação de
// papel PARTNER no servidor.
const KEY = 'ecocoleta-partner-auth'

// Credenciais do protótipo. Troque aqui quando quiser.
const PARTNER_USER = 'parceiro'
const PARTNER_PASSWORD = 'ecocoleta2025'

export function partnerLogin(user: string, password: string): boolean {
  const ok = user.trim().toLowerCase() === PARTNER_USER && password === PARTNER_PASSWORD
  if (ok) sessionStorage.setItem(KEY, '1')
  return ok
}

export function isPartnerAuthed(): boolean {
  return sessionStorage.getItem(KEY) === '1'
}

export function partnerLogout(): void {
  sessionStorage.removeItem(KEY)
}
