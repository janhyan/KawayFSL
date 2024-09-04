import { userPool } from "./UserPool"

export function userSignOut() {
    const cognitoUser = userPool.getCurrentUser()
    if (cognitoUser) {
      cognitoUser.signOut()
    }

    
  }