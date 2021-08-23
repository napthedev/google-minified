import { Player } from "@lottiefiles/react-lottie-player";

function Cookie() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexGrow: 1 }}>
      <Player autoplay loop src="https://assets3.lottiefiles.com/packages/lf20_6xfdtlzb.json" style={{ height: "300px", width: "300px" }}></Player>
      <h1 style={{ textAlign: "center" }}>Cookie is currently disabled</h1>
      <h3 style={{ textAlign: "center" }}>Refresh the page after enabling cookies</h3>
    </div>
  );
}

export default Cookie;
