// Utility to check and install Leaflet dependencies
export const checkLeafletInstallation = () => {
  if (typeof window === 'undefined') {
    return false
  }

  try {
    // Try to access Leaflet from window object
    return !!(window as any).L
  } catch {
    return false
  }
}

export const loadLeafletCSS = () => {
  if (typeof document === 'undefined') return

  // Check if Leaflet CSS is already loaded
  if (document.querySelector('link[href*="leaflet"]')) {
    return
  }

  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
  link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY='
  link.crossOrigin = ''
  document.head.appendChild(link)
}

export const installationInstructions = {
  npm: 'npm install leaflet @types/leaflet react-leaflet',
  yarn: 'yarn add leaflet @types/leaflet react-leaflet',
  pnpm: 'pnpm add leaflet @types/leaflet react-leaflet'
}

export const mapFeatures = {
  current: [
    'Real-time geofence visualization',
    'Tourist safety scoring',
    'Emergency alert system',
    'Zone-based monitoring',
    'Live status indicators'
  ],
  withLeaflet: [
    'Interactive map tiles',
    'Smooth zoom and pan',
    'Detailed popup information',
    'Street-level accuracy',
    'Custom marker styling',
    'Real-time GPS tracking'
  ]
}