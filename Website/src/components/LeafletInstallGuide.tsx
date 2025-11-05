import React, { useState } from 'react'
import { 
  Download, MapPin, CheckCircle, AlertCircle, 
  ExternalLink, Code, Terminal, Copy 
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Alert, AlertDescription } from './ui/alert'
import { toast } from 'sonner@2.0.3'

interface LeafletInstallGuideProps {
  onClose?: () => void
}

export function LeafletInstallGuide({ onClose }: LeafletInstallGuideProps) {
  const [copiedStep, setCopiedStep] = useState<number | null>(null)

  const installSteps = [
    {
      title: "Install Leaflet Core",
      command: "npm install leaflet @types/leaflet",
      description: "Core Leaflet library with TypeScript support"
    },
    {
      title: "Install React-Leaflet",
      command: "npm install react-leaflet",
      description: "React components for Leaflet integration"
    },
    {
      title: "Import CSS (optional)",
      command: 'import "leaflet/dist/leaflet.css"',
      description: "Add to your main CSS or index file"
    }
  ]

  const copyToClipboard = async (text: string, stepIndex: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedStep(stepIndex)
      toast.success('Copied to clipboard!')
      setTimeout(() => setCopiedStep(null), 2000)
    } catch (error) {
      toast.error('Failed to copy to clipboard')
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <MapPin className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <CardTitle>Enable Full Interactive Maps</CardTitle>
              <p className="text-sm text-muted-foreground">
                Upgrade to Leaflet for enhanced mapping features
              </p>
            </div>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Benefits */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            Benefits of Full Leaflet Integration
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm">Real-time GPS tracking</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm">Interactive geofence zones</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm">Detailed popup information</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm">Street-level map tiles</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm">Smooth zoom & pan controls</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm">Custom marker styling</span>
            </div>
          </div>
        </div>

        {/* Current Status */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Current Status:</strong> Using fallback visualization mode. 
            NavRakshak is fully functional but with limited map interactivity.
          </AlertDescription>
        </Alert>

        {/* Installation Steps */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center">
            <Terminal className="h-5 w-5 text-blue-500 mr-2" />
            Installation Steps
          </h3>
          <div className="space-y-3">
            {installSteps.map((step, index) => (
              <div key={index} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">{index + 1}</Badge>
                    <span className="font-medium">{step.title}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(step.command, index)}
                    className="h-8 px-2"
                  >
                    {copiedStep === index ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <div className="bg-black/80 text-green-400 p-3 rounded font-mono text-sm mb-2">
                  {step.command}
                </div>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Setup */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2 flex items-center">
            <Code className="h-4 w-4 mr-2" />
            Quick Setup (All-in-one)
          </h4>
          <div className="bg-black/80 text-green-400 p-3 rounded font-mono text-sm mb-3">
            npm install leaflet @types/leaflet react-leaflet
          </div>
          <p className="text-sm text-blue-600 dark:text-blue-400">
            After installation, refresh the page to automatically enable full map features.
          </p>
        </div>

        {/* External Resources */}
        <div>
          <h3 className="font-semibold mb-3">Additional Resources</h3>
          <div className="space-y-2">
            <a 
              href="https://leafletjs.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Leaflet Official Documentation</span>
            </a>
            <a 
              href="https://react-leaflet.js.org/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm"
            >
              <ExternalLink className="h-4 w-4" />
              <span>React-Leaflet Documentation</span>
            </a>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4 border-t">
          <Button 
            onClick={() => window.location.reload()} 
            className="flex-1"
          >
            <Download className="h-4 w-4 mr-2" />
            I've Installed - Refresh Page
          </Button>
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Continue with Current Mode
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}