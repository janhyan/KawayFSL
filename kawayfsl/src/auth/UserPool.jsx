import {CognitoUserPool} from "amazon-cognito-identity-js";

const poolData = {
    UserPoolId: import.meta.env.VITE_APP_USER_POOL_ID, // Your user pool id here
    ClientId: import.meta.env.VITE_APP_CLIENT_ID // Your client id here
};

export const userPool = new CognitoUserPool(poolData);