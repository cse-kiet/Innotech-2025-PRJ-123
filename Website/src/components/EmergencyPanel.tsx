import React, { useState } from 'react'
import { AlertTriangle, Phone, MapPin, Clock, Zap, Users, MessageSquare } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Alert, AlertDescription } from './ui/alert'
import { ImageWithFallback } from './figma/ImageWithFallback'

export function EmergencyPanel() {
  const [emergencyActive, setEmergencyActive] = useState(false)
  const [emergencyType, setEmergencyType] = useState<string | null>(null)

  const emergencyTypes = [
    { id: 'medical', label: 'Medical Emergency', icon: '🏥', color: 'bg-red-500' },
    { id: 'police', label: 'Police Assistance', icon: '🚔', color: 'bg-blue-500' },
    { id: 'fire', label: 'Fire Emergency', icon: '🚒', color: 'bg-orange-500' },
    { id: 'lost', label: 'Lost/Stranded', icon: '🗺️', color: 'bg-purple-500' },
  ]

  const emergencyContacts = [
    { name: 'Police Control Room', number: '100', type: 'police' },
    { name: 'Ambulance', number: '108', type: 'medical' },
    { name: 'Fire Brigade', number: '101', type: 'fire' },
    { name: 'Tourist Helpline', number: '1363', type: 'tourism' },
  ]

  const handleEmergency = (type: string) => {
    setEmergencyType(type)
    setEmergencyActive(true)
    // In a real app, this would trigger location sharing and alerts
  }

  const handlePanicButton = () => {
    setEmergencyActive(true)
    setEmergencyType('panic')
    // Trigger immediate emergency alert
  }

  if (emergencyActive) {
    return (
      <div className="space-y-6">
        <Alert className="border-red-500 bg-red-50 dark:bg-red-900/20">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-700 dark:text-red-300">
            Emergency alert activated! Your location has been shared with authorities and emergency contacts.
          </AlertDescription>
        </Alert>

        <Card className="border-red-500">
          <CardHeader className="bg-red-50 dark:bg-red-900/20">
            <CardTitle className="text-red-700 dark:text-red-300 flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Emergency Active</span>
            </CardTitle>
            <CardDescription>
              Response team has been notified. Help is on the way.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="text-center space-y-4">
              <div className="text-6xl">{emergencyType === 'panic' ? '🆘' : '🚨'}</div>
              <h3 className="text-xl font-semibold">
                {emergencyType === 'panic' ? 'Panic Button Activated' : `${emergencyType} Emergency`}
              </h3>
              <p className="text-muted-foreground">
                Emergency services have been contacted. Stay calm and follow their instructions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin className="h-4 w-4 text-green-500" />
                  <span className="font-medium">Location Shared</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your exact coordinates have been sent to emergency responders
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">Contacts Notified</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Emergency contacts and family have been alerted
                </p>
              </div>
            </div>

            <div className="flex space-x-4 mt-6">
              <Button 
                variant="destructive" 
                className="flex-1"
                onClick={() => setEmergencyActive(false)}
              >
                Cancel Emergency
              </Button>
              <Button variant="outline" className="flex-1">
                Update Status
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Main Emergency Button */}
      <Card className="border-red-500 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30">
        <CardContent className="p-8 text-center space-y-6">
          <div className="relative mx-auto w-32 h-32 mb-6">
            <div className="absolute inset-0 bg-red-500 rounded-full animate-pulse"></div>
            <div className="absolute inset-2 bg-red-600 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-16 w-16 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 h-8 w-8 bg-red-400 rounded-full animate-ping"></div>
          </div>
          
          <h2 className="text-3xl font-bold text-red-700 dark:text-red-300">EMERGENCY SOS</h2>
          <p className="text-lg text-red-600 dark:text-red-400 max-w-md mx-auto">
            Tap the button below for immediate emergency assistance. Your location will be shared instantly with authorities.
          </p>
          
          <Button 
            size="lg" 
            className="bg-red-600 hover:bg-red-700 text-white w-full h-20 text-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            onClick={handlePanicButton}
          >
            <AlertTriangle className="h-8 w-8 mr-3" />
            ACTIVATE EMERGENCY ALERT
          </Button>
          
          <p className="text-sm text-muted-foreground">
            This will immediately notify emergency services, tourism authorities, and your emergency contacts
          </p>
        </CardContent>
      </Card>

      {/* Quick Emergency Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-red-700 dark:text-red-300">Quick Emergency Actions</CardTitle>
          <CardDescription>
            Tap for specific emergency assistance with faster response
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {emergencyTypes.map((type) => (
              <Button
                key={type.id}
                variant="outline"
                className={`h-24 flex flex-col items-center justify-center space-y-2 hover:scale-105 transition-all duration-200 border-2 ${type.color} text-white hover:shadow-lg`}
                onClick={() => handleEmergency(type.id)}
              >
                <span className="text-3xl">{type.icon}</span>
                <span className="font-semibold">{type.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contacts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Phone className="h-5 w-5 text-green-500" />
            <span>Emergency Hotlines</span>
          </CardTitle>
          <CardDescription>One-tap calling to emergency services</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {emergencyContacts.map((contact, index) => (
            <Button
              key={index}
              variant="outline"
              className="w-full h-16 flex items-center justify-between p-4 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className={`h-4 w-4 rounded-full ${
                  contact.type === 'police' ? 'bg-blue-500' :
                  contact.type === 'medical' ? 'bg-red-500' :
                  contact.type === 'fire' ? 'bg-orange-500' : 'bg-green-500'
                }`} />
                <div className="text-left">
                  <div className="font-semibold">{contact.name}</div>
                  <div className="text-sm text-muted-foreground capitalize">{contact.type} service</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge variant="default" className="bg-green-600 text-white">
                  {contact.number}
                </Badge>
                <Phone className="h-5 w-5 text-green-600" />
              </div>
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Safety Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Safety Guidelines</CardTitle>
          <CardDescription>Important emergency procedures</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="h-2 w-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm">Stay calm and assess the situation before taking action</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="h-2 w-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm">Share your location with trusted contacts when traveling</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="h-2 w-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm">Keep emergency numbers saved and easily accessible</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="h-2 w-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm">Follow local safety guidelines and avoid high-risk areas</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}