import Particles from "react-particles-js";
import { useStore } from "../shared/store";

function Canvas() {
  const theme = useStore((state) => state.theme);

  return (
    <Particles
      width="100vw"
      height="100vh"
      style={{ position: "absolute", top: 0, left: 0, zIndex: -1 }}
      params={{
        particles: {
          color: {
            value: theme === "dark" ? "#FFFFFF" : "#000000",
          },
          line_linked: {
            enable: true,
            color: theme === "dark" ? "#FFFFFF" : "#000000",
            opacity: 0.4,
            width: 1,
          },
        },
      }}
    />
  );
}

export default Canvas;
