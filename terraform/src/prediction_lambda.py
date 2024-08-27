import json

def lambda_handler(event, context):
    print(event)
    return {
        'statusCode': 200,
        'body': json.dumps(event) # returning the data sent to backend lambda function as API response.
    }