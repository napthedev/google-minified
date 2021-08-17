import { useRouteMatch, Route, Switch } from "react-router-dom";

import { useEffect } from "react";

import FormsHome from "./FormsHome";
import Edit from "./Edit";
import Create from "./Create";
import Response from "./Response";
import NotFound from "../NotFound";

import Navbar from "../Navbar";

function FormsRoute() {
  useEffect(() => {
    document.querySelector("link[rel='shortcut icon']").href = "https://i.imgur.com/prj8GAN.png";
  }, []);

  const { path } = useRouteMatch();

  return (
    <>
      <Navbar name="Forms" />

      <Switch>
        <Route path={`${path}`} exact>
          <FormsHome />
        </Route>
        <Route path={`${path}/create`}>
          <Create />
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
