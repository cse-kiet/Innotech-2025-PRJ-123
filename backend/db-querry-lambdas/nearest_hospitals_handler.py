import json
import os
import pymysql
from datetime import datetime

def lambda_handler(event, context):
    # Parse latitude and longitude from request body
    try:
        body = json.loads(event['body'])
        latitude = float(body['latitude'])
        longitude = float(body['longitude'])
    except (KeyError, TypeError, ValueError):
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
        
        with connection.cursor() as cursor:
            sql = """
            SELECT id, name, address, phone, type, latitude, longitude, district, state, created_at,
            ( 6371 * acos(
                cos(radians(%s)) * cos(radians(latitude)) *
                cos(radians(longitude) - radians(%s)) +
                sin(radians(%s)) * sin(radians(latitude))
            )) AS distance
            FROM hospitals
            WHERE latitude IS NOT NULL AND longitude IS NOT NULL
            ORDER BY distance
            LIMIT 1;
            """
            cursor.execute(sql, (latitude, longitude, latitude))
            result = cursor.fetchone()
        
        if result:
            # Convert Decimal objects to float and handle datetime for JSON serialization
            response = {
                'id': result['id'],
                'name': result['name'],
                'address': result['address'],
                'phone': result['phone'],
                'type': result['type'],
                'latitude': float(result['latitude']) if result['latitude'] else None,
                'longitude': float(result['longitude']) if result['longitude'] else None,
                'district': result['district'],
                'state': result['state'],
                'distance_km': float(result['distance']),
                'created_at': result['created_at'].strftime('%Y-%m-%d %H:%M:%S') if result['created_at'] else None
            }
        else:
            response = {
                'message': 'No hospital found nearby'
            }
    
    except pymysql.MySQLError as e:
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
    
    return {
        'statusCode': 200,
        'body': json.dumps(response),
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    }

