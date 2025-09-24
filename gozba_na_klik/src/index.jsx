import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/main.scss";
import { UserProvider } from "./components/users/UserContext";
import "./styles/main.scss";

ReactDOM.createRoot(document.getElementById("root")).render(


    <React.StrictMode>
        <UserProvider>
            <App />
        </UserProvider>
    </React.StrictMode>
);

