import json
import os
import sys
import boto3
import psycopg2
import logging

ALLOWED_ORIGINS = ["http://localhost:3000", "https://dvbk4z4bhydxp.cloudfront.net"]

# Establish connection to postgres
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

def handler(event, context):
    # origin = event["headers"].get("origin", "")
    
    # headers = {
    #     "Access-Control-Allow-Origin": origin if origin in ALLOWED_ORIGINS else "",
    #     "Access-Control-Allow-Credentials": True,
    #     "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
    #     "X-Requested-With": "*",
    #     "Access-Control-Allow-Headers": "X-PINGOTHER, Content-Type,X-Amz-Date,X-Amz-Security-Token,Authorization,X-Api-Key,X-Requested-With,Accept,Access-Control-Allow-Methods,Access-Control-Allow-Origin,Access-Control-Allow-Headers",
    # }
    items = []
    with conn.cursor() as cur:
        cur.execute("SELECT * FROM Lessons")
        logging.info("Executed query. Results:")
        for row in cur.fetchall():
            logging.info(row)
            items.append(row)
    conn.commit()
    

    
    return {
        "statusCode": 200,
        # "headers": headers,
        "body": json.dumps(items)
    }
