import { Redirect, Route, useLocation } from "react-router-dom";

import { useStore } from "../shared/store";

function PrivateRoute({ component: Component, children, ...others }) {
  const currentUser = useStore((state) => state.currentUser);
  const location = useLocation();

  return (
    <>
      {currentUser ? (
        <Route {...others}>
          {Component && <Component />}
          {children}
        </Route>
      ) : (
        <Redirect to={`/auth?redirect=${encodeURIComponent(location.pathname)}`} />
      )}
    </>
  );
}

export default PrivateRoute;
