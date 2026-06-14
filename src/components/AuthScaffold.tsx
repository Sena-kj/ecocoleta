import type { ReactNode } from 'react'

export interface AuthStat {
  value: string
  label: string
}

interface AuthScaffoldProps {
  /** Texto do "eyebrow" verde acima do título do hero. */
  eyebrow: string
  /** Título do hero — pode conter <br/> e <em> para destaque. */
  title: ReactNode
  /** Parágrafo de apoio do hero. */
  pitch: ReactNode
  /** Estatísticas exibidas no rodapé do painel lateral. */
  stats: AuthStat[]
  /** Conteúdo do formulário (lado direito). */
  children: ReactNode
}

/**
 * Layout compartilhado das telas de autenticação (Login e Register).
 * Painel lateral "hero" à esquerda + slot do formulário à direita.
 * No mobile (≤860px) o painel lateral é ocultado via CSS (.auth__art).
 */
export default function AuthScaffold({ eyebrow, title, pitch, stats, children }: AuthScaffoldProps) {
  return (
    <div className="auth">
      <aside className="auth__art">
        <span className="brand">
          <img src={`${import.meta.env.BASE_URL}leaf.svg`} alt="" />
          Eco<b>Coleta</b>
        </span>
        <div className="auth__pitch rise">
          <span className="eyebrow" style={{ color: 'var(--leaf-glow)' }}>{eyebrow}</span>
          <h1>{title}</h1>
          <p>{pitch}</p>
        </div>
        <div className="auth__stats rise">
          {stats.map((s) => (
            <div className="auth__stat" key={s.label}>
              <b>{s.value}</b>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </aside>

      <section className="auth__form">
        <div className="auth__formInner rise">{children}</div>
      </section>
    </div>
  )
}
