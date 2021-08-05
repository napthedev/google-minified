import { useState, useContext, useEffect } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { TextField, Button, Link } from "@material-ui/core";
import { userContext } from "../App";
import axios from "axios";

import Particles from "./Particles";

function SignUp() {
  useEffect(() => (document.querySelector("link[rel='shortcut icon']").href = "https://i.imgur.com/yq4Tp3N.png"), []);

  const { currentUser } = useContext(userContext);
  const history = useHistory();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateUsername = () => {
    if (!username.trim()) {
      setUsernameError("Please enter your username");
    } else {
      setUsernameError("");
    }
  };
  const validateEmail = () => {
    if (!/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
      setEmailError("Please enter a valid email");
    } else {
      setEmailError("");
    }
  };
  const validatePassword = () => {
    if (password.length < 6 || password.length > 18) {
      setPasswordError("Password must be between 6-18 character");
    } else {
      setPasswordError("");
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!usernameError && !emailError && !passwordError) signUp();
  };

  const signUp = () => {
    axios
      .post(process.env.REACT_APP_SERVER_URL + "auth/sign-up", { username, email, password })
      .then((res) => {
        alert("Account creation successful, please verify your email");
        history.push("/sign-in");
      })
      .catch((err) => {
        console.log(err, err.response);
        if (err.response) {
          if (err.response.data.code === "email-in-use") {
            setEmailError(err.response.data.message);
          } else {
            alert("Account creation failed! Please try again later");
          }
        } else {
          alert(err);
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
              <TextField type="text" error={usernameError ? true : false} label="Username" helperText={usernameError} value={username} onChange={(e) => setUsername(e.target.value)} onKeyUp={validateUsername} />
              <TextField type="email" error={emailError ? true : false} label="Email" helperText={emailError} value={email} onChange={(e) => setEmail(e.target.value)} onKeyUp={validateEmail} />
              <TextField type="password" error={passwordError ? true : false} label="Password" helperText={passwordError} value={password} onChange={(e) => setPassword(e.target.value)} onKeyUp={validatePassword} />
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  history.push("/sign-in");
                }}
              >
                Already have an account? Sign in
              </Link>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                onClick={() => {
                  validateUsername();
                  validateEmail();
                  validatePassword();
                }}
              >
                Sign up
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

export default SignUp;
