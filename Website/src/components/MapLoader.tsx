import React, { useState, useEffect } from 'react'
import { AlertTriangle, RefreshCw, CheckCircle, Loader, MapPin } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'

interface MapLoaderProps {
  children: React.ReactNode
  height?: string
  onRetry?: () => void
  onMapTypeDetected?: (type: 'leaflet' | 'fallback') => void
}

export function MapLoader({ 
  children, 
  height = "400px", 
  onRetry,
  onMapTypeDetected 
}: MapLoaderProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mapType, setMapType] = useState<'leaflet' | 'fallback'>('fallback')
  const [loadingSteps, setLoadingSteps] = useState<string[]>([])

  useEffect(() => {
    // Check if Leaflet is available and load it
    const checkLeaflet = async () => {
      try {
        setLoadingSteps(['Initializing NavRakshak Map System...'])
        await new Promise(resolve => setTimeout(resolve, 500))

        setLoadingSteps(prev => [...prev, 'Checking Leaflet availability...'])
        await new Promise(resolve => setTimeout(resolve, 300))

        // Ensure Leaflet CSS is loaded
        if (typeof document !== 'undefined' && !document.querySelector('link[href*="leaflet"]')) {
          const link = document.createElement('link')
          link.rel = 'stylesheet'
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
          link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY='
          link.crossOrigin = ''
          document.head.appendChild(link)
          
          setLoadingSteps(prev => [...prev, 'Loading Leaflet CSS...'])
          await new Promise(resolve => setTimeout(resolve, 500))
        }

        // Try to dynamically import Leaflet
        const leaflet = await import('leaflet')
        const reactLeaflet = await import('react-leaflet')
        
        if (leaflet && reactLeaflet) {
          setLoadingSteps(prev => [...prev, 'Leaflet libraries loaded successfully!'])
          setMapType('leaflet')
          onMapTypeDetected?.('leaflet')
        }
        
        setLoadingSteps(prev => [...prev, 'Setting up real-time geofencing...'])
        await new Promise(resolve => setTimeout(resolve, 300))
        
        setIsLoading(false)
      } catch (err) {
        console.warn('Leaflet not available, using fallback:', err)
        setLoadingSteps(prev => [...prev, 'Using fallback map visualization'])
        setMapType('fallback')
        onMapTypeDetected?.('fallback')
        setIsLoading(false)
      }
    }

    const timer = setTimeout(() => {
      checkLeaflet()
    }, 200)

    return () => clearTimeout(timer)
  }, [onMapTypeDetected])

  if (isLoading) {
    return (
      <div className="w-full bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg flex items-center justify-center" style={{ height }}>
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-6 text-center">
            <div className="mb-4">
              <Loader className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-3" />
              <MapPin className="h-6 w-6 text-green-500 mx-auto" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Loading NavRakshak Map</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Initializing real-time safety monitoring system...
            </p>
            
            {/* Loading steps */}
            <div className="space-y-2 text-left">
              {loadingSteps.map((step, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-muted-foreground">{step}</span>
                </div>
              ))}
              {loadingSteps.length > 0 && (
                <div className="flex items-center space-x-2 text-sm">
                  <Loader className="h-4 w-4 animate-spin text-blue-500 flex-shrink-0" />
                  <span className="text-muted-foreground">Finalizing setup...</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center" style={{ height }}>
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Map Load Error</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {error}
            </p>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg mb-4">
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Don't worry! NavRakshak will use backup visualization mode.
              </p>
            </div>
            {onRetry && (
              <Button onClick={onRetry} size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry Loading
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}

// Helper function to ensure Leaflet CSS is loaded
export function ensureLeafletCSS() {
  if (typeof document === 'undefined') return

  if (!document.querySelector('link[href*="leaflet"]')) {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY='
    link.crossOrigin = ''
    document.head.appendChild(link)
  }
}