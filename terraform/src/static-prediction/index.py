import pickle
import json
import numpy as np
from statistics import mode

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
    parsed_body = json.loads(body) if body else {}

    results = parsed_body
    predicted_answer = []

    if results:
        for landmarks in results:
            data_aux = []
            x_ = []
            y_ = []
            lh_landmarks = landmarks.get('lh', [])  
            rh_landmarks = landmarks.get('rh', [])  

            # Skip if both are empty
            if not lh_landmarks and not rh_landmarks:
                continue

            # Select hand with the most landmarks
            chosen_hand = lh_landmarks if len(lh_landmarks) > len(rh_landmarks) else rh_landmarks

            # Left hand landmarks need to be flipped for accurate detection
            for i in range(len(chosen_hand)):
                x = chosen_hand[i]['x'] if chosen_hand == rh_landmarks else 1 - chosen_hand[i]['x']
                y = chosen_hand[i]['y']

                x_.append(x)
                y_.append(y)

            for i in range(len(chosen_hand)):
                x = chosen_hand[i]['x'] if chosen_hand == rh_landmarks else 1 - chosen_hand[i]['x']
                y = chosen_hand[i]['y']
                data_aux.append(x - min(x_))
                data_aux.append(y - min(y_))

            prediction = model.predict([np.asarray(data_aux)])

            predicted_character = labels_dict[int(prediction[0])]
            predicted_answer.append(predicted_character)

        # Ensure we have enough predictions to calculate mode
        if predicted_answer:
            # Check last third of frames
            checked_frames = predicted_answer[-int(len(predicted_answer) / 3):]
            user_answer = mode(checked_frames)

            # Handle special case for 'NG'
            if 'N' in predicted_answer and user_answer == 'G':
                user_answer = 'NG'
        else:
            user_answer = "No prediction made"

    return {
        "statusCode": 200,
        "headers": headers,
        "body": json.dumps(user_answer),
}
    

