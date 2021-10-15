import "aos/dist/aos.css";

import { useContext, useEffect } from "react";

import AOS from "aos";
import Favicon from "../../components/Favicon";
import { Link } from "react-router-dom";
import Section from "./Section";
import Title from "../../components/Title";
import Typewriter from "typewriter-effect";
import { Typography } from "@material-ui/core";
import { routes } from "../../shared/routes";
import { useInnerWidth } from "./useInnerWidth";
import { userContext } from "../../App";

function Landing() {
  const { theme } = useContext(userContext);
  const { width } = useInnerWidth();

  useEffect(() => {
    AOS.init();
  }, []);

  useEffect(() => {
    AOS.refresh();
  }, [width]);

  return (
    <>
      <Title title="Google Minified" />
      <Favicon icon="https://ik.imagekit.io/nap/google-minified/google__RkZUHwQQ.png" />
      <div className="first-section" style={{ backgroundImage: `url(${theme.palette.type === "dark" ? "https://ik.imagekit.io/nap/google-minified/backgroundDark_CeamoQy6CTA.svg" : "https://ik.imagekit.io/nap/google-minified/backgroundLight_JEXxOPVa9.svg"})` }}>
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
