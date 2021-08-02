import firebase from "./firebase";
import { Route, Switch, useHistory } from "react-router-dom";
import { useState, useEffect, createContext, useMemo } from "react";
import { CircularProgress, AppBar, IconButton, Toolbar, Avatar, Typography, useMediaQuery, CssBaseline } from "@material-ui/core";
import { AccountCircle } from "@material-ui/icons";
import FolderRoute from "./components/FolderRoute";
import SignIn from "./components/SignIn";
import CenterContainer from "./components/CenterContainer";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";

export const UserContext = createContext();

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
  const history = useHistory();

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });
  }, []);

  const signInWithGoogle = () => {
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(googleProvider)
      .then((res) => {
        setCurrentUser(res.user);
      })
      .catch((err) => alert(err));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UserContext.Provider value={{ currentUser, setCurrentUser }}>
        <AppBar position="static" color="transparent" elevation={1}>
          <Toolbar style={{ justifyContent: "space-between" }}>
            <div onClick={() => history.push("/")} edge="start" style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
              <IconButton>
                <img src="https://i.imgur.com/7UhjvWJ.png" height="30" />
              </IconButton>
              <Typography variant="h5">Google Drive Clone</Typography>
            </div>
            <IconButton
              onClick={() => {
                if (!currentUser) signInWithGoogle();
                else firebase.auth().signOut();
              }}
              edge="end"
            >
              {currentUser ? <Avatar src={currentUser.photoURL} height="30" /> : <AccountCircle />}
            </IconButton>
          </Toolbar>
        </AppBar>
        {typeof currentUser == "undefined" ? (
          <CenterContainer>
            <CircularProgress />
          </CenterContainer>
        ) : (
          <Switch>
            <Route path="/" exact>
              <FolderRoute />
            </Route>
            <Route path="/signin">
              <SignIn signInWithGoogle={signInWithGoogle} />
            </Route>
            <Route path="/folder/:id" component={FolderRoute}></Route>
            <Route>404 not found</Route>
          </Switch>
        )}
      </UserContext.Provider>
    </ThemeProvider>
  );
}

export default App;
