import React, { useState } from 'react'
import { Sun, Moon, Globe, Bell, Shield, User, Phone, MapPin, Languages } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Switch } from './ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Separator } from './ui/separator'
import { ImageWithFallback } from './figma/ImageWithFallback'

interface SettingsProps {
  isDark: boolean
  setIsDark: (dark: boolean) => void
}

export function Settings({ isDark, setIsDark }: SettingsProps) {
  const [settings, setSettings] = useState({
    notifications: true,
    locationTracking: true,
    emergencySharing: true,
    language: 'english',
    voiceAlerts: false,
    autoCheckIn: true,
  })

  const languages = [
    { value: 'english', label: 'English', flag: '🇺🇸' },
    { value: 'hindi', label: 'हिंदी (Hindi)', flag: '🇮🇳' },
    { value: 'bengali', label: 'বাংলা (Bengali)', flag: '🇧🇩' },
    { value: 'assamese', label: 'অসমীয়া (Assamese)', flag: '🇮🇳' },
    { value: 'gujarati', label: 'ગુજરાતી (Gujarati)', flag: '🇮🇳' },
    { value: 'tamil', label: 'தமிழ் (Tamil)', flag: '🇮🇳' },
    { value: 'telugu', label: 'తెలుగు (Telugu)', flag: '🇮🇳' },
    { value: 'marathi', label: 'मराठी (Marathi)', flag: '🇮🇳' },
    { value: 'punjabi', label: 'ਪੰਜਾਬੀ (Punjabi)', flag: '🇮🇳' },
    { value: 'urdu', label: 'اردو (Urdu)', flag: '🇵🇰' },
  ]

  const updateSetting = (key: string, value: boolean | string) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-6">
      {/* Language & Accessibility */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Languages className="h-5 w-5 text-blue-500" />
            <span>Language & Accessibility</span>
          </CardTitle>
          <CardDescription>
            Multilingual support for better accessibility
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="relative w-full h-32 rounded-lg overflow-hidden mb-4">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1654839776224-a8d8a849b1e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdWx0aWxpbmd1YWwlMjB0cmFuc2xhdGlvbnxlbnwxfHx8fDE3NTcwNzcxNjJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Multilingual Translation"
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="language-select">App Language</Label>
            <Select
              value={settings.language}
              onValueChange={(value) => updateSetting('language', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    <div className="flex items-center space-x-2">
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Voice Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Enable voice-based emergency instructions
              </p>
            </div>
            <Switch
              checked={settings.voiceAlerts}
              onCheckedChange={(checked) => updateSetting('voiceAlerts', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sun className="h-5 w-5 text-yellow-500" />
            <span>Appearance</span>
          </CardTitle>
          <CardDescription>
            Customize the app appearance and theme
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Dark Mode</Label>
              <p className="text-sm text-muted-foreground">
                Toggle between light and dark theme
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Sun className="h-4 w-4" />
              <Switch
                checked={isDark}
                onCheckedChange={setIsDark}
              />
              <Moon className="h-4 w-4" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-green-500" />
            <span>Privacy & Security</span>
          </CardTitle>
          <CardDescription>
            Control your data and privacy settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Location Tracking</Label>
              <p className="text-sm text-muted-foreground">
                Allow real-time location monitoring for safety
              </p>
            </div>
            <Switch
              checked={settings.locationTracking}
              onCheckedChange={(checked) => updateSetting('locationTracking', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Emergency Sharing</Label>
              <p className="text-sm text-muted-foreground">
                Share location with emergency contacts during alerts
              </p>
            </div>
            <Switch
              checked={settings.emergencySharing}
              onCheckedChange={(checked) => updateSetting('emergencySharing', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Auto Check-in</Label>
              <p className="text-sm text-muted-foreground">
                Automatically check-in at popular tourist destinations
              </p>
            </div>
            <Switch
              checked={settings.autoCheckIn}
              onCheckedChange={(checked) => updateSetting('autoCheckIn', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-orange-500" />
            <span>Notifications</span>
          </CardTitle>
          <CardDescription>
            Manage alert and notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Push Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive safety alerts and updates
              </p>
            </div>
            <Switch
              checked={settings.notifications}
              onCheckedChange={(checked) => updateSetting('notifications', checked)}
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <Label>Notification Types</Label>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Safety Alerts</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Zone Warnings</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Weather Updates</span>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Tourist Information</span>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contacts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Phone className="h-5 w-5 text-red-500" />
            <span>Emergency Contacts</span>
          </CardTitle>
          <CardDescription>
            Manage your emergency contact information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="primary-contact">Primary Contact</Label>
            <Input
              id="primary-contact"
              placeholder="+91 98765 43210"
              defaultValue="+91 98765 43210"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="secondary-contact">Secondary Contact</Label>
            <Input
              id="secondary-contact"
              placeholder="+91 98765 43211"
              defaultValue="+91 87654 32109"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="medical-info">Medical Information (Optional)</Label>
            <Input
              id="medical-info"
              placeholder="Any allergies or medical conditions"
            />
          </div>

          <Button className="w-full">
            Update Emergency Contacts
          </Button>
        </CardContent>
      </Card>

      {/* Data & Privacy */}
      <Card>
        <CardHeader>
          <CardTitle>Data & Privacy</CardTitle>
          <CardDescription>
            Manage your data and understand our privacy practices
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="justify-start">
              <User className="h-4 w-4 mr-2" />
              Export My Data
            </Button>
            <Button variant="outline" className="justify-start">
              <Shield className="h-4 w-4 mr-2" />
              Privacy Policy
            </Button>
          </div>
          
          <Separator />
          
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              NavRakshak is committed to protecting your privacy and ensuring data security.
            </p>
            <p className="text-xs text-muted-foreground">
              Version 1.0.0 • Last updated: January 2024
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}