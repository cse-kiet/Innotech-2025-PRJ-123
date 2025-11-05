// Lex V2 Configuration
const lexConfig = {
    region: 'ap-southeast-2',
    identityPoolId: 'ap-southeast-2:0276c0ac-dd06-4309-8a73-61c406a7ce05',
    botId: 'UZZDM06FUP',
    botAliasId: 'TSTALIASID',
    localeId: 'en_US'
};

// Global variables
let lexClient = null;
let sessionId = 'tourist-session-' + Date.now();
let currentLatitude = null;
let currentLongitude = null;
let locationAvailable = false;
let expectingCoordinates = false;
let currentLanguage = 'en_US';

// Voice variables
let mediaRecorder;
let audioChunks = [];
let isRecording = false;
let speechEnabled = true;
let isVoiceInteraction = false;

// Conversation flow variables
let currentStep = 'language';
let selectedLanguage = null;

// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('welcomeTime').textContent = new Date().toLocaleTimeString();
    initializeLexClient();
    requestLocationNow();
    setTimeout(() => {
        initializeVoice();
    }, 1000);
    
    // Initialize toggle label
    updateToggleLabel();
});

// UPDATED: Toggle button functionality for new button beside mic
function toggleQuickActions() {
    const container = document.getElementById('quickActionsContainer');
    const toggleBtn = document.getElementById('toggleMenuBtn');
    const toggleIcon = document.getElementById('toggleIcon');
    
    if (!container || !toggleBtn || !toggleIcon) return;

    if (container.style.display === 'none') {
        container.style.display = 'block';
        toggleIcon.innerHTML = '▲';
        toggleBtn.title = (selectedLanguage === 'hi_IN') ? 'मेनू छुपाएं' : 'Hide Menu';
        toggleBtn.classList.remove('menu-hidden');
    } else {
        container.style.display = 'none';
        toggleIcon.innerHTML = '▼';
        toggleBtn.title = (selectedLanguage === 'hi_IN') ? 'मेनू दिखाएं' : 'Show Menu';
        toggleBtn.classList.add('menu-hidden');
        
        // Remove any existing home button when hiding menu
        const homeBtn = document.querySelector('.home-button-container');
        if (homeBtn) {
            homeBtn.remove();
        }
    }
}

// Update toggle label based on current language and menu state
function updateToggleLabel() {
    const toggleBtn = document.getElementById('toggleMenuBtn');
    const container = document.getElementById('quickActionsContainer');
    
    if (toggleBtn && container) {
        if (container.style.display === 'none') {
            toggleBtn.title = (selectedLanguage === 'hi_IN') ? 'मेनू दिखाएं' : 'Show Menu';
        } else {
            toggleBtn.title = (selectedLanguage === 'hi_IN') ? 'मेनू छुपाएं' : 'Hide Menu';
        }
    }
}

