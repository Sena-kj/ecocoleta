import { useState } from 'react'
import { useRewards } from '../lib/queries'
import { Button, Card, Spinner } from '../components/ui'
import type { Reward } from '../types'

export default function AdminCatalog() {
  const { data: rewards, isLoading } = useRewards()
  const [local, setLocal] = useState<Record<string, { active: boolean; stock: number }>>({})

  if (isLoading || !rewards) return <Spinner />

  function state(r: Reward) {
    return local[r.id] ?? { active: r.active, stock: r.stock }
  }
  function setActive(r: Reward, active: boolean) {
    setLocal((l) => ({ ...l, [r.id]: { ...state(r), active } }))
  }
  function setStock(r: Reward, stock: number) {
    setLocal((l) => ({ ...l, [r.id]: { ...state(r), stock: Math.max(0, stock) } }))
  }

  return (
    <div className="rise">
      <span className="eyebrow">Gestão</span>
      <div className="row" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--sp-3)' }}>
        <h1>Catálogo de trocas</h1>
        <Button variant="ghost" onClick={() => alert('Em um build com backend, abriria o formulário de novo item.')}>+ Novo item</Button>
      </div>
      <p className="muted">Itens que os consumidores resgatam com pontos. Ative/desative e ajuste o estoque.</p>

      <Card style={{ padding: 'var(--sp-3) var(--sp-5)', marginTop: 'var(--sp-5)', overflowX: 'auto' }}>
        <table className="admin-table">
          <thead>
            <tr><th>Item</th><th>Tipo</th><th>Custo</th><th>Estoque</th><th>Parceiro</th><th>Ativo</th></tr>
          </thead>
          <tbody>
            {rewards.map((r) => {
              const s = state(r)
              return (
                <tr key={r.id} style={{ opacity: s.active ? 1 : 0.5 }}>
                  <td>{r.emoji} <strong>{r.name}</strong></td>
                  <td>{r.kind}</td>
                  <td>🍃 {r.pointsCost}</td>
                  <td>
                    <span className="qty-mini">
                      <button onClick={() => setStock(r, s.stock - 1)}>−</button>
                      <b>{s.stock}</b>
                      <button onClick={() => setStock(r, s.stock + 1)}>+</button>
                    </span>
                  </td>
                  <td className="faint">{r.partnerName ?? '—'}</td>
                  <td>
                    <button
                      className="toggle-pill"
                      data-on={s.active}
                      onClick={() => setActive(r, !s.active)}
                    >
                      {s.active ? '● Ativo' : '○ Inativo'}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Card>
      <p className="faint" style={{ fontSize: 'var(--fs-xs)', marginTop: 'var(--sp-3)' }}>
        As alterações são locais nesta demo (sem backend). Com a API real, persistiriam via PATCH no catálogo.
      </p>
    </div>
  )
}
