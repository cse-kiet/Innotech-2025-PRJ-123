import React, { useState } from 'react'
import { Header } from './components/Header'
import { TouristDashboard } from './components/TouristDashboard'
import { Maps } from './components/Maps'
import { ExternalChatbot } from './components/ExternalChatbot'
import { ChatbotWindow } from './components/ChatbotWindow'
import { DigitalID } from './components/DigitalID'
import { EmergencyPanel } from './components/EmergencyPanel'
import { AuthorityDashboard } from './components/AuthorityDashboard'
import { Settings } from './components/Settings'
import { Login } from './components/Login'
import { EmergencyButton } from './components/EmergencyButton'

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isDark, setIsDark] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userType, setUserType] = useState<'tourist' | 'authority'>('tourist')
  const [searchQuery, setSearchQuery] = useState('')

  const handleGlobalEmergency = () => {
    handleTabChange('emergency')
    // Trigger emergency alert
  }

  const handleSearchActivate = (query: string) => {
    setSearchQuery(query)
  }

  // Reset search query when leaving chatbot
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    if (tab !== 'chatbot') {
      setSearchQuery('')
    }
  }

  const handleNavigateToChat = () => {
    setActiveTab('chatbot')
  }

  if (!isLoggedIn) {
    return (
      <div className={isDark ? 'dark' : ''}>
        <div className="min-h-screen bg-background">
          <Login 
            onLogin={(type) => {
              setIsLoggedIn(true)
              setUserType(type)
            }} 
            isDark={isDark}
            setIsDark={setIsDark}
          />
        </div>
      </div>
    )
  }

  const renderContent = () => {
    if (userType === 'authority') {
      return <AuthorityDashboard />
    }

    switch (activeTab) {
      case 'dashboard':
        return <TouristDashboard onNavigateToChat={handleNavigateToChat} />
      case 'maps':
        return <Maps userType={userType} />
      case 'chatbot':
        return <ChatbotWindow onBack={() => handleTabChange('dashboard')} initialQuery={searchQuery} />
      case 'id':
        return <DigitalID />
      case 'emergency':
        return <EmergencyPanel />
      case 'settings':
        return <Settings isDark={isDark} setIsDark={setIsDark} />
      default:
        return <TouristDashboard onNavigateToChat={handleNavigateToChat} />
    }
  }

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 text-foreground relative overflow-hidden">
        {/* Background Effects */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-grid-pattern opacity-40"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/5 via-purple-400/5 to-indigo-400/5"></div>
        </div>

        {/* Floating Elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className="absolute w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 2}s`,
                animationDuration: `${10 + i * 2}s`
              }}
            />
          ))}
        </div>
        
        {/* Show header only if not in chatbot mode */}
        {activeTab !== 'chatbot' && (
          <Header 
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            userType={userType}
            onLogout={() => setIsLoggedIn(false)}
            onSearchActivate={handleSearchActivate}
          />
        )}
        
        {/* Main content */}
        {activeTab === 'chatbot' ? (
          renderContent()
        ) : (
          <main className="container mx-auto px-4 py-6 relative z-10">
            <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/30 shadow-2xl p-6 min-h-[70vh]">
              {renderContent()}
            </div>
          </main>
        )}

        {/* Global Floating Emergency Button for Tourists */}
        {userType === 'tourist' && activeTab !== 'emergency' && activeTab !== 'chatbot' && (
          <EmergencyButton 
            onClick={handleGlobalEmergency}
            className="fixed bottom-6 right-6 z-50 shadow-2xl hover:shadow-3xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transform hover:scale-110 transition-all duration-300"
            size="lg"
          />
        )}
      </div>
    </div>
  )
}