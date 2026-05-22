import { useRanking } from '../lib/queries'
import { Card, Spinner } from '../components/ui'

const MEDALS = ['🥇', '🥈', '🥉']

function initials(name: string) {
  return name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
}

export default function Ranking() {
  const { data: ranking, isLoading } = useRanking()

  if (isLoading || !ranking) return <div className="container page"><Spinner /></div>

  const top3 = ranking.slice(0, 3)
  const rest = ranking.slice(3)
  const order = [1, 0, 2] // pódio: 2º, 1º, 3º

  return (
    <div className="container page rise">
      <div className="page__head">
        <span className="eyebrow">Maio · Curitiba</span>
        <h1>Ranking do mês</h1>
        <p>Os pontos do ranking zeram todo dia 1º. Os totais ficam para sempre.</p>
      </div>

      <div className="podium">
        {order.map((idx) => {
          const e = top3[idx]
          if (!e) return <div key={idx} />
          return (
            <div key={e.userId} className={`podium__col podium__col--${e.position}`}>
              <div className="podium__avatar">{initials(e.name)}</div>
              <div style={{ fontSize: '1.5rem' }}>{MEDALS[e.position - 1]}</div>
              <div className="podium__name">{e.name.split(' ')[0]}</div>
              <div className="podium__pts">{e.monthlyPoints} pts</div>
            </div>
          )
        })}
      </div>

      <Card style={{ padding: 'var(--sp-3)' }}>
        <div className="stack" style={{ gap: 4 }}>
          {rest.map((e) => (
            <div key={e.userId} className={`rank-row ${e.isCurrentUser ? 'rank-row--me' : ''}`}>
              <span className="rank-pos">{e.position}</span>
              <span className="stack" style={{ gap: 2, minWidth: 0 }}>
                <strong>{e.name}{e.isCurrentUser && ' (você)'}</strong>
                <span className="faint" style={{ fontSize: 'var(--fs-xs)' }}>{e.neighborhood}</span>
              </span>
              <span className="rank-pts">{e.monthlyPoints} pts</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
