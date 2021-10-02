import { useRouteMatch, Route, Switch } from "react-router-dom";
import { useEffect } from "react";
import Home from "./Home";
import Room from "./Room";
import SomethingWentWrong from "./SomethingWentWrong";
import Navbar from "../../components/Navbar";
import PrivateRoute from "../../components/PrivateRoute";
import { changeFavicon } from "../../utils";
import { routes } from "../../utils/routes";

function FormsRoute() {
  useEffect(() => {
    changeFavicon(routes.find((e) => e.name === "Meet").icon);
  }, []);

  const { path } = useRouteMatch();

  return (
    <>
      <Navbar name="Meet" />

      <Switch>
        <PrivateRoute path={`${path}`} exact component={Home}></PrivateRoute>
        <Route path={`${path}/error`} component={SomethingWentWrong}></Route>
        <PrivateRoute path={`${path}/:id`} component={Room}></PrivateRoute>
      </Switch>
    </>
  );
}

export default FormsRoute;
