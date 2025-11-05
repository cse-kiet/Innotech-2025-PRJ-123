import React, { useState } from 'react'
import { Users, MapPin, AlertTriangle, Activity, TrendingUp, Eye, FileText, Shield } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Progress } from './ui/progress'
import { ImageWithFallback } from './figma/ImageWithFallback'
import { Maps } from './Maps'
import { GeofenceAlertsManager } from './GeofenceAlert'
import { ApiStatusIndicator } from './ApiStatusIndicator'
import { useGeofenceAPI } from '../hooks/useGeofenceAPI'

export function AuthorityDashboard() {
  // Use real API data by default, fallback to mock data if API is unavailable
  const { 
    dashboardMetrics, 
    tourists, 
    zones, 
    activeAlerts, 
    loading, 
    error, 
    connected,
    loadData
  } = useGeofenceAPI({ 
    useMockData: false, // Enable real API
    enableRealTime: true, 
    autoRefresh: true,
    refreshInterval: 15000 // Refresh every 15 seconds
  })

  return (
    <div className="space-y-6">
      {/* API Status Indicator */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <ApiStatusIndicator 
            connected={connected}
            loading={loading}
            error={error}
            onRetry={loadData}
          />
        </div>
      </div>

      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Tourists</p>
                <p className="text-2xl font-bold">{dashboardMetrics.totalTourists}</p>
              </div>
              <Users className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Online Now</p>
                <p className="text-2xl font-bold">{dashboardMetrics.onlineTourists}</p>
              </div>
              <Activity className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Active Alerts</p>
                <p className="text-2xl font-bold">{dashboardMetrics.activeAlerts}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Zone Violations</p>
                <p className="text-2xl font-bold">{dashboardMetrics.safeZoneViolations}</p>
              </div>
              <Shield className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="monitoring" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="monitoring">Live Monitoring</TabsTrigger>
          <TabsTrigger value="tourists">Tourist Records</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="monitoring" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Integrated Interactive Map */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-blue-500" />
                  <span>Interactive Geofencing Control Center</span>
                </CardTitle>
                <CardDescription>Real-time tourist monitoring with advanced geofencing controls</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Maps userType="authority" />
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Geofence Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <span>Geofence Alerts</span>
                </CardTitle>
                <CardDescription>Real-time zone violation and safety alerts</CardDescription>
              </CardHeader>
              <CardContent className="max-h-96 overflow-y-auto">
                <GeofenceAlertsManager userType="authority" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tourists" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Registered Tourists</CardTitle>
              <CardDescription>Complete database of tourist records and status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading && (
                  <div className="text-center py-8">
                    <div className="text-muted-foreground">Loading tourist data...</div>
                  </div>
                )}
                {!loading && tourists.length === 0 && (
                  <div className="text-center py-8">
                    <div className="text-muted-foreground">No tourists found</div>
                  </div>
                )}
                {tourists.map((tourist) => (
                  <div key={tourist.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div>
                        <div className="font-medium">{tourist.name}</div>
                        <div className="text-sm text-muted-foreground">ID: {tourist.digitalId}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm">{`${tourist.location.lat.toFixed(4)}, ${tourist.location.lng.toFixed(4)}`}</div>
                        <div className="text-xs text-muted-foreground">{new Date(tourist.lastSeen).toLocaleString()}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm">Score: {tourist.safetyScore}/100</div>
                        <Progress value={tourist.safetyScore} className="w-16 h-2" />
                      </div>
                      <Badge variant={
                        tourist.status === 'safe' ? 'default' :
                        tourist.status === 'caution' ? 'secondary' : 'destructive'
                      }>
                        {tourist.status}
                      </Badge>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <span>Tourist Flow Trends</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Shillong</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={85} className="w-20" />
                      <span className="text-sm">450 tourists</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Cherrapunji</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={65} className="w-20" />
                      <span className="text-sm">320 tourists</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Kaziranga</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={40} className="w-20" />
                      <span className="text-sm">180 tourists</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Safety Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Average Safety Score</span>
                    <span className="font-semibold">78/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Incidents This Month</span>
                    <span className="font-semibold text-red-600">7</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Response Time (Avg)</span>
                    <span className="font-semibold text-green-600">4.2 mins</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Geo-fences</span>
                    <span className="font-semibold">152</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-500" />
                <span>Incident Reports</span>
              </CardTitle>
              <CardDescription>Automated E-FIR generation and case management</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                  <FileText className="h-6 w-6" />
                  <span>Generate Report</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                  <TrendingUp className="h-6 w-6" />
                  <span>Analytics Export</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                  <Shield className="h-6 w-6" />
                  <span>Safety Audit</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}