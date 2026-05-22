import { useNavigate } from 'react-router-dom'
import { useMe, useBadges } from '../lib/queries'
import { Button, Card, Spinner } from '../components/ui'
import { levelFor, levelProgress, pointsToNextLevel } from '../catalog'

function initials(name: string) {
  return name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
}

export default function Profile() {
  const navigate = useNavigate()
  const { data: me, isLoading } = useMe()
  const { data: badges } = useBadges()

  if (isLoading || !me) return <div className="container page"><Spinner /></div>

  const level = levelFor(me.totalPoints)
  const progress = levelProgress(me.totalPoints)
  const toNext = pointsToNextLevel(me.totalPoints)
  const earned = badges?.filter((b) => b.earned).length ?? 0

  return (
    <div className="container page rise">
      <Card className="profile-hero">
        <span className="avatar">{initials(me.name)}</span>
        <div className="stack" style={{ gap: 4 }}>
          <h1 style={{ fontSize: 'var(--fs-h2)' }}>{me.name}</h1>
          <span className="muted">{me.neighborhood} · Curitiba</span>
          <span className="eyebrow" style={{ marginTop: 4 }}>{level.name} · Nível {level.level}</span>
        </div>
      </Card>

      <Card style={{ padding: 'var(--sp-5)', marginTop: 'var(--sp-4)' }}>
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 'var(--sp-3)' }}>
          <strong>{level.name}</strong>
          {toNext != null ? (
            <span className="muted" style={{ fontSize: 'var(--fs-sm)' }}>faltam <b>{toNext}</b> pts</span>
          ) : (
            <span className="muted" style={{ fontSize: 'var(--fs-sm)' }}>nível máximo 🎉</span>
          )}
        </div>
        <div className="level-bar"><div className="level-bar__fill" style={{ width: `${Math.round(progress * 100)}%` }} /></div>
      </Card>

      <div className="stat-grid" style={{ marginTop: 'var(--sp-4)' }}>
        <Card className="stat-box"><b>{me.totalPoints}</b><span>pontos totais</span></Card>
        <Card className="stat-box"><b>{me.monthlyPoints}</b><span>pontos no mês</span></Card>
        <Card className="stat-box"><b>{earned}</b><span>selos</span></Card>
      </div>

      <div style={{ marginTop: 'var(--sp-6)' }}>
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 'var(--sp-3)' }}>
          <span className="eyebrow">Selos de cidadania</span>
          <span className="faint" style={{ fontSize: 'var(--fs-sm)' }}>{earned}/{badges?.length ?? 0}</span>
        </div>
        <div className="badge-grid">
          {badges?.map((b) => (
            <Card key={b.code} className={`badge-item ${b.earned ? '' : 'badge-item--locked'}`} title={b.description}>
              <div className="badge-item__emoji" aria-hidden>{b.emoji}</div>
              <b>{b.name}</b>
              <span>{b.earned ? 'Conquistado' : b.description}</span>
            </Card>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 'var(--sp-7)' }}>
        <Button variant="outline" block onClick={() => navigate('/login')}>Sair da conta</Button>
      </div>
    </div>
  )
}
