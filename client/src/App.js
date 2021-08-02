import { useState, useEffect, createContext, useMemo, useContext } from "react";
import { Link, Route, Switch, useHistory, useLocation, useRouteMatch } from "react-router-dom";
import { AppBar, Toolbar, Typography, IconButton, Tooltip, useMediaQuery, CssBaseline } from "@material-ui/core";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import { ExitToApp } from "@material-ui/icons";
import axios from "axios";
import FormsHome from "./components/forms/FormsHome";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Edit from "./components/forms/Edit";
import Create from "./components/forms/Create";
import Response from "./components/forms/Response";
import NotFound from "./components/NotFound";

export const userContext = createContext(null);

axios.defaults.withCredentials = true;

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

  useEffect(() => {
    axios
      .post(process.env.REACT_APP_SERVER_URL + "auth/login")
      .then((res) => {
        setCurrentUser(res.data.user);
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
        {typeof currentUser != "undefined" && (
          <Switch>
            <Route path="/" exact>
              GGClone home.
              <Link to="/forms">GG Forms Clone</Link>
            </Route>
            <Route path="/signin">
              <SignIn />
            </Route>
            <Route path="/signup">
              <SignUp />
            </Route>
            <Route path="/forms" component={Forms}></Route>
            <Route>
              <NotFound />
            </Route>
          </Switch>
        )}
      </userContext.Provider>
    </ThemeProvider>
  );
}

function Forms() {
  const { currentUser, setCurrentUser } = useContext(userContext);

  const { path } = useRouteMatch();

  const history = useHistory();
  const location = useLocation();

  const handleSignOut = () => {
    axios
      .get(process.env.REACT_APP_SERVER_URL + "auth/signout")
      .then((res) => {
        setCurrentUser(null);
      })
      .catch((err) => {
        console.log(err, err.response);
        alert("Failed to sign out, try to delete the cookie");
      });
  };

  return (
    <>
      <AppBar position="static" color="transparent" elevation={location.pathname.startsWith("/forms/edit") ? 0 : 1}>
        <Toolbar>
          <IconButton onClick={() => history.push("/forms")} edge="start" color="inherit" aria-label="menu">
            <img height={30} src="https://i.imgur.com/prj8GAN.png" />
          </IconButton>
          <div style={{ flexGrow: 1 }}>
            <Typography onClick={() => history.push("/forms")} variant="h6" style={{ cursor: "pointer", display: "inline" }}>
              Google Form Clone
            </Typography>
          </div>
          {currentUser && (
            <Tooltip title="Sign out">
              <IconButton onClick={handleSignOut} color="secondary">
                <ExitToApp />
              </IconButton>
            </Tooltip>
          )}
        </Toolbar>
      </AppBar>

      <Switch>
        <Route path={`${path}`} exact>
          <FormsHome />
        </Route>
        <Route path={`${path}/create`}>
          <Create />
        </Route>
        <Route path={`${path}/edit/:id`} children={<Edit />}></Route>
        <Route path={`${path}/response/:id`} children={<Response />}></Route>
      </Switch>
    </>
  );
}

export default App;
