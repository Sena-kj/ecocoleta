// ============================================================
// EcoColeta — Modelos de domínio (espelham o schema da spec §8/§14)
// Fonte de verdade dos tipos consumidos pela UI e pelas fixtures.
// ============================================================

export type MaterialCategory =
  | 'PILHA_BATERIA'
  | 'CELULAR'
  | 'NOTEBOOK_COMPUTADOR'
  | 'ELETRODOMESTICO_PEQUENO'
  | 'ELETRODOMESTICO_GRANDE'
  | 'CABOS_CARREGADORES'
  | 'OUTROS'

export type UserRole = 'USER' | 'PARTNER' | 'ADMIN'

export type DisposalStatus = 'PENDING' | 'VALIDATED' | 'CANCELLED' | 'EXPIRED'

export interface Coordinates {
  lat: number
  lng: number
}

export interface User {
  id: string
  name: string
  email: string
  photoUrl?: string
  neighborhood?: string
  role: UserRole
  totalPoints: number
  monthlyPoints: number
  createdAt: string
}

export interface CollectionPoint {
  id: string
  name: string
  description?: string
  address: string
  neighborhood: string
  location: Coordinates
  phone?: string
  openingHours: string
  photoUrl?: string
  acceptedMaterials: MaterialCategory[]
  averageRating: number
  ratingCount: number
  /** metros — calculado client-side a partir da posição do usuário */
  distanceMeters?: number
  isPartner: boolean
}

export interface Disposal {
  id: string
  qrCode: string
  status: DisposalStatus
  pointId: string
  pointName: string
  material: MaterialCategory
  quantity: number
  pointsAwarded: number
  createdAt: string
  validatedAt?: string
  expiresAt: string
}

export interface Badge {
  code: string
  name: string
  description: string
  emoji: string
  earned: boolean
  earnedAt?: string
}

export interface RankingEntry {
  position: number
  userId: string
  name: string
  neighborhood?: string
  monthlyPoints: number
  isCurrentUser: boolean
}

export interface Level {
  level: number
  name: string
  min: number
  max: number | null
}

export interface EducationArticle {
  id: string
  category: MaterialCategory | 'GERAL'
  title: string
  excerpt: string
  body: string
  readMinutes: number
}

export type RewardKind = 'ELETRONICO' | 'DESCONTO' | 'PRODUTO' | 'SERVICO'

export interface Reward {
  id: string
  name: string
  description: string
  emoji: string
  kind: RewardKind
  pointsCost: number
  stock: number
  partnerName?: string
  active: boolean
}

export interface Redemption {
  id: string
  rewardId: string
  rewardName: string
  userName: string
  pointsSpent: number
  status: 'PENDING' | 'DELIVERED' | 'CANCELLED'
  createdAt: string
}

// ---- Metadados de categoria (rótulo PT-BR, emoji, pontos por unidade) ----
export interface CategoryMeta {
  category: MaterialCategory
  label: string
  emoji: string
  pointsPerUnit: number
}
