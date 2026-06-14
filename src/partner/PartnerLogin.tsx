import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Button, Card, Field } from '../components/ui'
import { partnerLogin, isPartnerAuthed } from './partnerAuth'

export default function PartnerLogin() {
  const navigate = useNavigate()
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  if (isPartnerAuthed()) return <Navigate to="/partner" replace />

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(false)
    setTimeout(() => {
      if (partnerLogin(user, password)) {
        navigate('/partner', { replace: true })
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
          <img src={`${import.meta.env.BASE_URL}leaf.svg`} alt="" width={30} height={30} />
          Eco<b>Parceiro</b>
        </span>
        <h1>Área do parceiro</h1>
        <p className="muted">Acesso dos pontos de coleta parceiros do EcoColeta.</p>

        <form onSubmit={submit} className="stack" style={{ gap: 'var(--sp-4)', marginTop: 'var(--sp-5)' }}>
          <Field
            label="Usuário"
            placeholder="parceiro"
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

        <p className="faint" style={{ fontSize: 'var(--fs-xs)', marginTop: 'var(--sp-4)' }}>
          Demo: <b>parceiro</b> / <b>ecocoleta2025</b>
        </p>
        <button className="admin-login__back" onClick={() => navigate('/app/map')}>
          ← Voltar ao app
        </button>
      </Card>
    </div>
  )
}
