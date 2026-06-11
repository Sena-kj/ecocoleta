import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as api from '../api/endpoints'
import type { Coordinates, MaterialCategory } from '../types'

export function useMe() {
  return useQuery({ queryKey: ['me'], queryFn: api.getMe })
}

export function useNearbyPoints(
  origin: Coordinates,
  radiusMeters: number,
  materials: MaterialCategory[],
) {
  return useQuery({
    queryKey: ['points', origin.lat, origin.lng, radiusMeters, materials.join(',')],
    queryFn: () => api.getNearbyPoints({ origin, radiusMeters, materials }),
  })
}

export function usePoint(id: string | undefined) {
  return useQuery({
    queryKey: ['point', id],
    queryFn: () => api.getPoint(id!),
    enabled: !!id,
  })
}

export function useMyDisposals() {
  return useQuery({ queryKey: ['disposals'], queryFn: api.getMyDisposals })
}

export function useDisposal(id: string | undefined) {
  return useQuery({
    queryKey: ['disposal', id],
    queryFn: () => api.getDisposal(id!),
    enabled: !!id,
  })
}

export function useCreateDisposal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: api.createDisposal,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['disposals'] }),
  })
}

export function useBadges() {
  return useQuery({ queryKey: ['badges'], queryFn: api.getBadges })
}

export function useRanking() {
  return useQuery({ queryKey: ['ranking'], queryFn: api.getRanking })
}

export function useArticles() {
  return useQuery({ queryKey: ['articles'], queryFn: api.getArticles })
}

export function useRewards() {
  return useQuery({ queryKey: ['rewards'], queryFn: api.getRewards })
}

export function useRedeem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: api.redeemReward,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rewards'] })
      qc.invalidateQueries({ queryKey: ['me'] })
      qc.invalidateQueries({ queryKey: ['redemptions'] })
    },
  })
}

export function useRedemptions() {
  return useQuery({ queryKey: ['redemptions'], queryFn: api.getRedemptions })
}

export function useAllPoints() {
  return useQuery({ queryKey: ['all-points'], queryFn: api.getAllPoints })
}

export function useAdminMetrics() {
  return useQuery({ queryKey: ['admin-metrics'], queryFn: api.getAdminMetrics })
}

export function useAdminRecentDisposals() {
  return useQuery({ queryKey: ['admin-recent-disposals'], queryFn: api.getRecentDisposalsAdmin })
}
