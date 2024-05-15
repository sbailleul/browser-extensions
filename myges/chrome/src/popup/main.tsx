import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/popup/App";
import "@/popup/index.css";
const root = document.createElement("div");
root.id = "myges-content-script-root";

document.body.appendChild(root);

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
