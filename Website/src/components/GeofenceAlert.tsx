import React, { useState, useEffect } from 'react'
import { AlertTriangle, MapPin, Clock, User, X, Eye, Phone, MessageCircle, Navigation, RefreshCw } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { motion, AnimatePresence } from 'motion/react'
import { useGeofenceAPI } from '../hooks/useGeofenceAPI'

interface GeofenceAlertProps {
  alert: {
    id: string
    touristId: string
    touristName: string
    type: 'entry' | 'exit' | 'violation'
    zone: string
    zoneType: 'safe' | 'caution' | 'restricted' | 'emergency'
    location: { lat: number; lng: number }
    timestamp: Date
    severity: 'low' | 'medium' | 'high'
    message: string
  }
  onDismiss: (id: string) => void
  onViewDetails: (id: string) => void
  onContact: (id: string) => void
}

export function GeofenceAlert({ alert, onDismiss, onViewDetails, onContact }: GeofenceAlertProps) {
  const [timeAgo, setTimeAgo] = useState('')

  useEffect(() => {
    const updateTimeAgo = () => {
      const now = new Date()
      const diff = now.getTime() - alert.timestamp.getTime()
      const minutes = Math.floor(diff / 60000)
      
      if (minutes < 1) {
        setTimeAgo('Just now')
      } else if (minutes < 60) {
        setTimeAgo(`${minutes} min${minutes > 1 ? 's' : ''} ago`)
      } else {
        const hours = Math.floor(minutes / 60)
        setTimeAgo(`${hours} hour${hours > 1 ? 's' : ''} ago`)
      }
    }

    updateTimeAgo()
    const interval = setInterval(updateTimeAgo, 60000)
    return () => clearInterval(interval)
  }, [alert.timestamp])

  const getSeverityColor = () => {
    switch (alert.severity) {
      case 'high': return 'border-red-500 bg-red-50 dark:bg-red-950'
      case 'medium': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950'
      case 'low': return 'border-blue-500 bg-blue-50 dark:bg-blue-950'
      default: return 'border-gray-500 bg-gray-50 dark:bg-gray-950'
    }
  }

  const getZoneTypeColor = () => {
    switch (alert.zoneType) {
      case 'safe': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
      case 'caution': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
      case 'restricted': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
      case 'emergency': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const getAlertIcon = () => {
    switch (alert.type) {
      case 'entry': return <Navigation className="h-4 w-4" />
      case 'exit': return <Navigation className="h-4 w-4 rotate-180" />
      case 'violation': return <AlertTriangle className="h-4 w-4" />
      default: return <AlertTriangle className="h-4 w-4" />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Card className={`border-l-4 ${getSeverityColor()} shadow-lg hover:shadow-xl transition-all duration-300`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${
                alert.severity === 'high' ? 'bg-red-500 text-white' :
                alert.severity === 'medium' ? 'bg-yellow-500 text-white' :
                'bg-blue-500 text-white'
              } animate-pulse`}>
                {getAlertIcon()}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <CardTitle className="text-lg">Geofence Alert</CardTitle>
                  <Badge variant="secondary" className={getZoneTypeColor()}>
                    {alert.zoneType.toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className={
                    alert.severity === 'high' ? 'border-red-500 text-red-700' :
                    alert.severity === 'medium' ? 'border-yellow-500 text-yellow-700' :
                    'border-blue-500 text-blue-700'
                  }>
                    {alert.severity.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2 mt-1 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{timeAgo}</span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDismiss(alert.id)}
              className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Tourist Information */}
          <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-blue-500" />
              <div className="flex-1">
                <div className="font-medium">{alert.touristName}</div>
                <div className="text-sm text-muted-foreground">ID: {alert.touristId}</div>
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-green-500" />
              <div className="flex-1">
                <div className="font-medium">{alert.zone}</div>
                <div className="text-sm text-muted-foreground">
                  Zone {alert.type}: {alert.zoneType} area
                </div>
              </div>
            </div>
          </div>

          {/* Alert Message */}
          <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-lg">
            <p className="text-sm">{alert.message}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 pt-2">
            <Button
              size="sm"
              onClick={() => onViewDetails(alert.id)}
              className="flex-1"
            >
              <Eye className="h-4 w-4 mr-2" />
              View on Map
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onContact(alert.id)}
            >
              <Phone className="h-4 w-4 mr-2" />
              Contact
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onContact(alert.id)}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Message
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

interface GeofenceAlertsManagerProps {
  userType: 'tourist' | 'authority'
}

export function GeofenceAlertsManager({ userType }: GeofenceAlertsManagerProps) {
  // Use the geofence API hook
  const {
    alerts,
    loading,
    error,
    connected,
    acknowledgeAlert,
    resolveAlert,
    loadData
  } = useGeofenceAPI({
    enableRealTime: true,
    useMockData: true, // Set to false when API is fully configured
    autoRefresh: true
  })

  // Convert API alerts to component format
  const componentAlerts = alerts.map(alert => ({
    id: alert.id,
    touristId: alert.touristId,
    touristName: alert.touristName,
    type: alert.alertType as 'entry' | 'exit' | 'violation',
    zone: alert.zoneName,
    zoneType: alert.zoneType,
    location: alert.location,
    timestamp: new Date(alert.timestamp),
    severity: alert.severity as 'low' | 'medium' | 'high',
    message: alert.message
  }))

  const handleDismiss = async (id: string) => {
    try {
      await acknowledgeAlert(id)
    } catch (error) {
      console.error('Failed to acknowledge alert:', error)
    }
  }

  const handleViewDetails = (id: string) => {
    console.log('View details for alert:', id)
    // This would typically open a detailed view or navigate to the map
  }

  const handleContact = (id: string) => {
    console.log('Contact tourist for alert:', id)
    // This would typically open a communication interface
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-3 text-blue-500" />
          <p>Loading geofence alerts...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <AlertTriangle className="h-8 w-8 mx-auto mb-3 text-red-500" />
          <p className="text-red-600 mb-2">Failed to load alerts</p>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <Button onClick={loadData} size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (componentAlerts.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-muted-foreground">
            <AlertTriangle className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No active geofence alerts</p>
            <p className="text-sm mt-1">All tourists are within designated safe zones</p>
            {!connected && (
              <p className="text-orange-500 text-sm mt-2">(Offline mode - limited data)</p>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold">Active Geofence Alerts</h3>
          {!connected && (
            <Badge variant="outline" className="text-orange-500 border-orange-500">
              Offline
            </Badge>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="destructive" className="animate-pulse">
            {componentAlerts.length} Active
          </Badge>
          <Button size="sm" variant="outline" onClick={loadData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>
      
      <AnimatePresence>
        {componentAlerts.map(alert => (
          <GeofenceAlert
            key={alert.id}
            alert={alert}
            onDismiss={handleDismiss}
            onViewDetails={handleViewDetails}
            onContact={handleContact}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}