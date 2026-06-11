import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Field } from '../components/ui'

export default function Register() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => navigate('/app/map'), 800)
  }

  return (
    <div className="auth">
      <aside className="auth__art">
        <span className="brand">
          <img src={`${import.meta.env.BASE_URL}leaf.svg`} alt="" />
          Eco<b>Coleta</b>
        </span>
        <div className="auth__pitch rise">
          <span className="eyebrow" style={{ color: 'var(--leaf-glow)' }}>Junte-se ao movimento</span>
          <h1>
            Cada descarte<br />vira <em>impacto real</em>.
          </h1>
          <p>
            Pilhas que não contaminam o solo, celulares que viram matéria-prima de novo.
            Você no centro dessa mudança.
          </p>
        </div>
        <div className="auth__stats rise">
          <div className="auth__stat"><b>5</b><span>níveis de cidadania</span></div>
          <div className="auth__stat"><b>8</b><span>selos para conquistar</span></div>
        </div>
      </aside>

      <section className="auth__form">
        <form className="auth__formInner rise" onSubmit={submit}>
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
      </section>
    </div>
  )
}
