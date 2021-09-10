import { useRouteMatch, Route, Switch } from "react-router-dom";

import { useEffect } from "react";

import Home from "./Home";
import Edit from "./Edit";
import Response from "./Response";
import Create from "./Create";

import NotFound from "../../components/NotFound";

import Navbar from "../../components/Navbar";
import { allApps } from "../../utils/allApps";

import PrivateRoute from "../../components/PrivateRoute";
import { changeFavicon } from "../../utils";

function FormsRoute() {
  useEffect(() => {
    changeFavicon(allApps.find((e) => e.name === "Forms").icon);
  }, []);

  const { path } = useRouteMatch();

  return (
    <>
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
