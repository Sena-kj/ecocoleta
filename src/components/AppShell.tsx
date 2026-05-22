import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useTheme } from '../lib/theme'
import { useMe } from '../lib/queries'

function Icon({ name }: { name: 'map' | 'history' | 'ranking' | 'rewards' | 'profile' }) {
  const paths: Record<string, string> = {
    map: 'M9 3 3 5v16l6-2 6 2 6-2V3l-6 2-6-2Zm0 0v16m6-14v16',
    history: 'M12 8v4l3 2m6-2a9 9 0 1 1-9-9 9 9 0 0 1 9 9Z',
    ranking: 'M8 21V9H4v12m6 0V3h4v18m6 0v-8h-4v8M2 21h20',
    rewards: 'M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7Zm0 0h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7Z',
    profile: 'M20 21a8 8 0 1 0-16 0M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z',
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[name]} />
    </svg>
  )
}

const NAV = [
  { to: '/app/map', label: 'Mapa', icon: 'map' as const },
  { to: '/app/rewards', label: 'Trocas', icon: 'rewards' as const },
  { to: '/app/history', label: 'Histórico', icon: 'history' as const },
  { to: '/app/ranking', label: 'Ranking', icon: 'ranking' as const },
  { to: '/app/profile', label: 'Perfil', icon: 'profile' as const },
]

export default function AppShell() {
  const { theme, toggle } = useTheme()
  const { data: me } = useMe()
  const navigate = useNavigate()

  return (
    <div className="shell">
      <header className="topbar">
        <button className="brand" onClick={() => navigate('/app/map')} aria-label="Início">
          <img src="/leaf.svg" alt="" />
          Eco<b>Coleta</b>
        </button>
        <div className="topbar__actions">
          {me && (
            <span className="points-pill" title="Seus pontos totais">
              🍃 {me.totalPoints} pts
            </span>
          )}
          <button className="icon-btn" onClick={toggle} aria-label="Alternar tema" title="Alternar tema">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <nav className="bottomnav" aria-label="Navegação principal">
        {NAV.map((n) => (
          <NavLink key={n.to} to={n.to} className={({ isActive }) => `bottomnav__item ${isActive ? 'active' : ''}`}>
            <Icon name={n.icon} />
            {n.label}
            <span className="bottomnav__dot" />
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
