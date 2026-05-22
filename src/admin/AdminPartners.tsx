import { useState } from 'react'
import { useAllPoints } from '../lib/queries'
import { Button, Card, Spinner, Stars } from '../components/ui'

interface Pending {
  id: string
  name: string
  type: string
  neighborhood: string
}

const PENDING: Pending[] = [
  { id: 'pa-1', name: 'CelularTech Sítio Cercado', type: 'Assistência técnica', neighborhood: 'Sítio Cercado' },
  { id: 'pa-2', name: 'Mercado Verde Boqueirão', type: 'Comércio', neighborhood: 'Boqueirão' },
  { id: 'pa-3', name: 'Recicla Já Pinheirinho', type: 'Cooperativa', neighborhood: 'Pinheirinho' },
]

export default function AdminPartners() {
  const { data: points, isLoading } = useAllPoints()
  const [pending, setPending] = useState(PENDING)
  const [hidden, setHidden] = useState<Set<string>>(new Set())

  if (isLoading || !points) return <Spinner />

  function resolve(id: string) {
    setPending((p) => p.filter((x) => x.id !== id))
  }
  function toggleHide(id: string) {
    setHidden((h) => {
      const n = new Set(h)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })
  }

  return (
    <div className="rise">
      <span className="eyebrow">Moderação</span>
      <h1>Parceiros e pontos</h1>

      <div className="admin-section" style={{ marginTop: 'var(--sp-5)' }}>
        <h2>Parceiros aguardando aprovação <span className="faint" style={{ fontSize: '1rem' }}>({pending.length})</span></h2>
        {pending.length === 0 ? (
          <p className="muted">Nenhum parceiro pendente. 🎉</p>
        ) : (
          <div className="stack" style={{ gap: 'var(--sp-3)' }}>
            {pending.map((p) => (
              <Card key={p.id} style={{ padding: 'var(--sp-4)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--sp-3)', flexWrap: 'wrap' }}>
                <div>
                  <strong>{p.name}</strong>
                  <div className="faint" style={{ fontSize: 'var(--fs-sm)' }}>{p.type} · {p.neighborhood}</div>
                </div>
                <div className="row" style={{ gap: 'var(--sp-2)' }}>
                  <Button size="sm" variant="outline" onClick={() => resolve(p.id)}>Recusar</Button>
                  <Button size="sm" onClick={() => resolve(p.id)}>Aprovar</Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="admin-section">
        <h2>Pontos no mapa</h2>
        <Card style={{ padding: 'var(--sp-3) var(--sp-5)', overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr><th>Nome</th><th>Bairro</th><th>Tipo</th><th>Avaliação</th><th>Visível</th></tr>
            </thead>
            <tbody>
              {points.map((p) => (
                <tr key={p.id} style={{ opacity: hidden.has(p.id) ? 0.45 : 1 }}>
                  <td><strong>{p.name}</strong></td>
                  <td>{p.neighborhood}</td>
                  <td>{p.isPartner ? 'Parceiro' : 'Ecoponto'}</td>
                  <td><Stars value={p.averageRating} count={p.ratingCount} /></td>
                  <td>
                    <button className="toggle-pill" data-on={!hidden.has(p.id)} onClick={() => toggleHide(p.id)}>
                      {hidden.has(p.id) ? '○ Oculto' : '● Visível'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  )
}
