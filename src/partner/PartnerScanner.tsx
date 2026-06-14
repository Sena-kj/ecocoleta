import { useState } from 'react'
import { Button, Card, Field, StatusBadge, SkeletonList, EmptyState } from '../components/ui'
import { useToast } from '../lib/toast'
import { usePartnerDisposals, useValidateQr } from '../lib/queries'
import { CATEGORY_META } from '../catalog'

export default function PartnerScanner() {
  const toast = useToast()
  const [code, setCode] = useState('')
  const { data: disposals, isLoading } = usePartnerDisposals()
  const validate = useValidateQr()

  const pending = disposals?.filter((d) => d.status === 'PENDING') ?? []

  async function handleValidate(qr: string) {
    const target = qr.trim()
    if (!target) {
      toast.error('Cole ou selecione um QR Code primeiro.')
      return
    }
    try {
      const res = await validate.mutateAsync(target)
      toast.success(`Descarte validado! +${res.pointsAwarded} pts creditados a ${res.disposal.userName}.`)
      setCode('')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Falha ao validar.')
    }
  }

  return (
    <div className="rise">
      <span className="eyebrow">Área do parceiro</span>
      <h1>Validar descarte</h1>
      <p className="muted">Leia ou cole o QR Code que o cliente apresenta para creditar os pontos.</p>

      <Card className="scanner-card" style={{ marginTop: 'var(--sp-5)' }}>
        <div className="scanner-frame" aria-hidden>📷</div>
        <div className="stack" style={{ gap: 'var(--sp-4)', width: '100%' }}>
          <Field
            label="Código do descarte (QR)"
            placeholder="cole o conteúdo do QR Code aqui"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <Button
            size="lg"
            block
            loading={validate.isPending}
            onClick={() => handleValidate(code)}
          >
            Validar descarte
          </Button>
        </div>
      </Card>

      <div className="admin-section">
        <h2>Descartes pendentes neste ponto</h2>
        <p className="muted" style={{ fontSize: 'var(--fs-sm)' }}>
          Toque em “Usar código” para preencher o campo automaticamente (demo).
        </p>

        <div className="stack" style={{ gap: 'var(--sp-3)', marginTop: 'var(--sp-4)' }}>
          {isLoading && <SkeletonList count={3} />}
          {!isLoading && pending.length === 0 && (
            <EmptyState emoji="✅" title="Nenhum descarte pendente" desc="Todos os descartes deste ponto já foram validados." />
          )}
          {pending.map((d) => {
            const meta = CATEGORY_META[d.material]
            return (
              <Card key={d.id} className="partner-disposal">
                <span className="disposal-card__icon">{meta.emoji}</span>
                <div className="stack" style={{ gap: 4, minWidth: 0, flex: 1 }}>
                  <strong>{d.quantity}× {meta.label}</strong>
                  <span className="faint" style={{ fontSize: 'var(--fs-sm)' }}>{d.userName}</span>
                  <span className="mono-code">{d.qrCode}</span>
                  <StatusBadge status={d.status} />
                </div>
                <div className="stack" style={{ gap: 'var(--sp-2)', alignItems: 'flex-end' }}>
                  <span className="disposal-card__pts">+{meta.pointsPerUnit * d.quantity} pts</span>
                  <Button size="sm" variant="outline" onClick={() => setCode(d.qrCode)}>Usar código</Button>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
