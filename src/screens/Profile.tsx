import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMe, useBadges, useUpdateMe } from '../lib/queries'
import { Button, Card, Field, Spinner } from '../components/ui'
import { useToast } from '../lib/toast'
import { levelFor, levelProgress, pointsToNextLevel } from '../catalog'
import type { User } from '../types'

function initials(name: string) {
  return name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
}

const AVATAR_EMOJIS = ['🌱', '🌳', '♻️', '🌎', '🍃', '🦊', '🐢', '🌻', '🦉', '🐝']

function EditProfileModal({
  me,
  onClose,
  onSave,
  pending,
}: {
  me: User
  onClose: () => void
  onSave: (partial: { name: string; neighborhood: string; photoUrl?: string }) => void
  pending: boolean
}) {
  const [name, setName] = useState(me.name)
  const [neighborhood, setNeighborhood] = useState(me.neighborhood ?? '')
  const [avatar, setAvatar] = useState<string | undefined>(me.photoUrl)

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <Card className="modal modal--form rise" onClick={(e) => e.stopPropagation()}>
        <h2>Editar perfil</h2>

        <div className="avatar-picker" role="radiogroup" aria-label="Escolha um avatar">
          {AVATAR_EMOJIS.map((e) => (
            <button
              key={e}
              type="button"
              role="radio"
              aria-checked={avatar === e}
              aria-label={`Avatar ${e}`}
              className={`avatar-picker__opt ${avatar === e ? 'is-on' : ''}`}
              onClick={() => setAvatar(avatar === e ? undefined : e)}
            >
              {e}
            </button>
          ))}
        </div>

        <div className="stack" style={{ gap: 'var(--sp-4)', width: '100%', textAlign: 'left' }}>
          <Field label="Nome" value={name} onChange={(e) => setName(e.target.value)} required />
          <Field label="Bairro" value={neighborhood} placeholder="Onde você mora em Curitiba" onChange={(e) => setNeighborhood(e.target.value)} />
        </div>

        <div className="row" style={{ gap: 'var(--sp-3)', width: '100%', marginTop: 'var(--sp-2)' }}>
          <Button variant="outline" block type="button" onClick={onClose}>Cancelar</Button>
          <Button
            block
            loading={pending}
            disabled={name.trim().length === 0}
            onClick={() => onSave({ name, neighborhood, photoUrl: avatar })}
          >
            Salvar
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default function Profile() {
  const navigate = useNavigate()
  const toast = useToast()
  const { data: me, isLoading } = useMe()
  const { data: badges } = useBadges()
  const updateMe = useUpdateMe()
  const [editing, setEditing] = useState(false)

  if (isLoading || !me) return <div className="container page"><Spinner /></div>

  const level = levelFor(me.totalPoints)
  const progress = levelProgress(me.totalPoints)
  const toNext = pointsToNextLevel(me.totalPoints)
  const earned = badges?.filter((b) => b.earned).length ?? 0

  async function handleSave(partial: { name: string; neighborhood: string; photoUrl?: string }) {
    try {
      await updateMe.mutateAsync(partial)
      setEditing(false)
      toast.success('Perfil atualizado!')
    } catch {
      toast.error('Não foi possível salvar o perfil.')
    }
  }

  return (
    <div className="container page rise">
      <Card className="profile-hero">
        <span className="avatar">{me.photoUrl ? me.photoUrl : initials(me.name)}</span>
        <div className="stack" style={{ gap: 4 }}>
          <h1 style={{ fontSize: 'var(--fs-h2)' }}>{me.name}</h1>
          <span className="muted">{me.neighborhood ? `${me.neighborhood} · ` : ''}Curitiba</span>
          <span className="eyebrow" style={{ marginTop: 4 }}>{level.name} · Nível {level.level}</span>
        </div>
        <Button variant="outline" size="sm" className="profile-hero__edit" onClick={() => setEditing(true)}>
          ✏️ Editar perfil
        </Button>
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

      <div className="stack" style={{ gap: 'var(--sp-3)', marginTop: 'var(--sp-6)' }}>
        <Card className="profile-link" onClick={() => navigate('/app/education')}>
          <span>📚 Aprender sobre e-waste</span><span aria-hidden>→</span>
        </Card>
        <Card className="profile-link" onClick={() => navigate('/app/rewards')}>
          <span>🎁 Trocar pontos por itens</span><span aria-hidden>→</span>
        </Card>
        <Card className="profile-link" onClick={() => navigate('/partner')}>
          <span>🤝 Área do parceiro</span><span aria-hidden>→</span>
        </Card>
        <Card className="profile-link" onClick={() => navigate('/admin')}>
          <span>🛠️ Painel administrativo</span><span aria-hidden>→</span>
        </Card>
      </div>

      <div style={{ marginTop: 'var(--sp-6)' }}>
        <Button variant="outline" block onClick={() => navigate('/login')}>Sair da conta</Button>
      </div>

      {editing && (
        <EditProfileModal me={me} onClose={() => setEditing(false)} onSave={handleSave} pending={updateMe.isPending} />
      )}
    </div>
  )
}
