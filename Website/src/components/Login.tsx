import React, { useState } from 'react'
import { Shield, Sun, Moon, User, Users } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { ImageWithFallback } from './figma/ImageWithFallback'

interface LoginProps {
  onLogin: (userType: 'tourist' | 'authority') => void
  isDark: boolean
  setIsDark: (dark: boolean) => void
}

export function Login({ onLogin, isDark, setIsDark }: LoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (userType: 'tourist' | 'authority') => {
    onLogin(userType)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="flex justify-between items-center">
          <div></div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDark(!isDark)}
            className="rounded-full hover:bg-white/20 dark:hover:bg-black/20 transition-all duration-300"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>

        <div className="text-center space-y-6">
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-lg opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-green-400 to-blue-500 p-4 rounded-full shadow-2xl">
                <Shield className="h-12 w-12 text-white" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent font-bold text-4xl tracking-tight">
              NavRakshak
            </h1>
            <p className="text-muted-foreground text-lg">
              Smart Tourist Safety Monitoring System
            </p>
            <div className="flex items-center justify-center space-x-1 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Secure • Reliable • Real-time</span>
            </div>
          </div>
        </div>

        <Tabs defaultValue="tourist" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 shadow-lg">
            <TabsTrigger 
              value="tourist" 
              className="flex items-center space-x-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all duration-300"
            >
              <User className="h-4 w-4" />
              <span>Tourist</span>
            </TabsTrigger>
            <TabsTrigger 
              value="authority" 
              className="flex items-center space-x-2 data-[state=active]:bg-green-500 data-[state=active]:text-white transition-all duration-300"
            >
              <Users className="h-4 w-4" />
              <span>Authority</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="tourist" className="mt-6">
            <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-white/30 dark:border-slate-700/50 shadow-2xl">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Tourist Login</CardTitle>
                    <CardDescription className="text-sm">
                      Access your digital ID and safety features
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="tourist-email" className="text-sm font-medium">Email Address</Label>
                  <Input
                    id="tourist-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 bg-white/50 dark:bg-slate-700/50 border-gray-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tourist-password" className="text-sm font-medium">Password</Label>
                  <Input
                    id="tourist-password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 bg-white/50 dark:bg-slate-700/50 border-gray-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                  />
                </div>
                <div className="space-y-3 pt-2">
                  <Button 
                    onClick={() => handleLogin('tourist')} 
                    className="w-full h-11 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Login as Tourist
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full h-11 border-2 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                  >
                    Register New Tourist
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="authority" className="mt-6">
            <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-white/30 dark:border-slate-700/50 shadow-2xl">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Authority Login</CardTitle>
                    <CardDescription className="text-sm">
                      Tourism Department & Police Dashboard
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="authority-email" className="text-sm font-medium">Official Email</Label>
                  <Input
                    id="authority-email"
                    type="email"
                    placeholder="Enter official email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 bg-white/50 dark:bg-slate-700/50 border-gray-200 dark:border-slate-600 focus:border-green-500 dark:focus:border-green-400 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="authority-password" className="text-sm font-medium">Secure Password</Label>
                  <Input
                    id="authority-password"
                    type="password"
                    placeholder="Enter secure password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 bg-white/50 dark:bg-slate-700/50 border-gray-200 dark:border-slate-600 focus:border-green-500 dark:focus:border-green-400 transition-colors"
                  />
                </div>
                <div className="pt-2">
                  <Button 
                    onClick={() => handleLogin('authority')} 
                    className="w-full h-11 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Login as Authority
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}