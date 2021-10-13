import { useContext, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { userContext } from "../App";
import { IconButton, Menu, MenuItem, Divider, AppBar, Toolbar, Typography } from "@material-ui/core";
import { Person, ExitToApp, Home, AccountCircle, VpnKey, AssignmentReturn } from "@material-ui/icons";
import axios from "axios";

import { routes } from "../utils/routes";

function Navbar(props) {
  const { name } = props;

  const { currentUser, setCurrentUser } = useContext(userContext);
  const history = useHistory();
  const location = useLocation();

  const [userMenuOpened, setUserMenuOpened] = useState(null);
  const [authMenuOpened, setAuthMenuOpened] = useState(null);

  const signOut = () => {
    axios
      .get("auth/sign-out")
      .then((res) => {
        if (res.status === 200) setCurrentUser(null);
        else throw new Error("Failed to sign out");
      })
      .catch((err) => {
        console.log(err, err.response);
        alert("Failed to sign out, try to delete the cookie");
      });
  };

  return (
    <AppBar position="static" color="transparent" elevation={location.pathname.startsWith("/forms/edit") ? 0 : 1}>
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => history.push(routes.find((e) => e.name === name).route)}>
          <img height={30} src={routes.find((e) => e.name === name).icon} alt="" />
        </IconButton>
        <div style={{ flexGrow: 1 }}>
          <Typography variant="h6" style={{ cursor: "pointer", display: "inline" }} onClick={() => history.push(routes.find((e) => e.name === name).route)}>
            Google {name} Minified
          </Typography>
        </div>
        {currentUser ? (
          <>
            <IconButton style={{ padding: 0 }} onClick={(e) => setUserMenuOpened(e.currentTarget)}>
              <img style={{ borderRadius: 50 }} height="40" src={currentUser.avatar} alt="" />
            </IconButton>
            <Menu id="profile-menu" anchorEl={userMenuOpened} keepMounted open={Boolean(userMenuOpened)} onClose={() => setUserMenuOpened(null)}>
              <MenuItem onClick={() => setUserMenuOpened(null)}>
                <Person />
                My Profile
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setUserMenuOpened(null);
                  signOut();
                }}
              >
                <ExitToApp color="secondary" />
                Logout
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setUserMenuOpened(null);
                  history.push("/");
                }}
              >
                <Home color="primary" />
                Homepage
              </MenuItem>
              <Divider />

              {routes.map(
                (e) =>
                  !name.includes(e.name) && (
                    <MenuItem
                      key={e.name}
                      onClick={() => {
                        setUserMenuOpened(null);
                        history.push(e.route);
                      }}
                    >
                      <img height="17" src={e.icon} alt="" />
                      {e.name}
                    </MenuItem>
                  )
              )}
            </Menu>
          </>
        ) : (
          <>
            <IconButton onClick={(e) => setAuthMenuOpened(e.currentTarget)}>
              <AccountCircle />
            </IconButton>
            <Menu anchorEl={authMenuOpened} keepMounted open={Boolean(authMenuOpened)} onClose={() => setAuthMenuOpened(null)}>
              <MenuItem
                style={{ gap: 10 }}
                onClick={() => {
                  setAuthMenuOpened(null);
                  history.push(`/sign-in?redirect=${encodeURIComponent(location.pathname)}`);
                }}
              >
                <AssignmentReturn />
                Sign in
              </MenuItem>
              <MenuItem
                style={{ gap: 10 }}
                onClick={() => {
                  setAuthMenuOpened(null);
                  history.push(`/sign-up?redirect=${encodeURIComponent(location.pathname)}`);
                }}
              >
                <VpnKey />
                Sign up
              </MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
