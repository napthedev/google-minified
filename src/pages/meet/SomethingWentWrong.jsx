import { Player } from "@lottiefiles/react-lottie-player";
import data from "../../lottie/error.json";

function SomethingWentWrong() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexGrow: 1 }}>
      <Player autoplay loop src={data} style={{ height: "300px", width: "300px" }}></Player>
      <h1 style={{ textAlign: "center", maxWidth: "100%" }}>Something went wrong</h1>
      <h1 style={{ textAlign: "center", maxWidth: "100%" }}>Maybe you are attending a meeting somewhere else</h1>
    </div>
  );
}

export default SomethingWentWrong;
