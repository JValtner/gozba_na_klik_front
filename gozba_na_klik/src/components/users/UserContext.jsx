import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getToken,
  setToken,
  removeToken,
  login as loginService,
  register as registerService,
  getCurrentProfile,
  getUserRolesFromToken,
  logout as logoutService,
} from "../service/userService";

const UserContext = createContext(null);
export const useUser = () => useContext(UserContext);

export default function UserProvider({ children }) {
  const [token, setTokenState] = useState(() => getToken());
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState(() => getUserRolesFromToken(getToken()));
  const [loading, setLoading] = useState(Boolean(token));

  // Load profile when token exists
  useEffect(() => {
    if (!token) {
      setLoading(false);
      setUser(null);
      setRoles([]);
      return;
    }

    let mounted = true;
    setLoading(true);

    getCurrentProfile()
      .then((data) => mounted && setUser(data))
      .catch(() => {
        logoutService();
        removeToken();
        setTokenState(null);
        setUser(null);
        setRoles([]);
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [token]);

  const login = async (credentials) => {
  const data = await loginService(credentials);
  const t = typeof data === "string" ? data : data.token ?? data.accessToken;

  if (t) {
    setToken(t);
    setTokenState(t);
    setRoles(getUserRolesFromToken(t));

    // fetch profile immediately after login
    const profile = await getCurrentProfile();
    setUser(profile);

    // return the token you just stored
    return t;
  }

  return null;
};


  const register = async (payload) => {
    await registerService(payload);
  };

  const logout = () => {
    logoutService();
    removeToken();
    setTokenState(null);
    setUser(null);
    setRoles([]);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        userId: user?.id || null,
        username: user?.username || null,
        role: roles?.[0] || null,
        token,
        loading,
        isAuth: Boolean(user),
        login,
        register,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
