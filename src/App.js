import { useState, useEffect, createContext, useMemo, lazy, Suspense } from "react";
import { Link, Route, Switch, useLocation } from "react-router-dom";
import { useTransition, animated } from "react-spring";
import { useMediaQuery, CssBaseline, CircularProgress } from "@material-ui/core";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import axios from "axios";

import NotFound from "./components/NotFound";
import Cookie from "./components/Cookie";

import { allApps } from "./components/Navbar";

const SignUp = lazy(() => import("./components/SignUp"));
const SignIn = lazy(() => import("./components/SignIn"));
const FormsRoute = lazy(() => import("./components/forms/FormsRoute"));
const DriveRoute = lazy(() => import("./components/drive/DriveRoute"));
const TranslateRoute = lazy(() => import("./components/translate/TranslateRoute"));
const MapsRoute = lazy(() => import("./components/maps/MapsRoute"));
const DocsRoute = lazy(() => import("./components/docs/DocsRoute"));

export const userContext = createContext(null);

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.REACT_APP_SERVER_URL;

function App() {
  useEffect(() => {
    document.querySelector("link[rel='shortcut icon']").href = "https://i.imgur.com/UcOrFtl.png";
    document.title = "Google Minified";
  }, []);

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
                  <Suspense fallback={<div className="topbar-loading"></div>}>
                    <Switch location={item}>
                      <Route path="/" exact>
                        {allApps.map((e) => (
                          <Link key={e.name} to={e.route}>
                            {e.name}
                          </Link>
                        ))}
                      </Route>
                      <Route path="/sign-in">
                        <SignIn />
                      </Route>
                      <Route path="/sign-up">
                        <SignUp />
                      </Route>
                      <Route path="/forms" component={FormsRoute}></Route>
                      <Route path="/drive" component={DriveRoute}></Route>
                      <Route path="/translate" component={TranslateRoute}></Route>
                      <Route path="/maps" component={MapsRoute}></Route>
                      <Route path="/docs" component={DocsRoute}></Route>
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
