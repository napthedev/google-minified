import { CircularProgress, CssBaseline, useMediaQuery } from "@material-ui/core";
import { Route, Switch, useLocation } from "react-router-dom";
import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { ThemeProvider, createTheme } from "@material-ui/core/styles";
import { animated, useTransition } from "react-spring";

import Cookie from "./components/Cookie";
import NotFound from "./components/NotFound";
import TopBarProgress from "react-topbar-progress-indicator";
import axios from "axios";
import { routes } from "./shared/routes";
import { useStore } from "./shared/store";

const SignUp = lazy(() => import("./pages/auth/SignUp"));
const SignIn = lazy(() => import("./pages/auth/SignIn"));
const Landing = lazy(() => import("./pages/landing"));

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.REACT_APP_SERVER_URL;

TopBarProgress.config({
  barColors: {
    0: "#0D6EFD",
    1: "#0D6EFD",
  },
});

function App() {
  const { currentUser, setCurrentUser, setTheme } = useStore();

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          type: prefersDarkMode ? "dark" : "light",
        },
      }),
    [prefersDarkMode]
  );

  useEffect(() => {
    setTheme(prefersDarkMode ? "dark" : "light");
  }, [prefersDarkMode, setTheme]);

  const [cookie, setCookie] = useState(true);

  useEffect(() => {
    let cookieEnabled = navigator.cookieEnabled;
    if (!cookieEnabled) {
      document.cookie = "cookieCheck=test;";
      cookieEnabled = document.cookie.indexOf("test") !== -1;
    }

    if (!cookieEnabled) {
      setCookie(cookieEnabled);
      return;
    }

    axios
      .post("auth/sign-in")
      .then((res) => {
        if (res.status === 200) {
          setCurrentUser(res.data);
        } else {
          console.log(res);
          setCurrentUser(null);
        }
      })
      .catch((err) => {
        console.log(err, err.response);
        setCurrentUser(null);
      });
  }, [setCurrentUser]);

  const location = useLocation();
  const transitions = useTransition(location, {
    from: {
      position: "absolute",
      opacity: 0,
    },
    enter: {
      position: "absolute",
      opacity: 1,
    },
    leave: {
      position: "absolute",
      opacity: 0,
    },
  });

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      {cookie ? (
        <>
          {typeof currentUser !== "undefined" ? (
            <>
              {transitions((props, item) => (
                <animated.div style={props} className="root">
                  <Suspense fallback={<TopBarProgress />}>
                    <Switch location={item}>
                      <Route path="/" exact component={Landing}></Route>
                      <Route path="/sign-in" component={SignIn}></Route>
                      <Route path="/sign-up" component={SignUp}></Route>
                      {routes.map((e) => (
                        <Route key={e.route} path={e.route} component={e.component} />
                      ))}
                      <Route>
                        <NotFound />
                      </Route>
                    </Switch>
                  </Suspense>
                </animated.div>
              ))}
            </>
          ) : (
            <div className="center-container">
              <CircularProgress />
            </div>
          )}
        </>
      ) : (
        <Cookie />
      )}
    </ThemeProvider>
  );
}

export default App;