// ENHANCED: Complete emergency message formatter for ALL message types - English AND Hindi INCLUDING PROFILES
function formatEmergencyMessage(message) {
    // Check if it's any type of emergency/service response (English OR Hindi)
    if (message.includes('Emergency SOS') || 
        message.includes('police station') || 
        message.includes('Nearest hospital') ||
        message.includes('Hospital name is') ||
        message.includes('coordinates are') ||
        message.includes('Location assistance activated') ||
        message.includes('Area safety assessment') ||
        message.includes('Latest safety updates') ||
        message.includes('risk level') ||
        message.includes('safety announcements') ||
        // Hindi patterns
        message.includes('आपातकालीन SOS') ||
        message.includes('पुलिस स्टेशन') ||
        message.includes('निकटतम अस्पताल') ||
        message.includes('अस्पताल का नाम') ||
        message.includes('निर्देशांक') ||
        message.includes('स्थान सहायता') ||
        message.includes('क्षेत्र सुरक्षा मूल्यांकन') ||
        message.includes('नवीनतम सुरक्षा अपडेट') ||
        message.includes('जोखिम स्तर') ||
        message.includes('सुरक्षा घोषणाएं') ||
        // Profile patterns
        message.includes('Digital tourist profile loaded successfully') ||
        message.includes('डिजिटल पर्यटक प्रोफ़ाइल सफलतापूर्वक लोड हो गई')) {
        
        let formatted = message;
        
        // ENGLISH PROFILE FORMATTING
        if (message.includes('Digital tourist profile loaded successfully') || message.includes('Your tourist ID is')) {
            formatted = formatted.replace(/Digital tourist profile loaded successfully/g, '👤 Digital Tourist Profile Loaded Successfully');
            formatted = formatted.replace(/Your tourist ID is ([^\.]+)\./g, '🆔 Tourist ID: $1<br>');
            formatted = formatted.replace(/Name: ([^\.]+)\./g, '👤 Name: $1<br>');
            formatted = formatted.replace(/Phone number: ([^\.]+)\./g, '📱 Phone: $1<br>');
            formatted = formatted.replace(/Email address: ([^\.]+)\./g, '📧 Email: $1<br>');
            formatted = formatted.replace(/Address: ([^\.]+)\./g, '🏠 Address: $1<br>');
            formatted = formatted.replace(/Emergency contact: ([^\.]+)\./g, '🚨 Emergency Contact: $1<br>');
            formatted = formatted.replace(/Status: ([^\.]+)\./g, '✅ Status: $1<br>');
            formatted = formatted.replace(/Show this profile to authorities when requested/g, '<br>⚠️ Show this profile to authorities when requested');
        }
        
        // HINDI PROFILE FORMATTING  
        if (message.includes('डिजिटल पर्यटक प्रोफ़ाइल सफलतापूर्वक लोड हो गई') || message.includes('आपकी पर्यटक आईडी')) {
            formatted = formatted.replace(/डिजिटल पर्यटक प्रोफ़ाइल सफलतापूर्वक लोड हो गई/g, '👤 डिजिटल पर्यटक प्रोफ़ाइल सफलतापूर्वक लोड हुई');
            formatted = formatted.replace(/आपकी पर्यटक आईडी ([^है]+)है/g, '🆔 पर्यटक आईडी: $1<br>');
            formatted = formatted.replace(/नाम: ([^।]+)।/g, '👤 नाम: $1<br>');
            formatted = formatted.replace(/फोन नंबर: ([^।]+)।/g, '📱 फोन नंबर: $1<br>');
            formatted = formatted.replace(/ईमेल पता: ([^।]+)।/g, '📧 ईमेल पता: $1<br>');
            formatted = formatted.replace(/पता: ([^।]+)।/g, '🏠 पता: $1<br>');
            formatted = formatted.replace(/आपातकालीन संपर्क: ([^।]+)।/g, '🚨 आपातकालीन संपर्क: $1<br>');
            formatted = formatted.replace(/स्थिति: ([^।]+)।/g, '✅ स्थिति: $1<br>');
            formatted = formatted.replace(/जब अधिकारी अनुरोध करें तो यह प्रोफ़ाइल दिखाएं/g, '<br>⚠️ जब अधिकारी पूछें तो यह प्रोफाइल दिखाएं');
        }
        
        // HINDI POLICE STATION FORMATTING
        if (message.includes('आपातकालीन SOS') || message.includes('पुलिस स्टेशन')) {
            formatted = formatted.replace(/आपातकालीन SOS अलर्ट भेजा गया!/g, '🚨 आपातकालीन SOS अलर्ट भेजा गया');
            formatted = formatted.replace(/आपका स्थान अधिकारियों के साथ साझा किया गया है/g, '✅ स्थान अधिकारियों के साथ साझा किया गया');
            formatted = formatted.replace(/निकटतम पुलिस स्टेशन ([^है]+)है/g, '🏢 निकटतम पुलिस स्टेशन: $1');
            formatted = formatted.replace(/स्टेशन निर्देशांक ([\d\.,\s]+) हैं और यह आपसे ([\d\.]+) (किलोमीटर) दूर है/g,
                function(match, coords, distance, unit) {
                    const coordParts = coords.trim().split(',');
                    if (coordParts.length === 2) {
                        const lat = coordParts[0].trim();
                        const lon = coordParts[1].trim();
                        const mapUrl = `https://www.google.com/maps?q=${lat},${lon}`;
                        return `🗺 निर्देशांक: <a href="${mapUrl}" target="_blank">${lat}, ${lon} (मैप देखें)</a><br>📏 दूरी: ${distance} ${unit}`;
                    }
                    return `🗺 निर्देशांक: ${coords}<br>📏 दूरी: ${distance} ${unit}`;
                });
            formatted = formatted.replace(/संपर्क नंबर not available है/g, '☎ संपर्क: उपलब्ध नहीं');
            formatted = formatted.replace(/आपातकालीन संपर्क: सभी आपातकाल के लिए (\d+), पुलिस के लिए सीधे (\d+), या पर्यटक हेल्पलाइन के लिए (\d+) पर कॉल करें/g,
                '🚨 आपातकालीन संपर्क:<br>📞 सभी आपातकाल: $1<br>📞 पुलिस: $2<br>📞 पर्यटक हेल्पलाइन: $3');
            formatted = formatted.replace(/मदद आ रही है/g, '🆘 मदद आ रही है');
            formatted = formatted.replace(/शांत रहें और सुरक्षित स्थान पर चले जाएं/g, '⚠️ सुरक्षा सलाह: शांत रहें और सुरक्षित स्थान पर जाएं');
        }
        
        // HINDI HOSPITAL FORMATTING
        if (message.includes('निकटतम अस्पताल') || message.includes('अस्पताल का नाम')) {
            formatted = formatted.replace(/निकटतम अस्पताल मिल गया/g, '🏥 निकटतम अस्पताल मिल गया');
            formatted = formatted.replace(/अस्पताल का नाम ([^है]+)है/g, '🏥 अस्पताल: $1');
            formatted = formatted.replace(/पता ([^है]+)है/g, '📍 पता:<br>$1');
            formatted = formatted.replace(/अस्पताल निर्देशांक ([\d\.,\s]+) हैं और यह आपसे ([\d\.]+) (किलोमीटर) दूर है/g,
                function(match, coords, distance, unit) {
                    const coordParts = coords.trim().split(',');
                    if (coordParts.length === 2) {
                        const lat = coordParts[0].trim();
                        const lon = coordParts[1].trim();
                        const mapUrl = `https://www.google.com/maps?q=${lat},${lon}`;
                        return `🗺 निर्देशांक: <a href="${mapUrl}" target="_blank">${lat}, ${lon} (मैप देखें)</a><br>📏 दूरी: ${distance} ${unit}`;
                    }
                    return `🗺 निर्देशांक: ${coords}<br>📏 दूरी: ${distance} ${unit}`;
                });
            formatted = formatted.replace(/संपर्क नंबर (\d+) है/g, '☎ संपर्क: $1');
            formatted = formatted.replace(/आपातकालीन एम्बुलेंस सेवाएं (\d+) नंबर पर 24\/7 उपलब्ध हैं/g, '🚑 आपातकालीन एम्बुलेंस: $1 (24/7)');
        }
        
        // HINDI SAFETY UPDATES FORMATTING
        if (message.includes('नवीनतम सुरक्षा अपडेट') || message.includes('सुरक्षा घोषणाएं')) {
            formatted = formatted.replace(/नवीनतम सुरक्षा अपडेट उपलब्ध/g, '📢 नवीनतम सुरक्षा अपडेट उपलब्ध');
            formatted = formatted.replace(/वर्तमान में (\d+) सुरक्षा घोषणाएं हैं:/g, '📋 वर्तमान सुरक्षा घोषणाएं: $1<br>');
            
            // Format each update (keeping English content but adding Hindi headers)
            formatted = formatted.replace(/Update (\d+): (\w+) priority - ([^.]+)\./g, function(match, num, priority, title) {
                const priorityIcon = priority === 'HIGH' ? '🔴' : priority === 'MEDIUM' ? '🟡' : '🟢';
                return `<br><br>${priorityIcon} अपडेट ${num}: ${title}`;
            });
            
            // Same English guideline formatting but with Hindi context
            formatted = formatted.replace(/Share location with trusted contacts, avoid isolated areas after dark, trust your instincts, learn basic self-defense, keep emergency contacts readily accessible, and dial (\d+) for Women Helpline/g, 
                '<br>• 📍 विश्वसनीय संपर्कों के साथ स्थान साझा करें<br>• 🌙 अंधेरे के बाद एकांत क्षेत्रों से बचें<br>• 🧠 अपनी सहज बुद्धि पर भरोसा करें<br>• 🥋 बुनियादी आत्मरक्षा सीखें<br>• 📞 आपातकालीन संपर्क तैयार रखें<br>• 🆘 महिला हेल्पलाइन: $1');
            
            formatted = formatted.replace(/Use strong passwords, enable two-factor authentication, avoid clicking suspicious links, do not share OTP with anyone, verify caller identity before sharing personal information, and report cyber crimes to (\d+)/g,
                '<br>• 🔐 मजबूत पासवर्ड उपयोग करें<br>• 🔒 द्विकारक प्रमाणीकरण सक्षम करें<br>• ⛔ संदिग्ध लिंक से बचें<br>• 🚫 OTP साझा न करें<br>• ✅ कॉलर की पहचान सत्यापित करें<br>• 🚨 साइबर अपराध हेल्पलाइन: $1');
            
            formatted = formatted.replace(/Always wear seatbelts\/helmets, follow speed limits, do not drink and drive, avoid mobile phone usage while driving, maintain safe following distance, and use designated pedestrian crossings/g,
                '<br>• 🛡️ हमेशा सीट बेल्ट/हेलमेट पहनें<br>• 🚗 गति सीमा का पालन करें<br>• 🚫 पीकर गाड़ी न चलाएं<br>• 📱 ड्राइविंग के दौरान फोन से बचें<br>• 📏 सुरक्षित दूरी बनाए रखें<br>• 🚶 निर्दिष्ट पैदल पार पथ उपयोग करें');
            
            formatted = formatted.replace(/सतर्क रहें और सभी सुरक्षा दिशानिर्देशों का पालन करें/g, '<br><br>⚡ सतर्क रहें और दिशानिर्देशों का पालन करें');
            formatted = formatted.replace(/आपातकालीन नंबर (\d+) है/g, '<br>🚨 आपातकालीन नंबर: $1');
        }
        
        // HINDI AREA ASSESSMENT FORMATTING
        if (message.includes('क्षेत्र सुरक्षा मूल्यांकन') || message.includes('जोखिम स्तर')) {
            formatted = formatted.replace(/क्षेत्र सुरक्षा मूल्यांकन पूर्ण/g, '🛡️ क्षेत्र सुरक्षा मूल्यांकन पूर्ण');
            formatted = formatted.replace(/आप ([^क्षेत्र]+क्षेत्र) में हैं जिसका जोखिम स्तर (\w+) है/g, '📍 स्थान: $1<br>⚠️ जोखिम स्तर: $2');
            formatted = formatted.replace(/सुरक्षा सिफारिशें:/g, '<br>🔒 सुरक्षा सिफारिशें:');
            formatted = formatted.replace(/⚠️ Exercise extreme caution,/g, '<br>• ⚠️ अत्यधिक सावधानी बरतें');
            formatted = formatted.replace(/🌅 Prefer daylight hours for travel,/g, '<br>• 🌅 यात्रा के लिए दिन के समय को प्राथमिकता दें');
            formatted = formatted.replace(/📱 Keep emergency contacts ready,/g, '<br>• 📱 आपातकालीन संपर्क तैयार रखें');
            formatted = formatted.replace(/💼 Keep valuables secure/g, '<br>• 💼 कीमती सामान सुरक्षित रखें');
            formatted = formatted.replace(/आपातकालीन हेल्पलाइन (\d+) है/g, '<br>🚨 आपातकालीन हेल्पलाइन: $1');
        }
        
        // HINDI LOST WAY FORMATTING
        if (message.includes('स्थान सहायता सक्रिय') || message.includes('अंतिम रिकॉर्ड की गई स्थिति')) {
            formatted = formatted.replace(/स्थान सहायता सक्रिय!/g, '🗺 स्थान सहायता सक्रिय');
            formatted = formatted.replace(/आपकी अंतिम रिकॉर्ड की गई स्थिति ([\d\.,\s]+) पर है/g, function(match, coords) {
                const coordParts = coords.trim().split(',');
                if (coordParts.length === 2) {
                    const lat = coordParts[0].trim();
                    const lon = coordParts[1].trim();
                    const mapUrl = `https://www.google.com/maps?q=${lat},${lon}`;
                    return `📍 आपका स्थान: <a href="${mapUrl}" target="_blank">${lat}, ${lon} (मैप देखें)</a>`;
                }
                return `📍 आपका स्थान: ${coords}`;
            });
            formatted = formatted.replace(/अधिकारियों को आपके स्थान की सूचना दे दी गई है/g, '✅ अधिकारियों को सूचना दी गई');
            formatted = formatted.replace(/पर्यटक हेल्पलाइन (\d+) से संपर्क किया गया है/g, '📞 पर्यटक हेल्पलाइन: $1 (संपर्क किया गया)');
            formatted = formatted.replace(/बिल्कुल वहीं रुकें जहाँ आप हैं/g, '⚠️ बिल्कुल वहीं रुकें जहाँ आप हैं');
            formatted = formatted.replace(/आपके निर्देशांकों पर मदद आ रही है/g, '🆘 मदद आ रही है');
        }
        
        // ENGLISH FORMATTING (keep all existing patterns)
        
        // LOST WAY / LOCATION ASSISTANCE FORMATTING
        if (message.includes('Location assistance activated') || message.includes('last recorded position')) {
            formatted = formatted.replace(/Location assistance activated!/g, '🗺 Location Assistance Activated');
            formatted = formatted.replace(/Your last recorded position is at ([\d\.,\s]+)/g, function(match, coords) {
                const coordParts = coords.trim().split(',');
                if (coordParts.length === 2) {
                    const lat = coordParts[0].trim();
                    const lon = coordParts[1].trim();
                    const mapUrl = `https://www.google.com/maps?q=${lat},${lon}`;
                    return `📍 Your Location: <a href="${mapUrl}" target="_blank">${lat}, ${lon} (View Map)</a>`;
                }
                return `📍 Your Location: ${coords}`;
            });
            formatted = formatted.replace(/Authorities have been notified/g, '✅ Authorities Notified');
            formatted = formatted.replace(/Tourist helpline (\d+) has been contacted/g, '📞 Tourist Helpline: $1 (Contacted)');
            formatted = formatted.replace(/Stay exactly where you are/g, '⚠️ Stay Exactly Where You Are');
            formatted = formatted.replace(/help is on the way to your coordinates/g, '🆘 Help is On the Way');
        }
        
        // RISK ASSESSMENT FORMATTING
        if (message.includes('Area safety assessment') || message.includes('risk level')) {
            formatted = formatted.replace(/Area safety assessment complete/g, '🛡️ Area Safety Assessment Complete');
            formatted = formatted.replace(/You are in the ([^zone]+zone) with risk level (\w+)/g, '📍 Location: $1<br>⚠️ Risk Level: $2');
            formatted = formatted.replace(/Safety recommendations:/g, '<br>🔒 Safety Recommendations:');
            formatted = formatted.replace(/⚠️ Exercise extreme caution,/g, '<br>• ⚠️ Exercise extreme caution');
            formatted = formatted.replace(/🌅 Prefer daylight hours for travel,/g, '<br>• 🌅 Prefer daylight hours for travel');
            formatted = formatted.replace(/📱 Keep emergency contacts ready,/g, '<br>• 📱 Keep emergency contacts ready');
            formatted = formatted.replace(/💼 Keep valuables secure/g, '<br>• 💼 Keep valuables secure');
            formatted = formatted.replace(/Emergency helpline is (\d+)/g, '<br>🚨 Emergency Helpline: $1');
        }
        
        // SAFETY UPDATES FORMATTING
        if (message.includes('Latest safety updates') || message.includes('safety announcements')) {
            formatted = formatted.replace(/Latest safety updates available/g, '📢 Latest Safety Updates Available');
            formatted = formatted.replace(/There are (\d+) current safety announcements:/g, '📋 Current Safety Announcements: $1<br>');
            
            // Format each update
            formatted = formatted.replace(/Update (\d+): (\w+) priority - ([^.]+)\./g, function(match, num, priority, title) {
                const priorityIcon = priority === 'HIGH' ? '🔴' : priority === 'MEDIUM' ? '🟡' : '🟢';
                return `<br><br>${priorityIcon} Update ${num}: ${title}`;
            });
            
            // Format guidelines within updates
            formatted = formatted.replace(/Share location with trusted contacts, avoid isolated areas after dark, trust your instincts, learn basic self-defense, keep emergency contacts readily accessible, and dial (\d+) for Women Helpline/g, 
                '<br>• 📍 Share location with trusted contacts<br>• 🌙 Avoid isolated areas after dark<br>• 🧠 Trust your instincts<br>• 🥋 Learn basic self-defense<br>• 📞 Keep emergency contacts ready<br>• 🆘 Women Helpline: $1');
            
            formatted = formatted.replace(/Use strong passwords, enable two-factor authentication, avoid clicking suspicious links, do not share OTP with anyone, verify caller identity before sharing personal information, and report cyber crimes to (\d+)/g,
                '<br>• 🔐 Use strong passwords<br>• 🔒 Enable two-factor authentication<br>• ⛔ Avoid suspicious links<br>• 🚫 Never share OTP<br>• ✅ Verify caller identity<br>• 🚨 Cyber Crime Helpline: $1');
            
            formatted = formatted.replace(/Always wear seatbelts\/helmets, follow speed limits, do not drink and drive, avoid mobile phone usage while driving, maintain safe following distance, and use designated pedestrian crossings/g,
                '<br>• 🛡️ Always wear seatbelts/helmets<br>• 🚗 Follow speed limits<br>• 🚫 Do not drink and drive<br>• 📱 Avoid phone while driving<br>• 📏 Maintain safe distance<br>• 🚶 Use pedestrian crossings');
            
            formatted = formatted.replace(/Stay alert and follow all safety guidelines/g, '<br><br>⚡ Stay Alert and Follow Guidelines');
            formatted = formatted.replace(/Emergency number is (\d+)/g, '<br>🚨 Emergency Number: $1');
        }
        
        // EXISTING POLICE/HOSPITAL FORMATTING
        formatted = formatted.replace(/\. /g, '.<br><br>');
        
        // Headers and main sections
        formatted = formatted.replace(/Emergency SOS alert sent/g, '🚨 Emergency SOS Alert Sent');
        formatted = formatted.replace(/Nearest hospital found/g, '🏥 Nearest Hospital Found');
        formatted = formatted.replace(/Your location has been shared with authorities/g, 
            '✅ Location Shared with Authorities');
        
        // Hospital specific
        formatted = formatted.replace(/Hospital name is ([^\.]+)/g, '🏥 Hospital: $1');
        formatted = formatted.replace(/Address is ([^\.]+)/g, '📍 Address:<br>$1');
        
        // Police specific  
        formatted = formatted.replace(/Nearest (police station) is ([^\.]+)/g, '🏢 $1: $2');
        
        // Coordinates (universal) - WITH GOOGLE MAPS LINK
        formatted = formatted.replace(/(Station|Hospital) coordinates are ([\d\.,\s]+) and it is ([\d\.]+) (kilometers?|km) from/g,
            function(match, type, coords, distance, unit) {
                const coordParts = coords.trim().split(',');
                if (coordParts.length === 2) {
                    const lat = coordParts[0].trim();
                    const lon = coordParts[1].trim();
                    const mapUrl = `https://www.google.com/maps?q=${lat},${lon}`;
                    return `🗺 Coordinates: <a href="${mapUrl}" target="_blank">${lat}, ${lon} (View Map)</a><br>📏 Distance: ${distance} ${unit} from`;
                }
                return `🗺 Coordinates: ${coords}<br>📏 Distance: ${distance} ${unit} from`;
            });
        
        // Contact information (universal)
        formatted = formatted.replace(/Contact number is (\d+)/g, '☎ Contact: $1');
        formatted = formatted.replace(/Contact number is not available/g, '☎ Contact: Not available');
        
        // Emergency contacts
        formatted = formatted.replace(/Emergency contacts: call (\d+) for all emergencies, (\d+) for police direct, or (\d+) for tourist helpline/g,
            '🚨 Emergency Contacts:<br>📞 All Emergencies: $1<br>📞 Police Direct: $2<br>📞 Tourist Helpline: $3');
        
        // Ambulance services
        formatted = formatted.replace(/Emergency ambulance services are available 24\/7 at number (\d+)/g,
            '🚑 Emergency Ambulance: $1 (24/7)');
        
        // Safety message
        formatted = formatted.replace(/Stay calm and move to a safe location/g, 
            '⚠️ Safety Advice: Stay calm and move to a safe location');
        
        // Help message
        formatted = formatted.replace(/help is on the way/g, '🆘 Help is on the way');
        
        // Clean up multiple consecutive line breaks
        formatted = formatted.replace(/(<br>){3,}/g, '<br><br>');
        
        return formatted;
    }
    
    return message;
}

