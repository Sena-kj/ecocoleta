import { useState } from 'react'
import { useArticles } from '../lib/queries'
import { Button, Card, SkeletonCard } from '../components/ui'
import { CATEGORY_META } from '../catalog'
import type { EducationArticle } from '../types'

function emojiFor(a: EducationArticle) {
  if (a.category === 'GERAL') return '🌍'
  return CATEGORY_META[a.category].emoji
}

export default function Education() {
  const { data: articles, isLoading } = useArticles()
  const [open, setOpen] = useState<EducationArticle | null>(null)

  if (isLoading || !articles)
    return (
      <div className="container page">
        <div className="page__head">
          <span className="eyebrow">Educação ambiental</span>
          <h1>Aprender</h1>
        </div>
        <div className="article-grid">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} avatar={false} lines={3} />)}
        </div>
      </div>
    )

  if (open) {
    return (
      <div className="container page rise" style={{ maxWidth: 640 }}>
        <button className="back-link" onClick={() => setOpen(null)}>← Todos os artigos</button>
        <div className="article-card__top" style={{ borderRadius: 'var(--r-lg)', height: 160 }}>{emojiFor(open)}</div>
        <span className="eyebrow" style={{ marginTop: 'var(--sp-5)', display: 'block' }}>
          {open.category === 'GERAL' ? 'Geral' : CATEGORY_META[open.category].label} · {open.readMinutes} min
        </span>
        <h1 style={{ marginTop: 'var(--sp-2)' }}>{open.title}</h1>
        <p style={{ marginTop: 'var(--sp-4)', fontSize: '1.1rem', lineHeight: 'var(--lh-body)' }}>{open.body}</p>
      </div>
    )
  }

  return (
    <div className="container page rise">
      <div className="page__head">
        <span className="eyebrow">Educação ambiental</span>
        <h1>Aprender</h1>
        <p>Entenda o impacto do lixo eletrônico e como o descarte certo muda o jogo.</p>
      </div>

      <div className="article-grid">
        {articles.map((a, i) => (
          <Card key={a.id} className="article-card" onClick={() => setOpen(a)} style={{ animationDelay: `${Math.min(i, 8) * 45}ms` }}>
            <div className="article-card__top" aria-hidden>{emojiFor(a)}</div>
            <div className="article-card__body">
              <h3>{a.title}</h3>
              <p>{a.excerpt}</p>
              <div className="article-card__meta">{a.readMinutes} min de leitura →</div>
            </div>
          </Card>
        ))}
      </div>

      <Card style={{ padding: 'var(--sp-6)', marginTop: 'var(--sp-6)', textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem' }}>📚</div>
        <h3 style={{ marginTop: 'var(--sp-2)' }}>Leia 10 artigos e ganhe o selo Educador</h3>
        <p className="muted" style={{ margin: 'var(--sp-2) auto 0', maxWidth: '40ch' }}>
          Conhecimento também é cidadania ambiental.
        </p>
        <div style={{ marginTop: 'var(--sp-4)' }}><Button variant="ghost">Continuar lendo</Button></div>
      </Card>
    </div>
  )
}
