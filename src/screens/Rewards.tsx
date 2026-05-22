import { useState } from 'react'
import { useMe, useRewards, useRedeem } from '../lib/queries'
import { Button, Card, Spinner } from '../components/ui'
import type { Reward, RewardKind } from '../types'

const KIND_LABEL: Record<RewardKind, string> = {
  ELETRONICO: 'Eletrônico',
  DESCONTO: 'Desconto',
  PRODUTO: 'Produto',
  SERVICO: 'Serviço',
}

export default function Rewards() {
  const { data: me } = useMe()
  const { data: rewards, isLoading } = useRewards()
  const redeem = useRedeem()
  const [done, setDone] = useState<Reward | null>(null)
  const [filter, setFilter] = useState<RewardKind | 'TODOS'>('TODOS')

  if (isLoading || !rewards) return <div className="container page"><Spinner /></div>

  const points = me?.totalPoints ?? 0
  const list = filter === 'TODOS' ? rewards : rewards.filter((r) => r.kind === filter)

  async function handleRedeem(r: Reward) {
    await redeem.mutateAsync(r.id)
    setDone(r)
  }

  return (
    <div className="container page rise">
      <div className="rewards-head">
        <div>
          <span className="eyebrow">Loja de recompensas</span>
          <h1>Trocas</h1>
          <p className="muted">Troque seus pontos por itens e benefícios de parceiros.</p>
        </div>
        <Card className="rewards-balance">
          <span>Seu saldo</span>
          <b>🍃 {points}</b>
          <span>pontos</span>
        </Card>
      </div>

      <div className="filter-bar" style={{ margin: 'var(--sp-5) 0' }}>
        {(['TODOS', 'ELETRONICO', 'DESCONTO', 'PRODUTO', 'SERVICO'] as const).map((k) => (
          <button
            key={k}
            className={`chip chip--sm chip--btn ${filter === k ? 'chip--active' : ''}`}
            onClick={() => setFilter(k)}
          >
            {k === 'TODOS' ? 'Todos' : KIND_LABEL[k]}
          </button>
        ))}
      </div>

      <div className="reward-grid">
        {list.map((r) => {
          const afford = points >= r.pointsCost
          const out = r.stock <= 0
          return (
            <Card key={r.id} className="reward-card">
              <div className="reward-card__emoji" aria-hidden>{r.emoji}</div>
              <span className="reward-kind">{KIND_LABEL[r.kind]}</span>
              <h3>{r.name}</h3>
              <p className="muted">{r.description}</p>
              {r.partnerName && <p className="faint" style={{ fontSize: 'var(--fs-xs)' }}>por {r.partnerName}</p>}
              <div className="reward-card__foot">
                <span className="reward-cost">🍃 {r.pointsCost}</span>
                <Button
                  size="sm"
                  variant={afford && !out ? 'primary' : 'outline'}
                  disabled={!afford || out}
                  loading={redeem.isPending && redeem.variables === r.id}
                  onClick={() => handleRedeem(r)}
                >
                  {out ? 'Esgotado' : afford ? 'Resgatar' : 'Faltam pts'}
                </Button>
              </div>
              {!out && <span className="reward-stock">{r.stock} disponíveis</span>}
            </Card>
          )
        })}
      </div>

      {done && (
        <div className="modal-backdrop" onClick={() => setDone(null)}>
          <Card className="modal rise" onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: '3rem' }}>🎉</div>
            <h2>Resgate confirmado!</h2>
            <p className="muted">
              Você resgatou <b>{done.name}</b>. {done.partnerName ? `Retire em ${done.partnerName}.` : 'Em breve entraremos em contato.'}
            </p>
            <Button block onClick={() => setDone(null)}>Entendi</Button>
          </Card>
        </div>
      )}
    </div>
  )
}
