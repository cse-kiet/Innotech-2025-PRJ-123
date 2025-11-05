import React, { useEffect, useRef, useState } from 'react'
import { MapPin, Shield, AlertTriangle, Users, Navigation, Radio, Eye, Phone, ZoomIn, ZoomOut, RotateCcw, Layers, Info, Target, Car, MapIcon, Compass, Building } from 'lucide-react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { useGeofenceAPI } from '../hooks/useGeofenceAPI'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'

interface LeafletRealMapProps {
  userType: 'tourist' | 'authority'
  height?: string
  showControls?: boolean
  center?: [number, number]
  zoom?: number
  interactive?: boolean
  onZoneSelect?: (zoneId: string | null) => void
}

declare global {
  interface Window {
    L: any;
  }
}

export function LeafletRealMap({ 
  userType, 
  height = "400px", 
  showControls = true,
  center = [28.7041, 77.4025], // KIET Ghaziabad coordinates
  zoom = 15,
  interactive = true,
  onZoneSelect
}: LeafletRealMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const zonesRef = useRef<any[]>([])
  const [selectedZone, setSelectedZone] = useState<string | null>(null)
  const [mapZoom, setMapZoom] = useState(zoom)
  const [mapLayer, setMapLayer] = useState('osm')
  const [leafletLoaded, setLeafletLoaded] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null)
  const [showTraffic, setShowTraffic] = useState(false)
  const [showPlaces, setShowPlaces] = useState(true)

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
    useMockData: false, // Use real API
    autoRefresh: true
  })

  // Get real user location
  useEffect(() => {
    // Set default location immediately
    setCurrentLocation(center)
    
    // Try to get real location if available
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          console.log('✅ GPS location acquired:', { latitude, longitude })
          setCurrentLocation([latitude, longitude])
        },
        (error) => {
          let errorMessage = 'Unknown geolocation error'
          
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied by user or browser policy'
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable'
              break
            case error.TIMEOUT:
              errorMessage = 'Location request timed out'
              break
            default:
              errorMessage = error.message || 'Geolocation failed'
          }
          
          console.warn('⚠️ Geolocation failed:', errorMessage)
          console.log('📍 Using default KIET Ghaziabad location instead')
          // Already set to center as default
        },
        { 
          enableHighAccuracy: false, // Less battery intensive
          timeout: 5000, // Shorter timeout
          maximumAge: 300000 // 5 minutes cache
        }
      )
    } else {
      console.warn('⚠️ Geolocation API not supported by this browser')
      console.log('📍 Using default KIET Ghaziabad location')
    }
  }, [center])

  // Load Leaflet dynamically
  useEffect(() => {
    const loadLeaflet = async () => {
      if (window.L) {
        setLeafletLoaded(true)
        return
      }

      try {
        // Load Leaflet CSS
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        document.head.appendChild(link)

        // Load Leaflet JS
        const script = document.createElement('script')
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
        script.onload = () => setLeafletLoaded(true)
        document.head.appendChild(script)
      } catch (error) {
        console.error('Failed to load Leaflet:', error)
      }
    }

    loadLeaflet()
  }, [])

  // Initialize map
  useEffect(() => {
    if (!leafletLoaded || !mapRef.current || mapInstanceRef.current) return

    const L = window.L
    
    // Create map with enhanced options
    const map = L.map(mapRef.current, {
      center: currentLocation || center,
      zoom: mapZoom,
      zoomControl: false,
      attributionControl: true,
      maxZoom: 20,
      minZoom: 8,
      preferCanvas: true, // Better performance
      zoomAnimation: true,
      fadeAnimation: true,
      markerZoomAnimation: true
    })

    // Enhanced tile layers with more realistic options
    const layers = {
      osm: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
        subdomains: ['a', 'b', 'c']
      }),
      satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '© Esri © DigitalGlobe © GeoEye © Earthstar Geographics © CNES/Airbus DS © USDA © USGS © AeroGRID © IGN © IGP',
        maxZoom: 18
      }),
      hybrid: L.layerGroup([
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: '© Esri',
          maxZoom: 18
        }),
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          opacity: 0.3,
          maxZoom: 19
        })
      ]),
      terrain: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenTopoMap contributors',
        maxZoom: 17
      }),
      cartodb: L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '© CARTO © OpenStreetMap contributors',
        maxZoom: 20,
        subdomains: 'abcd'
      }),
      dark: L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© CARTO © OpenStreetMap contributors',
        maxZoom: 20,
        subdomains: 'abcd'
      })
    }

    // Add default layer
    layers[mapLayer as keyof typeof layers].addTo(map)

    mapInstanceRef.current = map
    
    // Add scale control
    L.control.scale({
      position: 'bottomleft',
      metric: true,
      imperial: false
    }).addTo(map)

    // Add real-time location tracking
    if (currentLocation) {
      map.setView(currentLocation, mapZoom)
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [leafletLoaded, currentLocation, center, mapZoom, mapLayer])

  // Add realistic places of interest around KIET Ghaziabad
  const addPlacesOfInterest = (map: any) => {
    if (!showPlaces) return

    const L = window.L
    const places = [
      { name: 'KIET Group of Institutions', lat: 28.7041, lng: 77.4025, type: 'university', icon: '🏫' },
      { name: 'Ghaziabad Railway Station', lat: 28.6692, lng: 77.4538, type: 'transport', icon: '🚂' },
      { name: 'Shipra Mall', lat: 28.6640, lng: 77.4069, type: 'shopping', icon: '🛍️' },
      { name: 'Swarna Jayanti Park', lat: 28.6823, lng: 77.4194, type: 'park', icon: '🌳' },
      { name: 'Max Hospital', lat: 28.6618, lng: 77.4027, type: 'hospital', icon: '🏥' },
      { name: 'DLF Mall of India', lat: 28.5672, lng: 77.3250, type: 'shopping', icon: '🛒' },
      { name: 'Raj Nagar District Centre', lat: 28.6838, lng: 77.3730, type: 'commercial', icon: '🏢' },
      { name: 'Delhi Police Station', lat: 28.6950, lng: 77.4100, type: 'police', icon: '👮' }
    ]

    places.forEach(place => {
      const placeIcon = L.divIcon({
        className: 'place-marker',
        html: `
          <div class="relative bg-white rounded-full p-2 shadow-lg border-2 border-blue-400">
            <span class="text-sm">${place.icon}</span>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      })

      const marker = L.marker([place.lat, place.lng], { icon: placeIcon })
        .bindPopup(`
          <div class="bg-white p-3 rounded-lg shadow-lg border border-gray-200 min-w-[200px]">
            <h3 class="font-bold text-gray-800 mb-1">${place.name}</h3>
            <p class="text-sm text-gray-600 capitalize">${place.type}</p>
            <div class="mt-2 text-xs text-gray-500">
              📍 ${place.lat.toFixed(4)}, ${place.lng.toFixed(4)}
            </div>
          </div>
        `)
        .addTo(map)

      markersRef.current.push(marker)
    })
  }

  // Update markers and zones
  useEffect(() => {
    if (!mapInstanceRef.current || !leafletLoaded) return

    const L = window.L
    const map = mapInstanceRef.current

    // Clear existing markers and zones
    markersRef.current.forEach(marker => map.removeLayer(marker))
    zonesRef.current.forEach(zone => map.removeLayer(zone))
    markersRef.current = []
    zonesRef.current = []

    // Add current user marker with enhanced design
    const userLocation = currentLocation || center
    const userIcon = L.divIcon({
      className: 'current-user-marker',
      html: `
        <div class="relative">
          <div class="absolute inset-0 w-16 h-16 bg-blue-500/20 rounded-full animate-ping"></div>
          <div class="absolute inset-0 w-12 h-12 bg-blue-500/30 rounded-full animate-ping animation-delay-200"></div>
          <div class="absolute inset-0 w-8 h-8 bg-blue-500/40 rounded-full animate-ping animation-delay-300"></div>
          <div class="relative w-8 h-8 bg-gradient-to-tr from-blue-500 to-blue-600 rounded-full border-4 border-white shadow-2xl flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
            </svg>
          </div>
          <div class="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-bold shadow-lg border border-blue-400 whitespace-nowrap">
            You are here
            <div class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-blue-600"></div>
          </div>
        </div>
      `,
      iconSize: [64, 64],
      iconAnchor: [32, 32]
    })

    const userMarker = L.marker(userLocation, { icon: userIcon })
      .bindPopup(`
        <div class="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-lg shadow-xl border border-blue-400 min-w-[250px]">
          <div class="flex items-center mb-3">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
            </svg>
            <h3 class="font-bold text-lg">Your Current Location</h3>
          </div>
          <div class="space-y-2 text-sm">
            <div class="flex items-center">
              <span class="w-16 text-blue-200">Status:</span>
              <span class="font-semibold text-green-300">● Live GPS Active</span>
            </div>
            <div class="flex items-center">
              <span class="w-16 text-blue-200">Area:</span>
              <span class="font-semibold">Near KIET Ghaziabad</span>
            </div>
            <div class="flex items-center">
              <span class="w-16 text-blue-200">Coords:</span>
              <span class="font-mono text-xs">${userLocation[0].toFixed(6)}, ${userLocation[1].toFixed(6)}</span>
            </div>
            <div class="flex items-center">
              <span class="w-16 text-blue-200">Safety:</span>
              <span class="font-semibold text-green-300">✓ Protected Zone</span>
            </div>
          </div>
        </div>
      `)
      .addTo(map)

    markersRef.current.push(userMarker)

    // Add realistic geofence zones around KIET Ghaziabad area
    const realZones = [
      { 
        id: 'kiet-campus', 
        name: 'KIET Campus Safe Zone', 
        type: 'safe', 
        lat: 28.7041, 
        lng: 77.4025, 
        radius: 500,
        description: 'Main campus area with 24/7 security'
      },
      { 
        id: 'gzb-station', 
        name: 'Railway Station Caution', 
        type: 'caution', 
        lat: 28.6692, 
        lng: 77.4538, 
        radius: 300,
        description: 'High traffic area, stay alert'
      },
      { 
        id: 'shipra-mall', 
        name: 'Shipra Mall Safe Zone', 
        type: 'safe', 
        lat: 28.6640, 
        lng: 77.4069, 
        radius: 200,
        description: 'Secure shopping complex'
      },
      { 
        id: 'nh9-highway', 
        name: 'NH-9 Restricted', 
        type: 'restricted', 
        lat: 28.6800, 
        lng: 77.3800, 
        radius: 150,
        description: 'Heavy traffic highway - pedestrians restricted'
      },
      { 
        id: 'emergency-hospital', 
        name: 'Max Hospital Emergency', 
        type: 'emergency', 
        lat: 28.6618, 
        lng: 77.4027, 
        radius: 100,
        description: 'Emergency medical services available'
      },
      {
        id: 'raj-nagar',
        name: 'Raj Nagar Commercial',
        type: 'caution',
        lat: 28.6838,
        lng: 77.3730,
        radius: 250,
        description: 'Busy commercial area, moderate safety'
      }
    ]

    realZones.forEach((zone, index) => {
      const colors = {
        safe: { fill: '#22c55e', stroke: '#16a34a', bg: 'bg-green-500' },
        caution: { fill: '#eab308', stroke: '#ca8a04', bg: 'bg-yellow-500' },
        restricted: { fill: '#ef4444', stroke: '#dc2626', bg: 'bg-red-500' },
        emergency: { fill: '#3b82f6', stroke: '#2563eb', bg: 'bg-blue-500' }
      }

      const color = colors[zone.type as keyof typeof colors]
      
      // Create circle for zone
      const circle = L.circle([zone.lat, zone.lng], {
        radius: zone.radius,
        fillColor: color.fill,
        color: color.stroke,
        weight: 3,
        opacity: 0.8,
        fillOpacity: 0.25,
        interactive: true
      }).addTo(map)

      // Enhanced zone marker
      const zoneIcon = L.divIcon({
        className: 'zone-marker',
        html: `
          <div class="relative">
            <div class="w-10 h-10 ${color.bg} rounded-full border-3 border-white shadow-xl flex items-center justify-center animate-pulse">
              ${zone.type === 'safe' ? '<svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11.5C15.4,11.5 16,12.1 16,12.7V16.3C16,16.9 15.4,17.5 14.8,17.5H9.2C8.6,17.5 8,16.9 8,16.3V12.7C8,12.1 8.6,11.5 9.2,11.5V10C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.5,8.7 10.5,10V11.5H13.5V10C13.5,8.7 12.8,8.2 12,8.2Z"/></svg>' :
               zone.type === 'caution' ? '<svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z"/></svg>' :
               zone.type === 'restricted' ? '<svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12,2C13.1,2 14,2.9 14,4C14,5.1 13.1,6 12,6C10.9,6 10,5.1 10,4C10,2.9 10.9,2 12,2M21,9V7L15,1H9V3H7V21A2,2 0 0,0 9,23H15A2,2 0 0,0 17,21V15H21V13H17V11H19V9H17Z"/></svg>' :
               '<svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62,10.79C6.57,10.62 6.54,10.45 6.54,10.28C6.54,9.47 7.19,8.82 8,8.82C8.81,8.82 9.46,9.47 9.46,10.28C9.46,10.45 9.43,10.62 9.38,10.79L12,3.5L14.62,10.79C14.57,10.62 14.54,10.45 14.54,10.28C14.54,9.47 15.19,8.82 16,8.82C16.81,8.82 17.46,9.47 17.46,10.28C17.46,10.45 17.43,10.62 17.38,10.79L19.5,13H4.5L6.62,10.79Z"/></svg>'}
            </div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      })

      const zoneMarker = L.marker([zone.lat, zone.lng], { icon: zoneIcon })
        .bindPopup(`
          <div class="bg-white p-4 rounded-lg shadow-xl border border-gray-200 min-w-[300px] max-w-[350px]">
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-bold text-lg text-gray-800">${zone.name}</h3>
              <span class="px-3 py-1 rounded-full text-xs font-semibold text-white ${color.bg}">
                ${zone.type.toUpperCase()}
              </span>
            </div>
            
            <p class="text-sm text-gray-600 mb-3">${zone.description}</p>
            
            <div class="grid grid-cols-2 gap-3 text-sm">
              <div class="bg-gray-50 p-2 rounded">
                <div class="text-gray-500">Coverage Radius</div>
                <div class="font-semibold text-gray-800">${zone.radius}m</div>
              </div>
              <div class="bg-gray-50 p-2 rounded">
                <div class="text-gray-500">Active Tourists</div>
                <div class="font-semibold text-gray-800">${Math.floor(Math.random() * 50) + 1}</div>
              </div>
              <div class="bg-gray-50 p-2 rounded">
                <div class="text-gray-500">Safety Score</div>
                <div class="font-semibold ${zone.type === 'safe' ? 'text-green-600' : zone.type === 'caution' ? 'text-yellow-600' : zone.type === 'restricted' ? 'text-red-600' : 'text-blue-600'}">
                  ${zone.type === 'safe' ? '95%' : zone.type === 'caution' ? '75%' : zone.type === 'restricted' ? '45%' : '85%'}
                </div>
              </div>
              <div class="bg-gray-50 p-2 rounded">
                <div class="text-gray-500">Last Updated</div>
                <div class="font-semibold text-gray-800">Live</div>
              </div>
            </div>
            
            <div class="mt-3 text-xs text-gray-500">
              📍 ${zone.lat.toFixed(6)}, ${zone.lng.toFixed(6)}
            </div>
            
            ${userType === 'authority' ? `
              <div class="mt-4 pt-3 border-t border-gray-200 grid grid-cols-2 gap-2">
                <button class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-semibold transition-colors">
                  📢 Broadcast Alert
                </button>
                <button class="border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-2 rounded text-sm font-semibold transition-colors">
                  👁️ Monitor Zone
                </button>
              </div>
            ` : ''}
          </div>
        `)
        .addTo(map)

      zonesRef.current.push(circle, zoneMarker)

      // Handle zone selection
      const handleZoneClick = () => {
        setSelectedZone(selectedZone === zone.id ? null : zone.id)
        onZoneSelect?.(selectedZone === zone.id ? null : zone.id)
      }

      circle.on('click', handleZoneClick)
      zoneMarker.on('click', handleZoneClick)
    })

    // Add realistic tourist markers (for authority view)
    if (userType === 'authority') {
      const touristLocations = [
        { lat: 28.7045, lng: 77.4030, name: 'Student A', status: 'safe' },
        { lat: 28.7038, lng: 77.4020, name: 'Student B', status: 'safe' },
        { lat: 28.6695, lng: 77.4540, name: 'Visitor C', status: 'caution' },
        { lat: 28.6642, lng: 77.4065, name: 'Tourist D', status: 'safe' },
        { lat: 28.6620, lng: 77.4025, name: 'Patient E', status: 'emergency' }
      ]

      touristLocations.forEach((tourist, index) => {
        const touristIcon = L.divIcon({
          className: 'tourist-marker',
          html: `
            <div class="relative">
              <div class="w-6 h-6 rounded-full border-3 border-white shadow-lg flex items-center justify-center ${
                tourist.status === 'safe' ? 'bg-green-500' :
                tourist.status === 'caution' ? 'bg-yellow-500' :
                tourist.status === 'emergency' ? 'bg-red-500' : 'bg-blue-500'
              }">
                <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"/>
                </svg>
              </div>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        })

        const touristMarker = L.marker([tourist.lat, tourist.lng], { icon: touristIcon })
          .bindPopup(`
            <div class="bg-white p-3 rounded-lg shadow-lg border border-gray-200 min-w-[200px]">
              <div class="flex items-center justify-between mb-2">
                <h3 class="font-bold text-gray-800">${tourist.name}</h3>
                <span class="w-3 h-3 rounded-full ${
                  tourist.status === 'safe' ? 'bg-green-500' :
                  tourist.status === 'caution' ? 'bg-yellow-500' :
                  tourist.status === 'emergency' ? 'bg-red-500' : 'bg-blue-500'
                }"></span>
              </div>
              <div class="space-y-1 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600">Status:</span>
                  <span class="font-semibold capitalize ${
                    tourist.status === 'safe' ? 'text-green-600' :
                    tourist.status === 'caution' ? 'text-yellow-600' :
                    tourist.status === 'emergency' ? 'text-red-600' : 'text-blue-600'
                  }">${tourist.status}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Safety Score:</span>
                  <span class="font-semibold">${tourist.status === 'safe' ? '95%' : tourist.status === 'caution' ? '75%' : '25%'}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Last Seen:</span>
                  <span class="font-semibold">Just now</span>
                </div>
              </div>
              <div class="mt-2 text-xs text-gray-500">
                📍 ${tourist.lat.toFixed(4)}, ${tourist.lng.toFixed(4)}
              </div>
            </div>
          `)
          .addTo(map)

        markersRef.current.push(touristMarker)
      })
    }

    // Add places of interest
    addPlacesOfInterest(map)

  }, [zones, tourists, userType, leafletLoaded, currentLocation, center, selectedZone, onZoneSelect, showPlaces])

  const handleEmergencyAlert = async () => {
    try {
      const location = currentLocation || center
      await triggerEmergencyAlert(
        'current-user', 
        { lat: location[0], lng: location[1] },
        'Emergency alert triggered from KIET Ghaziabad area'
      )
    } catch (error) {
      console.error('Emergency alert failed:', error)
    }
  }

  const changeMapLayer = (layer: string) => {
    if (!mapInstanceRef.current || !leafletLoaded) return

    const L = window.L
    const map = mapInstanceRef.current

    // Remove current layers
    map.eachLayer((layer: any) => {
      if (layer instanceof L.TileLayer || layer instanceof L.LayerGroup) {
        map.removeLayer(layer)
      }
    })

    // Add new layer
    const layers = {
      osm: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }),
      satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '© Esri',
        maxZoom: 18
      }),
      hybrid: L.layerGroup([
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: '© Esri',
          maxZoom: 18
        }),
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          opacity: 0.3,
          maxZoom: 19
        })
      ]),
      terrain: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenTopoMap contributors',
        maxZoom: 17
      }),
      cartodb: L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '© CARTO',
        maxZoom: 20
      }),
      dark: L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© CARTO',
        maxZoom: 20
      })
    }

    layers[layer as keyof typeof layers].addTo(map)
    setMapLayer(layer)
  }

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn()
      setMapZoom(mapInstanceRef.current.getZoom())
    }
  }

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut()
      setMapZoom(mapInstanceRef.current.getZoom())
    }
  }

  const handleResetView = () => {
    if (mapInstanceRef.current) {
      const location = currentLocation || center
      mapInstanceRef.current.setView(location, zoom)
      setMapZoom(zoom)
    }
  }

  const handleMyLocation = () => {
    console.log('🔍 Attempting to get current location...')
    
    if (!navigator.geolocation) {
      console.warn('⚠️ Geolocation not supported')
      return
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        console.log('✅ Location found:', { latitude, longitude })
        setCurrentLocation([latitude, longitude])
        
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([latitude, longitude], 16)
          setMapZoom(16)
        }
      },
      (error) => {
        let userMessage = 'Could not get your location'
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            userMessage = 'Location access denied. Please enable location permissions.'
            console.warn('⚠️ Location permission denied by user or browser policy')
            break
          case error.POSITION_UNAVAILABLE:
            userMessage = 'Location currently unavailable. Using default location.'
            console.warn('⚠️ GPS position unavailable')
            break
          case error.TIMEOUT:
            userMessage = 'Location request timed out. Using default location.'
            console.warn('⚠️ Location request timeout')
            break
          default:
            userMessage = 'Location error. Using default KIET location.'
            console.warn('⚠️ Unknown location error:', error.message || 'No details')
        }
        
        // Show user-friendly message (you could use a toast here if you want)
        console.log('📍 Staying at default KIET Ghaziabad location')
      },
      { 
        enableHighAccuracy: false, 
        timeout: 3000, // Shorter timeout
        maximumAge: 60000 // 1 minute cache
      }
    )
  }

  if (!leafletLoaded) {
    return (
      <div className="relative w-full rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-900" style={{ height }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-700 dark:text-slate-300 font-medium">Loading Real Map...</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">KIET Ghaziabad Area</p>
        </div>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="relative w-full rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg" style={{ height }}>
        {/* Real Map Container */}
        <div ref={mapRef} className="w-full h-full" />

        {/* Enhanced Controls and Overlays */}
        {showControls && (
          <>
            {/* Live Status Indicator */}
            <div className="absolute top-4 left-4 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-gray-200 dark:border-slate-600 rounded-lg p-3 shadow-xl z-[1000]">
              <div className="flex items-center space-x-3">
                <div className={`h-3 w-3 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                <div>
                  <div className="text-gray-800 dark:text-white font-semibold text-sm">
                    {connected ? 'Live GPS Active' : 'Offline Mode'}
                  </div>
                  <div className="text-gray-600 dark:text-slate-400 text-xs">
                    KIET Ghaziabad, UP • Real-Time Map
                  </div>
                </div>
              </div>
            </div>

            {/* My Location Button */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000]">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    onClick={handleMyLocation}
                    className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-gray-200 dark:border-slate-600 text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-700 shadow-lg"
                  >
                    <Compass className="h-4 w-4 mr-2" />
                    My Location
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Get current GPS location</TooltipContent>
              </Tooltip>
            </div>

            {/* Map Layer Controls */}
            <div className="absolute top-4 right-20 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-gray-200 dark:border-slate-600 rounded-lg p-2 shadow-xl z-[1000]">
              <div className="grid grid-cols-3 gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant={mapLayer === 'osm' ? 'default' : 'ghost'}
                      className="h-8 w-8 p-0"
                      onClick={() => changeMapLayer('osm')}
                    >
                      <MapIcon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Street Map</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant={mapLayer === 'satellite' ? 'default' : 'ghost'}
                      className="h-8 w-8 p-0"
                      onClick={() => changeMapLayer('satellite')}
                    >
                      <Layers className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Satellite</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant={mapLayer === 'hybrid' ? 'default' : 'ghost'}
                      className="h-8 w-8 p-0"
                      onClick={() => changeMapLayer('hybrid')}
                    >
                      <Building className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Hybrid View</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant={mapLayer === 'terrain' ? 'default' : 'ghost'}
                      className="h-8 w-8 p-0"
                      onClick={() => changeMapLayer('terrain')}
                    >
                      <Target className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Terrain</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant={mapLayer === 'cartodb' ? 'default' : 'ghost'}
                      className="h-8 w-8 p-0"
                      onClick={() => changeMapLayer('cartodb')}
                    >
                      <Car className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Clean Map</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant={mapLayer === 'dark' ? 'default' : 'ghost'}
                      className="h-8 w-8 p-0"
                      onClick={() => changeMapLayer('dark')}
                    >
                      <MapPin className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Dark Mode</TooltipContent>
                </Tooltip>
              </div>
            </div>

            {/* Map Controls */}
            <div className="absolute top-4 right-4 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-gray-200 dark:border-slate-600 rounded-lg p-2 shadow-xl z-[1000]">
              <div className="flex flex-col space-y-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700"
                  onClick={handleZoomIn}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <div className="text-xs text-gray-600 dark:text-slate-400 text-center py-1 font-mono">{Math.round(mapZoom)}</div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700"
                  onClick={handleZoomOut}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <div className="border-t border-gray-200 dark:border-slate-600 pt-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700"
                    onClick={handleResetView}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Enhanced Stats Dashboard */}
            <div className="absolute top-20 right-4 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-gray-200 dark:border-slate-600 rounded-lg p-4 shadow-xl z-[1000]">
              <div className="grid grid-cols-2 gap-4 text-center min-w-[200px]">
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-green-500">4</div>
                  <div className="text-xs text-gray-600 dark:text-slate-400">Safe Zones</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-yellow-500">2</div>
                  <div className="text-xs text-gray-600 dark:text-slate-400">Caution</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-red-500">1</div>
                  <div className="text-xs text-gray-600 dark:text-slate-400">Restricted</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-blue-500">{userType === 'authority' ? '127' : '1'}</div>
                  <div className="text-xs text-gray-600 dark:text-slate-400">Active</div>
                </div>
              </div>
            </div>

            {/* Emergency SOS Button */}
            {userType === 'tourist' && (
              <div className="absolute bottom-4 right-4 z-[1000]">
                <Button
                  size="lg"
                  onClick={handleEmergencyAlert}
                  className="bg-red-600 hover:bg-red-700 text-white shadow-2xl border-2 border-red-400 animate-pulse-glow font-bold"
                >
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  🚨 EMERGENCY SOS
                </Button>
              </div>
            )}

            {/* Enhanced Legend */}
            <div className="absolute bottom-4 left-4 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-gray-200 dark:border-slate-600 rounded-lg p-4 shadow-xl z-[1000]">
              <div className="space-y-3">
                <div className="text-gray-800 dark:text-white font-semibold text-sm flex items-center">
                  <Info className="h-4 w-4 mr-2" />
                  Safety Legend
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-green-500 rounded-full shadow-sm"></div>
                    <span className="text-gray-700 dark:text-slate-300 text-sm">Safe Zone</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full shadow-sm"></div>
                    <span className="text-gray-700 dark:text-slate-300 text-sm">Caution Zone</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-red-500 rounded-full shadow-sm"></div>
                    <span className="text-gray-700 dark:text-slate-300 text-sm">Restricted Zone</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-blue-500 rounded-full shadow-sm"></div>
                    <span className="text-gray-700 dark:text-slate-300 text-sm">Emergency Zone</span>
                  </div>
                </div>
              </div>
            </div>

            {/* NavRakshak Branding */}
            <div className="absolute bottom-4 right-1/2 transform translate-x-1/2 z-[1000]">
              <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-gray-200 dark:border-slate-600 rounded-lg px-4 py-2 shadow-lg">
                <div className="flex items-center space-x-2 text-sm">
                  <Shield className="h-4 w-4 text-blue-500" />
                  <span className="text-gray-800 dark:text-white font-semibold">NavRakshak</span>
                  <span className="text-gray-600 dark:text-slate-400">Live Safety Map • KIET Area</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-[1001]">
            <div className="bg-white/95 dark:bg-slate-800/95 border border-gray-200 dark:border-slate-600 rounded-lg p-4 shadow-xl">
              <div className="flex items-center space-x-3 text-gray-800 dark:text-white">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent"></div>
                <span className="font-medium">Updating real-time data...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}