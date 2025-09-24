import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/main.scss";
import { UserProvider } from "./components/users/UserContext";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>
);
