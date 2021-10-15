import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import { Player } from "@lottiefiles/react-lottie-player";
import data from "../../lottie/error.json";

function SomethingWentWrong() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexGrow: 1 }}>
      <Player autoplay loop src={data} style={{ height: "300px", width: "300px" }}></Player>
      <h1 style={{ textAlign: "center", maxWidth: "100%", margin: 0 }}>Something went wrong</h1>
      <p style={{ textAlign: "center", maxWidth: "100%", margin: 0 }}>Maybe the meeting hasn't been started</p>
      <p style={{ textAlign: "center", maxWidth: "100%", margin: 0 }}>OR you are attending the meeting somewhere</p>
      <Link to="/meet">
        <Button style={{ marginTop: 20 }} variant="contained" color="primary">
          Return Home
        </Button>
      </Link>
    </div>
  );
}

export default SomethingWentWrong;
