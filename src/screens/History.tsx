import { useNavigate } from 'react-router-dom'
import { useMyDisposals } from '../lib/queries'
import { Button, Card, SkeletonList, EmptyState, StatusBadge } from '../components/ui'
import { CATEGORY_META } from '../catalog'

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function History() {
  const navigate = useNavigate()
  const { data: disposals, isLoading } = useMyDisposals()

  return (
    <div className="container page rise">
      <div className="page__head">
        <span className="eyebrow">Seus descartes</span>
        <h1>Histórico</h1>
        <p>Acompanhe cada descarte e o status da validação.</p>
      </div>

      {isLoading && <SkeletonList count={5} />}
      {!isLoading && disposals?.length === 0 && (
        <EmptyState
          title="Nenhum descarte ainda"
          desc="Encontre um ponto no mapa e faça seu primeiro descarte consciente."
          action={<Button onClick={() => navigate('/app/map')}>Ir ao mapa</Button>}
        />
      )}

      <div className="stack" style={{ gap: 'var(--sp-3)' }}>
        {disposals?.map((d, i) => {
          const meta = CATEGORY_META[d.material]
          const clickable = d.status === 'PENDING'
          return (
            <Card
              key={d.id}
              className="disposal-card"
              style={{ cursor: clickable ? 'pointer' : 'default', animationDelay: `${Math.min(i, 10) * 35}ms` }}
              onClick={() => clickable && navigate(`/app/qr/${d.id}`)}
            >
              <span className="disposal-card__icon">{meta.emoji}</span>
              <span className="stack" style={{ gap: 4, minWidth: 0 }}>
                <strong>{d.quantity}× {meta.label}</strong>
                <span className="faint" style={{ fontSize: 'var(--fs-sm)' }}>{d.pointName} · {fmtDate(d.createdAt)}</span>
                <StatusBadge status={d.status} />
              </span>
              <span className="disposal-card__pts">
                {d.status === 'VALIDATED' ? `+${d.pointsAwarded}` : `${meta.pointsPerUnit * d.quantity}`} pts
              </span>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
