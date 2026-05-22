import { useAdminMetrics, useMyDisposals } from '../lib/queries'
import { Card, Spinner, StatusBadge } from '../components/ui'
import { CATEGORY_META } from '../catalog'

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

export default function AdminDashboard() {
  const { data: m, isLoading } = useAdminMetrics()
  const { data: disposals } = useMyDisposals()

  if (isLoading || !m) return <Spinner />

  const metrics = [
    { label: 'Descartes totais', value: m.totalDisposals },
    { label: 'Descartes validados', value: m.validatedDisposals },
    { label: 'Pontos distribuídos', value: m.pointsDistributed.toLocaleString('pt-BR') },
    { label: 'Usuários ativos', value: m.activeUsers },
    { label: 'Parceiros ativos', value: m.partners },
    { label: 'E-waste desviado', value: `${m.ewasteKg.toLocaleString('pt-BR')} kg` },
  ]

  return (
    <div className="rise">
      <span className="eyebrow">Painel administrativo</span>
      <h1>Visão geral</h1>
      <p className="muted">Indicadores do EcoColeta em Curitiba.</p>

      <div className="metric-grid">
        {metrics.map((x) => (
          <Card key={x.label} className="metric-box">
            <b>{x.value}</b>
            <span>{x.label}</span>
          </Card>
        ))}
      </div>

      <div className="admin-section">
        <h2>Descartes recentes</h2>
        <Card style={{ padding: 'var(--sp-3) var(--sp-5)', overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr><th>Material</th><th>Ponto</th><th>Data</th><th>Status</th></tr>
            </thead>
            <tbody>
              {disposals?.map((d) => (
                <tr key={d.id}>
                  <td>{CATEGORY_META[d.material].emoji} {d.quantity}× {CATEGORY_META[d.material].label}</td>
                  <td>{d.pointName}</td>
                  <td>{fmtDate(d.createdAt)}</td>
                  <td><StatusBadge status={d.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  )
}