// Show Go Home button inside the quick actions container
function showGoHomeOption() {
    // Remove any existing home button first
    const existingButton = document.querySelector('.home-button-container');
    if (existingButton) {
        existingButton.remove();
    }

    // Create home button container
    const container = document.createElement('div');
    container.className = 'home-button-container';

    const button = document.createElement('button');
    button.className = 'menu-button home-button';
    button.textContent = (selectedLanguage === 'hi_IN') ? '🏠 मुख्य मेनू पर जाएं' : '🏠 Go Home';

    button.onclick = function() {
        // Hide all sub-menus
        document.getElementById('emergencyMenu').style.display = 'none';
        document.getElementById('areaMenu').style.display = 'none';
        document.getElementById('digitalIDMenu').style.display = 'none';

        // Show main menu
        document.getElementById('mainMenu').style.display = 'block';

        // Update buttons text
        updateMainMenuButtons(selectedLanguage);
        updateBackButtons(selectedLanguage);

        currentStep = 'main';

        addMessage((selectedLanguage === 'hi_IN') ? 'मुख्य मेनू पर वापस' : 'Back to main menu', 'system');

        // Remove the home button
        container.remove();
        
        // Update toggle label
        updateToggleLabel();
    };

    container.appendChild(button);

    // Append to the quickActionsContainer
    const quickActionsContainer = document.getElementById('quickActionsContainer');
    if (quickActionsContainer) {
        quickActionsContainer.appendChild(container);
    }
}

