import json
import os
import pymysql
from datetime import datetime

def lambda_handler(event, context):
    print(f"DEBUG: Received event: {json.dumps(event)}")
    
    # Handle both direct Lambda testing and API Gateway calls
    try:
        if 'body' in event:
            body = json.loads(event['body']) if event['body'] else {}
            print("DEBUG: Using API Gateway format")
        else:
            body = event
            print("DEBUG: Using direct Lambda format")
            
        # Optional filters
        category = body.get('category', '').strip()
        priority = body.get('priority', '').strip()
        location = body.get('location', '').strip()
        limit = int(body.get('limit', 20))
        
        print(f"DEBUG: Filters - category: {category}, priority: {priority}, location: {location}, limit: {limit}")
        
    except (json.JSONDecodeError, TypeError, ValueError) as e:
        print(f"DEBUG: Error parsing input: {e}")
        # Continue with default values
        category = priority = location = ""
        limit = 20
    
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
            # Build dynamic query
            where_conditions = ["is_active = TRUE"]
            query_params = []
            
            # Add current timestamp check
            where_conditions.append("(valid_from IS NULL OR valid_from <= NOW())")
            where_conditions.append("(valid_until IS NULL OR valid_until >= NOW())")
            
            if category:
                where_conditions.append("category = %s")
                query_params.append(category)
            
            if priority:
                where_conditions.append("priority = %s")
                query_params.append(priority)
                
            if location:
                where_conditions.append("(location LIKE %s OR location = 'All India')")
                query_params.append(f"%{location}%")
            
            # Build final query
            sql = f"""
                SELECT announcement_id, title, content, category, source, priority, 
                       location, valid_from, valid_until, published_at, updated_at
                FROM announcements 
                WHERE {' AND '.join(where_conditions)}
                ORDER BY 
                    CASE priority 
                        WHEN 'CRITICAL' THEN 4
                        WHEN 'HIGH' THEN 3
                        WHEN 'MEDIUM' THEN 2
                        WHEN 'LOW' THEN 1
                    END DESC,
                    published_at DESC
                LIMIT %s
            """
            query_params.append(limit)
            
            cursor.execute(sql, query_params)
            announcements = cursor.fetchall()
            print(f"DEBUG: Found {len(announcements)} announcements")
        
        # Process results
        processed_announcements = []
        for announcement in announcements:
            processed_announcement = {
                'announcement_id': announcement['announcement_id'],
                'title': announcement['title'],
                'content': announcement['content'],
                'category': announcement['category'],
                'source': announcement['source'],
                'priority': announcement['priority'],
                'location': announcement['location'],
                'valid_from': announcement['valid_from'].strftime('%Y-%m-%d %H:%M:%S') if announcement['valid_from'] else None,
                'valid_until': announcement['valid_until'].strftime('%Y-%m-%d %H:%M:%S') if announcement['valid_until'] else None,
                'published_at': announcement['published_at'].strftime('%Y-%m-%d %H:%M:%S') if announcement['published_at'] else None,
                'updated_at': announcement['updated_at'].strftime('%Y-%m-%d %H:%M:%S') if announcement['updated_at'] else None
            }
            processed_announcements.append(processed_announcement)
        
        response = {
            'total_announcements': len(processed_announcements),
            'announcements': processed_announcements,
            'filters_applied': {
                'category': category if category else 'all',
                'priority': priority if priority else 'all',
                'location': location if location else 'all',
                'limit': limit
            },
            'retrieved_at': datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')
        }
        print("DEBUG: Successfully created response")
        
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

