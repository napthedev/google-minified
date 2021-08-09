import { useState, useEffect, createContext, useMemo } from "react";
import { Link, Route, Switch } from "react-router-dom";
import { useMediaQuery, CssBaseline, CircularProgress } from "@material-ui/core";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import axios from "axios";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import NotFound from "./components/NotFound";

import FormsRoute from "./components/forms/FormsRoute";
import DriveRoute from "./components/drive/DriveRoute";

export const userContext = createContext(null);

axios.defaults.withCredentials = true;

function App() {
  useEffect(() => (document.querySelector("link[rel='shortcut icon']").href = "https://i.imgur.com/yq4Tp3N.png"), []);

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

  useEffect(() => {
    axios
      .post(process.env.REACT_APP_SERVER_URL + "auth/sign-in")
      .then((res) => {
        if (res.status === 200) {
          setCurrentUser(res.data.user);
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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <userContext.Provider value={{ currentUser, setCurrentUser, theme }}>
        {typeof currentUser !== "undefined" ? (
          <Switch>
            <Route path="/" exact>
              GGClone home.
              <Link to="/forms">Forms</Link>
              <Link to="/drive">Drive</Link>
              <p>Todo: Docs, Sheets, Meet, Map, Photos, Translate</p>
            </Route>
            <Route path="/sign-in">
              <SignIn />
            </Route>
            <Route path="/sign-up">
              <SignUp />
            </Route>
            <Route path="/forms" component={FormsRoute}></Route>
            <Route path="/drive" component={DriveRoute}></Route>
            <Route>
              <NotFound />
            </Route>
          </Switch>
        ) : (
          <div className="center-container">
            <CircularProgress />
          </div>
        )}
      </userContext.Provider>
    </ThemeProvider>
  );
}

export default App;
