// NavRakshak Smart Tourist Safety System - JavaScript
// Complete implementation matching React App.tsx functionality

class NavRakshakApp {
    constructor() {
        // State management matching React state
        this.activeTab = 'dashboard';
        this.isDark = false;
        this.isLoggedIn = false;
        this.userType = 'tourist'; // 'tourist' | 'authority'
        this.searchQuery = '';
        this.safetyScore = 85;
        this.isTracking = true;
        this.currentLocation = 'Shillong, Meghalaya';
        this.activeUsersCount = 1253;
        
        // Initialize the application
        this.init();
    }

    init() {
        // Initialize Lucide icons
        this.initializeLucideIcons();
        
        // Setup dark mode from localStorage
        this.setupDarkMode();
        
        // Bind all event listeners
        this.bindEvents();
        
        // Show login screen initially
        this.showLogin();
        
        // Start real-time updates when logged in
        this.startRealTimeUpdates();
        
        // Initialize icons after DOM is ready
        setTimeout(() => {
            this.initializeLucideIcons();
        }, 100);
    }

    initializeLucideIcons() {
        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    setupDarkMode() {
        // Check for saved dark mode preference
        const savedDarkMode = localStorage.getItem('navrakshak-dark-mode') === 'true';
        this.isDark = savedDarkMode;
        this.applyDarkMode();
    }

    toggleDarkMode() {
        this.isDark = !this.isDark;
        this.applyDarkMode();
        localStorage.setItem('navrakshak-dark-mode', this.isDark);
        
        // Update settings toggle if visible
        this.updateSettingsDarkModeToggle();
    }

    applyDarkMode() {
        if (this.isDark) {
            document.documentElement.classList.add('dark');
            document.body.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
            document.body.classList.remove('dark');
        }
    }

    updateSettingsDarkModeToggle() {
        const settingsToggle = document.getElementById('settingsDarkModeToggle');
        if (settingsToggle) {
            if (this.isDark) {
                settingsToggle.classList.add('dark');
            } else {
                settingsToggle.classList.remove('dark');
            }
        }
    }

    bindEvents() {
        // Dark mode toggle in login
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', () => {
                this.toggleDarkMode();
            });
        }

        // Settings dark mode toggle
        const settingsDarkModeToggle = document.getElementById('settingsDarkModeToggle');
        if (settingsDarkModeToggle) {
            settingsDarkModeToggle.addEventListener('click', () => {
                this.toggleDarkMode();
            });
        }

        // Login tab switching
        this.bindLoginTabs();

        // Login buttons
        this.bindLoginButtons();

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.handleLogout();
            });
        }

        // Navigation tabs
        this.bindNavigationTabs();

        // Search functionality
        this.bindSearchEvents();

        // Emergency buttons
        this.bindEmergencyButtons();

        // Chat functionality
        this.bindChatEvents();

        // Emergency contact buttons
        this.bindEmergencyContacts();
    }

    bindLoginTabs() {
        const touristTab = document.getElementById('touristTab');
        const authorityTab = document.getElementById('authorityTab');
        const touristContent = document.getElementById('touristContent');
        const authorityContent = document.getElementById('authorityContent');

        if (touristTab && authorityTab) {
            touristTab.addEventListener('click', () => {
                this.switchLoginTab('tourist', touristTab, authorityTab, touristContent, authorityContent);
            });

            authorityTab.addEventListener('click', () => {
                this.switchLoginTab('authority', authorityTab, touristTab, authorityContent, touristContent);
            });
        }
    }

    switchLoginTab(type, activeTab, inactiveTab, activeContent, inactiveContent) {
        // Update tab appearance
        activeTab.classList.add('active');
        inactiveTab.classList.remove('active');

        // Update content
        activeContent.classList.add('active');
        inactiveContent.classList.remove('active');

        // Apply tab-specific styling
        if (type === 'tourist') {
            activeTab.style.background = 'linear-gradient(to right, #3b82f6, #2563eb)';
            activeTab.style.color = 'white';
            inactiveTab.style.background = 'transparent';
            inactiveTab.style.color = 'var(--muted-foreground)';
        } else {
            activeTab.style.background = 'linear-gradient(to right, #22c55e, #16a34a)';
            activeTab.style.color = 'white';
            inactiveTab.style.background = 'transparent';
            inactiveTab.style.color = 'var(--muted-foreground)';
        }
    }

    bindLoginButtons() {
        const touristLogin = document.getElementById('touristLogin');
        const authorityLogin = document.getElementById('authorityLogin');

        if (touristLogin) {
            touristLogin.addEventListener('click', () => {
                this.handleLogin('tourist');
            });
        }

        if (authorityLogin) {
            authorityLogin.addEventListener('click', () => {
                this.handleLogin('authority');
            });
        }
    }

    handleLogin(type) {
        this.isLoggedIn = true;
        this.userType = type;
        this.showMainApp();
        this.updateUserInterface();
        this.showNotification(`Welcome to NavRakshak! Logged in as ${type}`, 'success');
        
        // Re-initialize icons after login
        setTimeout(() => {
            this.initializeLucideIcons();
        }, 100);
    }

    handleLogout() {
        this.isLoggedIn = false;
        this.userType = 'tourist';
        this.activeTab = 'dashboard';
        this.searchQuery = '';
        this.showLogin();
        this.showNotification('Logged out successfully', 'info');
    }

    updateUserInterface() {
        const userTypeLabel = document.getElementById('userTypeLabel');
        const userName = document.getElementById('userName');
        const userInitials = document.getElementById('userInitials');
        const userId = document.getElementById('userId');
        const userBadge = document.getElementById('userBadge');
        const userRating = document.getElementById('userRating');
        const touristNav = document.getElementById('touristNav');
        const locationBanner = document.getElementById('locationBanner');
        const searchSection = document.getElementById('searchSection');

        if (this.userType === 'tourist') {
            if (userTypeLabel) userTypeLabel.textContent = 'Tourist Safety Platform';
            if (userName) userName.textContent = 'John Doe';
            if (userInitials) userInitials.textContent = 'JD';
            if (userId) userId.textContent = 'ID: #TR001';
            if (userBadge) userBadge.textContent = 'VIP';
            if (userRating) userRating.classList.remove('hidden');
            if (touristNav) touristNav.classList.remove('hidden');
            if (locationBanner) locationBanner.classList.remove('hidden');
            if (searchSection) searchSection.classList.remove('hidden');
            
            // Show authority dashboard and hide others
            this.handleTabChange('dashboard');
        } else {
            if (userTypeLabel) userTypeLabel.textContent = 'Authority Control Center';
            if (userName) userName.textContent = 'Admin User';
            if (userInitials) userInitials.textContent = 'AD';
            if (userId) userId.textContent = 'ID: #AU001';
            if (userBadge) userBadge.textContent = 'AUTH';
            if (userRating) userRating.classList.add('hidden');
            if (touristNav) touristNav.classList.add('hidden');
            if (locationBanner) locationBanner.classList.add('hidden');
            if (searchSection) searchSection.classList.add('hidden');
            
            // Show authority dashboard
            this.handleTabChange('authorityDashboard');
        }

        // Update floating emergency button visibility
        this.updateFloatingEmergencyButton();
    }

    showLogin() {
        document.getElementById('loginScreen').classList.remove('hidden');
        document.getElementById('mainApp').classList.add('hidden');
    }

    showMainApp() {
        document.getElementById('loginScreen').classList.add('hidden');
        document.getElementById('mainApp').classList.remove('hidden');
    }

    bindNavigationTabs() {
        const navTabs = document.querySelectorAll('.nav-tab');
        navTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabId = tab.getAttribute('data-tab');
                this.handleTabChange(tabId);
                this.updateActiveNavTab(tab);
            });
        });
    }

    updateActiveNavTab(activeTab) {
        const navTabs = document.querySelectorAll('.nav-tab');
        navTabs.forEach(tab => {
            tab.classList.remove('active');
        });
        activeTab.classList.add('active');
    }

    handleTabChange(tab) {
        // Reset search query when leaving chatbot (matching React logic)
        if (tab !== 'chatbot') {
            this.searchQuery = '';
        }

        this.activeTab = tab;
        this.switchTab(tab);
    }

    switchTab(tabId) {
        // Handle chatbot special case (full screen)
        const header = document.getElementById('header');
        const mainContent = document.getElementById('mainContent');
        
        if (tabId === 'chatbot') {
            // Hide header and main content container for chatbot
            if (header) header.classList.add('hidden');
            if (mainContent) mainContent.classList.add('hidden');
        } else {
            // Show header and main content container for other tabs
            if (header) header.classList.remove('hidden');
            if (mainContent) mainContent.classList.remove('hidden');
        }

        // Hide all tab contents
        const tabContents = document.querySelectorAll('.tab-content');
        tabContents.forEach(content => {
            content.classList.remove('active');
            content.classList.add('hidden');
        });

        // Show active tab content
        let activeContentId = `${tabId}Content`;
        
        // Handle authority dashboard special case
        if (this.userType === 'authority' && tabId === 'dashboard') {
            activeContentId = 'authorityDashboardContent';
        } else if (this.userType === 'authority') {
            activeContentId = 'authorityDashboardContent';
        }

        const activeContent = document.getElementById(activeContentId);
        if (activeContent) {
            activeContent.classList.add('active');
            activeContent.classList.remove('hidden');
        }

        // Update navigation if it exists
        const navTabs = document.querySelectorAll('.nav-tab');
        navTabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.getAttribute('data-tab') === tabId) {
                tab.classList.add('active');
            }
        });

        // Update floating emergency button visibility
        this.updateFloatingEmergencyButton();
    }

    updateFloatingEmergencyButton() {
        const floatingBtn = document.getElementById('floatingEmergencyBtn');
        if (floatingBtn) {
            // Show for tourists, hide for emergency and chatbot tabs
            if (this.userType === 'tourist' && 
                this.activeTab !== 'emergency' && 
                this.activeTab !== 'chatbot') {
                floatingBtn.classList.remove('hidden');
            } else {
                floatingBtn.classList.add('hidden');
            }
        }
    }

    bindSearchEvents() {
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');

        if (searchInput) {
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && searchInput.value.trim()) {
                    this.handleSearchActivate(searchInput.value.trim());
                    searchInput.value = '';
                }
            });
        }

        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                if (searchInput && searchInput.value.trim()) {
                    this.handleSearchActivate(searchInput.value.trim());
                    searchInput.value = '';
                }
            });
        }
    }

    handleSearchActivate(query) {
        this.searchQuery = query;
        this.handleTabChange('chatbot');
        
        // Update chatbot iframe with search query
        setTimeout(() => {
            this.updateChatbotUrl(query);
        }, 500);
    }

    bindEmergencyButtons() {
        const emergencyBtn = document.getElementById('emergencyBtn');
        const floatingEmergencyBtn = document.getElementById('floatingEmergencyBtn');

        if (emergencyBtn) {
            emergencyBtn.addEventListener('click', () => {
                this.handleGlobalEmergency();
            });
        }

        if (floatingEmergencyBtn) {
            floatingEmergencyBtn.addEventListener('click', () => {
                this.handleGlobalEmergency();
            });
        }
    }

    handleGlobalEmergency() {
        this.handleTabChange('emergency');
        this.showEmergencyAlert();
        this.triggerEmergencyResponse();
    }

    showEmergencyAlert() {
        const alertHtml = `
            <div id="emergencyNotification" class="fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-2xl z-50 max-w-sm animate-pulse">
                <div class="flex items-center space-x-3">
                    <svg class="h-6 w-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                    </svg>
                    <div>
                        <h4 class="font-bold">Emergency Alert Activated!</h4>
                        <p class="text-sm">Location shared with authorities</p>
                        <p class="text-xs opacity-90">${this.currentLocation}</p>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', alertHtml);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            const alert = document.getElementById('emergencyNotification');
            if (alert) alert.remove();
        }, 5000);
    }

    triggerEmergencyResponse() {
        console.log('🚨 EMERGENCY ACTIVATED');
        console.log('📍 Location:', this.currentLocation);
        console.log('🆔 User Type:', this.userType);
        console.log('⏰ Time:', new Date().toLocaleString());
        
        // Simulate emergency response sequence
        setTimeout(() => {
            console.log('✅ Emergency alert sent to local authorities');
            this.showNotification('Emergency services notified', 'success');
        }, 1000);

        setTimeout(() => {
            console.log('📍 Location shared with emergency contacts');
            this.showNotification('Location shared with emergency contacts', 'info');
        }, 2000);

        setTimeout(() => {
            console.log('🚑 Response team dispatched');
            this.showNotification('Response team is on the way', 'success');
        }, 3000);
    }

    bindChatEvents() {
        const chatNowBtn = document.getElementById('chatNowBtn');
        const chatBackBtn = document.getElementById('chatBackBtn');

        if (chatNowBtn) {
            chatNowBtn.addEventListener('click', () => {
                this.handleNavigateToChat();
            });
        }

        if (chatBackBtn) {
            chatBackBtn.addEventListener('click', () => {
                this.handleTabChange('dashboard');
            });
        }
    }

    handleNavigateToChat() {
        this.handleTabChange('chatbot');
        // Reset to default chatbot URL
        setTimeout(() => {
            this.updateChatbotUrl();
        }, 100);
    }

    updateChatbotUrl(query = '') {
        const chatbotIframe = document.getElementById('chatbotIframe');
        if (chatbotIframe) {
            const chatbotUrl = query 
                ? `https://sbrtron.xyz/?query=${encodeURIComponent(query)}`
                : 'https://sbrtron.xyz/';
            
            // Try iframe first, fallback to new window if it fails
            chatbotIframe.src = chatbotUrl;
            
            // Set a timeout to check if iframe loads, otherwise show fallback
            setTimeout(() => {
                this.showChatbotFallback(chatbotUrl, query);
            }, 5000);
        } else {
            // No iframe available, open directly
            const chatbotUrl = query 
                ? `https://sbrtron.xyz/?query=${encodeURIComponent(query)}`
                : 'https://sbrtron.xyz/';
            this.openChatbotInNewWindow(chatbotUrl);
        }
    }

    showChatbotFallback(chatbotUrl, query = '') {
        const chatbotContent = document.getElementById('chatbotContent');
        if (chatbotContent) {
            const fallbackHtml = `
                <div class="flex flex-col h-screen relative overflow-hidden">
                    <!-- Header -->
                    <div class="bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b border-white/20 dark:border-gray-700/30 shadow-lg relative z-10 p-4">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-3">
                                <button id="chatBackBtn" class="flex items-center space-x-2 text-muted-foreground hover:text-foreground px-3 py-1 rounded-lg hover:bg-secondary transition-colors">
                                    <i data-lucide="arrow-left" class="h-4 w-4"></i>
                                    <span>Back</span>
                                </button>
                                <div class="flex items-center space-x-3">
                                    <div class="relative bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-full">
                                        <i data-lucide="bot" class="h-6 w-6 text-white"></i>
                                    </div>
                                    <div>
                                        <h3 class="text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">NavRakshak Assistant</h3>
                                        <div class="flex items-center space-x-2">
                                            <span class="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs px-2 py-1 rounded flex items-center space-x-1">
                                                <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                                <span>Ready to Help</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Fallback Content -->
                    <div class="flex-1 relative z-10 p-6">
                        <div class="max-w-2xl mx-auto text-center">
                            <div class="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border border-white/30 dark:border-gray-700/30 shadow-lg rounded-lg p-8">
                                <div class="relative mb-6">
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