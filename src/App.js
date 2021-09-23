import { useState, useEffect, createContext, useMemo, lazy, Suspense } from "react";
import { Route, Switch, useLocation } from "react-router-dom";
import { useTransition, animated } from "react-spring";
import { useMediaQuery, CssBaseline, CircularProgress } from "@material-ui/core";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import axios from "axios";
import TopBarProgress from "react-topbar-progress-indicator";

import NotFound from "./components/NotFound";
import Cookie from "./components/Cookie";

import { allApps } from "./utils/allApps";

const SignUp = lazy(() => import("./components/SignUp"));
const SignIn = lazy(() => import("./components/SignIn"));
const Landing = lazy(() => import("./pages/landing"));

export const userContext = createContext(null);

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.REACT_APP_SERVER_URL;

TopBarProgress.config({
  barColors: {
    0: "#0D6EFD",
    1: "#0D6EFD",
  },
});

function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          type: prefersDarkMode ? "dark" : "light",
        },
      }),
    [prefersDarkMode]
  );

  const [currentUser, setCurrentUser] = useState(undefined);
  const [cookie, setCookie] = useState(true);

  useEffect(() => {
    let cookieEnabled = navigator.cookieEnabled;
    if (!cookieEnabled) {
      document.cookie = "cookieCheck=test;";
      cookieEnabled = document.cookie.indexOf("test") != -1;
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
  }, []);

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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {cookie ? (
        <userContext.Provider value={{ currentUser, setCurrentUser, theme }}>
          {typeof currentUser !== "undefined" ? (
            <>
              {transitions((props, item) => (
                <animated.div style={props} className="root">
                  <Suspense fallback={<TopBarProgress />}>
                    <Switch location={item}>
                      <Route path="/" exact component={Landing}></Route>
                      <Route path="/sign-in" component={SignIn}></Route>
                      <Route path="/sign-up" component={SignUp}></Route>
                      {allApps.map((e) => (
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
        </userContext.Provider>
      ) : (
        <Cookie />
      )}
    </ThemeProvider>
  );
}

export default App;
