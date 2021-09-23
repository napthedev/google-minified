import { Player } from "@lottiefiles/react-lottie-player";
import { Typography } from "@material-ui/core";

function Section({ title, animation, reversed = false }) {
  return (
    <div className={`section-container${reversed ? " reversed" : ""}`}>
      <div className="section-title-container">
        <div className="section-title">
          <Typography variant="h4" style={{ textOverflow: "initial", whiteSpace: "normal" }}>
            {title}
          </Typography>
        </div>
      </div>
      <div className="section-animation">
        <Player autoplay loop src={animation} style={{ height: "auto", width: "100%" }}></Player>
      </div>
    </div>
  );
}

export default Section;
