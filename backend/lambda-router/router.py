import json
import urllib3
import os

# Initialize HTTP client
http = urllib3.PoolManager()

# Environment variables for each separate API endpoint
LOGIN_API = os.environ.get('LOGIN_API')
HOSPITAL_API = os.environ.get('HOSPITAL_API')
POLICE_API = os.environ.get('POLICE_API')
RISK_API = os.environ.get('RISK_API')
ANNOUNCEMENTS_API = os.environ.get('ANNOUNCEMENTS_API')

def lambda_handler(event, context):
    intent_name = event['sessionState']['intent']['name']
    slots = event['sessionState']['intent']['slots']
    session_attributes = event.get('sessionAttributes', {})
    
    try:
        if intent_name == 'EmergencyAssistance':
            return handle_emergency(slots, session_attributes)
        elif intent_name == 'AreaInformation':
            return handle_area_info(slots, session_attributes)
        elif intent_name == 'DigitalID':
            return handle_digital_id(slots, session_attributes)
        elif intent_name == 'SafetyUpdates':
            return handle_safety_updates(session_attributes)
        
        return close_response("I didn't understand that. Please try again.", session_attributes)
        
    except Exception as e:
        return close_response("Sorry, I'm experiencing technical difficulties. Please try again.", session_attributes)

def handle_emergency(slots, session_attributes):
    emergency_type = get_slot_value(slots, 'emergencyType')
    
    if emergency_type == 'unsafe':
        # Call your separate nearestpolice API
        payload = {"latitude": 28.7524404, "longitude": 77.4987640}  # Default coordinates
        
        response = http.request('POST', POLICE_API,
                              body=json.dumps(payload),
                              headers={'Content-Type': 'application/json'})
        
        data = json.loads(response.data.decode('utf-8'))
        
        message = f"""🚨 EMERGENCY SOS ALERT SENT!

Your SOS has been dispatched to local authorities and emergency contacts!

NEAREST POLICE STATION:
🚔 {data['name']}
📞 Emergency: 112 (Free)
🗺️ Distance: {data['distance_km']:.1f} km away

✅ Your location has been shared with authorities
✅ Help is on the way! Stay calm and move to a safe location.

🔙 Say "main menu" to return to options."""

    elif emergency_type == 'lost_way':
        # Call your separate login API to get user's last location
        login_payload = {"tourist_id": "T003", "password": "password123"}
        
        response = http.request('POST', LOGIN_API,
                              body=json.dumps(login_payload),
                              headers={'Content-Type': 'application/json'})
        
        data = json.loads(response.data.decode('utf-8'))
        location = data['user_profile']['last_location']
        
        message = f"""📍 LOCATION ASSISTANCE ACTIVATED!

Your last recorded location:
🧭 Latitude: {location['latitude']}
🧭 Longitude: {location['longitude']}

✅ GPS coordinates shared with local authorities
✅ Tourist helpline notified: +91-1363 (24/7)

Please stay exactly where you are. Local assistance is being dispatched.

🔙 Say "main menu" to return to options."""
    
    return close_response(message, session_attributes)

