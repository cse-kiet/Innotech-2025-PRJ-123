import React, { useState, useEffect } from 'react'
import { 
  Shield, User, AlertTriangle, BarChart3, Settings, LogOut, 
  Bell, MapPin, Wifi, WifiOff, Battery, Clock, Search, 
  Star, ChevronDown, Globe, Shield as ShieldCheck, 
  Phone, MessageCircle, Navigation, Cloud, Heart, 
  Zap, TrendingUp, Award, Users, Camera, Compass,
  Sun, Moon, Volume2, VolumeX, Languages, Gift,
  Activity, Target, Eye, Sparkles, Wind, Thermometer,
  Droplets, Sunrise, Mountain, TreePine, Radio,
  Signal, Bluetooth, ChevronLeft, ChevronRight,
  Play, Pause, SkipForward, Calendar, Bookmark
} from 'lucide-react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Input } from './ui/input'
import { Progress } from './ui/progress'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'
import { ImageWithFallback } from './figma/ImageWithFallback'

interface HeaderProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  userType: 'tourist' | 'authority'
  onLogout: () => void
  onSearchActivate?: (query: string) => void
}

export function Header({ activeTab, setActiveTab, userType, onLogout, onSearchActivate }: HeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isOnline, setIsOnline] = useState(true)
  const [notifications, setNotifications] = useState(3)
  const [safetyScore, setSafetyScore] = useState(85)
  const [searchQuery, setSearchQuery] = useState('')
  const [batteryLevel, setBatteryLevel] = useState(78)
  const [isLocationEnabled, setIsLocationEnabled] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isSoundEnabled, setIsSoundEnabled] = useState(true)
  const [currentLanguage, setCurrentLanguage] = useState('EN')
  const [weatherTemp, setWeatherTemp] = useState(22)
  const [weatherCondition, setWeatherCondition] = useState('partly-cloudy')
  const [activeUsers, setActiveUsers] = useState(1247)
  const [emergencyAlerts, setEmergencyAlerts] = useState(0)
  const [todaySteps, setTodaySteps] = useState(3420)
  const [rewardPoints, setRewardPoints] = useState(850)
  const [currentStreak, setCurrentStreak] = useState(7)
  const [isBluetoothEnabled, setIsBluetoothEnabled] = useState(true)
  const [signalStrength, setSignalStrength] = useState(4)
  const [liveEvents, setLiveEvents] = useState(2)
  const [nearbyUsers, setNearbyUsers] = useState(12)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setBatteryLevel(prev => Math.max(20, prev + (Math.random() - 0.5) * 2))
      setActiveUsers(prev => prev + Math.floor(Math.random() * 10 - 5))
      setTodaySteps(prev => prev + Math.floor(Math.random() * 10))
      setNearbyUsers(prev => Math.max(0, prev + Math.floor(Math.random() * 6 - 3)))
    }, 5000)
    
    return () => clearInterval(interval)
  }, [])

  // Weather condition icons
  const getWeatherIcon = () => {
    switch (weatherCondition) {
      case 'sunny': return <Sun className="h-4 w-4 text-yellow-500 animate-pulse" />
      case 'partly-cloudy': return <Cloud className="h-4 w-4 text-blue-500" />
      case 'rainy': return <Droplets className="h-4 w-4 text-blue-600" />
      default: return <Cloud className="h-4 w-4 text-gray-500" />
    }
  }

  // Signal strength bars
  const getSignalBars = () => {
    return Array.from({ length: 4 }, (_, i) => (
      <div 
        key={i}
        className={`w-1 bg-current rounded-full transition-all duration-300 ${
          i < signalStrength 
            ? 'h-3 opacity-100' 
            : 'h-1 opacity-30'
        }`}
        style={{ height: `${(i + 1) * 3}px` }}
      />
    ))
  }

  const touristTabs = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: BarChart3, 
      color: 'text-blue-500',
      gradient: 'from-blue-500 to-indigo-600'
    },
    { 
      id: 'maps', 
      label: 'Maps', 
      icon: MapPin, 
      color: 'text-cyan-500',
      gradient: 'from-cyan-500 to-blue-600'
    },
    { 
      id: 'chatbot', 
      label: 'AI Assistant', 
      icon: MessageCircle, 
      color: 'text-pink-500',
      gradient: 'from-pink-500 to-rose-600'
    },
    { 
      id: 'id', 
      label: 'Digital ID', 
      icon: User, 
      color: 'text-emerald-500',
      gradient: 'from-emerald-500 to-green-600'
    },
    { 
      id: 'emergency', 
      label: 'SOS', 
      icon: AlertTriangle, 
      color: 'text-red-500', 
      gradient: 'from-red-500 to-red-600',
      isEmergency: true 
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: Settings, 
      color: 'text-purple-500',
      gradient: 'from-purple-500 to-violet-600'
    },
  ]

  const getStatusColor = (score: number) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <TooltipProvider>
      <header className="sticky top-0 z-50 w-full relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDU5LCAxMzAsIDI0NiwgMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPjwvc3ZnPg==')] opacity-30"></div>
        <div className="absolute inset-0 backdrop-blur-xl border-b border-white/20 dark:border-gray-700/30 shadow-lg"></div>
        
        {/* Floating particles animation */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-blue-300/20 dark:bg-blue-400/20 rounded-full animate-bounce"
              style={{
                left: `${20 + i * 15}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: '3s'
              }}
            />
          ))}
        </div>

        {/* Emergency Alert Banner */}
        {emergencyAlerts > 0 && (
          <div className="relative bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 text-center animate-pulse">
            <div className="flex items-center justify-center space-x-2">
              <AlertTriangle className="h-4 w-4 animate-bounce" />
              <span className="text-sm font-semibold">
                {emergencyAlerts} Active Emergency Alert{emergencyAlerts > 1 ? 's' : ''} in Your Area
              </span>
              <Bell className="h-4 w-4 animate-ring" />
            </div>
          </div>
        )}

        {/* Main Header */}
        <div className="relative container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-6 w-6 text-white drop-shadow-lg" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                </div>
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-gradient bg-300% hover:scale-105 transition-transform cursor-pointer">
                  NavRakshak
                </h1>
                <div className="flex items-center space-x-2">
                  <p className="text-xs text-muted-foreground">
                    {userType === 'tourist' ? 'Tourist Safety Platform' : 'Authority Control Center'}
                  </p>
                  <Badge variant="secondary" className="text-xs px-1 py-0 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                    LIVE
                  </Badge>
                </div>
              </div>
            </div>

            {/* Advanced Search Bar & AI Assistant */}
            {userType === 'tourist' && (
              <div className="hidden lg:flex flex-1 max-w-lg mx-8">
                <div className="relative w-full group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-800 to-purple-800 rounded-lg opacity-0 group-hover:opacity-30 transition-opacity"></div>
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                  <Sparkles className="absolute right-12 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-500 animate-pulse z-10" />
                  <Input
                    placeholder="Ask NavRakshak AI about safety, places, routes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && searchQuery.trim()) {
                        setActiveTab('chatbot')
                        onSearchActivate?.(searchQuery)
                        setSearchQuery('')
                      }
                    }}
                    className="pl-10 pr-16 bg-white/60 dark:bg-gray-800/60 border-white/30 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 shadow-sm"
                  />
                  <Button 
                    size="sm" 
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 px-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    onClick={() => {
                      if (searchQuery.trim()) {
                        setActiveTab('chatbot')
                        onSearchActivate?.(searchQuery)
                        setSearchQuery('')
                      }
                    }}
                  >
                    <Zap className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}

            {/* Advanced Status Dashboard */}
            <div className="flex items-center space-x-2">
              {/* Enhanced User Profile Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm px-2 hover:scale-105 transition-transform group">
                    <div className="flex items-center space-x-2">
                      <div className="relative">
                        <Avatar className="h-8 w-8 border-2 border-transparent group-hover:border-blue-400 transition-colors">
                          <AvatarImage src="https://images.unsplash.com/photo-1704726135027-9c6f034cfa41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2VyJTIwcHJvZmlsZSUyMGF2YXRhcnxlbnwxfHx8fDE3NTc4MDI5Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" alt="User" />
                          <AvatarFallback>{userType === 'authority' ? 'AD' : 'JD'}</AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></div>
                      </div>
                      <div className="hidden md:block text-left">
                        <div className="flex items-center space-x-1">
                          <p className="text-sm font-semibold">
                            {userType === 'authority' ? 'Admin User' : 'John Doe'}
                          </p>
                          <Badge variant="secondary" className="text-xs px-1 py-0">
                            {userType === 'authority' ? 'AUTH' : 'VIP'}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <p className="text-xs text-muted-foreground">
                            ID: {userType === 'authority' ? '#AU001' : '#TR001'}
                          </p>
                          {userType === 'tourist' && (
                            <div className="flex items-center space-x-1">
                              <Star className="h-2 w-2 text-yellow-400 fill-current" />
                              <span className="text-xs text-yellow-600">4.9</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <ChevronDown className="h-4 w-4 group-hover:rotate-180 transition-transform" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72">
                  <div className="p-4 border-b">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src="https://images.unsplash.com/photo-1704726135027-9c6f034cfa41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx8fDE3NTc4MDI5Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" alt="User" />
                        <AvatarFallback>{userType === 'authority' ? 'AD' : 'JD'}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold">
                          {userType === 'authority' ? 'Admin User' : 'John Doe'}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {userType === 'authority' ? 'Tourism Authority' : 'Premium Tourist'}
                        </p>
                        {userType === 'tourist' && (
                          <div className="flex items-center space-x-2 mt-1">
                            <Progress value={85} className="h-1 flex-1" />
                            <span className="text-xs text-muted-foreground">85% Complete</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
                  {userType === 'tourist' ? (
                    <>
                      <DropdownMenuItem onClick={() => setActiveTab('id')} className="p-3">
                        <User className="h-4 w-4 mr-3" />
                        <div className="flex-1">
                          <p className="font-medium">Digital ID</p>
                          <p className="text-xs text-muted-foreground">View your verified tourist ID</p>
                        </div>
                      </DropdownMenuItem> 
                      
                      <DropdownMenuItem onClick={() => setActiveTab('settings')} className="p-3">
                        <Settings className="h-4 w-4 mr-3" />
                        <span>Settings & Preferences</span>
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem className="p-3">
                        <BarChart3 className="h-4 w-4 mr-3" />
                        <div className="flex-1">
                          <p className="font-medium">Dashboard Overview</p>
                          <p className="text-xs text-muted-foreground">Real-time monitoring & analytics</p>
                        </div>
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem className="p-3">
                        <Settings className="h-4 w-4 mr-3" />
                        <span>Authority Settings</span>
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout} className="p-3 text-red-600 focus:text-red-600">
                    <LogOut className="h-4 w-4 mr-3" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Enhanced Desktop Navigation */}
          {userType === 'tourist' && (
            <div className="hidden md:flex items-center justify-center py-4 border-t border-white/10 relative">
              <nav className="flex items-center space-x-2 relative">
                {/* Background highlight that moves with active tab */}
                <div 
                  className="absolute top-0 bottom-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg transition-all duration-500 ease-out"
                  style={{
                    left: `${touristTabs.findIndex(tab => tab.id === activeTab) * 140}px`,
                    width: '136px'
                  }}
                />
                
                {touristTabs.map((tab, index) => (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "default" : "ghost"}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative group overflow-hidden transition-all duration-500 w-32 h-12 ${
                      activeTab === tab.id 
                        ? `bg-gradient-to-r ${tab.gradient} text-white shadow-xl hover:shadow-2xl transform scale-105` 
                        : 'bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm hover:bg-white/60 dark:hover:bg-gray-800/60 hover:scale-105'
                    } ${
                      tab.isEmergency ? 'border-2 border-red-400 dark:border-red-600 shadow-red-200 dark:shadow-red-900' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-2 relative z-10">
                      <tab.icon className={`h-5 w-5 ${
                        activeTab === tab.id ? 'text-white' : tab.color
                      } ${tab.isEmergency ? 'animate-pulse' : ''} transition-all duration-300 group-hover:scale-110`} />
                      <span className={`font-medium ${
                        activeTab === tab.id ? 'text-white' : ''
                      } ${tab.isEmergency ? 'font-semibold' : ''}`}>
                        {tab.label}
                      </span>
                    </div>
                    
                    {/* Glow effect for active tab */}
                    {activeTab === tab.id && (
                      <div className={`absolute -inset-1 bg-gradient-to-r ${tab.gradient} rounded-lg blur opacity-20 animate-pulse`}></div>
                    )}
                    
                    {/* Emergency indicators */}
                    {tab.isEmergency && (
                      <>
                        <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-ping"></div>
                        <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-600 rounded-full"></div>
                      </>
                    )}

                    {/* Active indicator line */}
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white rounded-full animate-pulse"></div>
                    )}
                  </Button>
                ))}
              </nav>
            </div>
          )}

          {/* Enhanced Live Data & Quick Actions Bar */}
          {userType === 'tourist' && (
            <div className="hidden lg:block border-t border-white/5">
              {/* Location Banner with Background */}
              <div className="relative py-3 bg-gradient-to-r from-blue-50/80 via-purple-50/50 to-indigo-50/80 dark:from-gray-800/80 dark:via-purple-900/20 dark:to-blue-900/30 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1568644559664-e4a5735c37ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGxhbmRzY2FwZSUyMG5vcnRoZWFzdCUyMGluZGlhfGVufDF8fHx8MTc1NzgyMTI0OXww&ixlib=rb-4.1.0&q=80&w=1080')] bg-cover bg-center opacity-10"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-100/60 to-purple-100/60 dark:from-gray-800/60 dark:to-blue-900/40"></div>
                
                <div className="relative container mx-auto px-4">
                  <div className="flex items-center justify-between">
                    {/* Location & Environment Info */}
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2 bg-white/60 dark:bg-gray-800/60 rounded-full px-3 py-1 backdrop-blur-sm hover:scale-105 transition-transform">
                        <Mountain className="h-4 w-4 text-blue-600" />
                        <span className="font-semibold text-blue-700 dark:text-blue-300">KIET Ghaziabad, UP</span>
                        <Badge variant="secondary" className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">Safe Zone</Badge>
                      </div>

                      <div className="flex items-center space-x-2 bg-white/60 dark:bg-gray-800/60 rounded-full px-3 py-1 backdrop-blur-sm">
                        <Thermometer className="h-4 w-4 text-orange-500" />
                        <span className="text-orange-600 dark:text-orange-400">{weatherTemp}°C</span>
                        {getWeatherIcon()}
                        <span className="text-green-600 dark:text-green-400">Clear</span>
                      </div>

                      <div className="flex items-center space-x-2 bg-white/60 dark:bg-gray-800/60 rounded-full px-3 py-1 backdrop-blur-sm">
                        <Wind className="h-4 w-4 text-cyan-500" />
                        <span className="text-cyan-600 dark:text-cyan-400">12 km/h</span>
                      </div>
                    </div>

                    {/* Live Activity Stats */}
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2 bg-white/60 dark:bg-gray-800/60 rounded-full px-3 py-1 backdrop-blur-sm">
                        <Navigation className="h-4 w-4 text-purple-500 animate-pulse" />
                        <span className="text-purple-600 dark:text-purple-400">4 Attractions</span>
                      </div>

                      <div className="flex items-center space-x-2 bg-white/60 dark:bg-gray-800/60 rounded-full px-3 py-1 backdrop-blur-sm">
                        <Users className="h-4 w-4 text-indigo-500" />
                        <span className="text-indigo-600 dark:text-indigo-400">{activeUsers.toLocaleString()} Active</span>
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      </div>

                      <div className="flex items-center space-x-2 bg-white/60 dark:bg-gray-800/60 rounded-full px-3 py-1 backdrop-blur-sm">
                        <Radio className="h-4 w-4 text-green-500" />
                        <span className="text-green-600 dark:text-green-400">24/7 Support</span>
                        <Heart className="h-3 w-3 text-red-500 animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Events Ticker */}
              {liveEvents > 0 && (
                <div className="bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 px-4 py-2">
                  <div className="flex items-center justify-center space-x-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="h-4 w-4 text-yellow-500 animate-pulse" />
                      <span className="font-semibold text-yellow-700 dark:text-yellow-300">Live Events:</span>
                    </div>
                    <div className="flex items-center space-x-4 animate-pulse">
                      <span className="text-orange-600 dark:text-orange-400">🎵 Music Festival at Police Bazaar</span>
                      <span className="text-green-600 dark:text-green-400">🍽️ Food Fair at Ward's Lake</span>
                    </div>
                    <Button size="sm" variant="ghost" className="text-blue-600 hover:text-blue-700">
                      View All Events →
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Enhanced Mobile Navigation */}
        {userType === 'tourist' && (
          <div className="md:hidden">
            {/* Mobile Stats Bar */}
            <div className="border-t border-white/10 bg-gradient-to-r from-blue-50/90 to-purple-50/90 dark:from-gray-800/90 dark:to-blue-900/30 px-4 py-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3 text-blue-500" />
                    <span className="text-blue-600 dark:text-blue-400">KIET Ghaziabad</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Thermometer className="h-3 w-3 text-orange-500" />
                    <span className="text-orange-600 dark:text-orange-400">{weatherTemp}°C</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <ShieldCheck className="h-3 w-3 text-green-500" />
                    <span className="text-green-600 dark:text-green-400">{safetyScore}%</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-3 w-3 text-purple-500" />
                    <span className="text-purple-600 dark:text-purple-400">{nearbyUsers}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Navigation Tabs */}
            <div className="border-t border-white/10 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg">
              <div className="container mx-auto px-4 py-3">
                <div className="flex justify-around relative">
                  {/* Active tab background */}
                  <div 
                    className="absolute top-2 bottom-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl transition-all duration-500 ease-out"
                    style={{
                      left: `${(100 / touristTabs.length) * touristTabs.findIndex(tab => tab.id === activeTab)}%`,
                      width: `${100 / touristTabs.length}%`,
                      marginLeft: '2%',
                      marginRight: '2%'
                    }}
                  />
                  
                  {touristTabs.map((tab) => (
                    <Button
                      key={tab.id}
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex flex-col items-center space-y-1 px-3 py-3 relative transition-all duration-500 min-w-16 ${
                        activeTab === tab.id 
                          ? 'scale-110 z-10' 
                          : 'hover:scale-105'
                      } ${
                        tab.isEmergency ? 'animate-pulse' : ''
                      }`}
                    >
                      <div className={`p-2 rounded-xl transition-all duration-300 ${
                        activeTab === tab.id 
                          ? `bg-gradient-to-r ${tab.gradient} shadow-lg transform scale-110`
                          : 'bg-white/50 dark:bg-gray-800/50 hover:bg-white/70 dark:hover:bg-gray-800/70'
                      } ${
                        tab.isEmergency ? 'border-2 border-red-400 shadow-red-200 dark:shadow-red-900' : ''
                      }`}>
                        <tab.icon className={`h-5 w-5 ${
                          activeTab === tab.id ? 'text-white' : tab.color
                        } ${tab.isEmergency ? 'animate-pulse' : ''} transition-all duration-300`} />
                      </div>
                      
                      <span className={`text-xs transition-all duration-300 ${
                        activeTab === tab.id ? 'font-semibold text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'
                      } ${tab.isEmergency ? 'font-semibold text-red-600 dark:text-red-400' : ''}`}>
                        {tab.label}
                      </span>
                      
                      {/* Active indicator dot */}
                      {activeTab === tab.id && (
                        <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></div>
                      )}
                      
                      {/* Emergency indicators */}
                      {tab.isEmergency && (
                        <>
                          <div className="absolute top-1 right-2 h-2 w-2 bg-red-500 rounded-full animate-ping"></div>
                          <div className="absolute top-1 right-2 h-2 w-2 bg-red-600 rounded-full"></div>
                        </>
                      )}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
    </TooltipProvider>
  )
}