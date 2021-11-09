import { Redirect, useLocation } from "react-router-dom";
import { useMemo, useState } from "react";

import { GoogleLogin } from "react-google-login";
import { Snackbar } from "@material-ui/core";
import axios from "axios";
import { useStore } from "../../shared/store";

export default function Auth() {
  const currentUser = useStore((state) => state.currentUser);
  const setCurrentUser = useStore((state) => state.setCurrentUser);

  const { search } = useLocation();

  const query = useMemo(() => new URLSearchParams(search), [search]);

  const redirect = query.get("redirect");

  const [disabled, setDisabled] = useState(false);
  const [snackbarOpened, setSnackbarOpened] = useState(false);

  const successHandle = (res) => {
    console.log(res);
    setDisabled(true);
    axios
      .post("/auth/google", {
        user: {
          id: res.profileObj.googleId,
          photoURL: res.profileObj.imageUrl,
          email: res.profileObj.email,
          username: res.profileObj.name,
        },
      })
      .then((res) => {
        console.log(res);
        setCurrentUser(res.data);
      })
      .catch(failureHandle)
      .finally(() => setDisabled(false));
  };

  const failureHandle = (err) => {
    console.log(err);
    setSnackbarOpened(true);
  };

  if (currentUser) return <Redirect to={redirect || "/"} />;

  return (
    <>
      <div style={{ width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ width: "100%", maxWidth: 400, display: "flex", justifyContent: "center" }}>
          <GoogleLogin clientId={process.env.REACT_APP_OAUTH_CLIENT_ID} buttonText="Sign In With Google" onSuccess={successHandle} onFailure={failureHandle} cookiePolicy="single_host_origin" disabled={disabled} />
        </div>
      </div>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={snackbarOpened}
        onClose={() => setSnackbarOpened(false)}
        message="Unknown error when signing in!"
      />
    </>
  );
}
