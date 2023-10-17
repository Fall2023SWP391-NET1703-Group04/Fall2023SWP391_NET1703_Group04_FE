import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { useNavigate } from "react-router-dom";
import { PrimeReactProvider } from "primereact/api";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>

  <App />
  // </React.StrictMode>
);

reportWebVitals();
