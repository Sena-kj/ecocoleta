// Camada de endpoints. No modo mock retorna fixtures com latência simulada.
// Para backend real: setar VITE_API_MODE=live e implementar o ramo `client`.
import { IS_MOCK, delay } from './mode'
import * as fx from './fixtures'
import { haversine, SEARCH_RADIUS_KM, CATEGORY_META } from '../catalog'
import type {
  Badge,
  CollectionPoint,
  Coordinates,
  Disposal,
  EducationArticle,
  MaterialCategory,
  RankingEntry,
  Review,
  Reward,
  Redemption,
  User,
} from '../types'

function notLive(): never {
  throw new Error('Modo live ainda não implementado — rodando em fixtures-first (VITE_API_MODE=mock).')
}

export async function getMe(): Promise<User> {
  if (IS_MOCK) {
    await delay(250)
    return fx.currentUser
  }
  return notLive()
}

export interface NearbyParams {
  origin: Coordinates
  radiusMeters?: number
  materials?: MaterialCategory[]
}

export async function getNearbyPoints({
  origin,
  radiusMeters = SEARCH_RADIUS_KM * 1000,
  materials,
}: NearbyParams): Promise<CollectionPoint[]> {
  if (IS_MOCK) {
    await delay(500)
    return fx.collectionPoints
      .map((p) => ({ ...p, distanceMeters: haversine(origin, p.location) }))
      .filter((p) => p.distanceMeters! <= radiusMeters)
      .filter((p) =>
        !materials || materials.length === 0
          ? true
          : p.acceptedMaterials.some((m) => materials.includes(m)),
      )
      .sort((a, b) => a.distanceMeters! - b.distanceMeters!)
  }
  return notLive()
}

export async function getPoint(id: string): Promise<CollectionPoint | undefined> {
  if (IS_MOCK) {
    await delay(300)
    return fx.collectionPoints.find((p) => p.id === id)
  }
  return notLive()
}

export async function getMyDisposals(): Promise<Disposal[]> {
  if (IS_MOCK) {
    await delay(400)
    return [...fx.disposals].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
  }
  return notLive()
}

export async function getDisposal(id: string): Promise<Disposal | undefined> {
  if (IS_MOCK) {
    await delay(200)
    return fx.disposals.find((d) => d.id === id)
  }
  return notLive()
}

export interface CreateDisposalInput {
  pointId: string
  material: MaterialCategory
  quantity: number
}

export async function createDisposal(input: CreateDisposalInput): Promise<Disposal> {
  if (IS_MOCK) {
    await delay(650)
    const point = fx.collectionPoints.find((p) => p.id === input.pointId)
    const now = new Date()
    const created: Disposal = {
      id: `d-${Math.random().toString(36).slice(2, 8)}`,
      qrCode: crypto.randomUUID(),
      status: 'PENDING',
      pointId: input.pointId,
      pointName: point?.name ?? 'Ponto',
      material: input.material,
      quantity: input.quantity,
      pointsAwarded: 0,
      createdAt: now.toISOString(),
      expiresAt: new Date(now.getTime() + 24 * 3600 * 1000).toISOString(),
    }
    fx.disposals.unshift(created)
    return created
  }
  return notLive()
}

export async function getBadges(): Promise<Badge[]> {
  if (IS_MOCK) {
    await delay(300)
    return fx.badges
  }
  return notLive()
}

export async function getRanking(): Promise<RankingEntry[]> {
  if (IS_MOCK) {
    await delay(400)
    return fx.ranking
  }
  return notLive()
}

export async function getArticles(): Promise<EducationArticle[]> {
  if (IS_MOCK) {
    await delay(300)
    return fx.articles
  }
  return notLive()
}

export async function getRewards(): Promise<Reward[]> {
  if (IS_MOCK) {
    await delay(400)
    return fx.rewards
  }
  return notLive()
}

export async function redeemReward(rewardId: string): Promise<Redemption> {
  if (IS_MOCK) {
    await delay(600)
    const reward = fx.rewards.find((r) => r.id === rewardId)
    if (!reward) throw new Error('Item não encontrado')
    if (reward.stock <= 0) throw new Error('Item esgotado')
    if (fx.currentUser.totalPoints < reward.pointsCost) throw new Error('Pontos insuficientes')
    reward.stock -= 1
    fx.currentUser.totalPoints -= reward.pointsCost
    const red: Redemption = {
      id: `re-${Math.random().toString(36).slice(2, 8)}`,
      rewardId: reward.id,
      rewardName: reward.name,
      userName: fx.currentUser.name,
      pointsSpent: reward.pointsCost,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    }
    fx.redemptions.unshift(red)
    return red
  }
  return notLive()
}

export async function getRedemptions(): Promise<Redemption[]> {
  if (IS_MOCK) {
    await delay(300)
    return fx.redemptions
  }
  return notLive()
}

