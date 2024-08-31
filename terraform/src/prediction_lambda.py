import json
import numpy as np
from keras.models import Sequential
from keras.layers import LSTM, Dense
from sklearn.model_selection import train_test_split
from keras.utils import to_categorical


def lambda_handler(event, context):

    # Handle OPTIONS request for CORS preflight
    if event["httpMethod"] == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "http://localhost:3000",  # Adjust as needed
                "Access-Control-Allow-Credentials": "true",  # Allow credentials
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
                "X-Requested-With": "*",
                "Access-Control-Allow-Headers": "X-PINGOTHER, Content-Type,X-Amz-Date,X-Amz-Security-Token,Authorization,X-Api-Key,X-Requested-With,Accept,Access-Control-Allow-Methods,Access-Control-Allow-Origin,Access-Control-Allow-Headers",
            },
            "body": json.dumps("CORS preflight response"),
        }

    # Ensure that body exists and is properly decoded
    body = event.get("body", "")

    if body:
        try:
            # If body is a string representation of a JSON array or object
            parsed_body = json.loads(body)
            print("Parsed body:", parsed_body)
        except json.JSONDecodeError:
            # Handle cases where the body might not be JSON (e.g., plain text)
            print("Body is not a valid JSON:", body)
            parsed_body = body
    else:
        parsed_body = {}

    print("Event:", event)
    prediction = makePrediction(parsed_body)

    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": "http://localhost:3000",  # Adjust as needed
            "Access-Control-Allow-Credentials": "true",  # Allow credentials
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
            "X-Requested-With": "*",
            "Access-Control-Allow-Headers": "X-PINGOTHER, Content-Type,X-Amz-Date,X-Amz-Security-Token,Authorization,X-Api-Key,X-Requested-With,Accept,Access-Control-Allow-Methods,Access-Control-Allow-Origin,Access-Control-Allow-Headers",
        },
        "body": json.dumps(prediction),  # returning the parsed prediction data
    }


def makePrediction(sequence):
    actions = np.array(["Ako si", "Ano ang pangalan mo", "Ilang taon ka na", "Sino"])
    model = Sequential()
    model.add(
        LSTM(64, return_sequences=False, activation="relu", input_shape=(40, 1662))
    )
    model.add(Dense(16, activation="relu"))
    model.add(Dense(actions.shape[0], activation="softmax"))
    model.load_weights("introduction.h5")

    res = model.predict(np.expand_dims(sequence, axis=0))[0]
    print(actions[np.argmax(res)])

    return actions[np.argmax(res)]