// Language selection function with button updates
function setLanguage(locale) {
    currentLanguage = locale;
    lexConfig.localeId = locale;
    selectedLanguage = locale;
    
    // Hide language selector and show main menu
    document.getElementById('languageSelector').style.display = 'none';
    document.getElementById('mainMenu').style.display = 'block';
    
    // Update main menu title and buttons based on language
    const mainMenuTitle = document.getElementById('mainMenuTitle');
    if (locale === 'hi_IN') {
        mainMenuTitle.textContent = 'मैं आपकी कैसे मदद कर सकता हूं?';
        updateMainMenuButtons('hi_IN');
        updateBackButtons('hi_IN');
        addMessage('आपने हिंदी चुनी है।', 'system');
        setTimeout(() => {
            sendToLex('नमस्ते');
        }, 500);
    } else {
        mainMenuTitle.textContent = 'How can I help you?';
        updateMainMenuButtons('en_US');
        updateBackButtons('en_US');
        addMessage('You selected English.', 'system');
        setTimeout(() => {
            sendToLex('hi');
        }, 500);
    }
    
    currentStep = 'main';
    updateToggleLabel();
}

// Show Emergency Options - sends menu text to Lex
function showEmergencyOptions() {
    document.getElementById('mainMenu').style.display = 'none';
    document.getElementById('emergencyMenu').style.display = 'block';
    
    const emergencyTitle = document.getElementById('emergencyTitle');
    if (selectedLanguage === 'hi_IN') {
        emergencyTitle.textContent = 'आपातकालीन सहायता';
        updateEmergencyButtons('hi_IN');
        addMessage('आपातकालीन सहायता', 'user');
        sendToLex('आपातकालीन सहायता');
    } else {
        emergencyTitle.textContent = 'Emergency Assistance';
        updateEmergencyButtons('en_US');
        addMessage('Emergency Assistance', 'user');
        sendToLex('Emergency Assistance');
    }
    
    currentStep = 'emergency';
}

