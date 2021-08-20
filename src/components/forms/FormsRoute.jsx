import { useRouteMatch, Route, Switch } from "react-router-dom";

import { useEffect } from "react";

import FormsHome from "./FormsHome";
import Edit from "./Edit";
import Response from "./Response";
import NotFound from "../NotFound";

import Navbar, { allApps } from "../Navbar";

function FormsRoute() {
  useEffect(() => {
    document.querySelector("link[rel='shortcut icon']").href = allApps.find((e) => e.name === "Forms").icon;
  }, []);

  const { path } = useRouteMatch();

  return (
    <>
      <Navbar name="Forms" />

      <Switch>
        <Route path={`${path}`} exact>
          <FormsHome />
        </Route>
        <Route path={`${path}/edit/:id`} children={<Edit />}></Route>
        <Route path={`${path}/response/:id`} children={<Response />}></Route>
        <Route path={`${path}/*`}>
          <NotFound />
        </Route>
      </Switch>
    </>
  );
}

export default FormsRoute;