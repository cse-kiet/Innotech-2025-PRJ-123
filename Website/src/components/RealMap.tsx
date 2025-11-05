import React from 'react'
import { LeafletRealMap } from './LeafletRealMap'

interface RealMapProps {
  userType: 'tourist' | 'authority'
  height?: string
  showControls?: boolean
  center?: [number, number]
  zoom?: number
  interactive?: boolean
  onZoneSelect?: (zoneId: string | null) => void
}

export function RealMap({ 
  userType, 
  height = "400px", 
  showControls = true, 
  center = [28.7041, 77.4025], // KIET Ghaziabad coordinates
  zoom = 13,
  interactive = true,
  onZoneSelect
}: RealMapProps) {
  // Use the real Leaflet map implementation
  return (
    <LeafletRealMap
      userType={userType}
      height={height}
      showControls={showControls}
      center={center}
      zoom={zoom}
      interactive={interactive}
      onZoneSelect={onZoneSelect}
    />
  )
}