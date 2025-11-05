// NavRakshak Geofence API Integration
// API Base URL: https://geofence-api-production.up.railway.app

const API_BASE_URL = 'https://geofence-api-production.up.railway.app'

export interface GeofenceZone {
  id: string
  name: string
  type: 'safe' | 'caution' | 'restricted' | 'emergency'
  coordinates: {
    lat: number
    lng: number
  }
  radius: number
  active: boolean
  createdAt: string
  updatedAt: string
  description?: string
  alertsEnabled: boolean
  metadata?: {
    tourists: number
    alerts: number
    safetyLevel: number
  }
}

export interface GeofenceAlert {
  id: string
  touristId: string
  touristName: string
  zoneId: string
  zoneName: string
  zoneType: 'safe' | 'caution' | 'restricted' | 'emergency'
  alertType: 'entry' | 'exit' | 'violation' | 'proximity'
  location: {
    lat: number
    lng: number
  }
  timestamp: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  acknowledged: boolean
  resolvedAt?: string
}

export interface Tourist {
  id: string
  name: string
  digitalId: string
  location: {
    lat: number
    lng: number
  }
  safetyScore: number
  status: 'safe' | 'caution' | 'danger' | 'emergency'
  lastSeen: string
  deviceId: string
  emergencyContacts: Array<{
    name: string
    phone: string
    relation: string
  }>
}

export interface GeofenceApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
  timestamp: string
}

class GeofenceAPIService {
  private apiKey: string
  private baseUrl: string

  constructor() {
    // Use environment variable if available (Vite uses import.meta.env)
    this.apiKey = (typeof window !== 'undefined' && (window as any).ENV?.GEOFENCE_API_KEY) || 
                  'demo-api-key-navrakshak-2024'
    this.baseUrl = API_BASE_URL
  }

  // Method to configure API key at runtime
  setApiKey(apiKey: string) {
    this.apiKey = apiKey
  }

