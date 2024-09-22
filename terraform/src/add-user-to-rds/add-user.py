import os
import sys
import boto3
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

except psycopg2.Error as e:
    logging.error("Error connecting to the database")
    logging.error(e)
    sys.exit()

logging.info("Successfully connected to the database")

def lambda_handler(event, context):
    user = event['request']['userAttributes']
    print("USER:")
    print(user)
    user_display_name = user['name']
    user_email = user['email']
    user_id = user['sub']

    with conn.cursor() as cur:
        cur.execute("INSERT INTO Users (user_id, display_name, email) VALUES (%s, %s, %s)", (user_id, user_display_name, user_email))
    conn.commit()

    cur.close()
    conn.close()
    print('Database connection closed.')

    return event