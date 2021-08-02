import { Player } from "@lottiefiles/react-lottie-player";

function NotFound() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexGrow: 1 }}>
      <Player autoplay loop src="https://assets6.lottiefiles.com/packages/lf20_cg9lvxff.json" style={{ height: "300px", width: "300px" }}></Player>
      <h1 style={{ textAlign: "center" }}>Not Found</h1>
    </div>
  );
}

export default NotFound;
