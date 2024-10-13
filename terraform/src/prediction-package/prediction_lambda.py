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


    prediction_data = parsed_body['sequence']
    assessment_id = parsed_body['assessment_id']

    print("Event:", event)
    prediction = makePrediction(prediction_data, assessment_id)

    return {
        "statusCode": 200,
        "headers": headers,
        "body": json.dumps(prediction),  # returning the parsed prediction data
    }


def makePrediction(sequence, assessment_id):
    if assessment_id == 2:
        model_path = "introduction.h5"
        actions = np.array(["Ako si", "Ano ang pangalan mo", "Ilang taon ka na", "Sino"])
    elif assessment_id == 3:
        model_path = "greetings.h5"
        actions = np.array(['Ingat ka', 'Kumusta ka', 'Magandang Araw', 'Magandang Gabi', 'Magandang Hapon', 'Magandang Umaga', 'Maraming Salamat', 'Paalam', 'Pasensya na'])  
    else:
        model_path = "vocab.h5"
        actions = np.array(['Bahay', 'Sala', 'Silid', 'Dilaw', 'Kusina', 'Ube', 'Guro', 'Kailan', 'Pinto']) 

    model = Sequential()
    model.add(
        LSTM(64, return_sequences=False, activation="relu", input_shape=(40, 1662))
    )
    model.add(Dense(16, activation="relu"))
    model.add(Dense(len(actions), activation="softmax"))  # Dynamically set output

    model.load_weights(model_path)

    res = model.predict(np.expand_dims(sequence, axis=0))[0]
    return actions[np.argmax(res)]
