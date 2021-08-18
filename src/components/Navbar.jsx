import { useContext, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { userContext } from "../App";
import { IconButton, Menu, MenuItem, Divider, AppBar, Toolbar, Typography } from "@material-ui/core";
import { Person, ExitToApp, Home, AccountCircle } from "@material-ui/icons";
import axios from "axios";

export const allApps = [
  {
    name: "Drive",
    route: "/drive",
    icon: "https://i.imgur.com/Cr3oZGy.png",
  },
  {
    name: "Forms",
    route: "/forms",
    icon: "https://i.imgur.com/prj8GAN.png",
  },
  {
    name: "Translate",
    route: "/translate",
    icon: "https://i.imgur.com/PAS1jhL.png",
  },
  {
    name: "Maps",
    route: "/maps",
    icon: "https://i.imgur.com/7xyU04L.png",
  },
];

function ProfileMenu(props) {
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
        <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => history.push(allApps.find((e) => e.name === name).route)}>
          <img height={30} src={allApps.find((e) => e.name === name).icon} />
        </IconButton>
        <div style={{ flexGrow: 1 }} onClick={() => history.push(allApps.find((e) => e.name === name).route)}>
          <Typography variant="h6" style={{ cursor: "pointer", display: "inline" }}>
            Google {name} Minified
          </Typography>
        </div>
        {currentUser ? (
          <>
            <IconButton style={{ padding: 0 }} onClick={(e) => setUserMenuOpened(e.currentTarget)}>
              <img style={{ borderRadius: 50 }} height="40" src={`https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${encodeURIComponent(currentUser.username)}`} />
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

              {allApps.map(
                (e) =>
                  !name.includes(e.name) && (
                    <MenuItem
                      key={e.name}
                      onClick={() => {
                        setUserMenuOpened(null);
                        history.push(e.route);
                      }}
                    >
                      <img height="17" src={e.icon} />
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
                onClick={() => {
                  setAuthMenuOpened(null);
                  history.push(`/sign-in?redirect=${encodeURIComponent(location.pathname)}`);
                }}
              >
                Sign in
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setAuthMenuOpened(null);
                  history.push(`/sign-up?redirect=${encodeURIComponent(location.pathname)}`);
                }}
              >
                Sign up
              </MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default ProfileMenu;
