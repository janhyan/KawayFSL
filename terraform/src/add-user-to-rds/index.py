import os
import sys
import psycopg2
import logging

# Configure logging level
logging.basicConfig(level=logging.INFO)

def lambda_handler(event, context):
    # Establish the database connection inside the function to avoid connection reuse issues
    try:
        conn = psycopg2.connect(
            host=os.environ['DB_HOST'],
            database=os.environ['DB_NAME'],
            port=os.environ['DB_PORT'],
            user=os.environ['DB_USER'],
            password=os.environ['DB_PASSWORD']
        )
        logging.info("Successfully connected to the database")
    except psycopg2.Error as e:
        logging.error("Error connecting to the database")
        logging.error(e)
        sys.exit()

    # Extracting user attributes from the event
    user = event['request']['userAttributes']
    user_display_name = user.get('given_name')
    user_email = user.get('email')
    user_id = user.get('sub')  
    module_id = 1  
    lesson_id = 1  
    status = True  

    try:
        # Start a new database transaction
        with conn.cursor() as cur:
            # Insert into Users table
            cur.execute("""
                INSERT INTO Users (user_id, display_name, email) 
                VALUES (%s, %s, %s) 
                ON CONFLICT (user_id) DO NOTHING
            """, (user_id, user_display_name, user_email))  # Prevents duplication

            # Insert into UsersModuleProgress table
            cur.execute("""
                INSERT INTO UsersModuleProgress (user_id, module_id, status) 
                VALUES (%s, %s, %s)
            """, (user_id, module_id, status))

            # Insert into UsersLessonsProgress table
            cur.execute("""
                INSERT INTO UsersLessonsProgress (user_id, lesson_id, status) 
                VALUES (%s, %s, %s)
            """, (user_id, lesson_id, status))
        
        # Commit the transaction
        conn.commit()
        logging.info("Insert successful")

    except psycopg2.Error as e:
        # Rollback in case of any error
        conn.rollback()
        logging.error("Error executing query")
        logging.error(e)
    finally:
        # Close the connection after the transaction
        if conn:
            conn.close()
            logging.info('Database connection closed.')

    return event
