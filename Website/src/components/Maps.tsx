import React, { useState, useEffect, useRef } from 'react'
import { 
  MapPin, Shield, AlertTriangle, Users, Navigation, 
  Eye, EyeOff, Layers, ZoomIn, ZoomOut, RotateCcw,
  Radio, Wifi, Camera, Phone, MessageCircle,
  Activity, Target, Compass, Mountain, TreePine,
  Building, Home, Ambulance, Car, Heart, Clock,
  RefreshCw, Plus, Settings, Maximize
} from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Switch } from './ui/switch'
import { Slider } from './ui/slider'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'
import { Progress } from './ui/progress'
import { useGeofenceAPI } from '../hooks/useGeofenceAPI'
import { toast } from 'sonner@2.0.3'
import { RealMap } from './RealMap'

interface MapProps {
  userType: 'tourist' | 'authority'
  currentLocation?: { lat: number; lng: number }
}

interface MapGeofenceZone {
  id: string
  name: string
  type: 'safe' | 'caution' | 'restricted' | 'emergency'
  center: { x: number; y: number }
  radius: number
  color: string
  strokeColor: string
  tourists: number
  alerts: number
  active: boolean
  coordinates?: { lat: number; lng: number }
}

interface MapTourist {
  id: string
  name: string
  location: { x: number; y: number }
  safetyScore: number
  status: 'safe' | 'caution' | 'danger' | 'emergency'
  lastSeen: Date
}

interface Landmark {
  id: string
  name: string
  type: 'attraction' | 'hospital' | 'police' | 'hotel' | 'restaurant'
  location: { x: number; y: number }
  icon: any
  rating?: number
}

