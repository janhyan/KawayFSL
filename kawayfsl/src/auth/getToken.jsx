import { userPool } from "./UserPool";

export default async function getToken() {
  return new Promise((resolve, reject) => {
    const cognitoUser = userPool.getCurrentUser();

    if (!cognitoUser) {
      reject(new Error("No current user found"));
      return;
    }

    cognitoUser.getSession((err, session) => {
      if (err) {
        reject(err);
        return;
      }

      // Get the JWT token from the session
      const token = session.getIdToken().getJwtToken();
      resolve(token);
    });
  });
}
