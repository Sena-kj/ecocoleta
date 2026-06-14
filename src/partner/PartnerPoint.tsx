import { usePartnerPoint, usePartnerDisposals } from '../lib/queries'
import { Card, Spinner, Stars, StatusBadge, CategoryChip, SkeletonList } from '../components/ui'
import { CATEGORY_META } from '../catalog'

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

export default function PartnerPoint() {
  const { data: point, isLoading } = usePartnerPoint()
  const { data: disposals, isLoading: dLoading } = usePartnerDisposals()

  if (isLoading || !point) return <Spinner />

  const validated = disposals?.filter((d) => d.status === 'VALIDATED') ?? []
  const pending = disposals?.filter((d) => d.status === 'PENDING') ?? []
  const totalPointsCredited = validated.reduce((s, d) => s + d.pointsAwarded, 0)

  const metrics = [
    { label: 'Descartes recebidos', value: disposals?.length ?? 0 },
    { label: 'Validados', value: validated.length },
    { label: 'Pendentes', value: pending.length },
    { label: 'Pontos creditados', value: totalPointsCredited.toLocaleString('pt-BR') },
  ]

  return (
    <div className="rise">
      <span className="eyebrow">Área do parceiro</span>
      <h1>Meu ponto</h1>

      <Card className="partner-point-hero" style={{ marginTop: 'var(--sp-4)' }}>
        <div className="partner-point-hero__icon" aria-hidden>{point.photoUrl ?? '🏪'}</div>
        <div className="stack" style={{ gap: 6, minWidth: 0 }}>
          <div className="row" style={{ gap: 'var(--sp-3)', flexWrap: 'wrap' }}>
            <h2 style={{ fontSize: 'var(--fs-h2)' }}>{point.name}</h2>
            {point.isPartner && <span className="tag-partner">Parceiro</span>}
          </div>
          <span className="muted">{point.address}</span>
          <span className="faint" style={{ fontSize: 'var(--fs-sm)' }}>🕐 {point.openingHours}</span>
          <Stars value={point.averageRating} count={point.ratingCount} />
        </div>
      </Card>

      <div style={{ marginTop: 'var(--sp-5)' }}>
        <span className="eyebrow">Materiais aceitos</span>
        <div className="materials-grid" style={{ marginTop: 'var(--sp-3)' }}>
          {point.acceptedMaterials.map((m) => (
            <CategoryChip key={m} category={m} size="sm" />
          ))}
        </div>
      </div>

      <div className="metric-grid">
        {metrics.map((x) => (
          <Card key={x.label} className="metric-box">
            <b>{x.value}</b>
            <span>{x.label}</span>
          </Card>
        ))}
      </div>

      <div className="admin-section">
        <h2>Descartes recebidos</h2>
        {dLoading && <SkeletonList count={4} />}
        {!dLoading && (
          <Card style={{ padding: 'var(--sp-3) var(--sp-5)', overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr><th>Cliente</th><th>Material</th><th>Data</th><th>Pontos</th><th>Status</th></tr>
              </thead>
              <tbody>
                {disposals?.map((d) => (
                  <tr key={d.id}>
                    <td>{d.userName}</td>
                    <td>{CATEGORY_META[d.material].emoji} {d.quantity}× {CATEGORY_META[d.material].label}</td>
                    <td>{fmtDate(d.createdAt)}</td>
                    <td>{d.status === 'VALIDATED' ? `+${d.pointsAwarded}` : '—'}</td>
                    <td><StatusBadge status={d.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </div>
    </div>
  )
}
