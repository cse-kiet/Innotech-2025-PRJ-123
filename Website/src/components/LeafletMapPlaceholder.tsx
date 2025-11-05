import React, { useState } from 'react'
import { 
  MapPin, Download, CheckCircle, AlertCircle, 
  ExternalLink, Code, Terminal, Copy, Zap
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Alert, AlertDescription } from './ui/alert'
import { toast } from 'sonner@2.0.3'
import { FallbackMap } from './FallbackMap'

interface LeafletMapPlaceholderProps {
  userType: 'tourist' | 'authority'
  height?: string
  showControls?: boolean
  center?: [number, number]
  zoom?: number
  interactive?: boolean
  onZoneSelect?: (zoneId: string | null) => void
}

export function LeafletMapPlaceholder(props: LeafletMapPlaceholderProps) {
  const [showInstallGuide, setShowInstallGuide] = useState(false)
  const [copiedCommand, setCopiedCommand] = useState(false)

  const installCommand = "npm install leaflet @types/leaflet react-leaflet"

  const copyInstallCommand = async () => {
    try {
      await navigator.clipboard.writeText(installCommand)
      setCopiedCommand(true)
      toast.success('Installation command copied!')
      setTimeout(() => setCopiedCommand(false), 2000)
    } catch (error) {
      toast.error('Failed to copy command')
    }
  }

  if (showInstallGuide) {
    return (
      <div className="relative w-full" style={{ height: props.height || "500px" }}>
        <Card className="h-full flex flex-col">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Enhanced Interactive Maps</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Upgrade NavRakshak with Leaflet for professional mapping
                  </p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowInstallGuide(false)}
              >
                ✕
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex-1 space-y-6 overflow-auto">
            {/* Benefits */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center text-green-600">
                <Zap className="h-4 w-4 mr-2" />
                Enhanced Features with Leaflet
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  'Interactive street maps',
                  'Smooth zoom & pan controls',
                  'Detailed popup information',
                  'Professional map styling',
                  'Custom marker animations',
                  'Real-time GPS accuracy'
                ].map((feature, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Status */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Current Status:</strong> NavRakshak is fully functional using optimized visualization mode. 
                All safety features are active and working perfectly.
              </AlertDescription>
            </Alert>

            {/* Installation */}
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-3 flex items-center">
                <Terminal className="h-4 w-4 mr-2" />
                Quick Installation
              </h4>
              <div className="flex items-center space-x-2 mb-3">
                <div className="flex-1 bg-black/90 text-green-400 p-3 rounded font-mono text-sm">
                  {installCommand}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={copyInstallCommand}
                  className="h-12 px-3"
                >
                  {copiedCommand ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                After installation, refresh the page to automatically enable enhanced maps.
              </p>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold mb-3">Learn More</h4>
              <div className="space-y-2">
                <a 
                  href="https://leafletjs.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Leaflet Official Documentation</span>
                </a>
                <a 
                  href="https://react-leaflet.js.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>React-Leaflet Guide</span>
                </a>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4 border-t">
              <Button 
                onClick={() => window.location.reload()} 
                className="flex-1"
                variant="outline"
              >
                <Download className="h-4 w-4 mr-2" />
                I've Installed - Refresh Page
              </Button>
              <Button 
                variant="default" 
                onClick={() => setShowInstallGuide(false)}
                className="flex-1"
              >
                Continue with Current Map
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="relative">
      <FallbackMap {...props} />
      
      {/* Upgrade Button */}
      <div className="absolute top-4 right-4 z-20">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowInstallGuide(true)}
          className="bg-white/90 dark:bg-black/90 backdrop-blur-sm border shadow-lg hover:shadow-xl transition-all"
        >
          <Zap className="h-4 w-4 mr-2 text-blue-500" />
          <span className="text-sm font-medium">Upgrade Maps</span>
        </Button>
      </div>
    </div>
  )
}