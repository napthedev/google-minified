import { Player } from "@lottiefiles/react-lottie-player";
import { Typography } from "@material-ui/core";

import { useInnerWidth } from "./useInnerWidth";

function Section({ name, title, animation, reversed = false }) {
  const { width } = useInnerWidth();

  return (
    <div className={`section-container${reversed ? " reversed" : ""}`}>
      <div className="section-title-container">
        <div className="section-title">
          <Typography data-aos="fade-up" data-aos-delay="400" variant={width > 768 ? "h3" : "h4"} style={{ textOverflow: "initial", whiteSpace: "normal", margin: "20px 0" }}>
            {`Google ${name} Minified`}
          </Typography>
          <Typography data-aos="fade-up" data-aos-delay="800" variant={width > 768 ? "h4" : "h5"} style={{ textOverflow: "initial", whiteSpace: "normal" }}>
            {title}
          </Typography>
        </div>
      </div>
      <div data-aos="zoom-in" data-aos-delay="200" className="section-animation">
        <Player autoplay loop src={animation} style={{ height: "auto", width: "100%" }}></Player>
      </div>
    </div>
  );
}

export default Section;
