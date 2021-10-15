import { Link, TextField } from "@material-ui/core";
import { Redirect, useHistory, useLocation } from "react-router-dom";
import { useContext, useState } from "react";

import CircularIntegration from "../../components/CircularIntegration";
import Favicon from "../../components/Favicon";
import Particles from "../../components/Particles";
import Title from "../../components/Title";
import axios from "axios";
import { userContext } from "../../App";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SignUp() {
  const query = useQuery();
  const redirect = query.get("redirect");

  const { currentUser } = useContext(userContext);
  const history = useHistory();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [loading, setLoading] = useState(false);

  const validateUsername = () => {
    if (!username.trim()) {
      setUsernameError("Please enter your username");
      return false;
    } else {
      setUsernameError("");
      return true;
    }
  };
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
    if (password.length < 6 || password.length > 18) {
      setPasswordError("Password must be between 6-18 character");
      return false;
    } else {
      setPasswordError("");
      return true;
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const validation = validateEmail() && validatePassword() && validateUsername();

    if (!usernameError && !emailError && !passwordError && validation) signUp();
  };

  const signUp = async () => {
    setLoading(true);

    await axios
      .post("auth/sign-up", { username, email, password })
      .then((res) => {
        let url = new URL(window.location.href);
        let params = new URLSearchParams(url.search);

        if (redirect) params.set("redirect", redirect);
        params.set("alert", 1);
        history.push(`/sign-in?${params.toString()}`);
      })
      .catch((err) => {
        console.log(err, err.response);
        if (err.response) {
          if (err.response.data.code === "email-in-use") {
            setEmailError(err.response.data.message);
          } else {
            setEmailError("Account creation failed! Please try again later");
          }
        } else {
          alert(err);
        }
      });

    setLoading(false);
  };

  return (
    <>
      <Favicon icon="https://ik.imagekit.io/nap/google-minified/google__RkZUHwQQ.png" />
      <Title title="Sign Up - Google Minified" />
      {!currentUser ? (
        <>
          <Particles />
          <div className="auth-form-container">
            <form style={{ padding: "0 20px" }} className="auth-form" onSubmit={handleFormSubmit} noValidate>
              <TextField type="text" error={usernameError ? true : false} label="Username" helperText={usernameError} value={username} onChange={(e) => setUsername(e.target.value)} onBlur={validateUsername} />
              <TextField type="email" error={emailError ? true : false} label="Email" helperText={emailError} value={email} onChange={(e) => setEmail(e.target.value)} onBlur={validateEmail} />
              <TextField type="password" error={passwordError ? true : false} label="Password" helperText={passwordError} value={password} onChange={(e) => setPassword(e.target.value)} onBlur={validatePassword} />
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  history.push(`/sign-in${redirect ? "?redirect=" + encodeURIComponent(redirect) : ""}`);
                }}
              >
                Already have an account? Sign in
              </Link>
              <CircularIntegration
                onClick={() => {
                  validateUsername();
                  validateEmail();
                  validatePassword();
                }}
                text="Sign up"
                loading={loading}
              />
            </form>
          </div>
        </>
      ) : (
        <Redirect to={redirect ? redirect : "/"} />
      )}
    </>
  );
}

export default SignUp;
