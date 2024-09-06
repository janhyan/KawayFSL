import json
import numpy as np
from keras.models import Sequential
from keras.layers import LSTM, Dense
from sklearn.model_selection import train_test_split
from keras.utils import to_categorical

def lambda_handler(event, context):
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
    makePrediction(parsed_body)

    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        },
        "body": json.dumps(parsed_body),  # returning the parsed body data
    }


def makePrediction(sequence):
    actions = np.array(['Ako si', 'Ano ang pangalan mo', 'Ilang taon ka na', 'Sino'])
    model = Sequential()
    model.add(
        LSTM(64, return_sequences=False, activation="relu", input_shape=(40, 1662))
    )
    model.add(Dense(16, activation="relu"))
    model.add(Dense(actions.shape[0], activation="softmax"))
    model.load_weights('/introduction.h5')

    res = model.predict(np.expand_dims(sequence, axis=0))[0]
    print(actions[np.argmax(res)])
