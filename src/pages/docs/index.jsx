import { useRouteMatch, Route, Switch } from "react-router-dom";

import Home from "./Home";
import Document from "./Document";
import Navbar from "../../components/Navbar";
import PrivateRoute from "../../components/PrivateRoute";
import Create from "./Create";
import { routes } from "../../utils/routes";
import Favicon from "../../components/Favicon";

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
