import { createContext, useState, useEffect } from "react";
import setCurrentUser from "./setCurrentUser";
import { userSignOut } from "./userSignOut";
import { userSignIn } from "./userSignIn";
import getToken from "./getToken";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState();

  const fetchUser = async () => {
    try {
      const user = await setCurrentUser();
      setUser(user);

      const token = await getToken();
      setToken(token);
    } catch (err) {
      console.log(err);
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser()
      .then(() => setIsLoading(false))
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, []);

  const signIn = async (email, password) => {
    await userSignIn(email, password);
    await fetchUser();
  };
  const signOut = async () => {
    await userSignOut();
    setUser(null);
  };

  const authValue = {
    user,
    isLoading,
    signIn,
    signOut,
    token,
  };

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
}


export { AuthContext, AuthProvider };
