import json
import os
import pymysql


def lambda_handler(event, context):
    # Parse latitude and longitude from request body
    try:
        body = json.loads(event['body'])
        latitude = float(body['latitude'])
        longitude = float(body['longitude'])
    except (KeyError, TypeError, ValueError):
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Invalid input: Please provide latitude and longitude as numbers in JSON body'}),
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
            SELECT id, name, address, state, latitude, longitude,
            ( 6371 * acos(
                cos(radians(%s)) * cos(radians(latitude)) *
                cos(radians(longitude) - radians(%s)) +
                sin(radians(%s)) * sin(radians(latitude))
            )) AS distance
            FROM police_stations
            ORDER BY distance
            LIMIT 1;
            """
            cursor.execute(sql, (latitude, longitude, latitude))
            result = cursor.fetchone()
        
        if result:
            # Convert Decimal objects to float for JSON serialization
            response = {
                'id': result['id'],
                'name': result['name'],
                'address': result['address'],
                'state': result['state'],
                'latitude': float(result['latitude']),
                'longitude': float(result['longitude']),
                'distance_km': float(result['distance'])
            }
        else:
            response = {'message': 'No police station found nearby'}
    
    except pymysql.MySQLError as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Database error', 'message': str(e)}),
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

