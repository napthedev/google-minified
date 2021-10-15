import { Route, Switch, useRouteMatch } from "react-router-dom";

import Create from "./Create";
import Document from "./Document";
import Favicon from "../../components/Favicon";
import Home from "./Home";
import Navbar from "../../components/Navbar";
import PrivateRoute from "../../components/PrivateRoute";
import { routes } from "../../shared/routes";

function FormsRoute() {
  const { path } = useRouteMatch();

  return (
    <>
      <Favicon icon={routes.find((e) => e.name === "Docs").icon} />
      <Navbar name="Docs" />

      <Switch>
        <PrivateRoute path={`${path}`} exact component={Home}></PrivateRoute>
        <PrivateRoute path={`${path}/create`} component={Create}></PrivateRoute>
        <Route path={`${path}/:id`} component={Document}></Route>
      </Switch>
    </>
  );
}

export default FormsRoute;
