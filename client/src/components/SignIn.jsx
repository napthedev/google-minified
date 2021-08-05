import { useState, useContext, useEffect } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { TextField, Button, Link } from "@material-ui/core";
import { userContext } from "../App";
import axios from "axios";

import Particles from "./Particles";

function SignIn() {
  useEffect(() => (document.querySelector("link[rel='shortcut icon']").href = "https://i.imgur.com/yq4Tp3N.png"), []);

  const { currentUser, setCurrentUser } = useContext(userContext);

  const history = useHistory();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateEmail = () => {
    if (!/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
      setEmailError("Please enter a valid email");
    } else {
      setEmailError("");
    }
  };
  const validatePassword = () => {
    if (password.length === 0) {
      setPasswordError("Enter your password");
    } else {
      setPasswordError("");
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!emailError && !passwordError) signIn();
  };

  const signIn = () => {
    axios
      .post(process.env.REACT_APP_SERVER_URL + "auth/sign-in", { email, password })
      .then((res) => {
        setCurrentUser(res.data.user);
      })
      .catch((err) => {
        console.log(err, err.response);
        if (err.response.data.code === "email-not-found" || err.response.data.code === "email-not-verified") {
          setEmailError(err.response.data.message);
        } else if (err.response.data.code === "incorrect-password") {
          setPasswordError(err.response.data.message);
        }
      });
  };

  return (
    <>
      {!currentUser ? (
        <>
          <Particles />
          <div className="auth-form-container">
            <form style={{ padding: "0 20px" }} className="auth-form" onSubmit={handleFormSubmit} noValidate>
              <TextField type="email" error={emailError ? true : false} label="Email" helperText={emailError} value={email} onChange={(e) => setEmail(e.target.value)} onKeyUp={validateEmail} />
              <TextField type="password" error={passwordError ? true : false} label="Password" helperText={passwordError} value={password} onChange={(e) => setPassword(e.target.value)} onKeyUp={validatePassword} />
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  history.push("/sign-up");
                }}
              >
                Don't have an account? Sign up
              </Link>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                onClick={() => {
                  validateEmail();
                  validatePassword();
                }}
              >
                Sign in
              </Button>
            </form>
          </div>
        </>
      ) : (
        <Redirect to="/" />
      )}
    </>
  );
}

export default SignIn;
