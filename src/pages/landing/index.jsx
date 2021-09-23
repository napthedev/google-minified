import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import { allApps } from "../../utils/allApps";
import Section from "./Section";

function Landing() {
  return (
    <>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
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
        <Section title={i.description} animation={i.animation} reversed={index % 2 === 1} />
      ))}
    </>
  );
}

export default Landing;
