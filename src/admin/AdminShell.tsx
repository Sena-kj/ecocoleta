import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useTheme } from '../lib/theme'

const NAV = [
  { to: '/admin', label: '📊 Visão geral', end: true },
  { to: '/admin/catalog', label: '🎁 Catálogo de trocas', end: false },
  { to: '/admin/partners', label: '🤝 Parceiros e pontos', end: false },
  { to: '/admin/redemptions', label: '📦 Resgates', end: false },
]

export default function AdminShell() {
  const navigate = useNavigate()
  const { toggle } = useTheme()

  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <button className="brand" onClick={() => navigate('/admin')} aria-label="Admin">
          <img src="/leaf.svg" alt="" width={26} height={26} />
          Eco<b>Admin</b>
        </button>
        <nav className="admin-nav">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => (isActive ? 'active' : '')}>
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="admin-side__foot admin-nav">
          <a onClick={toggle} style={{ cursor: 'pointer' }}>🌓 Alternar tema</a>
          <a onClick={() => navigate('/app/map')} style={{ cursor: 'pointer' }}>← Voltar ao app</a>
        </div>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}
