import React, { useState, useEffect } from 'react'
import { Wifi, WifiOff, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { geofenceAPI } from '../services/geofenceApi'
import { toast } from 'sonner@2.0.3'

interface ApiStatusIndicatorProps {
  connected: boolean
  loading: boolean
  error?: string | null
  onRetry?: () => void
}

export function ApiStatusIndicator({ 
  connected, 
  loading, 
  error, 
  onRetry 
}: ApiStatusIndicatorProps) {
  const [apiConfig, setApiConfig] = useState<{ baseUrl: string; apiKey: string } | null>(null)
  const [testingConnection, setTestingConnection] = useState(false)

  useEffect(() => {
    // Get API configuration
    const config = geofenceAPI.getConfig()
    setApiConfig(config)
  }, [])

  const testConnection = async () => {
    setTestingConnection(true)
    try {
      const isConnected = await geofenceAPI.testConnection()
      if (isConnected) {
        toast.success('✅ API connection successful!')
      } else {
        toast.error('❌ API connection failed')
      }
    } catch (error) {
      toast.error('❌ API connection test failed')
    } finally {
      setTestingConnection(false)
    }
  }

  const getStatusIcon = () => {
    if (loading || testingConnection) {
      return <RefreshCw className="h-4 w-4 animate-spin" />
    }
    if (connected) {
      return <CheckCircle className="h-4 w-4 text-green-500" />
    }
    if (error) {
      return <AlertCircle className="h-4 w-4 text-red-500" />
    }
    return <WifiOff className="h-4 w-4 text-gray-500" />
  }

  const getStatusText = () => {
    if (loading) return 'Connecting...'
    if (connected) return 'API Connected'
    if (error) return 'API Error'
    return 'API Disconnected'
  }

  const getStatusColor = () => {
    if (connected) return 'bg-green-100 text-green-700 border-green-200'
    if (error) return 'bg-red-100 text-red-700 border-red-200'
    return 'bg-gray-100 text-gray-700 border-gray-200'
  }

  return (
    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/30">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Status Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getStatusIcon()}
              <span className="font-medium text-sm">{getStatusText()}</span>
            </div>
            <Badge className={getStatusColor()}>
              {connected ? 'Live' : error ? 'Error' : 'Offline'}
            </Badge>
          </div>

          {/* API Details */}
          {apiConfig && (
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Endpoint:</span>
                <span className="font-mono text-blue-600">
                  {apiConfig.baseUrl}
                </span>
              </div>
              <div className="flex justify-between">
                <span>API Key:</span>
                <span className="font-mono">
                  {apiConfig.apiKey}
                </span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="text-xs text-red-600 bg-red-50 dark:bg-red-900/20 p-2 rounded border border-red-200">
              {error}
            </div>
          )}

          {/* Connection Status Details */}
          <div className="text-xs space-y-1">
            {connected ? (
              <div className="text-green-600">
                ✅ Real-time WebSocket connection active
                <br />
                ✅ API endpoints responding normally
                <br />
                ✅ Geofence data syncing live
              </div>
            ) : (
              <div className="text-orange-600">
                ⚠️ Using offline demo data
                <br />
                🔄 Will auto-retry API connection
                <br />
                📡 Check your internet connection
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={testConnection} 
              disabled={testingConnection}
              className="flex-1"
            >
              <Wifi className="h-3 w-3 mr-1" />
              Test API
            </Button>
            {onRetry && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={onRetry} 
                disabled={loading}
                className="flex-1"
              >
                <RefreshCw className={`h-3 w-3 mr-1 ${loading ? 'animate-spin' : ''}`} />
                Retry
              </Button>
            )}
          </div>

          {/* Integration Guide */}
          {!connected && (
            <div className="text-xs text-muted-foreground bg-blue-50 dark:bg-blue-900/20 p-2 rounded border border-blue-200">
              <strong>🔗 API Integration Status:</strong>
              <br />
              <strong>API Endpoint:</strong> <code className="text-blue-600">geofence-api-production.up.railway.app</code>
              <br />
              <strong>Status:</strong> {error ? 'Connection Failed' : 'Checking...'}
              <br />
              <strong>Current Mode:</strong> Using Demo Data (KIET Ghaziabad focused)
              <br />
              <br />
              <strong>📋 Possible solutions:</strong>
              <ul className="mt-1 text-xs space-y-1">
                <li>• Check if your API server is running</li>
                <li>• Verify CORS settings allow web requests</li>
                <li>• Confirm API endpoints match expected URLs</li>
                <li>• Check network connectivity</li>
              </ul>
              <br />
              <em>Real-time tracking will work when API is available.</em>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}