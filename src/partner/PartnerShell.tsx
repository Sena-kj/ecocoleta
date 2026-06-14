import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useTheme } from '../lib/theme'
import { partnerLogout } from './partnerAuth'

const NAV = [
  { to: '/partner', label: '📷 Validar descarte', end: true },
  { to: '/partner/point', label: '🏪 Meu ponto', end: false },
]

export default function PartnerShell() {
  const navigate = useNavigate()
  const { toggle } = useTheme()

  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <button className="brand" onClick={() => navigate('/partner')} aria-label="Parceiro">
          <img src={`${import.meta.env.BASE_URL}leaf.svg`} alt="" width={26} height={26} />
          Eco<b>Parceiro</b>
        </button>
        <nav className="admin-nav">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => (isActive ? 'active' : '')}>
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="admin-side__foot admin-nav">
          <button type="button" onClick={toggle}>🌓 Alternar tema</button>
          <button type="button" onClick={() => navigate('/app/map')}>← Voltar ao app</button>
          <button
            type="button"
            onClick={() => {
              partnerLogout()
              navigate('/partner/login', { replace: true })
            }}
          >
            🔒 Sair do parceiro
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}
