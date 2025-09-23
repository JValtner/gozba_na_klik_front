import React, { createContext, useState, useContext, useEffect } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
    // inicijalno čitamo username iz localStorage
    const [username, setUsername] = useState(() => {
        return localStorage.getItem("username") || null;
    });

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

    return (
        <UserContext.Provider value={{ username, setUsername }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}
