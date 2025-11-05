import React from 'react'
import React from 'react'
import { FallbackMap } from './FallbackMap'

interface SafeLeafletMapProps {
  userType: 'tourist' | 'authority'
  height?: string
  showControls?: boolean
  center?: [number, number]
  zoom?: number
  interactive?: boolean
  onZoneSelect?: (zoneId: string | null) => void
}

export function SafeLeafletMap(props: SafeLeafletMapProps) {
  // Always use the enhanced fallback map - fully functional safety monitoring
  // Users can optionally install Leaflet for street-level map tiles
  return <FallbackMap {...props} />
}