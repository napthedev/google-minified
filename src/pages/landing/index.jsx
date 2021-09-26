import { useEffect, useContext } from "react";
import { userContext } from "../../App";
import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import { routes } from "../../utils/routes";
import Section from "./Section";
import { changeFavicon } from "../../utils";
import backgroundDark from "./backgroundDark.svg";
import backgroundLight from "./backgroundLight.svg";
import AOS from "aos";
import "aos/dist/aos.css";
import Typewriter from "typewriter-effect";
import { useInnerWidth } from "./useInnerWidth";

function Landing() {
  const { theme } = useContext(userContext);
  const { width } = useInnerWidth();

  useEffect(() => {
    changeFavicon("https://i.imgur.com/UcOrFtl.png");
    document.title = "Google Minified";
    AOS.init();
  }, []);

  useEffect(() => {
    AOS.refresh();
  }, [width]);

  return (
    <>
      <div className="first-section" style={{ backgroundImage: `url(${theme.palette.type === "dark" ? backgroundDark : backgroundLight})` }}>
        <Typography variant={width > 768 ? "h2" : "h3"}>{routes.length} Google apps, in one place</Typography>
        <Typewriter
          options={{
            delay: 60,
            loop: true,
            wrapperClassName: "wrapper-typewriter",
            cursorClassName: "cursor-typewriter Typewriter__cursor",
          }}
          onInit={(typewriter) => {
            routes
              .reduce((final, element) => {
                return final.deleteAll(10).typeString(`Google ${element.name} Minified`).pauseFor(2000);
              }, typewriter)
              .start();
          }}
        />
        <div className="first-section-link-container">
          {routes.map((i) => (
            <Link key={i.route} to={i.route} className="first-section-link">
              <img style={{ height: 64, width: "auto" }} src={i.icon} alt={i.name} key={i.name} />
            </Link>
          ))}
        </div>
      </div>
      {routes.map((i, index) => (
        <Section key={i.route} name={i.name} title={i.description} animation={i.animation} reversed={index % 2 === 1} width={width} />
      ))}
    </>
  );
}

export default Landing;
