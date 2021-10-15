import "aos/dist/aos.css";

import { Facebook, GitHub } from "@material-ui/icons";
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
      <div className="footer">
        <p style={{ whiteSpace: "pre-wrap" }}>Copyright NAPTheDev &copy; MindX Coding School</p>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <a href="https://facebook.com/napthedev" target="_blank">
            <Facebook style={{ height: 30, width: 30 }} className="svg-fill" />
          </a>
          <a href="https://github.com/napthedev" target="_blank">
            <GitHub style={{ height: 26, width: 26 }} className="svg-fill" />
          </a>
          <a href="https://discordapp.com/users/877882975855992852" target="_blank">
            <svg className="svg-fill" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" data-darkreader-inline-fill="">
              <path d="M9.593 10.971c-.542 0-.969.475-.969 1.055 0 .578.437 1.055.969 1.055.541 0 .968-.477.968-1.055.011-.581-.427-1.055-.968-1.055zm3.468 0c-.542 0-.969.475-.969 1.055 0 .578.437 1.055.969 1.055.541 0 .968-.477.968-1.055-.001-.581-.427-1.055-.968-1.055z"></path>
              <path d="M17.678 3H4.947A1.952 1.952 0 0 0 3 4.957v12.844c0 1.083.874 1.957 1.947 1.957H15.72l-.505-1.759 1.217 1.131 1.149 1.064L19.625 22V4.957A1.952 1.952 0 0 0 17.678 3zM14.01 15.407s-.342-.408-.626-.771c1.244-.352 1.719-1.13 1.719-1.13-.39.256-.76.438-1.093.562a6.679 6.679 0 0 1-3.838.398 7.944 7.944 0 0 1-1.396-.41 5.402 5.402 0 0 1-.693-.321c-.029-.021-.057-.029-.085-.048a.117.117 0 0 1-.039-.03c-.171-.094-.266-.16-.266-.16s.456.76 1.663 1.121c-.285.36-.637.789-.637.789-2.099-.067-2.896-1.444-2.896-1.444 0-3.059 1.368-5.538 1.368-5.538 1.368-1.027 2.669-.998 2.669-.998l.095.114c-1.71.495-2.499 1.245-2.499 1.245s.21-.114.561-.275c1.016-.446 1.823-.57 2.156-.599.057-.009.105-.019.162-.019a7.756 7.756 0 0 1 4.778.893s-.751-.712-2.366-1.206l.133-.152s1.302-.029 2.669.998c0 0 1.368 2.479 1.368 5.538 0-.001-.807 1.376-2.907 1.443z"></path>
            </svg>
          </a>
        </div>
      </div>
    </>
  );
}

export default Landing;
