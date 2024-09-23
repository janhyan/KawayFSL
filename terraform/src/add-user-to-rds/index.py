import os
import sys
import psycopg2
import logging

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

def lambda_handler(event, context):
    user = event['request']['userAttributes']
    user_display_name = user.get('given_name', 'Default Name')
    user_email = user.get('email', 'default@example.com')
    user_id = user.get('sub')

    try:
        with conn.cursor() as cur:
            cur.execute("INSERT INTO Users (user_id, display_name, email) VALUES (%s, %s, %s)", 
                        (user_id, user_display_name, user_email))
        conn.commit()
        logging.info("Insert successful")
    except psycopg2.Error as e:
        conn.rollback()  # Rollback the transaction on error
        logging.error("Error executing query")
        logging.error(e)
    finally:
        if conn:
            conn.close()  # Ensure the connection is closed even if there's an error
            logging.info('Database connection closed.')

    return event
