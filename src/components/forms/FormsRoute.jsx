import { useRouteMatch, Route, Switch } from "react-router-dom";

import { useEffect } from "react";

import FormsHome from "./FormsHome";
import Edit from "./Edit";
import Response from "./Response";
import NotFound from "../NotFound";
import CreateForm from "./CreateForm";

import Navbar, { allApps } from "../Navbar";
import PrivateRoute from "../PrivateRoute";

function FormsRoute() {
  useEffect(() => {
    document.querySelector("link[rel='shortcut icon']").href = allApps.find((e) => e.name === "Forms").icon;
  }, []);

  const { path } = useRouteMatch();

  return (
    <>
      <Navbar name="Forms" />

      <Switch>
        <PrivateRoute path={`${path}`} exact component={FormsHome}></PrivateRoute>
        <PrivateRoute path={`${path}/create`} component={CreateForm}></PrivateRoute>
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