// Show Area Information Options - sends menu text to Lex  
function showAreaOptions() {
    document.getElementById('mainMenu').style.display = 'none';
    document.getElementById('areaMenu').style.display = 'block';
    
    const areaTitle = document.getElementById('areaTitle');
    if (selectedLanguage === 'hi_IN') {
        areaTitle.textContent = 'क्षेत्र की जानकारी';
        updateAreaButtons('hi_IN');
        addMessage('क्षेत्र की जानकारी', 'user');
        sendToLex('क्षेत्र की जानकारी');
    } else {
        areaTitle.textContent = 'Area Information';
        updateAreaButtons('en_US');
        addMessage('Area Information', 'user');
        sendToLex('Area Information');
    }
    
    currentStep = 'area';
}

// Show Digital ID Options - sends menu text to Lex
function showDigitalIDOptions() {
    document.getElementById('mainMenu').style.display = 'none';
    document.getElementById('digitalIDMenu').style.display = 'block';
    
    const digitalIDTitle = document.getElementById('digitalIDTitle');
    if (selectedLanguage === 'hi_IN') {
        digitalIDTitle.textContent = 'डिजिटल पहचान पत्र';
        updateDigitalIDButtons('hi_IN');
        addMessage('डिजिटल पहचान पत्र', 'user');
        sendToLex('डिजिटल पहचान पत्र');
    } else {
        digitalIDTitle.textContent = 'Digital ID';
        updateDigitalIDButtons('en_US');
        addMessage('Digital ID', 'user');
        sendToLex('Digital ID');
    }
    
    currentStep = 'digitalID';
}

// Select Safety Updates - shows Go Home button after Lex response
function selectSafetyUpdates() {
    if (selectedLanguage === 'hi_IN') {
        addMessage('सुरक्षा अपडेट', 'user');
        sendToLex('सुरक्षा अपडेट');
    } else {
        addMessage('Safety Updates', 'user');
        sendToLex('Safety Updates');
    }
    
    document.getElementById('mainMenu').style.display = 'none';
    currentStep = 'conversation';
    
    setTimeout(() => {
        showGoHomeOption();
    }, 2000);
}

// Functions to update button text based on language
function updateMainMenuButtons(language) {
    const buttons = document.querySelectorAll('#mainMenu .menu-button');
    if (language === 'hi_IN') {
        buttons[0].innerHTML = '🚨 आपातकालीन सहायता';
        buttons[1].innerHTML = '🧭 क्षेत्र की जानकारी';
        buttons[2].innerHTML = '🆔 डिजिटल पहचान पत्र';
        buttons[3].innerHTML = '📢 सुरक्षा अपडेट';
    } else {
        buttons[0].innerHTML = '🚨 Emergency Assistance';
        buttons[1].innerHTML = '🧭 Area Information';
        buttons[2].innerHTML = '🆔 Digital ID';
        buttons[3].innerHTML = '📢 Safety Updates';
    }
}

function updateEmergencyButtons(language) {
    const buttons = document.querySelectorAll('#emergencyMenu .menu-button');
    if (language === 'hi_IN') {
        buttons[0].innerHTML = '🚨 असुरक्षित स्थिति';
        buttons[1].innerHTML = '🧭 रास्ता भटक गया';
    } else {
        buttons[0].innerHTML = '🚨 Unsafe Situation';
        buttons[1].innerHTML = '🧭 Lost Way';
    }
}

function updateAreaButtons(language) {
    const buttons = document.querySelectorAll('#areaMenu .menu-button');
    if (language === 'hi_IN') {
        buttons[0].innerHTML = '🏥 अस्पताल की जानकारी';
        buttons[1].innerHTML = '👮 पुलिस की जानकारी';
        buttons[2].innerHTML = '🛡️ क्षेत्र मूल्यांकन';
    } else {
        buttons[0].innerHTML = '🏥 Hospital Info';
        buttons[1].innerHTML = '👮 Police Info';
        buttons[2].innerHTML = '🛡️ Area Assessment';
    }
}

function updateDigitalIDButtons(language) {
    const buttons = document.querySelectorAll('#digitalIDMenu .menu-button');
    if (language === 'hi_IN') {
        buttons[0].innerHTML = '👤 प्रोफ़ाइल';
        buttons[1].innerHTML = '📱 क्यूआर कोड';
    } else {
        buttons[0].innerHTML = '👤 Profile';
        buttons[1].innerHTML = '📱 QR Code';
    }
}

function updateBackButtons(language) {
    const backButtons = document.querySelectorAll('.back-button');
    backButtons.forEach(button => {
        if (language === 'hi_IN') {
            if (button.onclick && button.onclick.toString().includes('goBackToMain')) {
                button.textContent = '← मुख्य मेनू पर वापस';
            } else {
                button.textContent = '← भाषा पर वापस';
            }
        } else {
            if (button.onclick && button.onclick.toString().includes('goBackToMain')) {
                button.textContent = '← Back to Main Menu';
            } else {
                button.textContent = '← Back to Language';
            }
        }
    });
}

// Select Emergency Type - shows Go Home button after Lex response
function selectEmergency(type) {
    if (type === 'unsafe') {
        const message = selectedLanguage === 'hi_IN' ? 'असुरक्षित' : 'unsafe';
        addMessage(message, 'user');
        sendToLex(message);
    } else if (type === 'lost_way') {
        const message = selectedLanguage === 'hi_IN' ? 'रास्ता भटक गया' : 'lost way';
        addMessage(message, 'user');
        sendToLex(message);
    }
    
    document.getElementById('emergencyMenu').style.display = 'none';
    currentStep = 'conversation';
    
    setTimeout(() => {
        showGoHomeOption();
    }, 2000);
}

// Select Area Information Type - shows Go Home button after Lex response
function selectAreaInfo(type) {
    let message = '';
    
    if (type === 'hospital') {
        message = selectedLanguage === 'hi_IN' ? 'अस्पताल' : 'hospital';
    } else if (type === 'police') {
        message = selectedLanguage === 'hi_IN' ? 'पुलिस' : 'police';  
    } else if (type === 'safety') {
        message = selectedLanguage === 'hi_IN' ? 'सुरक्षा' : 'safety';
    }
    
    addMessage(message, 'user');
    sendToLex(message);
    
    document.getElementById('areaMenu').style.display = 'none';
    currentStep = 'conversation';
    
    setTimeout(() => {
        showGoHomeOption();
    }, 2000);
}

// Select Digital ID Type - shows Go Home button after Lex response
function selectDigitalID(type) {
    let message = '';
    
    if (type === 'profile') {
        message = selectedLanguage === 'hi_IN' ? 'प्रोफ़ाइल' : 'profile';
    } else if (type === 'qr_code') {
        message = selectedLanguage === 'hi_IN' ? 'क्यूआर कोड' : 'qr code';
    }
    
    addMessage(message, 'user');
    sendToLex(message);
    
    document.getElementById('digitalIDMenu').style.display = 'none';
    currentStep = 'conversation';
    
    setTimeout(() => {
        showGoHomeOption();
    }, 2000);
}

// Navigation functions with button text updates
function goBackToLanguage() {
    document.getElementById('mainMenu').style.display = 'none';
    document.getElementById('languageSelector').style.display = 'block';
    currentStep = 'language';
    updateToggleLabel();
}

function goBackToMain() {
    document.getElementById('emergencyMenu').style.display = 'none';
    document.getElementById('areaMenu').style.display = 'none';
    document.getElementById('digitalIDMenu').style.display = 'none';
    
    document.getElementById('mainMenu').style.display = 'block';
    updateMainMenuButtons(selectedLanguage);
    updateBackButtons(selectedLanguage);
    currentStep = 'main';
    updateToggleLabel();
}

