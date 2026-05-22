import { useState } from 'react'
import { useRedemptions } from '../lib/queries'
import { Button, Card, Spinner } from '../components/ui'

const STATUS: Record<string, { label: string; cls: string }> = {
  PENDING: { label: 'Aguardando entrega', cls: 'pending' },
  DELIVERED: { label: 'Entregue', cls: 'validated' },
  CANCELLED: { label: 'Cancelado', cls: 'cancelled' },
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function AdminRedemptions() {
  const { data, isLoading } = useRedemptions()
  const [delivered, setDelivered] = useState<Set<string>>(new Set())

  if (isLoading || !data) return <Spinner />

  function statusOf(id: string, original: string) {
    return delivered.has(id) ? 'DELIVERED' : original
  }

  return (
    <div className="rise">
      <span className="eyebrow">Operação</span>
      <h1>Resgates</h1>
      <p className="muted">Pedidos de troca feitos pelos consumidores.</p>

      <Card style={{ padding: 'var(--sp-3) var(--sp-5)', marginTop: 'var(--sp-5)', overflowX: 'auto' }}>
        <table className="admin-table">
          <thead>
            <tr><th>Item</th><th>Usuário</th><th>Pontos</th><th>Data</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            {data.map((r) => {
              const st = statusOf(r.id, r.status)
              const s = STATUS[st]
              return (
                <tr key={r.id}>
                  <td><strong>{r.rewardName}</strong></td>
                  <td>{r.userName}</td>
                  <td>🍃 {r.pointsSpent}</td>
                  <td>{fmtDate(r.createdAt)}</td>
                  <td><span className={`status status--${s.cls}`}>{s.label}</span></td>
                  <td>
                    {st === 'PENDING' && (
                      <Button size="sm" variant="ghost" onClick={() => setDelivered((d) => new Set(d).add(r.id))}>
                        Marcar entregue
                      </Button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
