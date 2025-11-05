import React, { useState } from 'react'
import { MapPin, Shield, AlertTriangle, Clock, Activity, Navigation, Phone, Zap, MessageCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Progress } from './ui/progress'
import { Switch } from './ui/switch'
import { ImageWithFallback } from './figma/ImageWithFallback'
import { Alert, AlertDescription } from './ui/alert'
import { GeofenceAlertsManager } from './GeofenceAlert'
import { useGeofenceAPI } from '../hooks/useGeofenceAPI'
import { RealMap } from './RealMap'

interface TouristDashboardProps {
  onNavigateToChat?: () => void
}

export function TouristDashboard({ onNavigateToChat }: TouristDashboardProps) {
  const [safetyScore] = useState(85)
  const [currentLocation] = useState("KIET Ghaziabad, Uttar Pradesh")
  const [isTracking, setIsTracking] = useState(true)
  const [emergencyActive, setEmergencyActive] = useState(false)

  // Use geofence API for real-time data
  const {
    zones,
    dashboardMetrics,
    triggerEmergencyAlert
  } = useGeofenceAPI({
    enableRealTime: true,
    useMockData: true,
    autoRefresh: true
  })
  
  const alerts = [
    { id: 1, type: 'info', message: 'Welcome to KIET Ghaziabad! Campus safety protocols are active.', time: '10 mins ago' },
    { id: 2, type: 'warning', message: 'Avoid Delhi-Meerut Expressway service road after 9 PM due to construction work.', time: '2 hours ago' },
  ]

  const nearbyServices = [
    { name: 'Police Station', distance: '0.5 km', type: 'police' },
    { name: 'Hospital', distance: '1.2 km', type: 'medical' },
    { name: 'Tourist Help Center', distance: '0.8 km', type: 'help' },
  ]

  const emergencyContacts = [
    { name: 'Police', number: '100', type: 'police' },
    { name: 'Ambulance', number: '108', type: 'medical' },
    { name: 'Fire Brigade', number: '101', type: 'fire' },
    { name: 'Tourist Helpline', number: '1363', type: 'tourism' },
  ]

  const handleEmergencyAlert = () => {
    setEmergencyActive(true)
    // In a real app, this would trigger immediate location sharing and emergency alerts
  }

  if (emergencyActive) {
    return (
      <div className="space-y-6">
        <Alert className="border-red-500 bg-red-50 dark:bg-red-900/20">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-700 dark:text-red-300">
            Emergency alert activated! Your location has been shared with authorities and emergency contacts.
          </AlertDescription>
        </Alert>

        <Card className="border-red-500">
          <CardHeader className="bg-red-50 dark:bg-red-900/20">
            <CardTitle className="text-red-700 dark:text-red-300 flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Emergency Alert Active</span>
            </CardTitle>
            <CardDescription>
              Response team has been notified. Help is on the way.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="text-center space-y-4">
              <div className="text-6xl animate-pulse">🆘</div>
              <h3 className="text-xl font-semibold">Emergency Alert Activated</h3>
              <p className="text-muted-foreground">
                Emergency services have been contacted. Stay calm and follow their instructions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin className="h-4 w-4 text-green-500" />
                  <span className="font-medium">Location Shared</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your exact coordinates: {currentLocation}
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Phone className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">Contacts Notified</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Emergency contacts and authorities alerted
                </p>
              </div>
            </div>

            <div className="space-y-3 mt-6">
              <h4 className="font-medium">Quick Dial Emergency Services:</h4>
              <div className="grid grid-cols-2 gap-2">
                {emergencyContacts.map((contact, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="flex items-center justify-between p-3 h-auto"
                  >
                    <span className="text-sm">{contact.name}</span>
                    <Badge variant="destructive">{contact.number}</Badge>
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex space-x-4 mt-6">
              <Button 
                variant="destructive" 
                className="flex-1"
                onClick={() => setEmergencyActive(false)}
              >
                Cancel Emergency
              </Button>
              <Button variant="outline" className="flex-1">
                Update Status
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 relative">
      {/* Emergency SOS Button - Always Visible */}
      <Card className="border-red-500 dark:border-red-400 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="h-10 w-10 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                  <AlertTriangle className="h-5 w-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-600 rounded-full animate-ping"></div>
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-600 rounded-full"></div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-red-700 dark:text-red-300">Emergency SOS</h3>
                <p className="text-red-600 dark:text-red-400">Immediate emergency assistance</p>
                <p className="text-sm text-red-500 dark:text-red-500">Location will be shared instantly</p>
              </div>
            </div>
            <Button 
              size="lg" 
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 text-base font-bold shadow-2xl hover:shadow-3xl transition-all duration-200 transform hover:scale-105"
              onClick={handleEmergencyAlert}
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              ACTIVATE SOS
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Header Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Safety Score</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{safetyScore}/100</div>
            <Progress value={safetyScore} className="mt-2 bg-blue-400" />
            <p className="text-sm text-blue-100 mt-1">Good safety level</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>Current Location</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-semibold">{currentLocation}</div>
            <div className="flex items-center space-x-2 mt-2">
              <Activity className={`h-4 w-4 ${isTracking ? 'animate-pulse' : ''}`} />
              <span className="text-sm text-green-100">
                {isTracking ? 'Live tracking active' : 'Tracking paused'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <Navigation className="h-4 w-4" />
              <span>Trip Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-semibold">Day 3 of 7</div>
            <div className="text-sm text-purple-100 mt-1">
              5 locations visited
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Map Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Live Location & Geo-Fencing</CardTitle>
                <CardDescription>
                  Real-time location monitoring with safety zone alerts
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <MapPin className="h-4 w-4 mr-2" />
                Full Map View
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Real Interactive Map */}
            <RealMap 
              userType="tourist" 
              height="300px" 
              showControls={true}
              center={[28.7041, 77.4025]} // KIET Ghaziabad coordinates
              zoom={14}
              interactive={true}
            />
            <div className="mt-4 flex items-center justify-between">
              <Button 
                variant={isTracking ? "destructive" : "default"}
                onClick={() => setIsTracking(!isTracking)}
                size="sm"
              >
                {isTracking ? 'Pause Tracking' : 'Resume Tracking'}
              </Button>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-green-600">
                  <Shield className="h-3 w-3 mr-1" />
                  Safe Zone Active
                </Badge>
                <Badge variant="secondary" className="text-blue-600">
                  <Navigation className="h-3 w-3 mr-1" />
                  GPS Connected
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Geofence Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Geofence Status</CardTitle>
            <CardDescription>Active safety zones around you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {/* Current Zone - Safe Zone */}
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                  <div>
                    <div className="text-sm font-medium text-green-700 dark:text-green-300">Safe Zone</div>
                    <div className="text-xs text-green-600 dark:text-green-400">
                      {zones.find(z => z.type === 'safe')?.name || 'KIET Campus Safe Zone'}
                    </div>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-700">INSIDE</Badge>
              </div>

              {/* Nearby Zones */}
              {zones.filter(z => z.type !== 'safe').slice(0, 2).map((zone, index) => (
                <div 
                  key={zone.id} 
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    zone.type === 'emergency' ? 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800' :
                    zone.type === 'caution' ? 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800' :
                    'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div className={`h-3 w-3 rounded-full ${
                      zone.type === 'emergency' ? 'bg-blue-500' :
                      zone.type === 'caution' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}></div>
                    <div>
                      <div className={`text-sm font-medium ${
                        zone.type === 'emergency' ? 'text-blue-700 dark:text-blue-300' :
                        zone.type === 'caution' ? 'text-yellow-700 dark:text-yellow-300' :
                        'text-red-700 dark:text-red-300'
                      }`}>
                        {zone.type === 'emergency' ? 'Emergency Zone' :
                         zone.type === 'caution' ? 'Caution Zone' :
                         'Restricted Zone'}
                      </div>
                      <div className={`text-xs ${
                        zone.type === 'emergency' ? 'text-blue-600 dark:text-blue-400' :
                        zone.type === 'caution' ? 'text-yellow-600 dark:text-yellow-400' :
                        'text-red-600 dark:text-red-400'
                      }`}>
                        {zone.name}
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className={
                    zone.type === 'emergency' ? 'text-blue-600' :
                    zone.type === 'caution' ? 'text-yellow-600' :
                    'text-red-600'
                  }>
                    {((index + 1) * 1.2).toFixed(1)}km
                  </Badge>
                </div>
              ))}
            </div>

            <div className="pt-2 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Zone Notifications</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Exit Alerts</span>
                <Switch defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Geofence Alerts Section */}
        <div className="space-y-4">
          <GeofenceAlertsManager userType="tourist" />
        </div>

        {/* Nearby Services */}
        <Card>
          <CardHeader>
            <CardTitle>Nearby Emergency Services</CardTitle>
            <CardDescription>Quick access to help and support</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {nearbyServices.map((service, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <div className={`h-3 w-3 rounded-full ${
                    service.type === 'police' ? 'bg-blue-500' :
                    service.type === 'medical' ? 'bg-red-500' : 'bg-green-500'
                  }`} />
                  <div>
                    <div className="font-medium">{service.name}</div>
                    <div className="text-sm text-muted-foreground">{service.distance}</div>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  Navigate
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* AI Assistant Quick Access */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="h-10 w-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-purple-700 dark:text-purple-300">NavRakshak AI Assistant</h3>
                <p className="text-purple-600 dark:text-purple-400">24/7 multilingual safety support</p>
                <p className="text-sm text-purple-500 dark:text-purple-500">Get instant help with emergencies, directions & more</p>
              </div>
            </div>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 text-base font-semibold shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105"
              onClick={onNavigateToChat}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Chat Now
            </Button>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}