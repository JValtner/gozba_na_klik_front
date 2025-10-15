import React, { createContext, useState, useContext, useEffect } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [username, setUsername] = useState(() => {
    return localStorage.getItem("username") || null;
  });

  const [userId, setUserId] = useState(() => {
    const storedId = localStorage.getItem("userId");
    return storedId ? Number(storedId) : null;
  });

  const [role, setRole] = useState(() => {
    return localStorage.getItem("role");
  });

  useEffect(() => {
    if (username && userId) {
      localStorage.setItem("username", username);
      localStorage.setItem("userId", userId);
      localStorage.setItem("role", role);
    } else {
      localStorage.removeItem("username");
      localStorage.removeItem("userId");
      localStorage.removeItem("role");
    }
  }, [username, userId]);

  function logout() {
    setUsername(null);
    setUserId(null);
    setRole(null);
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  }

  const isAuth = !!username;

  return (
    <UserContext.Provider
      value={{
        username,
        setUsername,
        userId,
        setUserId,
        isAuth,
        logout,
        role,
        setRole,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
