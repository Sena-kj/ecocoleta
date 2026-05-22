import { useNavigate, useParams } from 'react-router-dom'
import { usePoint } from '../lib/queries'
import { Button, Card, CategoryChip, Spinner, Stars, EmptyState } from '../components/ui'
import { formatDistance } from '../catalog'

export default function PointDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: point, isLoading } = usePoint(id)

  if (isLoading) return <div className="container page"><Spinner label="Carregando ponto…" /></div>
  if (!point)
    return (
      <div className="container page">
        <EmptyState title="Ponto não encontrado" desc="Esse ponto de coleta não existe ou foi removido." action={<Button onClick={() => navigate('/app/map')}>Voltar ao mapa</Button>} />
      </div>
    )

  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${point.location.lat},${point.location.lng}`

  return (
    <div className="container page rise">
      <button className="back-link" onClick={() => navigate('/app/map')}>← Voltar ao mapa</button>

      <div className="detail-hero">
        <div style={{ position: 'relative', zIndex: 1 }}>
          {point.isPartner && <span className="tag-partner" style={{ marginBottom: 8, display: 'inline-block' }}>Parceiro EcoColeta</span>}
          <h1>{point.name}</h1>
          <div className="row" style={{ gap: 'var(--sp-3)', marginTop: 'var(--sp-2)' }}>
            <Stars value={point.averageRating} count={point.ratingCount} />
            {point.distanceMeters != null && <span style={{ fontWeight: 700 }}>· {formatDistance(point.distanceMeters)}</span>}
          </div>
        </div>
      </div>

      {point.description && <p className="muted" style={{ marginTop: 'var(--sp-5)' }}>{point.description}</p>}

      <Card style={{ marginTop: 'var(--sp-5)', padding: 'var(--sp-3) var(--sp-5)' }}>
        <div className="info-line">
          <span className="info-line__icon">📌</span>
          <span><span className="info-line__label">Endereço</span><br /><span className="info-line__value">{point.address}</span></span>
        </div>
        <div className="info-line">
          <span className="info-line__icon">🕐</span>
          <span><span className="info-line__label">Funcionamento</span><br /><span className="info-line__value">{point.openingHours}</span></span>
        </div>
        {point.phone && (
          <div className="info-line">
            <span className="info-line__icon">📞</span>
            <span><span className="info-line__label">Telefone</span><br /><span className="info-line__value">{point.phone}</span></span>
          </div>
        )}
      </Card>

      <div style={{ marginTop: 'var(--sp-6)' }}>
        <span className="eyebrow">Materiais aceitos</span>
        <div className="materials-grid" style={{ marginTop: 'var(--sp-3)' }}>
          {point.acceptedMaterials.map((m) => (
            <CategoryChip key={m} category={m} />
          ))}
        </div>
      </div>

      <div className="sticky-cta stack" style={{ gap: 'var(--sp-3)' }}>
        <Button size="lg" block onClick={() => navigate(`/app/disposal/new?point=${point.id}`)}>
          Iniciar descarte aqui
        </Button>
        <Button size="lg" variant="outline" block onClick={() => window.open(mapsUrl, '_blank')}>
          🧭 Traçar rota
        </Button>
      </div>
    </div>
  )
}
