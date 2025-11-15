import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import  UserProvider from "../src/components/users/UserContext";
import "./styles/main.scss";

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>
);
