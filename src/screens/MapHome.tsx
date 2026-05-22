import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import { useNearbyPoints } from '../lib/queries'
import { CATEGORY_LIST, CURITIBA_CENTER, formatDistance } from '../catalog'
import { CategoryChip, Spinner, Stars } from '../components/ui'
import type { CollectionPoint, MaterialCategory } from '../types'

function markerIcon(p: CollectionPoint) {
  return L.divIcon({
    className: '',
    html: `<div class="map-marker ${p.isPartner ? 'map-marker--partner' : ''}"><span>${p.isPartner ? '🤝' : '📍'}</span></div>`,
    iconSize: [38, 38],
    iconAnchor: [19, 36],
  })
}

function Recenter({ points }: { points: CollectionPoint[] }) {
  const map = useMap()
  useMemo(() => {
    if (points.length > 0) {
      const bounds = L.latLngBounds(points.map((p) => [p.location.lat, p.location.lng]))
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 14 })
    }
  }, [points, map])
  return null
}

export default function MapHome() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<MaterialCategory[]>([])
  const [sheetOpen, setSheetOpen] = useState(true)
  const { data: points, isLoading } = useNearbyPoints(CURITIBA_CENTER, 20000, filters)

  function toggle(cat: MaterialCategory) {
    setFilters((f) => (f.includes(cat) ? f.filter((c) => c !== cat) : [...f, cat]))
  }

  return (
    <div className="map-screen">
      <div className="map-wrap">
        <div className="map-controls">
          <div className="filter-bar">
            <CategoryChip
              category={'OUTROS'}
              size="sm"
              active={filters.length === 0}
              onClick={() => setFilters([])}
            />
            {CATEGORY_LIST.filter((c) => c.category !== 'OUTROS').map((c) => (
              <CategoryChip
                key={c.category}
                category={c.category}
                size="sm"
                active={filters.includes(c.category)}
                onClick={() => toggle(c.category)}
              />
            ))}
          </div>
        </div>

        <MapContainer
          center={[CURITIBA_CENTER.lat, CURITIBA_CENTER.lng]}
          zoom={12}
          zoomControl={false}
          scrollWheelZoom
        >
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {points?.map((p) => (
            <Marker
              key={p.id}
              position={[p.location.lat, p.location.lng]}
              icon={markerIcon(p)}
              eventHandlers={{ click: () => navigate(`/app/point/${p.id}`) }}
            />
          ))}
          {points && <Recenter points={points} />}
        </MapContainer>

        {!sheetOpen && (
          <button className="sheet-fab" onClick={() => setSheetOpen(true)}>
            📋 Ver {points?.length ?? 0} pontos
          </button>
        )}

        <div className={`point-sheet ${sheetOpen ? '' : 'point-sheet--collapsed'}`}>
          <button className="point-sheet__toggle" onClick={() => setSheetOpen((o) => !o)} aria-label={sheetOpen ? 'Recolher lista' : 'Expandir lista'}>
            <span className="point-sheet__grab" />
          </button>
          <div className="point-sheet__head">
            <h3>Pontos próximos</h3>
            <button className="sheet-collapse" onClick={() => setSheetOpen(false)}>
              Ocultar
            </button>
          </div>
          <div className="point-sheet__list">
            {isLoading && <Spinner label="Buscando pontos em Curitiba…" />}
            {points?.map((p) => (
              <button key={p.id} className="point-row" onClick={() => navigate(`/app/point/${p.id}`)}>
                <span className={`point-row__icon ${p.isPartner ? 'point-row__icon--partner' : ''}`}>
                  {p.isPartner ? '🤝' : '📍'}
                </span>
                <span className="stack" style={{ gap: 4, minWidth: 0 }}>
                  <span className="point-row__name">{p.name}</span>
                  <span className="point-row__meta">
                    {p.isPartner && <span className="tag-partner">Parceiro</span>}
                    <Stars value={p.averageRating} count={p.ratingCount} />
                  </span>
                  <span className="faint" style={{ fontSize: 'var(--fs-sm)' }}>{p.neighborhood}</span>
                </span>
                <span className="point-row__dist">{formatDistance(p.distanceMeters)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
