import json
import os
import pymysql
from datetime import datetime

def lambda_handler(event, context):
    print(f"DEBUG: Received event: {json.dumps(event)}")
    
    # Handle both direct Lambda testing and API Gateway calls
    try:
        if 'body' in event:
            # API Gateway format (when called via API Gateway)
            body = json.loads(event['body'])
            print("DEBUG: Using API Gateway format")
        else:
            # Direct Lambda testing format (when testing in Lambda console)
            body = event
            print("DEBUG: Using direct Lambda format")
            
        latitude = float(body['latitude'])
        longitude = float(body['longitude'])
        print(f"DEBUG: Parsed coordinates - lat: {latitude}, lng: {longitude}")
        
    except (KeyError, TypeError, ValueError) as e:
        print(f"DEBUG: Error parsing input: {e}")
        return {
            'statusCode': 400,
            'body': json.dumps({
                'error': 'Invalid input: Please provide latitude and longitude as numbers in JSON body'
            }),
            'headers': {'Content-Type': 'application/json'}
        }
    
    # Get DB connection details from environment variables
    db_host = os.environ['DB_HOST']
    db_user = os.environ['DB_USER']
    db_password = os.environ['DB_PASSWORD']
    db_name = os.environ['DB_NAME']
    
    connection = None
    try:
        connection = pymysql.connect(
            host=db_host,
            user=db_user,
            password=db_password,
            database=db_name,
            port=3306,
            cursorclass=pymysql.cursors.DictCursor
        )
        print("DEBUG: Database connection successful")
        
        with connection.cursor() as cursor:
            # Find the nearest risk zone that contains this point
            sql = """
            SELECT id, zone_name, description, risk_score, latitude, longitude, radius_km, 
                   created_at, updated_at,
            ( 6371 * acos(
                cos(radians(%s)) * cos(radians(latitude)) *
                cos(radians(longitude) - radians(%s)) +
                sin(radians(%s)) * sin(radians(latitude))
            )) AS distance_from_center
            FROM risk_zones
            WHERE latitude IS NOT NULL 
            AND longitude IS NOT NULL 
            AND radius_km IS NOT NULL
            AND ( 6371 * acos(
                cos(radians(%s)) * cos(radians(latitude)) *
                cos(radians(longitude) - radians(%s)) +
                sin(radians(%s)) * sin(radians(latitude))
            )) <= radius_km
            ORDER BY distance_from_center ASC
            LIMIT 1;
            """
            cursor.execute(sql, (
                latitude, longitude, latitude,  # First distance calculation
                latitude, longitude, latitude   # Second distance calculation for WHERE
            ))
            zone = cursor.fetchone()
            print(f"DEBUG: Query executed, found zone: {zone is not None}")
        
        if zone:
            # Determine risk level and recommendations
            risk_score = float(zone['risk_score'])
            print(f"DEBUG: Risk score: {risk_score}")
            
            if risk_score >= 8.0:
                risk_level = "VERY HIGH"
                recommendations = [
                    "🚨 AVOID this area if possible",
                    "👥 Travel in groups if you must go",
                    "📱 Share your location with trusted contacts",
                    "🚔 Have emergency numbers ready"
                ]
                safety_tips = [
                    "Stay in well-lit, populated areas",
                    "Trust your instincts - leave if you feel unsafe"
                ]
            elif risk_score >= 6.0:
                risk_level = "HIGH"
                recommendations = [
                    "⚠️ Exercise extreme caution",
                    "🌅 Prefer daylight hours for travel",
                    "📱 Keep emergency contacts ready",
                    "💼 Keep valuables secure"
                ]
                safety_tips = [
                    "Be aware of your surroundings at all times",
                    "Avoid displaying expensive items"
                ]
            elif risk_score >= 4.0:
                risk_level = "MODERATE"
                recommendations = [
                    "👀 Stay alert and aware of surroundings",
                    "🎒 Keep valuables secure",
                    "📱 Keep emergency contacts handy"
                ]
                safety_tips = [
                    "Maintain situational awareness",
                    "Follow local safety guidelines"
                ]
            elif risk_score >= 2.0:
                risk_level = "LOW"
                recommendations = [
                    "✅ Area has minimal safety concerns",
                    "👍 Follow general safety precautions"
                ]
                safety_tips = [
                    "Maintain normal precautions"
                ]
            else:
                risk_level = "VERY LOW"
                recommendations = [
                    "✅ Area appears very safe",
                    "😊 Enjoy your visit!"
                ]
                safety_tips = [
                    "Standard travel precautions apply"
                ]
            
            response = {
                'location': {
                    'latitude': latitude,
                    'longitude': longitude
                },
                'nearest_risk_zone': {
                    'id': zone['id'],
                    'zone_name': zone['zone_name'],
                    'description': zone['description'],
                    'risk_score': risk_score,
                    'risk_level': risk_level,
                    'center_latitude': float(zone['latitude']) if zone['latitude'] else None,
                    'center_longitude': float(zone['longitude']) if zone['longitude'] else None,
                    'radius_km': float(zone['radius_km']) if zone['radius_km'] else None,
                    'distance_from_center': float(zone['distance_from_center']),
                    'created_at': zone['created_at'].strftime('%Y-%m-%d %H:%M:%S') if zone['created_at'] else None,
                    'updated_at': zone['updated_at'].strftime('%Y-%m-%d %H:%M:%S') if zone['updated_at'] else None
                },
                'recommendations': recommendations,
                'safety_tips': safety_tips,
                'assessment_time': datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')
            }
            print("DEBUG: Successfully created response with risk zone")
        else:
            response = {
                'location': {
                    'latitude': latitude,
                    'longitude': longitude
                },
                'nearest_risk_zone': None,
                'risk_level': 'SAFE',
                'message': 'No risk zones found for this location - area appears safe',
                'recommendations': [
                    "✅ No specific risk zones affect this location",
                    "👍 Follow standard safety precautions",
                    "📍 Stay aware of your surroundings"
                ],
                'safety_tips': [
                    "Contact local authorities for area-specific safety information"
                ],
                'assessment_time': datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')
            }
            print("DEBUG: No risk zones found, created safe response")
            
    except pymysql.MySQLError as e:
        print(f"DEBUG: Database error: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({
                'error': 'Database error', 
                'message': str(e)
            }),
            'headers': {'Content-Type': 'application/json'}
        }
    
    finally:
        if connection:
            connection.close()
            print("DEBUG: Database connection closed")
    
    print("DEBUG: Returning successful response")
    return {
        'statusCode': 200,
        'body': json.dumps(response),
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    }

