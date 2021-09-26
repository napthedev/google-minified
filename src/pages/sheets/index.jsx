import { useRouteMatch, Route, Switch } from "react-router-dom";

import { useEffect } from "react";

import Home from "./Home";
import Sheet from "./Sheet";
import Navbar from "../../components/Navbar";
import PrivateRoute from "../../components/PrivateRoute";
import Create from "./Create";
import { changeFavicon } from "../../utils";
import { routes } from "../../utils/routes";

function FormsRoute() {
  useEffect(() => {
    changeFavicon(routes.find((e) => e.name === "Sheets").icon);
  }, []);

  const { path } = useRouteMatch();

  return (
    <>
      <Navbar name="Sheets" />

      <Switch>
        <PrivateRoute path={`${path}`} exact component={Home}></PrivateRoute>
        <PrivateRoute path={`${path}/create`} component={Create}></PrivateRoute>
        <Route path={`${path}/:id`} component={Sheet}></Route>
      </Switch>
    </>
  );
}

export default FormsRoute;
