import "./css/index.css";
import "./css/landing.css";
import "./css/forms.css";
import "./css/docs.css";
import "./css/auth.css";
import "./css/drive.css";
import "./css/translate.css";
import "./css/meet.css";

import App from "./App";
import { BrowserRouter } from "react-router-dom";
import React from "react";
import ReactDOM from "react-dom";

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
