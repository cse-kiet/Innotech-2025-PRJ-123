class="relative mb-6">
                                    <div class="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-full mx-auto w-fit">
                                        <i data-lucide="message-circle" class="h-8 w-8 text-white"></i>
                                    </div>
                                </div>
                                
                                <h2 class="text-2xl font-bold mb-4">Access NavRakshak AI Assistant</h2>
                                <p class="text-muted-foreground mb-6">
                                    Choose your preferred way to access the chatbot
                                    ${query ? `<br><span class="text-sm font-medium text-blue-600 dark:text-blue-400 mt-2 block">Search: "${query}"</span>` : ''}
                                </p>

                                <div class="space-y-4">
                                    <button onclick="window.open('${chatbotUrl}', '_blank')" class="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-all">
                                        <i data-lucide="external-link" class="h-4 w-4"></i>
                                        <span>Open in New Tab (Recommended)</span>
                                    </button>

                                    <button onclick="window.open('${chatbotUrl}', 'navrakshak-chat', 'width=800,height=600,scrollbars=yes,resizable=yes')" class="w-full border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 px-6 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-all">
                                        <i data-lucide="message-circle" class="h-4 w-4"></i>
                                        <span>Open in Popup Window</span>
                                    </button>

                                    <button onclick="window.open('chatbot.html${query ? `?query=${encodeURIComponent(query)}` : ''}', '_blank')" class="w-full border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 px-6 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-all">
                                        <i data-lucide="bot" class="h-4 w-4"></i>
                                        <span>NavRakshak Portal</span>
                                    </button>
                                </div>

                                <p class="text-sm text-muted-foreground mt-4 flex items-center justify-center space-x-2">
                                    <i data-lucide="shield" class="h-4 w-4"></i>
                                    <span>Secure external chatbot connection</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            chatbotContent.innerHTML = fallbackHtml;
            
            // Re-bind the back button
            const newBackBtn = document.getElementById('chatBackBtn');
            if (newBackBtn) {
                newBackBtn.addEventListener('click', () => {
                    this.handleTabChange('dashboard');
                });
            }
            
            // Re-initialize icons
            this.initializeLucideIcons();
        }
    }

    openChatbotInNewWindow(chatbotUrl) {
        window.open(chatbotUrl, '_blank', 'noopener,noreferrer');
        this.showNotification('Opening AI Assistant in new window', 'info');
    }



    bindEmergencyContacts() {
        const emergencyContacts = document.querySelectorAll('.emergency-contact');
        emergencyContacts.forEach(contact => {
            contact.addEventListener('click', (e) => {
                const number = e.currentTarget.getAttribute('data-number');
                const service = e.currentTarget.getAttribute('data-service');
                this.callEmergency(number, service);
            });
        });
    }

    callEmergency(number, service) {
        this.showNotification(`Calling ${service} (${number})...`, 'info');
        
        // In a real app, this would initiate a phone call
        console.log(`📞 Calling ${service} at ${number}`);
        
        // Simulate call being placed
        setTimeout(() => {
            this.showNotification(`Connected to ${service}`, 'success');
        }, 2000);
    }

    startRealTimeUpdates() {
        // Update safety score periodically
        setInterval(() => {
            if (this.isLoggedIn && this.userType === 'tourist') {
                // Update safety score with small variations
                const variation = Math.floor(Math.random() * 6) - 3; // -3 to +3
                this.safetyScore = Math.max(70, Math.min(95, this.safetyScore + variation));
                this.updateSafetyScoreDisplay();
                
                // Update active users count
                this.activeUsersCount += Math.floor(Math.random() * 10) - 5;
                this.updateActiveUsersDisplay();
            }
        }, 30000); // Update every 30 seconds

        // Reinitialize icons periodically
        setInterval(() => {
            this.initializeLucideIcons();
        }, 5000);
    }

    updateSafetyScoreDisplay() {
        const scoreValue = document.getElementById('safetyScoreValue');
        const scoreBar = document.getElementById('safetyScoreBar');
        
        if (scoreValue) {
            scoreValue.textContent = `${this.safetyScore}/100`;
        }
        
        if (scoreBar) {
            scoreBar.style.width = `${this.safetyScore}%`;
        }
    }

    updateActiveUsersDisplay() {
        const activeUsersCount = document.getElementById('activeUsersCount');
        if (activeUsersCount) {
            activeUsersCount.textContent = `${this.activeUsersCount.toLocaleString()} Active`;
        }
    }

    showNotification(message, type = 'info') {
        const colors = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            warning: 'bg-yellow-500',
            info: 'bg-blue-500'
        };

        const icons = {
            success: '✓',
            error: '✗',
            warning: '⚠',
            info: 'ℹ'
        };

        const notificationHtml = `
            <div class="notification fixed top-4 left-4 ${colors[type]} text-white p-3 rounded-lg shadow-lg z-50 max-w-xs transform transition-all duration-300">
                <div class="flex items-center space-x-2">
                    <span class="font-bold">${icons[type]}</span>
                    <p class="text-sm">${message}</p>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', notificationHtml);

        // Auto remove after 3 seconds with slide out animation
        setTimeout(() => {
            const notifications = document.querySelectorAll('.notification');
            if (notifications.length > 0) {
                const notification = notifications[0];
                notification.style.transform = 'translateX(-100%)';
                notification.style.opacity = '0';
                setTimeout(() => notification.remove(), 300);
            }
        }, 3000);
    }

    // Simulate geofence alerts
    simulateGeofenceAlert(zoneType, zoneName) {
        const alerts = {
            'safe': `Entered safe zone: ${zoneName}`,
            'caution': `Caution: Approaching ${zoneName}`,
            'danger': `Warning: Entering restricted area ${zoneName}`,
            'emergency': `Emergency zone detected: ${zoneName}`
        };

        this.showNotification(
            alerts[zoneType] || `Zone alert: ${zoneName}`, 
            zoneType === 'danger' ? 'error' : 
            zoneType === 'caution' ? 'warning' : 'info'
        );
    }

    // Environmental data simulation
    updateEnvironmentalData() {
        const weatherData = {
            temperature: '22°C',
            condition: 'Clear',
            windSpeed: '12 km/h',
            humidity: '65%',
            uvIndex: '3 (Moderate)'
        };

        console.log('🌤️ Weather update:', weatherData);
        return weatherData;
    }

    // Tourism data simulation
    updateTourismData() {
        const tourismData = {
            activeUsers: this.activeUsersCount,
            nearbyAttractions: 4,
            emergencyServices: '24/7 Support',
            crowdLevel: 'Moderate'
        };

        console.log('🏛️ Tourism data:', tourismData);
        return tourismData;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🛡️ NavRakshak Smart Tourist Safety System Initialized');
    
    // Create global app instance
    window.navRakshakApp = new NavRakshakApp();
    
    // Simulate some initial data updates
    setTimeout(() => {
        window.navRakshakApp.updateEnvironmentalData();
        window.navRakshakApp.updateTourismData();
    }, 2000);
    
    // Simulate geofence alerts for demonstration
    setTimeout(() => {
        window.navRakshakApp.simulateGeofenceAlert('safe', 'Police Bazaar');
    }, 8000);
    
    setTimeout(() => {
        window.navRakshakApp.simulateGeofenceAlert('caution', 'Construction Zone');
    }, 15000);
});

// Handle window events
window.addEventListener('online', () => {
    console.log('🌐 Connection restored');
    if (window.navRakshakApp) {
        window.navRakshakApp.showNotification('Connection restored', 'success');
    }
});

window.addEventListener('offline', () => {
    console.log('📵 Connection lost');
    if (window.navRakshakApp) {
        window.navRakshakApp.showNotification('Connection lost - Operating in offline mode', 'warning');
    }
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NavRakshakApp;
}