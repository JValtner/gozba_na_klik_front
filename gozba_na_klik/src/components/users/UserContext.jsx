import React, { createContext, useState, useContext, useEffect } from "react";
import { set } from "react-hook-form";

const UserContext = createContext();

export function UserProvider({ children }) {

  const [username, setUsername] = useState(() => {
    return localStorage.getItem("username") || null;
  });
  const [userId, setUserId] = useState(() => {
  const storedId = localStorage.getItem("userId");
  return storedId ? Number(storedId) : null;
});

    // svaki put kad se username promeni -> snimamo u localStorage
    //svaki put kad se user promeni--> snimamo u localStorage Ispravka Josip
    useEffect(() => {
        if (username && userId) {
            localStorage.setItem("username", username);
            localStorage.setItem("userId", userId);
        } else {
            localStorage.removeItem("username");
            localStorage.removeItem("userId");
        }
    }, [username, userId]);

  

  function logout() {
    setUsername(null);
    setUserId(null);
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    localStorage.removeItem("token"); 
  }
  const isAuth = !!username;

  return (
    <UserContext.Provider value={{ username, setUsername, userId, setUserId, isAuth, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
