import React, { createContext, useState, useContext, useEffect } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {

<<<<<<< HEAD
    // svaki put kad se username promeni -> snimamo u localStorage
    //svaki put kad se user promeni--> snimamo u localStorage Ispravka Josip
    useEffect(() => {
        if (user) {
            localStorage.setItem("username", username);
            localStorage.setItem("Userid", user.id);
        } else {
            localStorage.removeItem("username");
            localStorage.removeItem("userId");
        }
    }, [user]);
=======
  const [username, setUsername] = useState(() => {
    return localStorage.getItem("username") || null;
  });
>>>>>>> 78f843589c3f48745cf58de04e2011db66ab692e

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
