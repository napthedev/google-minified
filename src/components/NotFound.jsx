import { Player } from "@lottiefiles/react-lottie-player";
import data from "../lottie/not_found.json";

function NotFound() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexGrow: 1 }}>
      <Player autoplay loop src={data} style={{ height: "300px", width: "300px" }}></Player>
      <h1 style={{ textAlign: "center" }}>Not Found</h1>
    </div>
  );
}

export default NotFound;
