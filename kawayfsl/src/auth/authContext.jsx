import { createContext, useState, useEffect } from "react";
import * as currentUser from "./getCurrentUser";
import { userSignIn } from "./userSignIn";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getCurrentUser = async () => {
    try {
      const user = await currentUser.getCurrentUser();
      setUser(user);
    } catch (err) {
      console.error(err);
      setUser(null)
    } 
}

  useEffect(() => {
    getCurrentUser()
    .then(() => setIsLoading(false))
    .catch(() => setIsLoading(false))
  }, []);

  const signIn = async (email, password) => {
    await userSignIn(email, password)
    await getCurrentUser()
  }

  const authValue = {
    user,
    isLoading,
    signIn,
  };

  return (
  <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  )
}

export {AuthContext, AuthProvider}