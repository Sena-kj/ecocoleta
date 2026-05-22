import type { CategoryMeta, Level, MaterialCategory } from './types'

// Pontos por unidade — spec §14.2
export const CATEGORY_META: Record<MaterialCategory, CategoryMeta> = {
  PILHA_BATERIA: { category: 'PILHA_BATERIA', label: 'Pilhas e baterias', emoji: '🔋', pointsPerUnit: 5 },
  CABOS_CARREGADORES: { category: 'CABOS_CARREGADORES', label: 'Cabos e carregadores', emoji: '🔌', pointsPerUnit: 5 },
  CELULAR: { category: 'CELULAR', label: 'Celular', emoji: '📱', pointsPerUnit: 30 },
  NOTEBOOK_COMPUTADOR: { category: 'NOTEBOOK_COMPUTADOR', label: 'Notebook / computador', emoji: '💻', pointsPerUnit: 80 },
  ELETRODOMESTICO_PEQUENO: { category: 'ELETRODOMESTICO_PEQUENO', label: 'Eletrodoméstico pequeno', emoji: '📻', pointsPerUnit: 50 },
  ELETRODOMESTICO_GRANDE: { category: 'ELETRODOMESTICO_GRANDE', label: 'Eletrodoméstico grande', emoji: '🧊', pointsPerUnit: 150 },
  OUTROS: { category: 'OUTROS', label: 'Outros', emoji: '♻️', pointsPerUnit: 10 },
}

export const CATEGORY_LIST: CategoryMeta[] = Object.values(CATEGORY_META)

// Níveis — spec §14.3
export const LEVELS: Level[] = [
  { level: 1, name: 'Iniciante Verde', min: 0, max: 99 },
  { level: 2, name: 'Cidadão Consciente', min: 100, max: 299 },
  { level: 3, name: 'Guardião Local', min: 300, max: 699 },
  { level: 4, name: 'Embaixador EcoColeta', min: 700, max: 1499 },
  { level: 5, name: 'Lenda Sustentável', min: 1500, max: null },
]

export function levelFor(points: number): Level {
  return LEVELS.find((l) => points >= l.min && (l.max === null || points <= l.max)) ?? LEVELS[0]
}

/** Progresso 0..1 dentro do nível atual. Nível máx retorna 1. */
export function levelProgress(points: number): number {
  const lvl = levelFor(points)
  if (lvl.max === null) return 1
  return (points - lvl.min) / (lvl.max - lvl.min + 1)
}

export function pointsToNextLevel(points: number): number | null {
  const lvl = levelFor(points)
  if (lvl.max === null) return null
  return lvl.max + 1 - points
}

export function formatDistance(meters?: number): string {
  if (meters == null) return ''
  if (meters < 1000) return `${Math.round(meters)} m`
  return `${(meters / 1000).toFixed(1).replace('.', ',')} km`
}

// Haversine — distância geodésica (espelha ST_Distance do PostGIS, RN-10)
export function haversine(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371000
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLng = ((b.lng - a.lng) * Math.PI) / 180
  const la1 = (a.lat * Math.PI) / 180
  const la2 = (b.lat * Math.PI) / 180
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

// Centro de Curitiba (Praça Tiradentes) — fallback de localização
export const CURITIBA_CENTER = { lat: -25.4284, lng: -49.2733 }
