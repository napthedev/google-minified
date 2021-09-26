import { useRouteMatch, Route, Switch } from "react-router-dom";
import { useEffect } from "react";
import Home from "./Home";
import Room from "./Room";
import Navbar from "../../components/Navbar";
import PrivateRoute from "../../components/PrivateRoute";
import { changeFavicon } from "../../utils";
import { allApps } from "../../utils/allApps";

function FormsRoute() {
  useEffect(() => {
    changeFavicon(allApps.find((e) => e.name === "Meet").icon);
  }, []);

  const { path } = useRouteMatch();

  return (
    <>
      <Navbar name="Meet" />

      <Switch>
        <PrivateRoute path={`${path}`} exact component={Home}></PrivateRoute>
        <PrivateRoute path={`${path}/:id`} component={Room}></PrivateRoute>
      </Switch>
    </>
  );
}

export default FormsRoute;
