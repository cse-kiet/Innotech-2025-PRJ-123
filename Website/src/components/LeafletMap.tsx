// Safe Leaflet Map Component - Build-Safe Version
// This component provides a fallback that doesn't break builds when Leaflet isn't installed

import React from 'react'
import { FallbackMap } from './FallbackMap'
import { MapPin, Download, Zap, AlertCircle } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'

interface LeafletMapProps {
  userType: 'tourist' | 'authority'
  height?: string
  showControls?: boolean
  center?: [number, number]
  zoom?: number
  interactive?: boolean
  onZoneSelect?: (zoneId: string | null) => void
}

export function LeafletMap(props: LeafletMapProps) {
  // This is a build-safe fallback component
  // Install leaflet @types/leaflet react-leaflet for enhanced features
  
  return (
    <div className="relative">
      <FallbackMap {...props} />
      
      {/* Enhancement Notice */}
      <div className="absolute top-2 right-2 z-20">
        <Card className="bg-white/95 dark:bg-black/95 backdrop-blur-sm shadow-lg border">
          <CardContent className="p-3">
            <div className="flex items-center space-x-2 text-sm">
              <AlertCircle className="h-4 w-4 text-blue-500" />
              <div>
                <p className="font-medium">Enhanced Maps Available</p>
                <p className="text-xs text-muted-foreground">
                  Install Leaflet for interactive features
                </p>
              </div>
            </div>
            <Button
              size="sm"
              className="w-full mt-2"
              onClick={() => {
                const cmd = 'npm install leaflet @types/leaflet react-leaflet'
                navigator.clipboard?.writeText(cmd)
                alert(`Installation command copied to clipboard:\n\n${cmd}\n\nRun this command and refresh the page.`)
              }}
            >
              <Download className="h-3 w-3 mr-2" />
              Install Enhanced Maps
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}