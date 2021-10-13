import { useRouteMatch, Route, Switch } from "react-router-dom";
import Home from "./Home";
import Room from "./Room";
import SomethingWentWrong from "./SomethingWentWrong";
import Navbar from "../../components/Navbar";
import PrivateRoute from "../../components/PrivateRoute";
import { routes } from "../../utils/routes";
import Favicon from "../../components/Favicon";

function MeetRoute() {
  const { path } = useRouteMatch();

  return (
    <>
      <Favicon icon={routes.find((e) => e.name === "Meet").icon} />
      <Navbar name="Meet" />

      <Switch>
        <PrivateRoute path={`${path}`} exact component={Home}></PrivateRoute>
        <Route path={`${path}/error`} component={SomethingWentWrong}></Route>
        <PrivateRoute path={`${path}/:id`} component={Room}></PrivateRoute>
      </Switch>
    </>
  );
}

export default MeetRoute;
