import React, { useState, useEffect } from 'react'
import { MapPin, Shield, AlertTriangle, Users, Navigation, Radio, Eye, Phone, ZoomIn, ZoomOut, RotateCcw, Maximize, Info, Target } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { useGeofenceAPI } from '../hooks/useGeofenceAPI'
import { ImageWithFallback } from './figma/ImageWithFallback'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'

interface FallbackMapProps {
  userType: 'tourist' | 'authority'
  height?: string
  showControls?: boolean
  center?: [number, number]
  zoom?: number
  interactive?: boolean
  onZoneSelect?: (zoneId: string | null) => void
}

export function FallbackMap({ 
  userType, 
  height = "400px", 
  showControls = true,
  center = [25.5788, 91.8933],
  zoom = 13,
  interactive = true,
  onZoneSelect
}: FallbackMapProps) {
  const [selectedZone, setSelectedZone] = useState<string | null>(null)
  const [mapZoom, setMapZoom] = useState(zoom)
  const [isFullscreen, setIsFullscreen] = useState(false)
  
  // Use geofence API
  const {
    zones,
    tourists,
    alerts,
    loading,
    error,
    connected,
    dashboardMetrics,
    triggerEmergencyAlert
  } = useGeofenceAPI({
    enableRealTime: true,
    useMockData: true,
    autoRefresh: true
  })

  const handleEmergencyAlert = async () => {
    try {
      await triggerEmergencyAlert(
        'current-user', 
        { lat: center[0], lng: center[1] },
        'Emergency alert triggered from map interface'
      )
    } catch (error) {
      console.error('Emergency alert failed:', error)
    }
  }

  const handleZoneSelect = (zoneId: string | null) => {
    setSelectedZone(zoneId)
    onZoneSelect?.(zoneId)
  }

  return (
    <TooltipProvider>
      <div className="relative w-full rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg" style={{ height }}>
        {/* Dashboard Map Background with Dark Bluish Theme */}
        <div className="relative w-full h-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full" style={{
              backgroundImage: `
                linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '30px 30px'
            }}></div>
          </div>

          {/* Map Content Area */}
          <div className="absolute inset-0 p-6">
            {/* Geofence Zones with Enhanced Visualization */}
            {zones.slice(0, 6).map((zone, index) => {
              const positions = [
                { top: '25%', left: '20%' }, // Safe zone 1
                { top: '70%', left: '15%' }, // Safe zone 2
                { top: '40%', left: '65%' }, // Caution zone
                { top: '15%', right: '25%' }, // Restricted zone
                { bottom: '30%', right: '20%' }, // Emergency zone
                { top: '60%', left: '45%' } // Additional zone
              ]
              
              const position = positions[index] || { top: '50%', left: '50%' }
              const size = Math.max(60, Math.min(120, zone.radius / 8))
              
              return (
                <Tooltip key={zone.id}>
                  <TooltipTrigger asChild>
                    <div
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:scale-110 ${
                        selectedZone === zone.id ? 'z-20 scale-110' : 'z-10'
                      }`}
                      style={position}
                      onClick={() => handleZoneSelect(selectedZone === zone.id ? null : zone.id)}
                    >
                      {/* Zone Circle with Glow Effect */}
                      <div 
                        className={`rounded-full border-3 transition-all duration-500 ${
                          zone.type === 'safe' ? 'bg-green-500/30 border-green-400 shadow-green-400/50' :
                          zone.type === 'caution' ? 'bg-yellow-500/30 border-yellow-400 shadow-yellow-400/50' :
                          zone.type === 'restricted' ? 'bg-red-500/30 border-red-400 shadow-red-400/50' :
                          'bg-blue-500/30 border-blue-400 shadow-blue-400/50'
                        } ${selectedZone === zone.id ? 'shadow-2xl animate-pulse' : 'shadow-lg'}`}
                        style={{ 
                          width: `${size}px`,
                          height: `${size}px`,
                          boxShadow: selectedZone === zone.id ? 
                            `0 0 30px ${zone.type === 'safe' ? 'rgba(34, 197, 94, 0.6)' :
                             zone.type === 'caution' ? 'rgba(234, 179, 8, 0.6)' :
                             zone.type === 'restricted' ? 'rgba(239, 68, 68, 0.6)' :
                             'rgba(59, 130, 246, 0.6)'}` : 
                            'none'
                        }}
                      >
                        {/* Zone Center Icon */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          {zone.type === 'safe' && <Shield className="h-6 w-6 text-green-400" />}
                          {zone.type === 'caution' && <AlertTriangle className="h-6 w-6 text-yellow-400" />}
                          {zone.type === 'restricted' && <Target className="h-6 w-6 text-red-400" />}
                          {zone.type === 'emergency' && <Phone className="h-6 w-6 text-blue-400" />}
                        </div>
                      </div>
                      
                      {/* Zone Label */}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3">
                        <div className="bg-slate-800/90 backdrop-blur-sm border border-slate-600 rounded-lg px-3 py-1 text-xs font-medium text-white shadow-lg">
                          {zone.name}
                          <div className={`text-[10px] mt-0.5 ${
                            zone.type === 'safe' ? 'text-green-400' :
                            zone.type === 'caution' ? 'text-yellow-400' :
                            zone.type === 'restricted' ? 'text-red-400' :
                            'text-blue-400'
                          }`}>
                            {zone.type.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-slate-800 border-slate-600">
                    <div className="space-y-1">
                      <div className="font-semibold text-white">{zone.name}</div>
                      <div className="text-xs text-slate-300">
                        Radius: {zone.radius}m • Tourists: {zone.metadata?.tourists || 0}
                      </div>
                      {zone.metadata?.alerts > 0 && (
                        <div className="text-xs text-red-400">
                          ⚠ {zone.metadata.alerts} active alerts
                        </div>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              )
            })}

            {/* Current User Location - Enhanced "You" Marker */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
              <div className="relative">
                {/* Pulsing Ring */}
                <div className="absolute inset-0 w-12 h-12 bg-blue-500/30 rounded-full animate-ping"></div>
                <div className="absolute inset-0 w-8 h-8 bg-blue-500/50 rounded-full animate-ping animation-delay-200"></div>
                
                {/* Main Marker */}
                <div className="relative w-6 h-6 bg-blue-500 rounded-full border-4 border-white shadow-2xl">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-400 to-blue-600"></div>
                  <Navigation className="absolute inset-0 w-3 h-3 m-auto text-white" />
                </div>
                
                {/* "You" Label */}
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                  <div className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-bold shadow-lg border border-blue-400">
                    You
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-blue-600"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tourist Markers (for authority view) */}
            {userType === 'authority' && tourists.slice(0, 4).map((tourist, index) => {
              const positions = [
                { top: '35%', left: '35%' },
                { top: '55%', left: '60%' },
                { top: '30%', right: '35%' },
                { bottom: '40%', left: '25%' }
              ]
              
              const position = positions[index] || { top: '50%', left: '50%' }
              
              return (
                <Tooltip key={tourist.id}>
                  <TooltipTrigger asChild>
                    <div
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
                      style={position}
                    >
                      <div className="relative">
                        <div 
                          className={`w-4 h-4 rounded-full border-2 border-white shadow-lg transition-all duration-300 hover:scale-125 ${
                            tourist.status === 'safe' ? 'bg-green-500' :
                            tourist.status === 'caution' ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                        />
                        <Users className="absolute inset-0 w-2 h-2 m-auto text-white" />
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-slate-800 border-slate-600">
                    <div className="space-y-1 text-white">
                      <div className="font-semibold">{tourist.name}</div>
                      <div className="text-xs text-slate-300">
                        Safety Score: {tourist.safetyScore}%
                      </div>
                      <div className={`text-xs ${
                        tourist.status === 'safe' ? 'text-green-400' :
                        tourist.status === 'caution' ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        Status: {tourist.status.toUpperCase()}
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </div>

          {/* Enhanced Controls and Overlays */}
          {showControls && (
            <>
              {/* Live Status Indicator */}
              <div className="absolute top-4 left-4 bg-slate-800/95 backdrop-blur-sm border border-slate-600 rounded-lg p-3 shadow-xl z-40">
                <div className="flex items-center space-x-3">
                  <div className={`h-3 w-3 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                  <div>
                    <div className="text-white font-semibold text-sm">
                      {connected ? 'Live GPS Tracking' : 'Offline Mode'}
                    </div>
                    <div className="text-slate-400 text-xs">
                      Shillong, Meghalaya
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Controls */}
              <div className="absolute top-4 right-4 bg-slate-800/95 backdrop-blur-sm border border-slate-600 rounded-lg p-2 shadow-xl z-40">
                <div className="flex flex-col space-y-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-white hover:bg-slate-700"
                    onClick={() => setMapZoom(prev => Math.min(prev + 1, 18))}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <div className="text-xs text-slate-400 text-center py-1">{mapZoom}</div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-white hover:bg-slate-700"
                    onClick={() => setMapZoom(prev => Math.max(prev - 1, 5))}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <div className="border-t border-slate-600 pt-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-white hover:bg-slate-700"
                      onClick={() => setMapZoom(13)}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Enhanced Stats Dashboard */}
              <div className="absolute top-20 right-4 bg-slate-800/95 backdrop-blur-sm border border-slate-600 rounded-lg p-4 shadow-xl z-40">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-green-400">{zones.filter(z => z.type === 'safe').length}</div>
                    <div className="text-xs text-slate-300">Safe Zones</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-yellow-400">{zones.filter(z => z.type === 'caution').length}</div>
                    <div className="text-xs text-slate-300">Caution</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-red-400">{zones.filter(z => z.type === 'restricted').length}</div>
                    <div className="text-xs text-slate-300">Restricted</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-blue-400">{dashboardMetrics.activeTourists}</div>
                    <div className="text-xs text-slate-300">Active</div>
                  </div>
                </div>
              </div>

              {/* Emergency SOS Button */}
              {userType === 'tourist' && (
                <div className="absolute bottom-4 right-4 z-40">
                  <Button
                    size="lg"
                    onClick={handleEmergencyAlert}
                    className="bg-red-600 hover:bg-red-700 text-white shadow-2xl border-2 border-red-400 animate-pulse-glow"
                  >
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    EMERGENCY SOS
                  </Button>
                </div>
              )}

              {/* Enhanced Legend */}
              <div className="absolute bottom-4 left-4 bg-slate-800/95 backdrop-blur-sm border border-slate-600 rounded-lg p-4 shadow-xl z-40">
                <div className="space-y-3">
                  <div className="text-white font-semibold text-sm flex items-center">
                    <Info className="h-4 w-4 mr-2" />
                    Zone Legend
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-green-500 rounded-full shadow-sm"></div>
                      <span className="text-slate-300 text-sm">Safe Zone</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-yellow-500 rounded-full shadow-sm"></div>
                      <span className="text-slate-300 text-sm">Caution Zone</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-red-500 rounded-full shadow-sm"></div>
                      <span className="text-slate-300 text-sm">Restricted Zone</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-blue-500 rounded-full shadow-sm"></div>
                      <span className="text-slate-300 text-sm">Emergency Zone</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Selected Zone Details Popup */}
          {selectedZone && zones.find(z => z.id === selectedZone) && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 translate-y-20 z-50">
              <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-600 rounded-lg p-6 shadow-2xl min-w-[300px]">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-bold text-lg">
                      {zones.find(z => z.id === selectedZone)?.name}
                    </h3>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-slate-400 hover:text-white"
                      onClick={() => handleZoneSelect(null)}
                    >
                      ×
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="text-slate-400">Zone Type</div>
                      <Badge className={`${
                        zones.find(z => z.id === selectedZone)?.type === 'safe' ? 'bg-green-500' :
                        zones.find(z => z.id === selectedZone)?.type === 'caution' ? 'bg-yellow-500' :
                        zones.find(z => z.id === selectedZone)?.type === 'restricted' ? 'bg-red-500' :
                        'bg-blue-500'
                      } text-white`}>
                        {zones.find(z => z.id === selectedZone)?.type.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="text-slate-400">Radius</div>
                      <div className="text-white font-semibold">
                        {zones.find(z => z.id === selectedZone)?.radius}m
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-slate-400">Active Tourists</div>
                      <div className="text-white font-semibold">
                        {zones.find(z => z.id === selectedZone)?.metadata?.tourists || 0}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-slate-400">Alerts</div>
                      <div className={`font-semibold ${
                        (zones.find(z => z.id === selectedZone)?.metadata?.alerts || 0) > 0 ? 'text-red-400' : 'text-green-400'
                      }`}>
                        {zones.find(z => z.id === selectedZone)?.metadata?.alerts || 0}
                      </div>
                    </div>
                  </div>

                  {userType === 'authority' && (
                    <div className="pt-3 border-t border-slate-600">
                      <div className="grid grid-cols-2 gap-2">
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                          <Radio className="h-4 w-4 mr-2" />
                          Broadcast
                        </Button>
                        <Button size="sm" variant="outline" className="border-slate-600 text-white hover:bg-slate-700">
                          <Eye className="h-4 w-4 mr-2" />
                          Monitor
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* NavRakshak Branding */}
          <div className="absolute bottom-4 right-1/2 transform translate-x-1/2 z-30">
            <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-600 rounded-lg px-4 py-2 shadow-lg">
              <div className="flex items-center space-x-2 text-sm">
                <Shield className="h-4 w-4 text-blue-400" />
                <span className="text-white font-semibold">NavRakshak</span>
                <span className="text-slate-400">Live Safety Dashboard</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}