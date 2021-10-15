import { Route, Switch, useRouteMatch } from "react-router-dom";

import Create from "./Create";
import Edit from "./Edit";
import Favicon from "../../components/Favicon";
import Home from "./Home";
import Navbar from "../../components/Navbar";
import NotFound from "../../components/NotFound";
import PrivateRoute from "../../components/PrivateRoute";
import Response from "./Response";
import { routes } from "../../shared/routes";

function FormsRoute() {
  const { path } = useRouteMatch();

  return (
    <>
      <Favicon icon={routes.find((e) => e.name === "Forms").icon} />
      <Navbar name="Forms" />

      <Switch>
        <PrivateRoute path={`${path}`} exact component={Home}></PrivateRoute>
        <PrivateRoute path={`${path}/create`} component={Create}></PrivateRoute>
        <PrivateRoute path={`${path}/edit/:id`} component={Edit}></PrivateRoute>
        <Route path={`${path}/response/:id`} component={Response}></Route>
        <Route path={`${path}/*`}>
          <NotFound />
        </Route>
      </Switch>
    </>
  );
}

export default FormsRoute;
