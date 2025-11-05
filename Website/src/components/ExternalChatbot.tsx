import React, { useState, useEffect } from 'react'
import { ArrowLeft, Bot, ExternalLink, MessageCircle, AlertCircle } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'

interface ExternalChatbotProps {
  onBack: () => void
  initialQuery?: string
}

export function ExternalChatbot({ onBack, initialQuery }: ExternalChatbotProps) {
  const [iframeError, setIframeError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Construct the chatbot URL with initial query if provided
  const chatbotUrl = initialQuery 
    ? `https://sbrtron.xyz/?query=${encodeURIComponent(initialQuery)}`
    : 'https://sbrtron.xyz/'

  // Construct the local chatbot page URL
  const localChatbotUrl = initialQuery
    ? `/chatbot.html?query=${encodeURIComponent(initialQuery)}`
    : '/chatbot.html'

  useEffect(() => {
    // Try to load iframe, fallback if it fails
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const handleOpenInNewTab = () => {
    window.open(chatbotUrl, '_blank', 'noopener,noreferrer')
  }

  const handleOpenLocalPage = () => {
    window.open(localChatbotUrl, '_blank', 'noopener,noreferrer')
  }

  const handleOpenPopup = () => {
    const popup = window.open(
      chatbotUrl, 
      'navrakshak-chatbot', 
      'width=800,height=600,scrollbars=yes,resizable=yes,toolbar=no,location=no,directories=no,status=no,menubar=no'
    )
    
    if (!popup) {
      // Fallback if popup blocked
      handleOpenInNewTab()
    }
  }

  const handleDirectRedirect = () => {
    window.location.href = chatbotUrl
  }

  const handleIframeError = () => {
    setIframeError(true)
    setIsLoading(false)
  }

  return (
    <div className="flex flex-col h-screen relative overflow-hidden">
      {/* Fixed Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 -z-10"></div>
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDU5LCAxMzAsIDI0NiwgMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPjwvc3ZnPg==')] opacity-20 -z-10"></div>
      
      {/* Floating particles animation */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        {Array.from({ length: 12 }, (_, i) => (
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
                Back
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
                    NavRakshak Assistant
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                      Online
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
      <div className="flex-1 relative z-10 p-4">
        <div className="h-full max-w-4xl mx-auto">
          {iframeError || isLoading ? (
            /* Fallback Options Card */
            <Card className="h-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border border-white/30 dark:border-gray-700/30 shadow-lg overflow-hidden">
              <CardContent className="h-full flex flex-col items-center justify-center p-8">
                <div className="text-center space-y-6 max-w-md">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur opacity-20"></div>
                    <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-full mx-auto w-fit">
                      <MessageCircle className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Access NavRakshak AI Assistant</h2>
                    <p className="text-muted-foreground mb-6">
                      Choose your preferred way to access the chatbot
                      {initialQuery && (
                        <span className="block mt-2 text-sm font-medium text-blue-600 dark:text-blue-400">
                          Query: "{initialQuery}"
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="space-y-4 w-full">
                    <Button 
                      onClick={handleOpenInNewTab}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                      size="lg"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open in New Tab (Recommended)
                    </Button>

                    <Button 
                      onClick={handleOpenPopup}
                      variant="outline"
                      className="w-full"
                      size="lg"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Open in Popup Window
                    </Button>

                    <Button 
                      onClick={handleOpenLocalPage}
                      variant="outline"
                      className="w-full"
                      size="lg"
                    >
                      <Bot className="h-4 w-4 mr-2" />
                      Open via NavRakshak Portal
                    </Button>

                    <Button 
                      onClick={handleDirectRedirect}
                      variant="ghost"
                      className="w-full"
                      size="lg"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Go to Chatbot Site Directly
                    </Button>
                  </div>

                  <div className="pt-4 text-center">
                    <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      Chatbot opens in a secure external window
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Try iframe first */
            <Card className="h-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border border-white/30 dark:border-gray-700/30 shadow-lg overflow-hidden">
              <iframe
                src={chatbotUrl}
                className="w-full h-full border-0"
                title="NavRakshak Chatbot"
                allow="microphone; camera; geolocation"
                onError={handleIframeError}
                onLoad={() => setIsLoading(false)}
                style={{
                  minHeight: '600px'
                }}
              />
              
              {/* Loading overlay */}
              {isLoading && (
                <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-sm text-muted-foreground">Loading AI Assistant...</p>
                    <Button 
                      onClick={() => setIframeError(true)}
                      variant="link" 
                      className="mt-2 text-xs"
                    >
                      Having trouble? Click for alternatives
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}