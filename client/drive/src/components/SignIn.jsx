import firebase from "../firebase";
import CenterContainer from "./CenterContainer";
import { Button, Typography } from "@material-ui/core";
import { Player } from "@lottiefiles/react-lottie-player";
import { useContext } from "react";
import { Redirect } from "react-router-dom";
import { UserContext } from "../App";

function SignIn(props) {
  const { currentUser } = useContext(UserContext);
  const { signInWithGoogle } = props;

  return (
    <>
      {!currentUser ? (
        <CenterContainer>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-around", alignItems: "center" }}>
            <Typography variant="h4">Google Drive Clone</Typography>
            <Player autoplay loop src="https://assets3.lottiefiles.com/packages/lf20_eNZ5IV.json" style={{ width: "100%", maxWidth: "400px" }}></Player>
            <Button onClick={signInWithGoogle} variant="contained" color="primary">
              Sign in with Google
            </Button>
          </div>
        </CenterContainer>
      ) : (
        <Redirect to="/" />
      )}
    </>
  );
}

export default SignIn;
