import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Field } from '../components/ui'

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
    <div className="auth">
      <aside className="auth__art">
        <span className="brand">
          <img src={`${import.meta.env.BASE_URL}leaf.svg`} alt="" />
          Eco<b>Coleta</b>
        </span>
        <div className="auth__pitch rise">
          <span className="eyebrow" style={{ color: 'var(--leaf-glow)' }}>Curitiba · 2026</span>
          <h1>
            Descartar certo,<br />tão fácil quanto <em>jogar fora</em>.
          </h1>
          <p>
            Encontre pontos de coleta de lixo eletrônico perto de você, ganhe pontos
            e vire referência ambiental no seu bairro.
          </p>
        </div>
        <div className="auth__stats rise">
          <div className="auth__stat"><b>+14</b><span>pontos em Curitiba</span></div>
          <div className="auth__stat"><b>72%</b><span>têm e-lixo parado em casa</span></div>
          <div className="auth__stat"><b>5 km</b><span>raio de busca</span></div>
        </div>
      </aside>

      <section className="auth__form">
        <form className="auth__formInner rise" onSubmit={submit}>
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
      </section>
    </div>
  )
}
