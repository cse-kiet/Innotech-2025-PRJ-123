import React, { useState, useEffect } from 'react'
import { ArrowLeft, Bot, ExternalLink, Loader2, AlertCircle } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Alert, AlertDescription } from './ui/alert'

interface SimpleChatbotProps {
  onBack: () => void
  initialQuery?: string
}

export function SimpleChatbot({ onBack, initialQuery }: SimpleChatbotProps) {
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [countdown, setCountdown] = useState(5)

  const chatbotUrl = initialQuery 
    ? `https://sbrtron.xyz/?query=${encodeURIComponent(initialQuery)}`
    : 'https://sbrtron.xyz/'

  const localChatbotUrl = initialQuery
    ? `/chatbot.html?query=${encodeURIComponent(initialQuery)}`
    : '/chatbot.html'

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isRedirecting && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    } else if (isRedirecting && countdown === 0) {
      window.open(chatbotUrl, '_blank', 'noopener,noreferrer')
      setIsRedirecting(false)
      setCountdown(5)
    }
    return () => clearTimeout(timer)
  }, [isRedirecting, countdown, chatbotUrl])

  const handleAutoRedirect = () => {
    setIsRedirecting(true)
  }

  const handleManualOpen = (url: string, target: string = '_blank') => {
    if (target === '_blank') {
      window.open(url, '_blank', 'noopener,noreferrer')
    } else {
      window.location.href = url
    }
  }

  return (
    <div className="flex flex-col h-screen relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 -z-10"></div>
      
      {/* Header */}
      <Card className="rounded-none border-x-0 border-t-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b border-white/20 dark:border-gray-700/30 shadow-lg relative z-10">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
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
              <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-full">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  NavRakshak AI Assistant
                </CardTitle>
                <Badge variant="secondary" className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                  Ready to Connect
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content */}
      <div className="flex-1 relative z-10 p-6">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border border-white/30 dark:border-gray-700/30 shadow-lg">
            <CardContent className="p-8">
              {/* Welcome Section */}
              <div className="text-center mb-8">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur opacity-20"></div>
                  <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-full mx-auto w-fit">
                    <Bot className="h-8 w-8 text-white" />
                  </div>
                </div>
                
                <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Connect to AI Assistant
                </h1>
                <p className="text-lg text-muted-foreground mb-4">
                  Your intelligent companion for tourist safety and assistance
                </p>
                
                {initialQuery && (
                  <Alert className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Search Query:</strong> "{initialQuery}"
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Connection Options */}
              <div className="space-y-6">
                {/* Auto Redirect Option */}
                <div className="text-center">
                  {isRedirecting ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-center space-x-2 text-blue-600">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Opening AI Assistant in {countdown} seconds...</span>
                      </div>
                      <Button 
                        onClick={() => setIsRedirecting(false)}
                        variant="outline"
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      onClick={handleAutoRedirect}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3"
                      size="lg"
                    >
                      <Bot className="h-5 w-5 mr-2" />
                      Auto-Connect (5s)
                    </Button>
                  )}
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300 dark:border-gray-600" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white dark:bg-gray-900 px-2 text-muted-foreground">
                      Or choose your preferred method
                    </span>
                  </div>
                </div>

                {/* Manual Options */}
                <div className="grid gap-4">
                  <Button 
                    onClick={() => handleManualOpen(chatbotUrl)}
                    variant="outline"
                    className="w-full justify-center"
                    size="lg"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open in New Tab
                  </Button>

                  <Button 
                    onClick={() => handleManualOpen(localChatbotUrl)}
                    variant="outline"
                    className="w-full justify-center"
                    size="lg"
                  >
                    <Bot className="h-4 w-4 mr-2" />
                    NavRakshak Portal
                  </Button>

                  <Button 
                    onClick={() => handleManualOpen(chatbotUrl, '_self')}
                    variant="ghost"
                    className="w-full justify-center"
                    size="lg"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Direct Navigation
                  </Button>
                </div>

                {/* Info Section */}
                <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    🤖 What can the AI Assistant help with?
                  </h3>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <li>• Emergency assistance and safety protocols</li>
                    <li>• Real-time location-based travel information</li>
                    <li>• Weather updates and crowd conditions</li>
                    <li>• Tourist attractions and route planning</li>
                    <li>• Multilingual support (10+ Indian languages)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}