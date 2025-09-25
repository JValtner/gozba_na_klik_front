import React, { createContext, useState, useContext, useEffect } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [username, setUsername] = useState(() => {
    return localStorage.getItem("username") || null;
  });
  const [role, setRole] = useState(() => {
    return localStorage.getItem("role") || null;
  });

  useEffect(() => {
    if (username) {
      localStorage.setItem("username", username);
    } else {
      localStorage.removeItem("username");
    }
  }, [username]);

  useEffect(() => {
    if (role) {
      localStorage.setItem("role", role);
    } else {
      localStorage.removeItem("role");
    }
  }, [role]);

  function logout() {
    setUsername(null);
    setRole(null);
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  }
  const isAuth = !!username;

  return (
    <UserContext.Provider
      value={{ username, setUsername, role, setRole, isAuth, logout }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
