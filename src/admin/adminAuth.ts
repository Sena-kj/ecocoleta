// Autenticação do painel admin — client-side (protótipo, sem backend).
// Quando houver API real, trocar por verificação de papel ADMIN no servidor.
const KEY = 'ecocoleta-admin-auth'

// Credenciais do protótipo. Troque aqui quando quiser.
const ADMIN_USER = 'admin'
const ADMIN_PASSWORD = 'ecocoleta2025'

export function adminLogin(user: string, password: string): boolean {
  const ok = user.trim().toLowerCase() === ADMIN_USER && password === ADMIN_PASSWORD
  if (ok) sessionStorage.setItem(KEY, '1')
  return ok
}

export function isAdminAuthed(): boolean {
  return sessionStorage.getItem(KEY) === '1'
}

export function adminLogout(): void {
  sessionStorage.removeItem(KEY)
}
