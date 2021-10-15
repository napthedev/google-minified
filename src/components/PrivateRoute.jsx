import { Redirect, Route, useLocation } from "react-router-dom";

import { useContext } from "react";
import { userContext } from "../App";

function PrivateRoute({ component: Component, children, ...others }) {
  const { currentUser } = useContext(userContext);
  const location = useLocation();

  return (
    <>
      {currentUser ? (
        <Route {...others}>
          {Component && <Component />}
          {children}
        </Route>
      ) : (
        <Redirect to={`/sign-in?redirect=${encodeURIComponent(location.pathname)}`} />
      )}
    </>
  );
}

export default PrivateRoute;