// ---- Avaliações de ponto (reviews) ----
export async function getPointReviews(pointId: string): Promise<Review[]> {
  if (IS_MOCK) {
    await delay(350)
    return fx.reviews
      .filter((r) => r.pointId === pointId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }
  return notLive()
}

export interface SubmitReviewInput {
  pointId: string
  rating: number
  comment: string
}

export async function submitReview(input: SubmitReviewInput): Promise<Review> {
  if (IS_MOCK) {
    await delay(550)
    const review: Review = {
      id: `rv-${Math.random().toString(36).slice(2, 8)}`,
      pointId: input.pointId,
      userName: fx.currentUser.name,
      rating: Math.max(1, Math.min(5, Math.round(input.rating))),
      comment: input.comment.trim(),
      createdAt: new Date().toISOString(),
    }
    fx.reviews.unshift(review)
    // Recalcula a média/contagem do ponto para refletir a nova avaliação.
    const point = fx.collectionPoints.find((p) => p.id === input.pointId)
    if (point) {
      const ofPoint = fx.reviews.filter((r) => r.pointId === input.pointId)
      const avg = ofPoint.reduce((s, r) => s + r.rating, 0) / ofPoint.length
      point.averageRating = Math.round(avg * 10) / 10
      point.ratingCount = point.ratingCount + 1
    }
    return review
  }
  return notLive()
}

// ---- Edição de perfil ----
export interface UpdateMeInput {
  name?: string
  neighborhood?: string
  photoUrl?: string
}

export async function updateMe(partial: UpdateMeInput): Promise<User> {
  if (IS_MOCK) {
    await delay(500)
    if (partial.name !== undefined) fx.currentUser.name = partial.name.trim() || fx.currentUser.name
    if (partial.neighborhood !== undefined) fx.currentUser.neighborhood = partial.neighborhood.trim()
    if (partial.photoUrl !== undefined) fx.currentUser.photoUrl = partial.photoUrl
    return fx.currentUser
  }
  return notLive()
}

export async function getAllPoints(): Promise<CollectionPoint[]> {
  if (IS_MOCK) {
    await delay(300)
    return fx.collectionPoints
  }
  return notLive()
}

/** Descarte enriquecido com o usuário autor — usado só no painel admin global. */
export interface AdminDisposal extends Disposal {
  userName: string
  userEmail: string
}

export async function getRecentDisposalsAdmin(): Promise<AdminDisposal[]> {
  if (IS_MOCK) {
    await delay(400)
    return [...fx.adminRecentDisposals].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
  }
  return notLive()
}

// ============================================================
// ÁREA DO PARCEIRO
// O parceiro logado opera um ponto fixo (TechFix, p-002 — é isPartner).
// Reaproveita a base global de descartes (adminRecentDisposals) como os
// descartes "recebidos" neste ponto, filtrando por pointId.
// ============================================================
export const PARTNER_POINT_ID = 'p-002'

export async function getPartnerPoint(): Promise<CollectionPoint | undefined> {
  if (IS_MOCK) {
    await delay(300)
    return fx.collectionPoints.find((p) => p.id === PARTNER_POINT_ID)
  }
  return notLive()
}

export async function getPartnerDisposals(): Promise<AdminDisposal[]> {
  if (IS_MOCK) {
    await delay(400)
    return [...fx.adminRecentDisposals]
      .filter((d) => d.pointId === PARTNER_POINT_ID)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }
  return notLive()
}

export interface ValidateQrResult {
  disposal: AdminDisposal
  pointsAwarded: number
}

/**
 * Valida um descarte PENDING a partir do qrCode colado/lido pelo parceiro.
 * Credita os pontos via CATEGORY_META e marca como VALIDATED. Mock-only.
 */
export async function validateDisposalByQr(qrCode: string): Promise<ValidateQrResult> {
  if (IS_MOCK) {
    await delay(600)
    const code = qrCode.trim()
    if (!code) throw new Error('Informe um QR Code.')
    const disposal = fx.adminRecentDisposals.find((d) => d.qrCode === code)
    if (!disposal) throw new Error('QR Code não encontrado neste ponto.')
    if (disposal.pointId !== PARTNER_POINT_ID) throw new Error('Este descarte pertence a outro ponto.')
    if (disposal.status === 'VALIDATED') throw new Error('Este descarte já foi validado.')
    if (disposal.status === 'EXPIRED') throw new Error('Este descarte expirou e não pode ser validado.')

    const pointsAwarded = CATEGORY_META[disposal.material].pointsPerUnit * disposal.quantity
    disposal.status = 'VALIDATED'
    disposal.validatedAt = new Date().toISOString()
    disposal.pointsAwarded = pointsAwarded
    return { disposal, pointsAwarded }
  }
  return notLive()
}

export interface AdminMetrics {
  totalDisposals: number
  validatedDisposals: number
  pointsDistributed: number
  activeUsers: number
  partners: number
  pendingPartners: number
  ewasteKg: number
}

export async function getAdminMetrics(): Promise<AdminMetrics> {
  if (IS_MOCK) {
    await delay(350)
    const validated = fx.disposals.filter((d) => d.status === 'VALIDATED')
    return {
      totalDisposals: fx.disposals.length + 1240,
      validatedDisposals: validated.length + 1010,
      pointsDistributed: 84210,
      activeUsers: 312,
      partners: fx.collectionPoints.filter((p) => p.isPartner).length,
      pendingPartners: 3,
      ewasteKg: 1875,
    }
  }
  return notLive()
}
