import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { usePoint, useCreateDisposal } from '../lib/queries'
import { Button, Card, Spinner, EmptyState, CategoryChip } from '../components/ui'
import { useToast } from '../lib/toast'
import { CATEGORY_META } from '../catalog'
import type { MaterialCategory } from '../types'

export default function CreateDisposal() {
  const [params] = useSearchParams()
  const pointId = params.get('point') ?? ''
  const navigate = useNavigate()
  const toast = useToast()
  const { data: point, isLoading } = usePoint(pointId)
  const createMut = useCreateDisposal()

  const [material, setMaterial] = useState<MaterialCategory | null>(null)
  const [qty, setQty] = useState(1)

  if (isLoading) return <div className="container page"><Spinner /></div>
  if (!point)
    return (
      <div className="container page">
        <EmptyState title="Escolha um ponto primeiro" desc="Abra um ponto de coleta no mapa para iniciar um descarte." action={<Button onClick={() => navigate('/app/map')}>Ir ao mapa</Button>} />
      </div>
    )

  const meta = material ? CATEGORY_META[material] : null
  const previewPoints = meta ? meta.pointsPerUnit * qty : 0

  async function submit() {
    if (!material) return
    try {
      const created = await createMut.mutateAsync({ pointId, material, quantity: qty })
      toast.success('Descarte criado! Mostre o QR Code ao parceiro.')
      navigate(`/app/qr/${created.id}`)
    } catch {
      toast.error('Não foi possível criar o descarte.')
    }
  }

  return (
    <div className="container page rise" style={{ maxWidth: 560 }}>
      <button className="back-link" onClick={() => navigate(`/app/point/${pointId}`)}>← {point.name}</button>
      <div className="page__head">
        <span className="eyebrow">Novo descarte</span>
        <h1>O que você vai descartar?</h1>
      </div>

      <span className="info-line__label">Tipo de material</span>
      <div className="materials-grid" style={{ marginTop: 'var(--sp-3)', marginBottom: 'var(--sp-6)' }}>
        {point.acceptedMaterials.map((m) => (
          <CategoryChip key={m} category={m} active={material === m} onClick={() => setMaterial(m)} />
        ))}
      </div>

      <span className="info-line__label">Quantidade</span>
      <Card style={{ padding: 'var(--sp-5)', marginTop: 'var(--sp-3)' }}>
        <div className="qty-stepper" style={{ justifyContent: 'center' }}>
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Diminuir">−</button>
          <b>{qty}</b>
          <button onClick={() => setQty((q) => q + 1)} aria-label="Aumentar">+</button>
        </div>
      </Card>

      {meta && (
        <div className="points-preview rise">
          <span className="row" style={{ gap: 8 }}>
            <span style={{ fontSize: '1.4rem' }}>{meta.emoji}</span>
            <span>{qty}× {meta.label}</span>
          </span>
          <span>+<b>{previewPoints}</b> pts</span>
        </div>
      )}

      <p className="faint center" style={{ fontSize: 'var(--fs-xs)', marginTop: 'var(--sp-4)' }}>
        Os pontos são creditados após o parceiro validar seu QR Code no local.
      </p>

      <div className="sticky-cta">
        <Button size="lg" block disabled={!material} loading={createMut.isPending} onClick={submit}>
          Gerar QR Code do descarte
        </Button>
      </div>
    </div>
  )
}
