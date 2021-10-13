import { useState, useContext } from "react";
import { Redirect, useHistory, useLocation } from "react-router-dom";
import { TextField, Link, Snackbar, IconButton } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { userContext } from "../App";
import axios from "axios";

import Particles from "./Particles";
import CircularIntegration from "./CircularIntegration";
import Title from "../components/Title";
import Favicon from "../components/Favicon";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SignIn() {
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
      return false;
    } else {
      setEmailError("");
      return true;
    }
  };
  const validatePassword = () => {
    if (password.length === 0) {
      setPasswordError("Enter your password");
      return false;
    } else {
      setPasswordError("");
      return true;
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const validation = validateEmail() && validatePassword();

    if (!emailError && !passwordError && validation) signIn();
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
      <Favicon icon="https://ik.imagekit.io/nap/google-minified/google__RkZUHwQQ.png" />
      <Title title="Sign In - Google Minified" />
      {!currentUser ? (
        <>
          <Particles />
          <div className="auth-form-container">
            <form style={{ padding: "0 20px" }} className="auth-form" onSubmit={handleFormSubmit} noValidate>
              <TextField type="email" error={emailError ? true : false} label="Email" helperText={emailError} value={email} onChange={(e) => setEmail(e.target.value)} onBlur={validateEmail} />
              <TextField type="password" error={passwordError ? true : false} label="Password" helperText={passwordError} value={password} onChange={(e) => setPassword(e.target.value)} onBlur={validatePassword} />
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
