import React from "react";
import { useNavigate } from "react-router-dom";

export default function WelcomePage() {
    const navigate = useNavigate();

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Dobrodošli u Gozba na Klik</h1>
            <p>Prijavite se ili kreirajte nalog kako biste koristili aplikaciju.</p>
            <button onClick={() => navigate("/register")}>
                Registracija
            </button>
        </div>
    );
}
