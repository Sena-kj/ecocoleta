import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { useDisposal } from '../lib/queries'
import { Button, Card, Spinner, EmptyState, StatusBadge } from '../components/ui'
import { CATEGORY_META } from '../catalog'

function useCountdown(target?: string) {
  const [left, setLeft] = useState('')
  useEffect(() => {
    if (!target) return
    const tick = () => {
      const ms = new Date(target).getTime() - Date.now()
      if (ms <= 0) return setLeft('expirado')
      const h = Math.floor(ms / 3.6e6)
      const m = Math.floor((ms % 3.6e6) / 6e4)
      const s = Math.floor((ms % 6e4) / 1000)
      setLeft(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`)
    }
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [target])
  return left
}

export default function QrCode() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: disposal, isLoading } = useDisposal(id)
  const countdown = useCountdown(disposal?.expiresAt)

  if (isLoading) return <div className="qr-screen"><Spinner /></div>
  if (!disposal)
    return <div className="container page"><EmptyState title="Descarte não encontrado" action={<Button onClick={() => navigate('/app/history')}>Ver histórico</Button>} /></div>

  const meta = CATEGORY_META[disposal.material]

  return (
    <div className="qr-screen">
      <Card className="qr-card rise">
        <StatusBadge status={disposal.status} />
        <h1 style={{ marginTop: 'var(--sp-4)', fontSize: 'var(--fs-h2)' }}>Mostre ao parceiro</h1>
        <p className="muted">Peça para escanear este código e validar seu descarte.</p>

        <div className="qr-frame">
          <QRCodeSVG value={disposal.qrCode} size={208} level="M" fgColor="#0a3357" />
        </div>

        <div className="row" style={{ justifyContent: 'center', gap: 8 }}>
          <span style={{ fontSize: '1.4rem' }}>{meta.emoji}</span>
          <strong>{disposal.quantity}× {meta.label}</strong>
        </div>
        <p className="faint" style={{ marginTop: 4 }}>{disposal.pointName}</p>

        <div className="qr-meta">
          <div className="center">
            <div className="faint" style={{ fontSize: 'var(--fs-xs)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Expira em</div>
            <div className="qr-timer">{countdown}</div>
          </div>
        </div>

        <div style={{ marginTop: 'var(--sp-6)' }}>
          <Button variant="outline" block onClick={() => navigate('/app/history')}>Ver meu histórico</Button>
        </div>
      </Card>
    </div>
  )
}
