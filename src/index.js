import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./css/index.css";
import "./css/landing.css";
import "./css/forms.css";
import "./css/docs.css";
import "./css/auth.css";
import "./css/drive.css";
import "./css/translate.css";
import "./css/meet.css";

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
