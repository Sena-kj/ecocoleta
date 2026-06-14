import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Field } from '../components/ui'
import AuthScaffold from '../components/AuthScaffold'

export default function Register() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => navigate('/app/map'), 800)
  }

  return (
    <AuthScaffold
      eyebrow="Junte-se ao movimento"
      title={<>Cada descarte<br />vira <em>impacto real</em>.</>}
      pitch="Pilhas que não contaminam o solo, celulares que viram matéria-prima de novo. Você no centro dessa mudança."
      stats={[
        { value: '5', label: 'níveis de cidadania' },
        { value: '8', label: 'selos para conquistar' },
      ]}
    >
      <form onSubmit={submit}>
        <h2>Criar conta</h2>
        <p>Leva menos de um minuto.</p>
        <div className="stack" style={{ gap: 'var(--sp-4)' }}>
          <Field label="Nome completo" placeholder="Seu nome" required />
          <Field label="E-mail" type="email" placeholder="voce@email.com" required />
          <Field label="Bairro" placeholder="Onde você mora em Curitiba" />
          <Field label="Senha" type="password" placeholder="Mínimo 8 caracteres" required />
        </div>
        <div style={{ marginTop: 'var(--sp-5)' }}>
          <Button type="submit" size="lg" block loading={loading}>Criar minha conta</Button>
        </div>
        <p className="auth__alt">
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </form>
    </AuthScaffold>
  )
}
