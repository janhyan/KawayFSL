import pickle
import json
import numpy as np

model_dict = pickle.load(open('./model.p', 'rb'))
model = model_dict['model']
labels_dict = {0: 'A', 1: 'B', 2: 'C', 3: 'D', 4: 'E', 5: 'F', 6: 'G', 7: 'H', 8: 'I', 9: 'J', 10: 'K', 11: 'L', 12: 'M', 13: 'N', 14: 'Ñ', 15: 'O', 16: 'P', 17: 'Q', 18: 'R', 19: 'S', 20: 'T', 21: 'U', 22: 'V', 23: 'W', 24: 'X', 25: 'Y', 26: 'Z'}

ALLOWED_ORIGINS = ["http://localhost:3000", "https://www.kawayfsl.com"]

def lambda_handler(event, context):
    origin = event["headers"].get("origin", "")

    headers = {
        "Access-Control-Allow-Origin": origin if origin in ALLOWED_ORIGINS else "",
        "Access-Control-Allow-Credentials": True,
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        "X-Requested-With": "*",
        "Access-Control-Allow-Headers": "X-PINGOTHER, Content-Type,X-Amz-Date,X-Amz-Security-Token,Authorization,X-Api-Key,X-Requested-With,Accept,Access-Control-Allow-Methods,Access-Control-Allow-Origin,Access-Control-Allow-Headers",
    }

    # Handle OPTIONS request for CORS preflight
    if event["httpMethod"] == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": headers,
            "body": json.dumps("CORS preflight response"),
        }

    # Ensure that body exists and is properly decoded
    body = event.get("body", "")

    if body:
        try:
            # If body is a string representation of a JSON array or object
            parsed_body = json.loads(body)
        except json.JSONDecodeError:
            # Handle cases where the body might not be JSON (e.g., plain text)
            parsed_body = body
    else:
        parsed_body = {}

    results = parsed_body
    data_aux = []
    x_ = []
    y_ = []

    if results:
        for landmarks in results:
            if len(landmarks['lh']) > len(landmarks['rh']):
                for i in range(len(landmarks['lh'])):
                    x = landmarks['lh'][i].x
                    y = landmarks['lh'][i].y

                    x_.append(x)
                    y_.append(y)

                for i in range(len(landmarks['lh'])):
                    x = landmarks['lh'][i].x
                    y = landmarks['lh'][i].y
                    data_aux.append(x - min(x_))
                    data_aux.append(y - min(y_))
            else:
                for i in range(len(landmarks['rh'])):
                    x = landmarks['rh'][i].x
                    y = landmarks['rh'][i].y

                    x_.append(x)
                    y_.append(y)

                for i in range(len(landmarks['rh'])):
                    x = landmarks['rh'][i].x
                    y = landmarks['rh'][i].y
                    data_aux.append(x - min(x_))
                    data_aux.append(y - min(y_))

        prediction = model.predict([np.asarray(data_aux)])

        predicted_character = labels_dict[int(prediction[0])]

    return {
        "statusCode": 200,
        "header"
        "body": json.dumps({
            "message": predicted_character,
        }),
}
    

