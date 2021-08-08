import { useHistory, useLocation, useRouteMatch, Route, Switch } from "react-router-dom";
import { AppBar, Toolbar, Typography, IconButton, Tooltip, Box, CircularProgress } from "@material-ui/core";
import { ExitToApp, Close } from "@material-ui/icons";
import axios from "axios";

import { useContext, useEffect, useState } from "react";
import { userContext } from "../../App";

import Folders from "./Folders";
import NotFound from "../NotFound";
import { nanoid } from "nanoid";

function CircularProgressWithLabel(props) {
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress variant="determinate" {...props} />
      <Box top={0} left={0} bottom={0} right={0} position="absolute" display="flex" alignItems="center" justifyContent="center">
        <Typography variant="caption" component="div" color="textSecondary">{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

function DriveRoute() {
  useEffect(() => (document.querySelector("link[rel='shortcut icon']").href = "https://i.imgur.com/7UhjvWJ.png"), []);

  const { currentUser, setCurrentUser } = useContext(userContext);

  const { path } = useRouteMatch();

  const history = useHistory();
  const location = useLocation();

  const handleSignOut = () => {
    axios
      .get(process.env.REACT_APP_SERVER_URL + "auth/sign-out")
      .then((res) => {
        setCurrentUser(null);
      })
      .catch((err) => {
        console.log(err, err.response);
        alert("Failed to sign out, try to delete the cookie");
      });
  };

  const [filesUploading, setFilesUploading] = useState([]);

  const uploadFile = async (event, parentId) => {
    const file = event.target.files[0];
    console.log(file);
    let formData = new FormData();
    let id = nanoid();
    formData.append("file", file);

    setFilesUploading((prevFilesUploading) => [
      ...prevFilesUploading,
      {
        id,
        name: file.name,
        percentage: 0,
      },
    ]);

    axios
      .post("http://localhost:4000/upload", formData, {
        onUploadProgress: (progress) => {
          let percentage = Math.round((progress.loaded / progress.total) * 100);

          setFilesUploading((prevFilesUploading) => {
            let clone = [...prevFilesUploading];
            let child = clone.find((e) => e.id === id);
            child.percentage = percentage;
            return clone;
          });
        },
      })
      .then((res) => {
        console.log(res);
        axios.post(process.env.REACT_APP_SERVER_URL + "drive/create-file", {
          name: file.name,
          parentId,
          userId: currentUser.id,
          url: res.data.url,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <AppBar position="static" color="transparent" elevation={location.pathname.startsWith("/forms/edit") ? 0 : 1}>
        <Toolbar>
          <IconButton onClick={() => history.push("/drive")} edge="start" color="inherit" aria-label="menu">
            <img height={30} src="https://i.imgur.com/7UhjvWJ.png" />
          </IconButton>
          <div style={{ flexGrow: 1 }}>
            <Typography onClick={() => history.push("/drive")} variant="h6" style={{ cursor: "pointer", display: "inline" }}>
              Google Drive Clone
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

      {filesUploading.length > 0 && (
        <div className="upload-progress-box">
          <div className="upload-progress-header">
            <p> Uploading {filesUploading.length} file</p>
            {filesUploading.every((e) => e.percentage === 100) && <Close onClick={setFilesUploading([])} style={{ cursor: "pointer" }} />}
          </div>

          {filesUploading.map((e) => (
            <div className="upload-progress-row" key={e.id}>
              <p>{e.name}</p>
              <CircularProgressWithLabel value={e.percentage} />
            </div>
          ))}
        </div>
      )}

      <Switch>
        <Route path={`${path}`} exact>
          <Folders uploadFile={uploadFile} />
        </Route>
        <Route path={`${path}/folder/:id`} children={<Folders uploadFile={uploadFile} />}></Route>
        <Route path={`${path}/*`}>
          <NotFound />
        </Route>
      </Switch>
    </>
  );
}

export default DriveRoute;