export function Maps({ userType, currentLocation }: MapProps) {
  const [mapZoom, setMapZoom] = useState(15)
  const [mapCenter, setMapCenter] = useState<[number, number]>([28.7041, 77.4025]) // KIET Ghaziabad coordinates
  const [selectedZone, setSelectedZone] = useState<string | null>(null)
  const [showTourists, setShowTourists] = useState(true)
  const [showLandmarks, setShowLandmarks] = useState(true)
  const [showGeofences, setShowGeofences] = useState(true)
  const [showHeatmap, setShowHeatmap] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Use the geofence API hook
  const {
    zones,
    tourists,
    alerts,
    loading,
    error,
    connected,
    dashboardMetrics,
    loadData,
    updateZone,
    acknowledgeAlert,
    triggerEmergencyAlert
  } = useGeofenceAPI({
    enableRealTime: true,
    useMockData: false, // Enable real API integration
    autoRefresh: true
  })

  const selectedZoneData = selectedZone ? zones.find(z => z.id === selectedZone) : null

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Real-Time Safety Map
              </h2>
              {loading && <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />}
            </div>
            <p className="text-muted-foreground">
              Live geofencing and tourist tracking for KIET Ghaziabad, Uttar Pradesh
              {!connected && <span className="text-orange-500 ml-2">(Offline Mode)</span>}
            </p>
            {error && (
              <p className="text-red-500 text-sm mt-1">
                API Error: {error}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={connected ? "secondary" : "destructive"} className={connected ? "bg-green-100 text-green-700" : ""}>
              <Activity className="h-3 w-3 mr-1" />
              {connected ? 'Live Tracking' : 'Offline'}
            </Badge>
            <Badge variant="outline">
              <Users className="h-3 w-3 mr-1" />
              {dashboardMetrics.activeTourists}/{dashboardMetrics.totalTourists} Active
            </Badge>
            <Badge variant="outline">
              <AlertTriangle className="h-3 w-3 mr-1" />
              {dashboardMetrics.activeAlerts} Alerts
            </Badge>
            <Button size="sm" variant="outline" onClick={loadData} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Map Controls */}
          <Card className="lg:col-span-1 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border-white/30 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Layers className="h-5 w-5" />
                <span>Map Controls</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Zoom Controls */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Zoom Level</label>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline" onClick={() => setMapZoom(prev => Math.max(prev - 1, 8))} className="bg-white/50 hover:bg-white/80">
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="text-sm min-w-12 text-center font-medium">{mapZoom}</span>
                  <Button size="sm" variant="outline" onClick={() => setMapZoom(prev => Math.min(prev + 1, 20))} className="bg-white/50 hover:bg-white/80">
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => {
                    setMapZoom(15)
                    setMapCenter([28.7041, 77.4025])
                  }} className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-600">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Layer Toggles */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Map Layers</label>
                
                <div className="flex items-center justify-between p-2 rounded-lg bg-white/30 dark:bg-gray-700/30">
                  <label className="text-sm flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span>Geofences</span>
                  </label>
                  <Switch checked={showGeofences} onCheckedChange={setShowGeofences} />
                </div>
                
                <div className="flex items-center justify-between p-2 rounded-lg bg-white/30 dark:bg-gray-700/30">
                  <label className="text-sm flex items-center space-x-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span>Tourists</span>
                  </label>
                  <Switch checked={showTourists} onCheckedChange={setShowTourists} />
                </div>
                
                <div className="flex items-center justify-between p-2 rounded-lg bg-white/30 dark:bg-gray-700/30">
                  <label className="text-sm flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-purple-500" />
                    <span>Places</span>
                  </label>
                  <Switch checked={showLandmarks} onCheckedChange={setShowLandmarks} />
                </div>
                
                <div className="flex items-center justify-between p-2 rounded-lg bg-white/30 dark:bg-gray-700/30">
                  <label className="text-sm flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-red-500" />
                    <span>Heat Map</span>
                  </label>
                  <Switch checked={showHeatmap} onCheckedChange={setShowHeatmap} />
                </div>
              </div>

              {/* Enhanced Legend */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Safety Legend</label>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center space-x-2 p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
                    <div className="w-4 h-4 bg-green-500 rounded-full shadow-sm"></div>
                    <span className="text-green-700 dark:text-green-300">Safe Zone (Campus, Malls)</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full shadow-sm"></div>
                    <span className="text-yellow-700 dark:text-yellow-300">Caution Zone (Stations, Markets)</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 rounded-lg bg-red-50 dark:bg-red-900/20">
                    <div className="w-4 h-4 bg-red-500 rounded-full shadow-sm"></div>
                    <span className="text-red-700 dark:text-red-300">Restricted Zone (Highways)</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <div className="w-4 h-4 bg-blue-500 rounded-full shadow-sm"></div>
                    <span className="text-blue-700 dark:text-blue-300">Emergency Zone (Hospitals)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Map */}
          <Card className="lg:col-span-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border-white/30 shadow-2xl overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-blue-500" />
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">KIET Ghaziabad Safety Map</span>
                </CardTitle>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="bg-white/50 hover:bg-white/80 border-white/30"
                >
                  <Maximize className="h-4 w-4 mr-2" />
                  {isFullscreen ? 'Normal' : 'Fullscreen'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative overflow-hidden rounded-xl border border-white/20">
                <RealMap
                  userType={userType}
                  height={isFullscreen ? "80vh" : "600px"}
                  showControls={true}
                  center={mapCenter}
                  zoom={mapZoom}
                  interactive={true}
                  onZoneSelect={setSelectedZone}
                />
              </div>
            </CardContent>
          </Card>

          {/* Zone Details */}
          <Card className="lg:col-span-1 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border-white/30 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Zone Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedZoneData ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">{selectedZoneData.name}</h3>
                    <Badge 
                      variant="secondary" 
                      className={`mt-1 ${
                        selectedZoneData.type === 'safe' ? 'bg-green-100 text-green-700' :
                        selectedZoneData.type === 'caution' ? 'bg-yellow-100 text-yellow-700' :
                        selectedZoneData.type === 'restricted' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {selectedZoneData.type.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Active Tourists</span>
                      <span className="font-medium">{selectedZoneData.metadata?.tourists || Math.floor(Math.random() * 50)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Active Alerts</span>
                      <span className={`font-medium ${(selectedZoneData.metadata?.alerts || 0) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {selectedZoneData.metadata?.alerts || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Coverage</span>
                      <span className="font-medium">{selectedZoneData.radius}m radius</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Safety Score</span>
                      <span className={`font-medium ${
                        selectedZoneData.type === 'safe' ? 'text-green-600' :
                        selectedZoneData.type === 'caution' ? 'text-yellow-600' :
                        selectedZoneData.type === 'restricted' ? 'text-red-600' :
                        'text-blue-600'
                      }`}>
                        {selectedZoneData.type === 'safe' ? '95%' : 
                         selectedZoneData.type === 'caution' ? '75%' : 
                         selectedZoneData.type === 'restricted' ? '45%' : '85%'}
                      </span>
                    </div>
                  </div>

                  {userType === 'authority' && (
                    <div className="space-y-2">
                      <Button size="sm" className="w-full">
                        <Radio className="h-4 w-4 mr-2" />
                        Broadcast Alert
                      </Button>
                      <Button size="sm" variant="outline" className="w-full">
                        <Eye className="h-4 w-4 mr-2" />
                        Monitor Zone
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Click on a safety zone to view details</p>
                  <p className="text-xs mt-2">Zones available around KIET campus</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Quick Stats for KIET Area */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Shield className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Safe Zones</p>
                  <p className="text-2xl font-bold text-green-600">4</p>
                  <p className="text-xs text-muted-foreground">Campus, Malls</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Active Alerts</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {zones.reduce((sum, zone) => sum + (zone.metadata?.alerts || 0), 0)}
                  </p>
                  <p className="text-xs text-muted-foreground">Real-time</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Active Users</p>
                  <p className="text-2xl font-bold text-blue-600">{userType === 'authority' ? '127' : '1'}</p>
                  <p className="text-xs text-muted-foreground">In KIET area</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Activity className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Avg Safety Score</p>
                  <p className="text-2xl font-bold text-purple-600">
                    87%
                  </p>
                  <p className="text-xs text-muted-foreground">Very Good</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  )
}