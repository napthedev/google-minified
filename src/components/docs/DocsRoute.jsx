import { useRouteMatch, Route, Switch } from "react-router-dom";

import { useEffect } from "react";

import DocsHome from "./DocsHome";
import Document from "./Document";
import Navbar, { allApps } from "../Navbar";
import PrivateRoute from "../PrivateRoute";
import CreateDocument from "./CreateDocument";

function FormsRoute() {
  useEffect(() => {
    document.querySelector("link[rel='shortcut icon']").href = allApps.find((e) => e.name === "Docs").icon;
  }, []);

  const { path } = useRouteMatch();

  return (
    <>
      <Navbar name="Docs" />

      <Switch>
        <PrivateRoute path={`${path}`} exact component={DocsHome}></PrivateRoute>
        <PrivateRoute path={`${path}/create`} component={CreateDocument}></PrivateRoute>
        <Route path={`${path}/:id`} component={Document}></Route>
      </Switch>
    </>
  );
}

export default FormsRoute;
