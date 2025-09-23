import React from "react";
import { useUser } from "../users/UserContext";
import { Link, Navigate } from "react-router-dom";



export default function Header() {
    const { username } = useUser();

    return (
        <header className="app-header">
            <div className="logo">🍴 Gozba na klik</div>
            <div className="user-info">
                {username ? (
                    <span>Dobrodošao, <Link><strong>{username}</strong></Link></span>
                ) : (
                    <span>Niste ulogovani</span>
                )}
            </div>
        </header>
    );
}

