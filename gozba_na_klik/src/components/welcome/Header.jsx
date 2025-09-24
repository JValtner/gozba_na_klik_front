import React from "react";
import { useUser } from "../users/UserContext";


export default function Header() {
    const { username } = useUser();

    return (
        <header className="app-header">
            <div className="logo">🍴 Gozba na klik</div>
            <div className="user-info">
                {username ? (
                    <span>Dobrodošao, <strong>{username}</strong></span>
                ) : (
                    <span>Niste ulogovani</span>
                )}
            </div>
        </header>
    );
}

