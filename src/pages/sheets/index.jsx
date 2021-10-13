import { useRouteMatch, Route, Switch } from "react-router-dom";

import Home from "./Home";
import Sheet from "./Sheet";
import Navbar from "../../components/Navbar";
import PrivateRoute from "../../components/PrivateRoute";
import Create from "./Create";
import { routes } from "../../shared/routes";
import Favicon from "../../components/Favicon";

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
