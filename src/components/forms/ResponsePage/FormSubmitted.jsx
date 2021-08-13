import { Player } from "@lottiefiles/react-lottie-player";

function FormSubmitted() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexGrow: 1 }}>
      <Player autoplay loop src="https://assets8.lottiefiles.com/packages/lf20_Ezf3ae.json" style={{ height: "300px", width: "300px" }}></Player>
      <h1 style={{ textAlign: "center" }}>Your form has been submitted</h1>
    </div>
  );
}

export default FormSubmitted;
