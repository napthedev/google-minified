import { Route, Switch, useRouteMatch } from "react-router-dom";

import Create from "./Create";
import Favicon from "../../components/Favicon";
import Home from "./Home";
import Navbar from "../../components/Navbar";
import PrivateRoute from "../../components/PrivateRoute";
import Sheet from "./Sheet";
import { routes } from "../../shared/routes";

function SheetsRoute() {
  const { path } = useRouteMatch();

  return (
    <>
      <Favicon icon={routes.find((e) => e.name === "Sheets").icon} />
      <Navbar name="Sheets" />

      <Switch>
        <PrivateRoute path={`${path}`} exact component={Home}></PrivateRoute>
        <PrivateRoute path={`${path}/create`} component={Create}></PrivateRoute>
        <Route path={`${path}/:id`} component={Sheet}></Route>
      </Switch>
    </>
  );
}

export default SheetsRoute;