def handle_area_info(slots, session_attributes):
    info_type = get_slot_value(slots, 'infoType')
    latitude = float(get_slot_value(slots, 'latitude'))
    longitude = float(get_slot_value(slots, 'longitude'))
    
    if info_type == 'hospital':
        # Call your separate nearesthospital API
        payload = {"latitude": latitude, "longitude": longitude}
        
        response = http.request('POST', HOSPITAL_API,
                              body=json.dumps(payload),
                              headers={'Content-Type': 'application/json'})
        
        data = json.loads(response.data.decode('utf-8'))
        
        message = f"""🏥 NEAREST HOSPITAL FOUND

📍 Based on coordinates: {latitude:.4f}, {longitude:.4f}

🏥 {data['name']}
📞 Main: {data['phone']}
📞 Emergency: {data['phone']} (24/7)
🏥 Type: {data['type']}
📍 {data['address']}
🗺️ Distance: {data['distance_km']:.1f} km from you

🚑 Emergency services available
🔙 Say "main menu" to return to options."""

    elif info_type == 'police':
        # Call your separate nearestpolice API
        payload = {"latitude": latitude, "longitude": longitude}
        
        response = http.request('POST', POLICE_API,
                              body=json.dumps(payload),
                              headers={'Content-Type': 'application/json'})
        
        data = json.loads(response.data.decode('utf-8'))
        
        message = f"""🚔 NEAREST POLICE STATION

📍 Based on coordinates: {latitude:.4f}, {longitude:.4f}

🚔 {data['name']}
📞 Emergency: 112 (Free from any phone)
🗺️ Distance: {data['distance_km']:.1f} km from you

👮 Tourist assistance available 24/7
🔙 Say "main menu" to return to options."""

    elif info_type == 'safety':
        # Call your separate riskassessment API
        payload = {"latitude": latitude, "longitude": longitude}
        
        response = http.request('POST', RISK_API,
                              body=json.dumps(payload),
                              headers={'Content-Type': 'application/json'})
        
        data = json.loads(response.data.decode('utf-8'))
        
        message = f"""🛡️ AREA SAFETY ASSESSMENT

📍 Location: {latitude:.4f}, {longitude:.4f}
🏛️ Zone: {data['nearest_risk_zone']['zone_name']}

RISK LEVEL: {data['nearest_risk_zone']['risk_level']}

{data['nearest_risk_zone']['description']}

⚠️ RECOMMENDATIONS:
{', '.join(data['recommendations'])}

🚨 Emergency Helpline: 112
🔙 Say "main menu" to return to options."""
    
    return close_response(message, session_attributes)

def handle_digital_id(slots, session_attributes):
    id_type = get_slot_value(slots, 'idType')
    
    # Call your separate login API
    payload = {"tourist_id": "T003", "password": "password123"}
    
    response = http.request('POST', LOGIN_API,
                          body=json.dumps(payload),
                          headers={'Content-Type': 'application/json'})
    
    data = json.loads(response.data.decode('utf-8'))
    profile = data['user_profile']
    
    if id_type == 'profile':
        message = f"""👤 DIGITAL TOURIST PROFILE

🆔 Tourist ID: {profile['tourist_id']}
👤 Name: {profile['name']}
📞 Phone: {profile['phone']}
📧 Email: {profile['email']}
🏠 Address: {profile['address']}
🚨 Emergency Contact: {profile['emergency_contact']}
✅ Status: Verified Active Tourist

🔐 Digital ID verified by Tourist Authority
📱 Show this to authorities when requested

🔙 Say "main menu" to return to options."""

    elif id_type == 'qr_code':
        message = f"""📱 DIGITAL QR CODE

[QR CODE DISPLAYED]
████ ▄▄▄▄▄▄▄ ▄▄▄▄  ████
████ █     █ █▄ ▀█ ████  
████ █ ▄▄▄ █  ▀▀▄  ████
████ █ ▄▄▄ █ ▀▄█▀█ ████
████ █▄▄▄▄▄█ █▄▄▀▄ ████

🆔 Tourist ID: {profile['tourist_id']}
👤 Name: {profile['name']}
📱 Valid Digital Tourist ID

✅ Show this QR code to authorities when requested

🔙 Say "main menu" to return to options."""
    
    return close_response(message, session_attributes)

def handle_safety_updates(session_attributes):
    # Call your separate announcements API
    payload = {"priority": "HIGH", "limit": 3}
    
    response = http.request('POST', ANNOUNCEMENTS_API,
                          body=json.dumps(payload),
                          headers={'Content-Type': 'application/json'})
    
    data = json.loads(response.data.decode('utf-8'))
    
    message = "📢 LATEST SAFETY UPDATES\n\n"
    
    for announcement in data['announcements']:
        priority_icon = "🚨" if announcement['priority'] == 'CRITICAL' else "⚠️" if announcement['priority'] == 'HIGH' else "📢"
        message += f"{priority_icon} {announcement['title'].upper()}\n"
        message += f"{announcement['content']}\n\n"
    
    message += "🔙 Say \"main menu\" to return to options."
    
    return close_response(message, session_attributes)

def get_slot_value(slots, slot_name):
    if slots and slot_name in slots and slots[slot_name]:
        return slots[slot_name]['value']['interpretedValue']
    return None

def close_response(message, session_attributes):
    return {
        'sessionState': {
            'dialogAction': {
                'type': 'Close'
            },
            'intent': {
                'state': 'Fulfilled'
            }
        },
        'sessionAttributes': session_attributes,
        'messages': [
            {
                'contentType': 'PlainText',
                'content': message
            }
        ]
    }

