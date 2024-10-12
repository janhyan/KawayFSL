import json
import numpy as np
from keras.models import Sequential
from keras.layers import LSTM, Dense
from sklearn.model_selection import train_test_split
from keras.utils import to_categorical

ALLOWED_ORIGINS = ["http://localhost:3000", "https://www.kawayfsl.com"]


def lambda_handler(event, context):
    print(event)
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
    # body = event.get("body", "")
    body = event["body"].get("sequence", "")
    assessment_id = event["body"].get("assessment_id", "")


    if body:
        try:
            # If body is a string representation of a JSON array or object
            parsed_body = json.loads(body)
        except json.JSONDecodeError:
            # Handle cases where the body might not be JSON (e.g., plain text)
            parsed_body = body
    else:
        parsed_body = {}

    print("Event:", event)
    prediction = makePrediction(parsed_body, assessment_id)

    return {
        "statusCode": 200,
        "headers": headers,
        "body": json.dumps(prediction),  # returning the parsed prediction data
    }


def makePrediction(sequence, assessment_id):
    actions = np.array(["Ako si", "Ano ang pangalan mo", "Ilang taon ka na", "Sino"])
    model = Sequential()
    model.add(
        LSTM(64, return_sequences=False, activation="relu", input_shape=(40, 1662))
    )
    model.add(Dense(16, activation="relu"))
    model.add(Dense(actions.shape[0], activation="softmax"))
    
    if assessment_id == 2:
        model.load_weights("introduction.h5")
    elif assessment_id == 3:
        model.load_weights("greetings.h5")
    else:
        model.load_weights("vocab.h5")

    res = model.predict(np.expand_dims(sequence, axis=0))[0]

    return actions[np.argmax(res)]
