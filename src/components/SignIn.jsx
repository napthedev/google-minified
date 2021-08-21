import { useState, useContext, useEffect } from "react";
import { Redirect, useHistory, useLocation } from "react-router-dom";
import { TextField, Link, Snackbar, IconButton } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { userContext } from "../App";
import axios from "axios";

import Particles from "./Particles";
import CircularIntegration from "./CircularIntegration";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SignIn() {
  useEffect(() => {
    document.querySelector("link[rel='shortcut icon']").href = "https://i.imgur.com/UcOrFtl.png";
    document.title = "Sign In - Google Minified";
  }, []);

  const query = useQuery();
  const redirect = query.get("redirect");

  const { currentUser, setCurrentUser } = useContext(userContext);

  const history = useHistory();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [loading, setLoading] = useState(false);

  const [snackbarOpened, setSnackbarOpened] = useState(Boolean(Number(query.get("alert"))));

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

  const signIn = async () => {
    setLoading(true);

    await axios
      .post("auth/sign-in", { email, password })
      .then((res) => {
        if (res.status === 200) {
          setCurrentUser(res.data);
        } else {
          console.log(res);
          setEmailError("Unknown error occured");
          setCurrentUser(null);
        }
      })
      .catch((err) => {
        console.log(err, err.response);
        if (err.response.data.code === "email-not-found" || err.response.data.code === "email-not-verified") {
          setEmailError(err.response.data.message);
        } else if (err.response.data.code === "incorrect-password") {
          setPasswordError(err.response.data.message);
        } else {
          setEmailError("Unknown error occured");
          setLoading(false);
        }
      });

    setLoading(false);
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
                  history.push(`/sign-up${redirect ? "?redirect=" + encodeURIComponent(redirect) : ""}`);
                }}
              >
                Don't have an account? Sign up
              </Link>
              <CircularIntegration
                onClick={() => {
                  validateEmail();
                  validatePassword();
                }}
                text="Sign in"
                loading={loading}
              />
            </form>
          </div>
          <Snackbar
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={snackbarOpened}
            onClose={() => setSnackbarOpened(false)}
            message="Please verify your email address. You may check your spam folder!"
            action={
              <IconButton size="small" aria-label="close" color="inherit" onClick={() => setSnackbarOpened(false)}>
                <Close fontSize="small" />
              </IconButton>
            }
          />
        </>
      ) : (
        <Redirect to={redirect ? redirect : "/"} />
      )}
    </>
  );
}

export default SignIn;
