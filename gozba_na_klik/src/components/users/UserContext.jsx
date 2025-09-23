import React, { createContext, useState, useContext, useEffect } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {

  const [username, setUsername] = useState(() => {
    return localStorage.getItem("username") || null;
  });

  useEffect(() => {
    if (username) {
      localStorage.setItem("username", username);
    } else {
      localStorage.removeItem("username");
    }
  }, [username]);

  function logout() {
    setUsername(null);
    localStorage.removeItem("username");
    localStorage.removeItem("token"); 
  }
  const isAuth = !!username;

  return (
    <UserContext.Provider value={{ username, setUsername, isAuth, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
