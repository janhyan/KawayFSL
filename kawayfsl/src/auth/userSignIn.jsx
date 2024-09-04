import { AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import { userPool } from "./UserPool";


export function userSignIn(email, password) {
  return new Promise((resolve, reject) => {
    const authenticatinDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool,
    });

    cognitoUser.authenticateUser(authenticatinDetails, {
      onSuccess: (result) => {
        resolve(result);
      },
      onFailure: (err) => {
        reject(err);
      },
    });
  });
}