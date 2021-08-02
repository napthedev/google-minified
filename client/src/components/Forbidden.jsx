import { Player } from "@lottiefiles/react-lottie-player";

function Forbidden() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexGrow: 1 }}>
      <Player autoplay loop src="https://assets1.lottiefiles.com/packages/lf20_5zs3qrld.json" style={{ height: "300px", width: "300px" }}></Player>
      <h1 style={{ textAlign: "center" }}>You don't have access to this form</h1>
    </div>
  );
}

export default Forbidden;
