// Camada de endpoints. No modo mock retorna fixtures com latência simulada.
// Para backend real: setar VITE_API_MODE=live e implementar o ramo `client`.
import { IS_MOCK, delay } from './mode'
import * as fx from './fixtures'
import { haversine } from '../catalog'
import type {
  Badge,
  CollectionPoint,
  Coordinates,
  Disposal,
  EducationArticle,
  MaterialCategory,
  RankingEntry,
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
  radiusMeters = 8000,
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
