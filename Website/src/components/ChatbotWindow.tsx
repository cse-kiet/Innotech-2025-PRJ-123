import React, { useState } from 'react'
import { ExternalLink, MessageCircle, Monitor, Smartphone, ArrowLeft, Bot, Zap, Shield, Globe, Users } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'

interface ChatbotWindowProps {
  onBack: () => void
  initialQuery?: string
}

export function ChatbotWindow({ onBack, initialQuery }: ChatbotWindowProps) {
  const [isOpening, setIsOpening] = useState(false)

  // Construct URLs
  const chatbotUrl = initialQuery 
    ? `https://sbrtron.xyz/?query=${encodeURIComponent(initialQuery)}`
    : 'https://sbrtron.xyz/'

  const localChatbotUrl = initialQuery
    ? `/chatbot.html?query=${encodeURIComponent(initialQuery)}`
    : '/chatbot.html'

  const handleOpenMethod = (method: string) => {
    setIsOpening(true)
    
    switch (method) {
      case 'new-tab':
        window.open(chatbotUrl, '_blank', 'noopener,noreferrer')
        break
      case 'popup':
        const popup = window.open(
          chatbotUrl, 
          'navrakshak-chatbot', 
          'width=1000,height=700,scrollbars=yes,resizable=yes,toolbar=no,location=no,directories=no,status=no,menubar=no,centerscreen=yes'
        )
        if (!popup) {
          // Fallback if popup blocked
          window.open(chatbotUrl, '_blank', 'noopener,noreferrer')
        }
        break
      case 'local':
        window.open(localChatbotUrl, '_blank', 'noopener,noreferrer')
        break
      case 'redirect':
        window.location.href = chatbotUrl
        break
      case 'mobile':
        // For mobile, open in same tab
        window.location.href = chatbotUrl
        break
    }

    setTimeout(() => setIsOpening(false), 2000)
  }

  return (
    <div className="flex flex-col h-screen relative overflow-hidden">
      {/* Fixed Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 -z-10"></div>
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDU5LCAxMzAsIDI0NiwgMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPjwvc3ZnPg==')] opacity-20 -z-10"></div>
      
      {/* Floating particles animation */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-300/30 dark:bg-blue-400/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Header */}
      <Card className="rounded-none border-x-0 border-t-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b border-white/20 dark:border-gray-700/30 shadow-lg relative z-10">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur opacity-20 animate-pulse"></div>
                  <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-full">
                    <Bot className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    NavRakshak AI Assistant
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                      Ready to Help
                    </Badge>
                    <span className="text-xs text-muted-foreground">24/7 Available</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content */}
      <div className="flex-1 relative z-10 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome to Your AI Safety Companion
            </h1>
            <p className="text-lg text-muted-foreground mb-2">
              Get instant help with travel safety, emergency assistance, and local information
            </p>
            {initialQuery && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  🔍 Search Query: "{initialQuery}"
                </p>
              </div>
            )}
          </div>

          {/* Access Methods */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Desktop Options */}
            <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur border border-white/30 dark:border-gray-700/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Desktop Access
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={() => handleOpenMethod('new-tab')}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                  size="lg"
                  disabled={isOpening}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in New Tab
                  <Badge variant="secondary" className="ml-2 bg-green-100 text-green-700">Recommended</Badge>
                </Button>

                <Button 
                  onClick={() => handleOpenMethod('popup')}
                  variant="outline"
                  className="w-full"
                  disabled={isOpening}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Open in Popup Window
                </Button>

                <Button 
                  onClick={() => handleOpenMethod('local')}
                  variant="outline"
                  className="w-full"
                  disabled={isOpening}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  NavRakshak Portal
                </Button>
              </CardContent>
            </Card>

            {/* Mobile Options */}
            <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur border border-white/30 dark:border-gray-700/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Mobile Access
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={() => handleOpenMethod('mobile')}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white"
                  size="lg"
                  disabled={isOpening}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Quick Access
                  <Badge variant="secondary" className="ml-2 bg-green-100 text-green-700">Mobile Optimized</Badge>
                </Button>

                <Button 
                  onClick={() => handleOpenMethod('redirect')}
                  variant="outline"
                  className="w-full"
                  disabled={isOpening}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Direct Navigation
                </Button>

                <div className="text-center pt-2">
                  <p className="text-xs text-muted-foreground">
                    Mobile users: Chatbot optimized for touch devices
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Features Grid */}
          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur border border-white/30 dark:border-gray-700/30">
            <CardHeader>
              <CardTitle>🤖 AI Assistant Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Globe className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <h3 className="font-semibold mb-1">Location Aware</h3>
                  <p className="text-xs text-muted-foreground">Real-time location-based safety info</p>
                </div>
                
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <Shield className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <h3 className="font-semibold mb-1">Emergency Ready</h3>
                  <p className="text-xs text-muted-foreground">Instant emergency assistance</p>
                </div>
                
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <Users className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <h3 className="font-semibold mb-1">Multilingual</h3>
                  <p className="text-xs text-muted-foreground">Supports 10+ Indian languages</p>
                </div>
                
                <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <Zap className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                  <h3 className="font-semibold mb-1">Real-time</h3>
                  <p className="text-xs text-muted-foreground">Live updates & notifications</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Indicator */}
          {isOpening && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <Card className="bg-white dark:bg-gray-900 p-6">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="font-semibold">Opening AI Assistant...</p>
                  <p className="text-sm text-muted-foreground">This may take a few seconds</p>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}