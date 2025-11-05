import React from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from './ui/button'

interface EmergencyButtonProps {
  onClick: () => void
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function EmergencyButton({ onClick, className = '', size = 'lg' }: EmergencyButtonProps) {
  const sizeClasses = {
    sm: 'h-10 w-10',
    md: 'h-12 w-12',
    lg: 'h-14 w-14'
  }

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5', 
    lg: 'h-7 w-7'
  }

  return (
    <div className={`relative ${className}`}>
      <Button
        size="lg"
        className={`${sizeClasses[size]} rounded-full bg-red-600 hover:bg-red-700 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 animate-pulse`}
        onClick={onClick}
      >
        <AlertTriangle className={iconSizes[size]} />
      </Button>
      <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full animate-ping"></div>
    </div>
  )
}