  // Method to configure base URL at runtime
  setBaseUrl(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  // Method to test API connectivity
  async testConnection(): Promise<boolean> {
    try {
      // Try multiple endpoints to check connectivity
      const healthEndpoints = [
        `${this.baseUrl}/health`,
        `${this.baseUrl}/api/v1/health`,
        `${this.baseUrl}/docs`, // FastAPI docs endpoint
        `${this.baseUrl}/` // Root endpoint
      ]

      for (const endpoint of healthEndpoints) {
        try {
          const response = await fetch(endpoint, {
            method: 'GET',
            mode: 'cors', // Explicitly enable CORS
            headers: {
              'Authorization': `Bearer ${this.apiKey}`,
              'Accept': 'application/json, text/plain, */*'
            }
          })
          
          if (response.ok || response.status === 404) { // 404 means server is reachable
            console.log(`API connection successful via ${endpoint}`)
            return true
          }
        } catch (endpointError) {
          console.log(`Failed to connect to ${endpoint}:`, endpointError)
          continue
        }
      }
      
      return false
    } catch (error) {
      console.error('API connection test failed:', error)
      return false
    }
  }

  // Get current configuration
  getConfig() {
    return {
      baseUrl: this.baseUrl,
      apiKey: this.apiKey.substring(0, 8) + '...' // Only show first 8 chars for security
    }
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<GeofenceApiResponse<T>> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'X-API-Version': '1.0',
          'X-Client': 'NavRakshak-Web',
          ...options.headers,
        },
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error')
        throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout - API is not responding')
        }
        if (error.message.includes('Failed to fetch')) {
          throw new Error('Network error - Unable to connect to geofence API')
        }
      }
      console.error('Geofence API Error:', error)
      throw error
    }
  }

  // Geofence Zone Management
  async getAllZones(): Promise<GeofenceZone[]> {
    const response = await this.makeRequest<GeofenceZone[]>('/api/v1/zones')
    return response.data
  }

  async getZoneById(zoneId: string): Promise<GeofenceZone> {
    const response = await this.makeRequest<GeofenceZone>(`/api/v1/zones/${zoneId}`)
    return response.data
  }

  async createZone(zone: Omit<GeofenceZone, 'id' | 'createdAt' | 'updatedAt'>): Promise<GeofenceZone> {
    const response = await this.makeRequest<GeofenceZone>('/api/v1/zones', {
      method: 'POST',
      body: JSON.stringify(zone),
    })
    return response.data
  }

  async updateZone(zoneId: string, updates: Partial<GeofenceZone>): Promise<GeofenceZone> {
    const response = await this.makeRequest<GeofenceZone>(`/api/v1/zones/${zoneId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
    return response.data
  }

  async deleteZone(zoneId: string): Promise<void> {
    await this.makeRequest<void>(`/api/v1/zones/${zoneId}`, {
      method: 'DELETE',
    })
  }

  // Tourist Tracking
  async getAllTourists(): Promise<Tourist[]> {
    const response = await this.makeRequest<Tourist[]>('/api/v1/tourists')
    return response.data
  }

  async getTouristById(touristId: string): Promise<Tourist> {
    const response = await this.makeRequest<Tourist>(`/api/v1/tourists/${touristId}`)
    return response.data
  }

  async updateTouristLocation(touristId: string, location: { lat: number; lng: number }): Promise<Tourist> {
    const response = await this.makeRequest<Tourist>(`/api/v1/tourists/${touristId}/location`, {
      method: 'PUT',
      body: JSON.stringify({ location, timestamp: new Date().toISOString() }),
    })
    return response.data
  }

  async registerTourist(tourist: Omit<Tourist, 'id' | 'lastSeen'>): Promise<Tourist> {
    const response = await this.makeRequest<Tourist>('/api/v1/tourists', {
      method: 'POST',
      body: JSON.stringify({
        ...tourist,
        registeredAt: new Date().toISOString(),
      }),
    })
    return response.data
  }

  // Alert Management
  async getAllAlerts(options?: {
    limit?: number
    acknowledged?: boolean
    severity?: string
    zoneId?: string
  }): Promise<GeofenceAlert[]> {
    const params = new URLSearchParams()
    if (options?.limit) params.append('limit', options.limit.toString())
    if (options?.acknowledged !== undefined) params.append('acknowledged', options.acknowledged.toString())
    if (options?.severity) params.append('severity', options.severity)
    if (options?.zoneId) params.append('zoneId', options.zoneId)

    const queryString = params.toString()
    const endpoint = queryString ? `/api/v1/alerts?${queryString}` : '/api/v1/alerts'
    
    const response = await this.makeRequest<GeofenceAlert[]>(endpoint)
    return response.data
  }

  async getAlertById(alertId: string): Promise<GeofenceAlert> {
    const response = await this.makeRequest<GeofenceAlert>(`/api/v1/alerts/${alertId}`)
    return response.data
  }

  async acknowledgeAlert(alertId: string): Promise<GeofenceAlert> {
    const response = await this.makeRequest<GeofenceAlert>(`/api/v1/alerts/${alertId}/acknowledge`, {
      method: 'POST',
      body: JSON.stringify({ acknowledgedAt: new Date().toISOString() }),
    })
    return response.data
  }

  async resolveAlert(alertId: string, resolution?: string): Promise<GeofenceAlert> {
    const response = await this.makeRequest<GeofenceAlert>(`/api/v1/alerts/${alertId}/resolve`, {
      method: 'POST',
      body: JSON.stringify({ 
        resolvedAt: new Date().toISOString(),
        resolution: resolution || 'Alert resolved by operator'
      }),
    })
    return response.data
  }

  // Real-time Monitoring
  async checkGeofenceViolations(touristId: string, location: { lat: number; lng: number }): Promise<{
    violations: Array<{
      zoneId: string
      zoneName: string
      zoneType: string
      violationType: 'entry' | 'exit' | 'proximity'
      severity: 'low' | 'medium' | 'high' | 'critical'
      distance: number
    }>
    nearbyZones: Array<{
      zoneId: string
      zoneName: string
      zoneType: string
      distance: number
    }>
  }> {
    const response = await this.makeRequest<any>('/api/v1/monitoring/check-violations', {
      method: 'POST',
      body: JSON.stringify({ touristId, location }),
    })
    return response.data
  }

  // Emergency Functions
  async triggerEmergencyAlert(touristId: string, location: { lat: number; lng: number }, message?: string): Promise<void> {
    await this.makeRequest<void>('/api/v1/emergency/alert', {
      method: 'POST',
      body: JSON.stringify({
        touristId,
        location,
        message: message || 'Emergency alert triggered by tourist',
        timestamp: new Date().toISOString(),
        priority: 'critical'
      }),
    })
  }

  async broadcastAlert(zoneId: string, message: string, severity: 'low' | 'medium' | 'high' | 'critical'): Promise<void> {
    await this.makeRequest<void>('/api/v1/zones/broadcast', {
      method: 'POST',
      body: JSON.stringify({
        zoneId,
        message,
        severity,
        timestamp: new Date().toISOString(),
      }),
    })
  }

  // Analytics and Reporting
  async getZoneStatistics(zoneId: string, timeRange?: { start: string; end: string }): Promise<{
    totalVisitors: number
    averageStayDuration: number
    alertsCount: number
    safetyScore: number
    peakHours: Array<{ hour: number; count: number }>
    violationTypes: Record<string, number>
  }> {
    const params = new URLSearchParams()
    if (timeRange) {
      params.append('start', timeRange.start)
      params.append('end', timeRange.end)
    }

    const queryString = params.toString()
    const endpoint = queryString 
      ? `/api/v1/analytics/zones/${zoneId}?${queryString}` 
      : `/api/v1/analytics/zones/${zoneId}`
    
    const response = await this.makeRequest<any>(endpoint)
    return response.data
  }

  async getDashboardMetrics(): Promise<{
    totalTourists: number
    activeTourists: number
    totalZones: number
    activeAlerts: number
    safetyScore: number
    recentAlerts: GeofenceAlert[]
    zoneMetrics: Array<{
      zoneId: string
      zoneName: string
      touristCount: number
      alertCount: number
      safetyLevel: number
    }>
  }> {
    const response = await this.makeRequest<any>('/api/v1/analytics/dashboard')
    return response.data
  }

  // WebSocket connection for real-time updates
  connectToRealTimeUpdates(callbacks: {
    onAlert?: (alert: GeofenceAlert) => void
    onTouristUpdate?: (tourist: Tourist) => void
    onZoneUpdate?: (zone: GeofenceZone) => void
  }): WebSocket {
    // Try different WebSocket endpoints
    const wsEndpoints = [
      `${this.baseUrl.replace('https://', 'wss://').replace('http://', 'ws://')}/api/v1/realtime`,
      `${this.baseUrl.replace('https://', 'wss://').replace('http://', 'ws://')}/ws`,
      `${this.baseUrl.replace('https://', 'wss://').replace('http://', 'ws://')}/websocket`
    ]

    let ws: WebSocket | null = null
    let connectionAttempt = 0

    const tryConnection = () => {
      if (connectionAttempt >= wsEndpoints.length) {
        console.error('All WebSocket endpoints failed to connect')
        throw new Error('WebSocket connection failed - all endpoints unreachable')
      }

      const wsUrl = wsEndpoints[connectionAttempt]
      console.log(`Attempting WebSocket connection ${connectionAttempt + 1}/${wsEndpoints.length}:`, wsUrl)
      
      ws = new WebSocket(wsUrl)
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          console.log('WebSocket message received:', data)
          
          switch (data.type) {
            case 'alert':
              callbacks.onAlert?.(data.payload)
              break
            case 'tourist_update':
              callbacks.onTouristUpdate?.(data.payload)
              break
            case 'zone_update':
              callbacks.onZoneUpdate?.(data.payload)
              break
            default:
              console.log('Unknown WebSocket message type:', data.type)
          }
        } catch (error) {
          console.error('WebSocket message parsing error:', error, 'Raw message:', event.data)
        }
      }

      ws.onopen = () => {
        console.log('✅ Connected to NavRakshak real-time updates via', wsUrl)
        try {
          ws?.send(JSON.stringify({ 
            type: 'authenticate', 
            apiKey: this.apiKey,
            client: 'NavRakshak-Web',
            timestamp: new Date().toISOString()
          }))
        } catch (error) {
          console.error('Failed to send authentication message:', error)
        }
      }

      ws.onclose = (event) => {
        console.log('❌ Disconnected from NavRakshak WebSocket', {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean
        })
      }

      ws.onerror = (error) => {
        console.error(`❌ WebSocket connection error for ${wsUrl}:`, error)
        connectionAttempt++
        
        // Try next endpoint if available
        if (connectionAttempt < wsEndpoints.length) {
          console.log('🔄 Trying next WebSocket endpoint...')
          setTimeout(tryConnection, 1000) // Wait 1 second before retry
        } else {
          console.error('🚫 All WebSocket endpoints failed')
        }
      }
    }

    tryConnection()
    
    return ws || new WebSocket('wss://dummy') // Return dummy socket if all fail
  }
}

// Export singleton instance
export const geofenceAPI = new GeofenceAPIService()

// Export mock data for development/fallback - updated for KIET Ghaziabad
export const mockGeofenceData = {
  zones: [
    {
      id: 'zone-001',
      name: 'KIET Main Campus Safe Zone',
      type: 'safe' as const,
      coordinates: { lat: 28.7041, lng: 77.4025 },
      radius: 500,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      description: 'Main campus area with high security presence and CCTV coverage',
      alertsEnabled: true,
      metadata: {
        tourists: 45,
        alerts: 0,
        safetyLevel: 95
      }
    },
    {
      id: 'zone-002',
      name: 'Shipra Mall Commercial Area',
      type: 'caution' as const,
      coordinates: { lat: 28.7156, lng: 77.4089 },
      radius: 300,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      description: 'Busy commercial area, exercise caution during peak hours',
      alertsEnabled: true,
      metadata: {
        tourists: 23,
        alerts: 2,
        safetyLevel: 75
      }
    },
    {
      id: 'zone-003',
      name: 'Industrial Area - Restricted',
      type: 'restricted' as const,
      coordinates: { lat: 28.6987, lng: 77.3876 },
      radius: 800,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      description: 'Industrial zone with restricted access for tourists',
      alertsEnabled: true,
      metadata: {
        tourists: 0,
        alerts: 0,
        safetyLevel: 30
      }
    },
    {
      id: 'zone-004',
      name: 'Ghaziabad Railway Station',
      type: 'caution' as const,
      coordinates: { lat: 28.6692, lng: 77.4538 },
      radius: 400,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      description: 'High traffic area with moderate security, stay alert',
      alertsEnabled: true,
      metadata: {
        tourists: 12,
        alerts: 1,
        safetyLevel: 70
      }
    }
  ],
  tourists: [
    {
      id: 'tourist-001',
      name: 'Rahul Sharma',
      digitalId: 'TR-KIET001',
      location: { lat: 28.7041, lng: 77.4025 },
      safetyScore: 85,
      status: 'safe' as const,
      lastSeen: new Date().toISOString(),
      deviceId: 'device-001',
      emergencyContacts: [
        { name: 'Priya Sharma', phone: '+91-9876543210', relation: 'Spouse' }
      ]
    },
    {
      id: 'tourist-002',
      name: 'Amit Kumar',
      digitalId: 'TR-KIET002',
      location: { lat: 28.7156, lng: 77.4089 },
      safetyScore: 75,
      status: 'caution' as const,
      lastSeen: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
      deviceId: 'device-002',
      emergencyContacts: [
        { name: 'Sunita Kumar', phone: '+91-9876543211', relation: 'Mother' }
      ]
    }
  ]
}