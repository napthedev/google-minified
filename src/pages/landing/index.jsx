import { useEffect, useContext } from "react";
import { userContext } from "../../App";
import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import { allApps } from "../../utils/allApps";
import Section from "./Section";
import { changeFavicon } from "../../utils";
import backgroundDark from "./backgroundDark.svg";
import backgroundLight from "./backgroundLight.svg";

function Landing() {
  const { theme } = useContext(userContext);

  useEffect(() => {
    changeFavicon("https://i.imgur.com/UcOrFtl.png");
    document.title = "Google Minified";
  }, []);

  return (
    <>
      <div className="first-section" style={{ backgroundImage: `url(${theme.palette.type === "dark" ? backgroundDark : backgroundLight})` }}>
        <Typography variant="h2" style={{ margin: "30px 10px" }}>
          Google Minified
        </Typography>
        <div style={{ display: "flex", gap: 5 }}>
          {allApps.map((i) => (
            <Link to={i.route}>
              <img src={i.icon} alt={i.name} key={i.name} />
            </Link>
          ))}
        </div>
      </div>
      {allApps.map((i, index) => (
        <Section name={i.name} title={i.description} animation={i.animation} reversed={index % 2 === 1} />
      ))}
    </>
  );
}

export default Landing;
