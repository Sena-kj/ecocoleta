import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { usePoint, usePointReviews, useSubmitReview } from '../lib/queries'
import { Button, Card, CategoryChip, Spinner, Stars, EmptyState, SkeletonCard } from '../components/ui'
import { useToast } from '../lib/toast'
import { formatDistance } from '../catalog'

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

function initials(name: string) {
  return name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
}

function ReviewModal({
  onClose,
  onSubmit,
  pending,
}: {
  onClose: () => void
  onSubmit: (rating: number, comment: string) => void
  pending: boolean
}) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <Card className="modal modal--form rise" onClick={(e) => e.stopPropagation()}>
        <h2>Avaliar este ponto</h2>
        <p className="muted">Sua nota ajuda outras pessoas a escolher onde descartar.</p>

        <div className="rating-input" role="radiogroup" aria-label="Nota de 1 a 5 estrelas">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={rating === n}
              aria-label={`${n} estrela${n > 1 ? 's' : ''}`}
              className={`rating-input__star ${n <= rating ? 'is-on' : ''}`}
              onClick={() => setRating(n)}
            >
              ★
            </button>
          ))}
        </div>

        <label className="field" htmlFor="review-comment" style={{ width: '100%', textAlign: 'left' }}>
          <span className="field__label">Comentário</span>
          <textarea
            id="review-comment"
            className="field__input field__textarea"
            placeholder="Conte como foi sua experiência…"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </label>

        <div className="row" style={{ gap: 'var(--sp-3)', width: '100%', marginTop: 'var(--sp-2)' }}>
          <Button variant="outline" block onClick={onClose} type="button">Cancelar</Button>
          <Button
            block
            loading={pending}
            disabled={comment.trim().length === 0}
            onClick={() => onSubmit(rating, comment)}
          >
            Enviar avaliação
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default function PointDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const { data: point, isLoading } = usePoint(id)
  const { data: reviews, isLoading: reviewsLoading } = usePointReviews(id)
  const submit = useSubmitReview(id)
  const [reviewing, setReviewing] = useState(false)

  if (isLoading) return <div className="container page"><Spinner label="Carregando ponto…" /></div>
  if (!point)
    return (
      <div className="container page">
        <EmptyState title="Ponto não encontrado" desc="Esse ponto de coleta não existe ou foi removido." action={<Button onClick={() => navigate('/app/map')}>Voltar ao mapa</Button>} />
      </div>
    )

  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${point.location.lat},${point.location.lng}`

  async function handleSubmitReview(rating: number, comment: string) {
    if (!id) return
    try {
      await submit.mutateAsync({ pointId: id, rating, comment })
      setReviewing(false)
      toast.success('Avaliação enviada. Obrigada por contribuir!')
    } catch {
      toast.error('Não foi possível enviar a avaliação.')
    }
  }

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

      {/* ---- Avaliações ---- */}
      <div style={{ marginTop: 'var(--sp-7)' }}>
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--sp-3)' }}>
          <div>
            <span className="eyebrow">Avaliações</span>
            <div className="row" style={{ gap: 'var(--sp-3)', marginTop: 4 }}>
              <Stars value={point.averageRating} count={point.ratingCount} />
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setReviewing(true)}>⭐ Avaliar este ponto</Button>
        </div>

        <div className="stack" style={{ gap: 'var(--sp-3)', marginTop: 'var(--sp-4)' }}>
          {reviewsLoading && <><SkeletonCard /><SkeletonCard /></>}
          {!reviewsLoading && reviews?.length === 0 && (
            <EmptyState
              emoji="📝"
              title="Ainda sem avaliações"
              desc="Seja a primeira pessoa a avaliar este ponto de coleta."
              action={<Button size="sm" variant="outline" onClick={() => setReviewing(true)}>Escrever avaliação</Button>}
            />
          )}
          {reviews?.map((rv, i) => (
            <Card key={rv.id} className="review-card" style={{ animationDelay: `${i * 40}ms` }}>
              <span className="review-card__avatar" aria-hidden>{initials(rv.userName)}</span>
              <div className="stack" style={{ gap: 4, minWidth: 0, flex: 1 }}>
                <div className="row" style={{ justifyContent: 'space-between', gap: 'var(--sp-2)', flexWrap: 'wrap' }}>
                  <strong>{rv.userName}</strong>
                  <span className="faint" style={{ fontSize: 'var(--fs-xs)' }}>{fmtDate(rv.createdAt)}</span>
                </div>
                <Stars value={rv.rating} />
                <p className="muted" style={{ fontSize: 'var(--fs-sm)' }}>{rv.comment}</p>
              </div>
            </Card>
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

      {reviewing && (
        <ReviewModal
          onClose={() => setReviewing(false)}
          onSubmit={handleSubmitReview}
          pending={submit.isPending}
        />
      )}
    </div>
  )
}