// Enhanced language detection
function detectAndSetLanguage(message) {
    const hindiPatterns = /[\u0900-\u097F]|नमस्ते|हैलो|हाय|मदद|आपातकाल|असुरक्षित|अस्पताल|पुलिस|सुरक्षा|प्रोफ़ाइल/;
    
    if (hindiPatterns.test(message)) {
        currentLanguage = 'hi_IN';
        lexConfig.localeId = 'hi_IN';
        addMessage('🇮🇳 हिंदी भाषा का चयन किया गया', 'system');
        return 'hi_IN';
    } else if (message.toLowerCase().includes('english') || /^[a-zA-Z\s]+$/.test(message)) {
        currentLanguage = 'en_US';
        lexConfig.localeId = 'en_US';
        addMessage('🇺🇸 English language selected', 'system');
        return 'en_US';
    }
    
    return currentLanguage;
}

// Improved voice system initialization
function initializeVoice() {
    console.log('Initializing voice system...');
    
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        addMessage('❌ Microphone not supported. Voice disabled.', 'system');
        document.getElementById('voiceInputBtn').disabled = true;
        return;
    }

    const voiceBtn = document.getElementById('voiceInputBtn');
    voiceBtn.addEventListener('click', function() {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    });

    const toggleBtn = document.getElementById('toggleSpeechOutput');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function() {
            speechEnabled = !speechEnabled;
            toggleBtn.innerHTML = speechEnabled ? '🔊' : '🔇';
            addMessage(`Voice output ${speechEnabled ? 'enabled' : 'disabled'}`, 'system');
        });
    }

    const testBtn = document.getElementById('testSpeechBtn');
    if (testBtn) {
        testBtn.addEventListener('click', function() {
            testSpeech();
        });
    }

    addMessage('✅ Voice ready! Tap 🎤 to speak.', 'system');
}

// Function to decompress base64 gzipped strings from Amazon Lex V2
async function decompressLexResponse(base64String) {
    try {
        const binaryString = atob(base64String);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        
        if ('DecompressionStream' in window) {
            const ds = new DecompressionStream('gzip');
            const writer = ds.writable.getWriter();
            writer.write(bytes);
            writer.close();
            
            const decompressedStream = ds.readable;
            const decompressedArrayBuffer = await new Response(decompressedStream).arrayBuffer();
            const decodedText = new TextDecoder().decode(decompressedArrayBuffer);
            
            return decodedText;
        } else {
            console.warn('DecompressionStream not supported, using fallback');
            try {
                return atob(base64String);
            } catch (e) {
                return base64String;
            }
        }
    } catch (error) {
        console.error('Error decompressing Lex response:', error);
        return base64String;
    }
}

// Fallback TTS function for when Lex audio fails
function fallbackTTS(text) {
    if (!window.speechSynthesis) {
        console.error('No speech synthesis available');
        return;
    }

    let cleanText = text.replace(/\*\*(.*?)\*\*/g, '$1');
    cleanText = cleanText.replace(/[🚨🧭🏥👮🛡️🆔📢📍✅❌🎤🔊]/g, '');
    cleanText = cleanText.replace(/Assistant:\s*/g, '');
    
    if (cleanText.length < 5) return;

    console.log('🔊 Playing fallback TTS:', cleanText.substring(0, 50) + '...');

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    utterance.lang = currentLanguage === 'hi_IN' ? 'hi-IN' : 'en-US';

    if (text.includes('Emergency') || text.includes('SOS') || text.includes('police')) {
        utterance.rate = 0.8;
        utterance.pitch = 1.1;
        utterance.volume = 1.0;
    }

    utterance.onstart = () => {
        console.log('🔊 Fallback TTS started');
    };

    utterance.onend = () => {
        console.log('🔊 Fallback TTS finished');
    };

    utterance.onerror = (e) => {
        console.error('🔊 Fallback TTS error:', e);
    };

    window.speechSynthesis.speak(utterance);
}

// Better error handling for audio playback
async function playAudioWithCompleteBuffering(audioStream) {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('🔊 Starting audio playback...');
            
            if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }

            let audioData;

            if (audioStream instanceof Uint8Array) {
                audioData = audioStream;
            } else if (audioStream.buffer) {
                audioData = new Uint8Array(audioStream.buffer);
            } else if (audioStream instanceof ReadableStream) {
                const chunks = [];
                const reader = audioStream.getReader();

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    if (value) chunks.push(value);
                }

                const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
                audioData = new Uint8Array(totalLength);
                let offset = 0;
                for (const chunk of chunks) {
                    audioData.set(chunk, offset);
                    offset += chunk.length;
                }
            } else {
                reject(new Error(`Unsupported audio stream format: ${typeof audioStream}`));
                return;
            }

            if (!audioData || audioData.length === 0) {
                reject(new Error('Audio data is empty or invalid'));
                return;
            }

            const blob = new Blob([audioData], { type: 'audio/mpeg' });
            const url = URL.createObjectURL(blob);
            const audio = new Audio();
            
            audio.src = url;
            audio.preload = 'auto';
            audio.volume = 0.9;

            await new Promise((resolveBuffer, rejectBuffer) => {
                const timeout = setTimeout(() => {
                    rejectBuffer(new Error('Audio loading timeout'));
                }, 10000);

                audio.addEventListener('canplaythrough', () => {
                    clearTimeout(timeout);
                    resolveBuffer();
                }, { once: true });

                audio.addEventListener('error', (e) => {
                    clearTimeout(timeout);
                    rejectBuffer(e);
                }, { once: true });

                audio.load();
            });

            await audio.play();

            audio.addEventListener('ended', () => {
                URL.revokeObjectURL(url);
                resolve();
            });

        } catch (error) {
            console.error('❌ Audio playback failed:', error);
            reject(error);
        }
    });
}

// Clean voice recording without cluttered messages
async function startRecording() {
    try {
        isVoiceInteraction = true;
        
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
                channelCount: 1,
                sampleRate: 16000,
                echoCancellation: true,
                noiseSuppression: true
            }
        });

        const options = { mimeType: 'audio/webm;codecs=opus' };
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            options.mimeType = 'audio/webm';
        }

        mediaRecorder = new MediaRecorder(stream, options);
        audioChunks = [];

        mediaRecorder.ondataavailable = event => {
            if (event.data.size > 0) {
                audioChunks.push(event.data);
            }
        };

        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: mediaRecorder.mimeType });
            await convertAndSendToLex(audioBlob);
            stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        isRecording = true;

        const voiceBtn = document.getElementById('voiceInputBtn');
        voiceBtn.classList.add('listening');
        voiceBtn.innerHTML = '🛑';
        addMessage('🎤 Listening...', 'system');

    } catch (error) {
        console.error('Recording error:', error);
        addMessage(`❌ Microphone access failed: ${error.message}`, 'system');
        isVoiceInteraction = false;
    }
}

function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
    }
    
    isRecording = false;
    
    const voiceBtn = document.getElementById('voiceInputBtn');
    voiceBtn.classList.remove('listening');
    voiceBtn.innerHTML = '🎤';
}

