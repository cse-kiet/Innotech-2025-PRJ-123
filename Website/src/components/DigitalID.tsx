import React, { useState } from 'react'
import { User, CreditCard, Calendar, MapPin, Phone, QrCode, Download, Share2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Separator } from './ui/separator'
import { ImageWithFallback } from './figma/ImageWithFallback'

export function DigitalID() {
  const [touristData] = useState({
    name: 'Rahul Sharma',
    id: 'NR-2024-001234',
    nationality: 'Indian',
    passport: 'M1234567',
    issueDate: '15 Jan 2024',
    validUntil: '22 Jan 2024',
    entryPoint: 'Lokpriya Gopinath Bordoloi Airport',
    emergencyContact: '+91 98765 43210',
    currentLocation: 'Shillong, Meghalaya',
    status: 'Active'
  })

  const itinerary = [
    { date: '15 Jan', location: 'Guwahati', status: 'completed' },
    { date: '17 Jan', location: 'Shillong', status: 'current' },
    { date: '19 Jan', location: 'Cherrapunji', status: 'planned' },
    { date: '21 Jan', location: 'Kaziranga', status: 'planned' },
  ]

  return (
    <div className="space-y-6">
      {/* Digital ID Card */}
      <Card className="bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1704030459012-bfbe0d55fec6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwaWRlbnRpdHklMjBjYXJkfGVufDF8fHx8MTc1NzA3NzE1Mnww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Digital ID"
                  className="w-16 h-16 rounded-lg object-cover"
                />
              </div>
              <div>
                <h2 className="text-xl font-bold">NavRakshak Digital ID</h2>
                <p className="text-blue-100">Tourist Safety System</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-500 text-white">
              {touristData.status}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback className="bg-white/20 text-white">
                    {touristData.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{touristData.name}</h3>
                  <p className="text-blue-100">ID: {touristData.id}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-4 w-4 text-blue-200" />
                  <span className="text-sm">Passport: {touristData.passport}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-blue-200" />
                  <span className="text-sm">Valid until: {touristData.validUntil}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-blue-200" />
                  <span className="text-sm">Entry: {touristData.entryPoint}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-blue-200" />
                  <span className="text-sm">Emergency: {touristData.emergencyContact}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="bg-white p-4 rounded-lg">
                <QrCode className="h-24 w-24 text-black" />
                <p className="text-black text-xs text-center mt-2">Scan for verification</p>
              </div>
            </div>
          </div>

          <div className="flex space-x-3 mt-6">
            <Button variant="secondary" size="sm" className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Download</span>
            </Button>
            <Button variant="secondary" size="sm" className="flex items-center space-x-2">
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Travel Itinerary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-green-500" />
              <span>Travel Itinerary</span>
            </CardTitle>
            <CardDescription>Planned journey and current status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {itinerary.map((item, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className={`h-3 w-3 rounded-full ${
                    item.status === 'completed' ? 'bg-green-500' :
                    item.status === 'current' ? 'bg-blue-500 animate-pulse' :
                    'bg-gray-300'
                  }`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{item.location}</span>
                      <span className="text-sm text-muted-foreground">{item.date}</span>
                    </div>
                    <Badge 
                      variant={item.status === 'current' ? 'default' : 'outline'} 
                      className="text-xs mt-1"
                    >
                      {item.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Verification & Security */}
        <Card>
          <CardHeader>
            <CardTitle>Security Features</CardTitle>
            <CardDescription>Blockchain-secured identity verification</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center space-x-3">
                <div className="h-3 w-3 bg-green-500 rounded-full" />
                <span className="font-medium">Blockchain Verified</span>
              </div>
              <Badge variant="outline" className="text-green-600">
                Verified
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center space-x-3">
                <div className="h-3 w-3 bg-green-500 rounded-full" />
                <span className="font-medium">KYC Completed</span>
              </div>
              <Badge variant="outline" className="text-green-600">
                Valid
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center space-x-3">
                <div className="h-3 w-3 bg-blue-500 rounded-full animate-pulse" />
                <span className="font-medium">Real-time Tracking</span>
              </div>
              <Badge variant="outline" className="text-blue-600">
                Active
              </Badge>
            </div>

            <Separator />

            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Last updated: {new Date().toLocaleString()}
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Refresh Verification
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}