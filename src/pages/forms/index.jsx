import { useRouteMatch, Route, Switch } from "react-router-dom";

import Home from "./Home";
import Edit from "./Edit";
import Response from "./Response";
import Create from "./Create";

import NotFound from "../../components/NotFound";

import Navbar from "../../components/Navbar";
import { routes } from "../../utils/routes";

import PrivateRoute from "../../components/PrivateRoute";
import Favicon from "../../components/Favicon";

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