// Clean audio conversion without extra messages
async function convertAndSendToLex(audioBlob) {
    try {
        showTypingIndicator();

        const arrayBuffer = await audioBlob.arrayBuffer();
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        
        const channelData = audioBuffer.getChannelData(0);
        
        let resampledData = channelData;
        if (audioBuffer.sampleRate !== 16000) {
            resampledData = resampleAudio(channelData, audioBuffer.sampleRate, 16000);
        }
        
        const pcmData = convertToPCM16(resampledData);
        await sendPCMToLex(pcmData);
        
    } catch (error) {
        console.error('Audio conversion error:', error);
        hideTypingIndicator();
        addMessage(`❌ Could not process voice. Please try speaking again.`, 'system');
        isVoiceInteraction = false;
    }
}

function resampleAudio(inputBuffer, inputSampleRate, outputSampleRate) {
    if (inputSampleRate === outputSampleRate) {
        return inputBuffer;
    }
    
    const ratio = inputSampleRate / outputSampleRate;
    const newLength = Math.round(inputBuffer.length / ratio);
    const result = new Float32Array(newLength);
    
    for (let i = 0; i < newLength; i++) {
        const srcIndex = i * ratio;
        const srcIndexFloor = Math.floor(srcIndex);
        const srcIndexCeil = Math.min(srcIndexFloor + 1, inputBuffer.length - 1);
        
        const weight = srcIndex - srcIndexFloor;
        result[i] = inputBuffer[srcIndexFloor] * (1 - weight) + inputBuffer[srcIndexCeil] * weight;
    }
    
    return result;
}

function convertToPCM16(float32Array) {
    const buffer = new ArrayBuffer(float32Array.length * 2);
    const view = new DataView(buffer);
    
    for (let i = 0; i < float32Array.length; i++) {
        const sample = Math.max(-1, Math.min(1, float32Array[i]));
        const int16Sample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
        view.setInt16(i * 2, int16Sample, true);
    }
    
    return new Uint8Array(buffer);
}

async function sendPCMToLex(pcmData) {
    if (!lexClient) {
        addMessage('❌ Bot not connected. Please refresh.', 'system');
        return;
    }

    try {
        const params = {
            botId: lexConfig.botId,
            botAliasId: lexConfig.botAliasId,
            localeId: currentLanguage,
            sessionId: sessionId,
            requestContentType: 'audio/l16; rate=16000; channels=1',
            responseContentType: 'audio/mpeg',
            inputStream: pcmData
        };

        const response = await lexClient.recognizeUtterance(params).promise();
        hideTypingIndicator();
        await handleLexAudioResponse(response);

    } catch (error) {
        console.error('Lex API error:', error);
        hideTypingIndicator();
        addMessage(`❌ Error processing voice. Please try again.`, 'system');
        isVoiceInteraction = false;
    }
}

// Clean Lex audio response handling
async function handleLexAudioResponse(response) {
    try {
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }

        let inputTranscript = response.inputTranscript;
        let transcriptText = '';
        if (inputTranscript) {
            try {
                const decompressedTranscript = await decompressLexResponse(inputTranscript);
                transcriptText = decompressedTranscript.trim();
                
                if (transcriptText && transcriptText.length > 1 && !transcriptText.includes('undefined')) {
                    addMessage(`"${transcriptText}"`, 'user');
                } else {
                    addMessage('❌ Voice unclear. Please try speaking again or type your message.', 'system');
                    isVoiceInteraction = false;
                    return;
                }
            } catch (e) {
                addMessage('❌ Could not understand voice. Please try speaking again or type your message.', 'system');
                isVoiceInteraction = false;
                return;
            }
        }

        let messages = response.messages;
        let messageContent = '';
        if (messages) {
            try {
                const decompressedMessages = await decompressLexResponse(messages);
                let parsedMessages;
                try {
                    parsedMessages = JSON.parse(decompressedMessages);
                } catch (e) {
                    parsedMessages = [{ content: decompressedMessages }];
                }
                
                const messageArray = Array.isArray(parsedMessages) ? parsedMessages : [parsedMessages];
                messageArray.forEach(msg => {
                    if (msg.content && !isCoordinateRequest(msg.content)) {
                        messageContent = msg.content;
                        addMessage(msg.content, 'bot', false);
                    }
                });
            } catch (e) {
                console.error('Failed to decompress messages:', e);
                addMessage('❌ Error processing response. Please try again.', 'system');
                isVoiceInteraction = false;
                return;
            }
        }

        let sessionState = response.sessionState;
        if (sessionState) {
            try {
                const decompressedSessionState = await decompressLexResponse(sessionState);
                sessionState = JSON.parse(decompressedSessionState);
            } catch (e) {
                sessionState = null;
            }
        }

        const coordinateRequest = sessionState?.dialogAction?.type === 'ElicitSlot' ? 
            sessionState.dialogAction.slotToElicit : null;

        if (coordinateRequest && (coordinateRequest === 'latitude' || coordinateRequest === 'longitude')) {
            if (locationAvailable) {
                if (!expectingCoordinates) {
                    addMessage(`📍 Sending your location: ${currentLatitude}, ${currentLongitude}`, 'location');
                    expectingCoordinates = true;
                }
                handleCoordinateRequest(coordinateRequest);
                return;
            } else {
                addMessage('📍 Location needed...', 'location');
                requestLocationNow();
                return;
            }
        } else {
            expectingCoordinates = false;
        }

        if (speechEnabled) {
            if (response.audioStream) {
                try {
                    await playAudioWithCompleteBuffering(response.audioStream);
                } catch (audioError) {
                    console.error('❌ Lex audio playback failed:', audioError);
                    
                    if (messageContent && messageContent.length > 5) {
                        setTimeout(() => {
                            fallbackTTS(messageContent);
                        }, 500);
                    }
                }
            } else {
                if (messageContent && messageContent.length > 5) {
                    setTimeout(() => {
                        fallbackTTS(messageContent);
                    }, 500);
                }
            }
        }

        isVoiceInteraction = false;

    } catch (error) {
        console.error('Error processing response:', error);
        addMessage('❌ Error processing voice response. Please try again.', 'system');
        isVoiceInteraction = false;
    }
}

