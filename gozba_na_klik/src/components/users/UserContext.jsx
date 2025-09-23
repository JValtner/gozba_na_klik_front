import React, { createContext, useState, useContext, useEffect } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
    // inicijalno čitamo username iz localStorage
    const [username, setUsername] = useState(() => {
        return localStorage.getItem("username") || null;
    });

    // svaki put kad se username promeni -> snimamo u localStorage
    useEffect(() => {
        if (username) {
            localStorage.setItem("username", username);
        } else {
            localStorage.removeItem("username");
        }
    }, [username]);

    return (
        <UserContext.Provider value={{ username, setUsername }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}
