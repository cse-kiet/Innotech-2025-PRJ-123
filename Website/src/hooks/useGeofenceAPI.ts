import { useState, useEffect, useCallback, useRef } from 'react'
import { geofenceAPI, GeofenceZone, GeofenceAlert, Tourist, mockGeofenceData } from '../services/geofenceApi'
import { toast } from 'sonner@2.0.3'

export interface UseGeofenceAPIOptions {
  enableRealTime?: boolean
  useMockData?: boolean
  autoRefresh?: boolean
  refreshInterval?: number
}

export function useGeofenceAPI(options: UseGeofenceAPIOptions = {}) {
  const {
    enableRealTime = true,
    useMockData = false,
    autoRefresh = true,
    refreshInterval = 30000 // 30 seconds
  } = options

  // State management
  const [zones, setZones] = useState<GeofenceZone[]>([])
  const [alerts, setAlerts] = useState<GeofenceAlert[]>([])
  const [tourists, setTourists] = useState<Tourist[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [connected, setConnected] = useState(false)

  // Refs for WebSocket and intervals
  const wsRef = useRef<WebSocket | null>(null)
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Load initial data
  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      if (useMockData) {
        // Use mock data for development
        setZones(mockGeofenceData.zones)
        setTourists(mockGeofenceData.tourists)
        setAlerts([])
        setConnected(true)
        toast.success('Using demo data for testing')
      } else {
        // Try to load real data from API with timeout and fallback
        try {
          const [zonesData, touristsData, alertsData] = await Promise.allSettled([
            geofenceAPI.getAllZones(),
            geofenceAPI.getAllTourists(),
            geofenceAPI.getAllAlerts({ limit: 50, acknowledged: false })
          ])

          // Handle zones
          if (zonesData.status === 'fulfilled') {
            setZones(zonesData.value)
          } else {
            console.warn('Failed to load zones:', zonesData.reason)
            setZones(mockGeofenceData.zones)
          }

          // Handle tourists
          if (touristsData.status === 'fulfilled') {
            setTourists(touristsData.value)
          } else {
            console.warn('Failed to load tourists:', touristsData.reason)
            setTourists(mockGeofenceData.tourists)
          }

          // Handle alerts
          if (alertsData.status === 'fulfilled') {
            setAlerts(alertsData.value)
          } else {
            console.warn('Failed to load alerts:', alertsData.reason)
            setAlerts([])
          }

          // Check if at least one API call succeeded
          const hasAnySuccess = [zonesData, touristsData, alertsData].some(result => result.status === 'fulfilled')
          
          if (hasAnySuccess) {
            setConnected(true)
            toast.success('Connected to geofence API')
          } else {
            throw new Error('All API endpoints failed to respond')
          }

        } catch (apiError) {
          console.error('API connection failed:', apiError)
          // Fallback to mock data when API is completely unavailable
          setZones(mockGeofenceData.zones)
          setTourists(mockGeofenceData.tourists)
          setAlerts([])
          setConnected(false)
          setError('API unavailable - using offline mode')
          toast.warning('API unavailable - using offline demo data')
        }
      }
    } catch (err) {
      console.error('Failed to load geofence data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load data')
      setConnected(false)
      
      // Always fallback to mock data
      setZones(mockGeofenceData.zones)
      setTourists(mockGeofenceData.tourists)
      setAlerts([])
      
      toast.error('Error loading data - using offline mode')
    } finally {
      setLoading(false)
    }
  }, [useMockData])

  // Set up real-time updates
  const setupRealTimeUpdates = useCallback(() => {
    if (!enableRealTime || useMockData) {
      console.log('Real-time updates disabled:', { enableRealTime, useMockData })
      return
    }

    try {
      console.log('Setting up real-time updates...')
      wsRef.current = geofenceAPI.connectToRealTimeUpdates({
        onAlert: (alert) => {
          console.log('Received real-time alert:', alert)
          setAlerts(prev => [alert, ...prev])
          
          // Show toast notification for new alerts
          const severityEmoji = {
            low: '💙',
            medium: '💛', 
            high: '🧡',
            critical: '🚨'
          }
          
          toast.error(`${severityEmoji[alert.severity]} New Alert: ${alert.message}`, {
            duration: 5000,
            action: {
              label: 'View',
              onClick: () => console.log('View alert:', alert.id)
            }
          })
        },
        onTouristUpdate: (tourist) => {
          console.log('Received tourist update:', tourist)
          setTourists(prev => prev.map(t => t.id === tourist.id ? tourist : t))
        },
        onZoneUpdate: (zone) => {
          console.log('Received zone update:', zone)
          setZones(prev => prev.map(z => z.id === zone.id ? zone : z))
        }
      })
    } catch (error) {
      console.error('Failed to setup real-time updates:', error)
      toast.warning('Real-time updates unavailable - using polling instead')
    }
  }, [enableRealTime, useMockData])

  // Zone management functions
  const createZone = useCallback(async (zoneData: Omit<GeofenceZone, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (useMockData) {
        const newZone: GeofenceZone = {
          ...zoneData,
          id: `zone-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          metadata: { tourists: 0, alerts: 0, safetyLevel: 100 }
        }
        setZones(prev => [...prev, newZone])
        toast.success(`Zone "${zoneData.name}" created successfully`)
        return newZone
      }

      const newZone = await geofenceAPI.createZone(zoneData)
      setZones(prev => [...prev, newZone])
      toast.success(`Zone "${zoneData.name}" created successfully`)
      return newZone
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create zone'
      setError(message)
      toast.error(message)
      throw error
    }
  }, [useMockData])

  const updateZone = useCallback(async (zoneId: string, updates: Partial<GeofenceZone>) => {
    try {
      if (useMockData) {
        setZones(prev => prev.map(zone => 
          zone.id === zoneId 
            ? { ...zone, ...updates, updatedAt: new Date().toISOString() }
            : zone
        ))
        toast.success('Zone updated successfully')
        return
      }

      const updatedZone = await geofenceAPI.updateZone(zoneId, updates)
      setZones(prev => prev.map(zone => zone.id === zoneId ? updatedZone : zone))
      toast.success('Zone updated successfully')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update zone'
      setError(message)
      toast.error(message)
      throw error
    }
  }, [useMockData])

  const deleteZone = useCallback(async (zoneId: string) => {
    try {
      if (useMockData) {
        setZones(prev => prev.filter(zone => zone.id !== zoneId))
        toast.success('Zone deleted successfully')
        return
      }

      await geofenceAPI.deleteZone(zoneId)
      setZones(prev => prev.filter(zone => zone.id !== zoneId))
      toast.success('Zone deleted successfully')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete zone'
      setError(message)
      toast.error(message)
      throw error
    }
  }, [useMockData])

  // Alert management functions
  const acknowledgeAlert = useCallback(async (alertId: string) => {
    try {
      if (useMockData) {
        setAlerts(prev => prev.map(alert => 
          alert.id === alertId 
            ? { ...alert, acknowledged: true }
            : alert
        ))
        return
      }

      await geofenceAPI.acknowledgeAlert(alertId)
      setAlerts(prev => prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, acknowledged: true }
          : alert
      ))
      toast.success('Alert acknowledged')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to acknowledge alert'
      toast.error(message)
    }
  }, [useMockData])

  const resolveAlert = useCallback(async (alertId: string, resolution?: string) => {
    try {
      if (useMockData) {
        setAlerts(prev => prev.filter(alert => alert.id !== alertId))
        return
      }

      await geofenceAPI.resolveAlert(alertId, resolution)
      setAlerts(prev => prev.filter(alert => alert.id !== alertId))
      toast.success('Alert resolved')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to resolve alert'
      toast.error(message)
    }
  }, [useMockData])

  // Tourist tracking functions
  const updateTouristLocation = useCallback(async (touristId: string, location: { lat: number; lng: number }) => {
    try {
      if (useMockData) {
        setTourists(prev => prev.map(tourist => 
          tourist.id === touristId 
            ? { ...tourist, location, lastSeen: new Date().toISOString() }
            : tourist
        ))
        return
      }

      const updatedTourist = await geofenceAPI.updateTouristLocation(touristId, location)
      setTourists(prev => prev.map(tourist => 
        tourist.id === touristId ? updatedTourist : tourist
      ))
    } catch (error) {
      console.error('Failed to update tourist location:', error)
    }
  }, [useMockData])

  const triggerEmergencyAlert = useCallback(async (touristId: string, location: { lat: number; lng: number }, message?: string) => {
    try {
      if (useMockData) {
        const emergencyAlert: GeofenceAlert = {
          id: `alert-${Date.now()}`,
          touristId,
          touristName: tourists.find(t => t.id === touristId)?.name || 'Unknown Tourist',
          zoneId: 'emergency',
          zoneName: 'Emergency Alert',
          zoneType: 'emergency',
          alertType: 'violation',
          location,
          timestamp: new Date().toISOString(),
          severity: 'critical',
          message: message || 'Emergency alert triggered by tourist',
          acknowledged: false
        }
        setAlerts(prev => [emergencyAlert, ...prev])
        toast.error('🚨 Emergency Alert Triggered!', { duration: 10000 })
        return
      }

      await geofenceAPI.triggerEmergencyAlert(touristId, location, message)
      toast.error('🚨 Emergency Alert Triggered!', { duration: 10000 })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to trigger emergency alert'
      toast.error(message)
    }
  }, [useMockData, tourists])

  // Initialize and cleanup
  useEffect(() => {
    loadData()
  }, [loadData])

  useEffect(() => {
    if (enableRealTime) {
      setupRealTimeUpdates()
    }

    if (autoRefresh) {
      refreshIntervalRef.current = setInterval(loadData, refreshInterval)
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
      }
    }
  }, [enableRealTime, autoRefresh, refreshInterval, setupRealTimeUpdates, loadData])

  // Computed values
  const activeAlerts = alerts.filter(alert => !alert.acknowledged)
  const criticalAlerts = alerts.filter(alert => alert.severity === 'critical')
  const safeTourists = tourists.filter(tourist => tourist.status === 'safe')
  const activeZones = zones.filter(zone => zone.active)

  const dashboardMetrics = {
    totalTourists: tourists.length,
    activeTourists: tourists.filter(t => {
      const lastSeen = new Date(t.lastSeen)
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
      return lastSeen > fiveMinutesAgo
    }).length,
    onlineTourists: tourists.filter(t => {
      const lastSeen = new Date(t.lastSeen)
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
      return lastSeen > fiveMinutesAgo
    }).length,
    totalZones: zones.length,
    activeAlerts: activeAlerts.length,
    safeZoneViolations: alerts.filter(alert => alert.alertType === 'violation').length,
    safetyScore: tourists.length > 0 
      ? Math.round(tourists.reduce((sum, t) => sum + t.safetyScore, 0) / tourists.length)
      : 100
  }

  return {
    // Data
    zones,
    alerts,
    tourists,
    activeAlerts,
    criticalAlerts,
    safeTourists,
    activeZones,

    // Status
    loading,
    error,
    connected,
    dashboardMetrics,

    // Actions
    loadData,
    createZone,
    updateZone,
    deleteZone,
    acknowledgeAlert,
    resolveAlert,
    updateTouristLocation,
    triggerEmergencyAlert,

    // Utils
    clearError: () => setError(null)
  }
}