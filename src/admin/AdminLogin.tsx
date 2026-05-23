import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Button, Card, Field } from '../components/ui'
import { adminLogin, isAdminAuthed } from './adminAuth'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  // Se já estiver logado, vai direto.
  if (isAdminAuthed()) return <Navigate to="/admin" replace />

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(false)
    setTimeout(() => {
      if (adminLogin(user, password)) {
        navigate('/admin', { replace: true })
      } else {
        setError(true)
        setLoading(false)
      }
    }, 450)
  }

  return (
    <div className="admin-login">
      <Card className="admin-login__card rise">
        <span className="brand" style={{ justifyContent: 'center' }}>
          <img src="/leaf.svg" alt="" width={30} height={30} />
          Eco<b>Admin</b>
        </span>
        <h1>Área restrita</h1>
        <p className="muted">Acesso exclusivo da administração do EcoColeta.</p>

        <form onSubmit={submit} className="stack" style={{ gap: 'var(--sp-4)', marginTop: 'var(--sp-5)' }}>
          <Field
            label="Usuário"
            placeholder="admin"
            value={user}
            autoComplete="username"
            onChange={(e) => setUser(e.target.value)}
            required
          />
          <Field
            label="Senha"
            type="password"
            placeholder="••••••••"
            value={password}
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && (
            <p style={{ color: 'var(--danger)', fontSize: 'var(--fs-sm)', fontWeight: 600 }}>
              Usuário ou senha incorretos.
            </p>
          )}
          <Button type="submit" size="lg" block loading={loading}>Entrar no painel</Button>
        </form>

        <button className="admin-login__back" onClick={() => navigate('/app/map')}>
          ← Voltar ao app
        </button>
      </Card>
    </div>
  )
}
