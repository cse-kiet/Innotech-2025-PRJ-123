import json
import os
import pymysql
import hashlib
from datetime import datetime

def lambda_handler(event, context):
    print(f"DEBUG: Received event: {json.dumps(event)}")
    
    # Handle both direct Lambda testing and API Gateway calls
    try:
        if 'body' in event:
            body = json.loads(event['body'])
            print("DEBUG: Using API Gateway format")
        else:
            body = event
            print("DEBUG: Using direct Lambda format")
            
        tourist_id = body.get('tourist_id', '').strip()
        password = body.get('password', '').strip()
        print(f"DEBUG: Login attempt - tourist_id: '{tourist_id}', password: '{password}'")
        
    except (json.JSONDecodeError, TypeError) as e:
        print(f"DEBUG: Error parsing input: {e}")
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Invalid JSON input'}),
            'headers': {'Content-Type': 'application/json'}
        }
    
    if not tourist_id or not password:
        print("DEBUG: Missing tourist_id or password")
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Both tourist_id and password are required'}),
            'headers': {'Content-Type': 'application/json'}
        }
    
    # Hash password using MD5 (to match your database)
    password_hash = hashlib.md5(password.encode()).hexdigest()
    print(f"DEBUG: Generated MD5 hash: {password_hash}")
    
    # Database connection
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
            # First, check if user exists (for debugging)
            cursor.execute("SELECT tourist_id, password FROM tourists WHERE tourist_id = %s", (tourist_id,))
            user_check = cursor.fetchone()
            
            if user_check:
                print(f"DEBUG: User found in database")
                print(f"DEBUG: Stored hash: {user_check['password']}")
                print(f"DEBUG: Generated hash: {password_hash}")
                print(f"DEBUG: Hashes match: {user_check['password'] == password_hash}")
            else:
                print("DEBUG: User not found in database")
                return {
                    'statusCode': 401,
                    'body': json.dumps({'error': 'Invalid credentials'}),
                    'headers': {'Content-Type': 'application/json'}
                }
            
            # Now verify credentials AND get user profile in one query
            sql = """
                SELECT tourist_id, name, phone, email, emergency_contact, date_of_birth, 
                       address, last_stayed_lat, last_stayed_lon, created_at, updated_at 
                FROM tourists 
                WHERE tourist_id = %s AND password = %s
            """
            cursor.execute(sql, (tourist_id, password_hash))
            user = cursor.fetchone()
            print(f"DEBUG: Authentication query executed, user authenticated: {user is not None}")
            
            if not user:
                print("DEBUG: Invalid credentials - password mismatch")
                return {
                    'statusCode': 401,
                    'body': json.dumps({'error': 'Invalid credentials'}),
                    'headers': {'Content-Type': 'application/json'}
                }
        
        # Login successful - return user profile
        current_time = datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')
        
        response = {
            'message': 'Login successful',
            'authentication': {
                'status': 'authenticated',
                'tourist_id': user['tourist_id'],
                'login_time': current_time
            },
            'user_profile': {
                'tourist_id': user['tourist_id'],
                'name': user['name'],
                'phone': user['phone'],
                'email': user['email'],
                'emergency_contact': user['emergency_contact'],
                'date_of_birth': user['date_of_birth'].strftime('%Y-%m-%d') if user['date_of_birth'] else None,
                'address': user['address'],
                'last_location': {
                    'latitude': float(user['last_stayed_lat']) if user['last_stayed_lat'] else None,
                    'longitude': float(user['last_stayed_lon']) if user['last_stayed_lon'] else None
                },
                'account_info': {
                    'created_at': user['created_at'].strftime('%Y-%m-%d %H:%M:%S') if user['created_at'] else None,
                    'updated_at': user['updated_at'].strftime('%Y-%m-%d %H:%M:%S') if user['updated_at'] else None
                }
            }
        }
        print("DEBUG: Login successful, returning user profile")
        
    except pymysql.MySQLError as e:
        print(f"DEBUG: Database error: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Database error', 'message': str(e)}),
            'headers': {'Content-Type': 'application/json'}
        }
    
    except Exception as e:
        print(f"DEBUG: Unexpected error: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Internal server error', 'message': str(e)}),
            'headers': {'Content-Type': 'application/json'}
        }
    
    finally:
        if connection:
            connection.close()
            print("DEBUG: Database connection closed")
    
    return {
        'statusCode': 200,
        'body': json.dumps(response),
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    }

