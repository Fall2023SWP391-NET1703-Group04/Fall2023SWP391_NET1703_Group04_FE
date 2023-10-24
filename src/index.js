import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "primereact/resources/themes/lara-light-indigo/theme.css"; //theme
import "primereact/resources/primereact.min.css"; //core css
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
import '/node_modules/primeflex/primeflex.css'
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>

  <App />
  // </React.StrictMode>
);

reportWebVitals();
