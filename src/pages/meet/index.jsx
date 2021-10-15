import { Route, Switch, useRouteMatch } from "react-router-dom";

import Favicon from "../../components/Favicon";
import Home from "./Home";
import Navbar from "../../components/Navbar";
import PrivateRoute from "../../components/PrivateRoute";
import Room from "./Room";
import SomethingWentWrong from "./SomethingWentWrong";
import { routes } from "../../shared/routes";

function MeetRoute() {
  const { path } = useRouteMatch();

  return (
    <>
      <Favicon icon={routes.find((e) => e.name === "Meet").icon} />
      <Navbar name="Meet" />

      <Switch>
        <PrivateRoute path={`${path}`} exact component={Home}></PrivateRoute>
        <Route path={`${path}/error`} component={SomethingWentWrong}></Route>
        <PrivateRoute path={`${path}/:id`} component={Room}></PrivateRoute>
      </Switch>
    </>
  );
}

export default MeetRoute;
