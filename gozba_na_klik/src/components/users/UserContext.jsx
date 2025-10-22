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

  // Default to "Guest" if nothing is in localStorage
  const [role, setRole] = useState(() => {
    return localStorage.getItem("role") || "Guest";
  });

  useEffect(() => {
    if (username && userId) {
      localStorage.setItem("username", username);
      localStorage.setItem("userId", userId);
      localStorage.setItem("role", role);
    } else {
      // if logged out, keep role as Guest instead of removing it
      localStorage.removeItem("username");
      localStorage.removeItem("userId");
      localStorage.removeItem("token");
      localStorage.setItem("role", "Guest");
      setRole("Guest");
    }
  }, [username, userId, role]);

  function logout() {
    setUsername(null);
    setUserId(null);
    setRole("Guest"); // explicitly set Guest on logout
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.setItem("role", "Guest");
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