import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Field } from '../components/ui'
import AuthScaffold from '../components/AuthScaffold'
import { SEARCH_RADIUS_KM } from '../catalog'

export default function Login() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    // Mock: sem backend. Simula autenticação e entra.
    setTimeout(() => navigate('/app/map'), 700)
  }

  return (
    <AuthScaffold
      eyebrow="Curitiba · 2026"
      title={<>Descartar certo,<br />tão fácil quanto <em>jogar fora</em>.</>}
      pitch="Encontre pontos de coleta de lixo eletrônico perto de você, ganhe pontos e vire referência ambiental no seu bairro."
      stats={[
        { value: '+20', label: 'pontos em Curitiba' },
        { value: '72%', label: 'têm e-lixo parado em casa' },
        { value: `${SEARCH_RADIUS_KM} km`, label: 'raio de busca' },
      ]}
    >
      <form onSubmit={submit}>
        <h2>Bem-vinda de volta</h2>
        <p>Entre para continuar cuidando do planeta.</p>
        <div className="stack" style={{ gap: 'var(--sp-4)' }}>
          <Field label="E-mail" type="email" placeholder="voce@email.com" required defaultValue="marina@exemplo.example" />
          <Field label="Senha" type="password" placeholder="••••••••" required defaultValue="demo1234" />
        </div>
        <div style={{ marginTop: 'var(--sp-5)' }}>
          <Button type="submit" size="lg" block loading={loading}>Entrar</Button>
        </div>
        <div className="auth__divider">ou</div>
        <Button type="button" variant="outline" block onClick={() => navigate('/app/map')}>
          Entrar como visitante
        </Button>
        <p className="auth__alt">
          Ainda não tem conta? <Link to="/register">Cadastre-se</Link>
        </p>
      </form>
    </AuthScaffold>
  )
}