function testSpeech() {
    if (!window.speechSynthesis) {
        addMessage('❌ Speech not available', 'system');
        return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance("Voice test successful!");
    utterance.rate = 0.9;
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
    addMessage('🔊 Testing voice...', 'system');
}

function requestLocationNow() {
    const locationAlert = document.getElementById('locationAlert');
    if (locationAlert) {
        locationAlert.style.display = 'none';
    }
    
    if (!navigator.geolocation) {
        addMessage('❌ Geolocation not supported.', 'system');
        return;
    }
    addMessage('📍 Requesting location access...', 'location');
    navigator.geolocation.getCurrentPosition(
        function(position) {
            currentLatitude = position.coords.latitude.toFixed(6);
            currentLongitude = position.coords.longitude.toFixed(6);
            locationAvailable = true;
            addMessage(`✅ Location detected: ${currentLatitude}, ${currentLongitude}`, 'location');
        },
        function(error) {
            let errorMsg = '❌ Location failed: ';
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    errorMsg += 'Permission denied.';
                    if (locationAlert) {
                        locationAlert.style.display = 'block';
                    }
                    break;
                default:
                    errorMsg += 'Unknown error.';
            }
            addMessage(errorMsg, 'system');
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
    );
}

function initializeLexClient() {
    try {
        updateConnectionStatus('connecting', '🟡 Connecting to AWS Lex V2...');
        AWS.config.update({
            region: lexConfig.region,
            credentials: new AWS.CognitoIdentityCredentials({
                IdentityPoolId: lexConfig.identityPoolId
            })
        });
        lexClient = new AWS.LexRuntimeV2();
        testConnection();
    } catch (error) {
        console.error('Initialization Error:', error);
        updateConnectionStatus('error', '❌ Failed to initialize: ' + error.message);
    }
}

function testConnection() {
    AWS.config.credentials.get(function(err) {
        if (err) {
            updateConnectionStatus('error', '❌ Authentication failed');
        } else {
            updateConnectionStatus('connected', '🟢 Connected to Lex V2');
            addMessage('✅ Bot connected successfully!', 'system');
        }
    });
}

function updateConnectionStatus(status, message) {
    const statusEl = document.getElementById('connectionStatus');
    if (statusEl) {
        statusEl.textContent = message;
        statusEl.className = 'connection-status status-' + status;
    }
}

// ENHANCED: Message display with formatting for ALL emergency response types INCLUDING PROFILES
function addMessage(content, type = 'bot', useBrowserTTS = false) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    
    let messageClass, senderName;
    switch(type) {
        case 'user':
            messageClass = 'user-message';
            senderName = 'You';
            break;
        case 'voice':
            messageClass = 'voice-message';
            senderName = 'Voice';
            break;
        case 'system':
            messageClass = 'system-message';
            senderName = 'System';
            break;
        case 'location':
            messageClass = 'location-message';
            senderName = 'Location';
            break;
        default:
            messageClass = 'bot-message';
            senderName = 'Assistant';
    }
    
    // Format the content for better display (but keep original for voice)
    let displayContent = content;
    if (type === 'bot') {
        displayContent = formatEmergencyMessage(content);
    }
    
    messageDiv.className = `message ${messageClass}`;
    messageDiv.innerHTML = `
        <div class="message-content"><strong>${senderName}:</strong> ${displayContent}</div>
        <div class="message-time">${new Date().toLocaleTimeString()}</div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function showTypingIndicator() {
    const messagesContainer = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `<div class="typing-dots"><span></span><span></span><span></span></div>`;
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.remove();
}

// Enhanced sendMessage with language detection
function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    if (!message) return;
    
    detectAndSetLanguage(message);
    
    isVoiceInteraction = false;
    
    addMessage(message, 'user');
    input.value = '';
    sendToLex(message);
}

function isCoordinateRequest(messageContent) {
    const content = messageContent.toLowerCase();
    return content.includes('provide your current latitude') || 
           content.includes('provide your current longitude') ||
           content.includes('latitude coordinate') ||
           content.includes('longitude coordinate');
}

// This function enables voice for ALL text responses
async function sendToLex(message, showTyping = true) {
    if (!lexClient) {
        addMessage('❌ Bot not connected. Please refresh.', 'system');
        return;
    }
    
    const sendButton = document.getElementById('sendButton');
    const input = document.getElementById('messageInput');
    sendButton.disabled = true;
    sendButton.textContent = 'Sending...';
    input.disabled = true;
    
    if (showTyping) showTypingIndicator();
    
    const params = {
        botId: lexConfig.botId,
        botAliasId: lexConfig.botAliasId,
        localeId: currentLanguage,
        sessionId: sessionId,
        requestContentType: 'text/plain; charset=utf-8',
        responseContentType: 'audio/mpeg',
        inputStream: message
    };

    try {
        const response = await lexClient.recognizeUtterance(params).promise();
        
        if (showTyping) hideTypingIndicator();
        
        sendButton.disabled = false;
        sendButton.textContent = 'Send';
        input.disabled = false;
        input.focus();
        
        await handleLexVoiceResponse(response);
        
    } catch (error) {
        if (showTyping) hideTypingIndicator();
        
        sendButton.disabled = false;
        sendButton.textContent = 'Send';
        input.disabled = false;
        input.focus();
        
        addMessage(`❌ Error: ${error.message}`, 'system');
        console.error('Lex error:', error);
    }
}

// Clean voice response for text input
async function handleLexVoiceResponse(response) {
    try {
        let messageContent = '';
        
        if (response.messages) {
            try {
                const decompressedMessages = await decompressLexResponse(response.messages);
                let parsedMessages;
                try {
                    parsedMessages = JSON.parse(decompressedMessages);
                } catch (e) {
                    parsedMessages = [{ content: decompressedMessages }];
                }
                
                const messageArray = Array.isArray(parsedMessages) ? parsedMessages : [parsedMessages];
                messageArray.forEach(msg => {
                    if (msg.content && !isCoordinateRequest(msg.content)) {
                        messageContent = msg.content;
                        addMessage(msg.content, 'bot', false);
                    }
                });
            } catch (e) {
                console.error('Failed to decompress messages:', e);
                addMessage('❌ Error processing response. Please try again.', 'system');
                return;
            }
        }
        
        let sessionState = response.sessionState;
        if (sessionState) {
            try {
                const decompressedSessionState = await decompressLexResponse(sessionState);
                sessionState = JSON.parse(decompressedSessionState);
            } catch (e) {
                sessionState = null;
            }
        }
        
        const coordinateRequest = sessionState?.dialogAction?.type === 'ElicitSlot' ? 
            sessionState.dialogAction.slotToElicit : null;
            
        if (coordinateRequest && (coordinateRequest === 'latitude' || coordinateRequest === 'longitude')) {
            if (locationAvailable) {
                if (!expectingCoordinates) {
                    addMessage(`📍 Sending your location: ${currentLatitude}, ${currentLongitude}`, 'location');
                    expectingCoordinates = true;
                }
                handleCoordinateRequest(coordinateRequest);
                return;
            } else {
                addMessage('📍 Location needed...', 'location');
                requestLocationNow();
                return;
            }
        } else {
            expectingCoordinates = false;
        }
        
        // Use ORIGINAL messageContent for voice (not formatted version)
        if (speechEnabled && response.audioStream) {
            try {
                await playAudioWithCompleteBuffering(response.audioStream);
            } catch (audioError) {
                console.error('❌ Lex audio failed for text input:', audioError);
                
                if (messageContent && messageContent.length > 5) {
                    setTimeout(() => {
                        fallbackTTS(messageContent);
                    }, 500);
                }
            }
        } else if (speechEnabled && !response.audioStream) {
            if (messageContent && messageContent.length > 5) {
                setTimeout(() => {
                    fallbackTTS(messageContent);
                }, 500);
            }
        }
        
    } catch (error) {
        console.error('Error handling text voice response:', error);
        addMessage('❌ Error processing response. Please try again.', 'system');
    }
}

function handleCoordinateRequest(requestType) {
    if (requestType === 'latitude') {
        setTimeout(() => sendToLex(currentLatitude, false), 500);
    } else if (requestType === 'longitude') {
        setTimeout(() => sendToLex(currentLongitude, false), 500);
    }
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        sendMessage();
    }
}

setTimeout(() => {
    const messageInput = document.getElementById('messageInput');
    if (messageInput) {
        messageInput.focus();
    }
}, 2000);
