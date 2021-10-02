import { Player } from "@lottiefiles/react-lottie-player";
import data from "../lottie/cookie.json";

function Cookie() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexGrow: 1 }}>
      <Player autoplay loop src={data} style={{ height: "300px", width: "300px" }}></Player>
      <h1 style={{ textAlign: "center", maxWidth: "100%" }}>Cookie is currently disabled</h1>
      <h3 style={{ textAlign: "center", maxWidth: "100%" }}>Refresh the page after enabling cookies</h3>
    </div>
  );
}

export default Cookie;
