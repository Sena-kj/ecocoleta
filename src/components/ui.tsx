import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react'
import { CATEGORY_META } from '../catalog'
import type { MaterialCategory } from '../types'

// ---------- Button ----------
interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'outline' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  block?: boolean
  loading?: boolean
}
export function Button({
  variant = 'primary',
  size = 'md',
  block,
  loading,
  className = '',
  children,
  disabled,
  ...rest
}: BtnProps) {
  return (
    <button
      className={`btn btn--${variant} btn--${size} ${block ? 'btn--block' : ''} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && <span className="btn__spinner" aria-hidden />}
      {children}
    </button>
  )
}

// ---------- TextField ----------
interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  hint?: string
}
export function Field({ label, hint, id, className = '', ...rest }: FieldProps) {
  const fid = id ?? `f-${label.toLowerCase().replace(/\s+/g, '-')}`
  return (
    <label className="field" htmlFor={fid}>
      <span className="field__label">{label}</span>
      <input id={fid} className={`field__input ${className}`} {...rest} />
      {hint && <span className="field__hint">{hint}</span>}
    </label>
  )
}

// ---------- Card ----------
export function Card({
  children,
  className = '',
  as: As = 'div',
  ...rest
}: {
  children: ReactNode
  className?: string
  as?: 'div' | 'article' | 'section'
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <As className={`card ${className}`} {...rest}>
      {children}
    </As>
  )
}

// ---------- Stars ----------
export function Stars({ value, count }: { value: number; count?: number }) {
  return (
    <span className="stars" title={`${value.toFixed(1)} de 5`}>
      <span className="stars__track" aria-hidden>★★★★★</span>
      <span className="stars__fill" style={{ width: `${(value / 5) * 100}%` }} aria-hidden>
        ★★★★★
      </span>
      <span className="stars__num">{value.toFixed(1).replace('.', ',')}</span>
      {count != null && <span className="stars__count">({count})</span>}
    </span>
  )
}

// ---------- Category chip ----------
export function CategoryChip({
  category,
  active,
  onClick,
  size = 'md',
}: {
  category: MaterialCategory
  active?: boolean
  onClick?: () => void
  size?: 'sm' | 'md'
}) {
  const meta = CATEGORY_META[category]
  const Tag = onClick ? 'button' : 'span'
  return (
    <Tag
      className={`chip chip--${size} ${active ? 'chip--active' : ''} ${onClick ? 'chip--btn' : ''}`}
      onClick={onClick}
      type={onClick ? 'button' : undefined}
    >
      <span className="chip__emoji" aria-hidden>{meta.emoji}</span>
      {meta.label}
    </Tag>
  )
}

// ---------- Spinner / states ----------
export function Spinner({ label }: { label?: string }) {
  return (
    <div className="loading">
      <span className="loading__ring" aria-hidden />
      {label && <p>{label}</p>}
    </div>
  )
}

export function EmptyState({
  emoji = '🍃',
  title,
  desc,
  action,
}: {
  emoji?: string
  title: string
  desc?: string
  action?: ReactNode
}) {
  return (
    <div className="empty">
      <div className="empty__emoji" aria-hidden>{emoji}</div>
      <h3>{title}</h3>
      {desc && <p>{desc}</p>}
      {action}
    </div>
  )
}

// ---------- Status badge for disposals ----------
const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  PENDING: { label: 'Aguardando validação', cls: 'pending' },
  VALIDATED: { label: 'Validado', cls: 'validated' },
  EXPIRED: { label: 'Expirado', cls: 'expired' },
  CANCELLED: { label: 'Cancelado', cls: 'cancelled' },
}
export function StatusBadge({ status }: { status: string }) {
  const s = STATUS_LABEL[status] ?? { label: status, cls: 'pending' }
  return <span className={`status status--${s.cls}`}>{s.label}</span>
}
