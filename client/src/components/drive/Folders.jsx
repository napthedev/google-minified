import { Redirect, Link, useParams, useHistory } from "react-router-dom";
import { userContext } from "../../App";
import { useState, useContext, useEffect } from "react";
import { List, ListItem, Button, Menu, MenuItem, Breadcrumbs, IconButton, Tooltip, Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@material-ui/core";
import { Storage, Delete, CloudUpload, CreateNewFolder, InsertDriveFile, FileCopy, InsertLink, Create, GetApp, Folder } from "@material-ui/icons";
import axios from "axios";

function FolderRoute() {
  const { currentUser } = useContext(userContext);
  let { id: currentFolderId } = useParams();
  currentFolderId = typeof currentFolderId === "undefined" ? null : currentFolderId;

  const history = useHistory();

  const [uploadMenuOpened, setUploadMenuOpened] = useState(null);
  const [dialogOpened, setDialogOpened] = useState(false);
  const [createFolderName, setCreateFolderName] = useState("");
  const [createFolderNameError, setCreateFolderNameError] = useState("");
  const [path, setPath] = useState([]);

  const [allFolder, setAllFolder] = useState([]);
  const [allFiles, setAllFiles] = useState([]);

  const [breadcrumb, setBreadcrumb] = useState([]);

  const [selected, setSelected] = useState([]);

  const [permission, setPermission] = useState(undefined);

  useEffect(async () => {
    if (!currentUser) return;

    let permission;

    if (currentFolderId !== null) {
      const response = await axios.post(process.env.REACT_APP_SERVER_URL + "folders/get-folder", {
        id: currentFolderId,
      });
      let data = response.data;
      setPath([...data.path, data._id]);
      let path = await Promise.all(
        path.map(async (e) => {
          const child_data = await axios.post(process.env.REACT_APP_SERVER_URL + "folders/get-folder", {
            id: e,
          });
          return {
            link: "/folder/" + child_data.data._id,
            name: child_data.data.name,
          };
        })
      );
      path = [
        ...path,
        {
          link: data._id,
          name: data.name,
        },
      ];

      permission = data.userId === currentUser.uid;
      setPermission(permission);

      if (permission) {
        setBreadcrumb(path);
      } else {
        setBreadcrumb([{ link: "/folder/" + data._id, name: data.name }]);
      }
    } else {
      setBreadcrumb([]);
      permission = null;
      setPermission(permission);
    }

    const folderChild = await axios.post(process.env.REACT_APP_SERVER_URL + "folder/folder-child");
    setAllFolder(folderChild.data);

    document.onclick = (e) => {
      let clickedOutside = true;

      let foldersEl = Array.prototype.slice.call(document.getElementsByClassName("folder-container"));
      let filesEl = Array.prototype.slice.call(document.getElementsByClassName("file-container"));
      let allEl = foldersEl.concat(filesEl);

      for (const el of allEl) {
        if (el.contains(e.target)) {
          clickedOutside = false;
        }
      }

      if (clickedOutside) setSelected([]);
    };
  }, [currentFolderId]);

  const handleCreateFolderFormSubmit = (e) => {
    e.preventDefault();
    if (!createFolderName.trim()) {
      setCreateFolderNameError("Please enter the folder name");
    } else {
      setCreateFolderName("");
      setCreateFolderNameError("");
      createNewFolder();
      setDialogOpened(false);
    }
  };

  const createNewFolder = async () => {
    axios.post(process.env.REACT_APP_SERVER_URL + "folder/create", {
      name: createFolderName,
      path: path,
      parentId: currentFolderId,
    });
  };

  const handleClicks = (e, id) => {
    if (e.detail === 1) {
      if (e.ctrlKey) {
        let clone = [...selected];
        clone.push(id);
        setSelected(clone);
      } else {
        setSelected([id]);
      }
    } else if (e.detail === 2) {
      history.push("/folder/" + id);
    }
  };

  return (
    <>
      {currentUser ? (
        <div style={{ display: "flex", flexGrow: 1 }}>
          <List component="nav" className="main-column">
            {permission !== false && (
              <>
                <Button style={{ margin: 10 }} onClick={(e) => setUploadMenuOpened(e.currentTarget)} variant="outlined" color="primary">
                  <CloudUpload />
                  <Typography className="responsive-label" style={{ marginLeft: 10 }}>
                    Upload
                  </Typography>
                </Button>
                <Menu anchorEl={uploadMenuOpened} keepMounted open={Boolean(uploadMenuOpened)} onClose={() => setUploadMenuOpened(null)}>
                  <MenuItem
                    style={{ gap: 10 }}
                    onClick={() => {
                      setDialogOpened(true);
                      setUploadMenuOpened(null);
                    }}
                  >
                    <CreateNewFolder />
                    New Folder
                  </MenuItem>
                  <MenuItem style={{ gap: 10 }} onClick={() => setUploadMenuOpened(null)}>
                    <InsertDriveFile />
                    Upload a file
                  </MenuItem>
                  <MenuItem style={{ gap: 10 }} onClick={() => setUploadMenuOpened(null)}>
                    <FileCopy />
                    Upload files
                  </MenuItem>
                </Menu>
              </>
            )}

            <ListItem onClick={() => history.push("/drive")} className="list-item" button>
              <Storage className="gray-icon" />
              <Typography className="responsive-label">My Drive</Typography>
            </ListItem>
            <ListItem className="list-item" button>
              <Delete className="gray-icon" />
              <Typography className="responsive-label">Trash</Typography>
            </ListItem>
          </List>
          <div className="main">
            <div className="actions-wrapper">
              <Breadcrumbs>
                {permission !== false ? <Link to="/">My Drive</Link> : <Link>Shared with me</Link>}

                {breadcrumb.map((e, index) => (
                  <Link key={index} to={e.link}>
                    {e.name}
                  </Link>
                ))}
              </Breadcrumbs>
              <div>
                <Tooltip title="Copy Link">
                  <IconButton color="default">
                    <InsertLink />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Download">
                  <IconButton color="primary">
                    <GetApp />
                  </IconButton>
                </Tooltip>
                {permission && (
                  <>
                    <Tooltip title="Rename file">
                      <IconButton>
                        <Create />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete">
                      <IconButton color="secondary">
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </>
                )}
              </div>
            </div>

            {allFolder.length === 0 && allFiles.length === 0 && <Typography>This folder is empty</Typography>}

            {allFolder.length > 0 && (
              <Typography style={{ margin: 10 }} variant="subtitle2">
                Folders
              </Typography>
            )}

            <div className="main-grid">
              {allFolder.map((e) => (
                <div onClick={(event) => handleClicks(event, e.id)} key={e.id} className={"folder-container" + (selected.includes(e.id) ? " selected" : "")}>
                  <Folder className="gray-icon" />
                  <Typography>{e.name}</Typography>
                </div>
              ))}
            </div>

            {allFiles.length > 0 && (
              <Typography style={{ margin: 10 }} variant="subtitle2">
                Files
              </Typography>
            )}

            <div className="main-grid">
              {allFiles.map((e) => (
                <div className="file-container">
                  <div key={e.id} className="center-div" style={{ flexGrow: 1 }}>
                    <div className="center-div" style={{ width: "40%", height: "40%" }}>
                      <img src="https://raw.githubusercontent.com/NAPTheDev/File-Icons/master/default_file.svg" height="100%" />
                    </div>
                  </div>
                  <div className="file-container-label">
                    <Typography>{e.name}</Typography>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Dialog open={dialogOpened} onClose={() => setDialogOpened(false)}>
            <form onSubmit={handleCreateFolderFormSubmit}>
              <DialogTitle>Create New Folder</DialogTitle>
              <DialogContent>
                <TextField error={Boolean(createFolderNameError)} helperText={createFolderNameError} value={createFolderName} onChange={(e) => setCreateFolderName(e.target.value)} type="text" autoFocus margin="dense" label="Folder name" fullWidth />
              </DialogContent>
              <DialogActions>
                <Button type="button" onClick={() => setDialogOpened(false)} color="primary">
                  Cancel
                </Button>
                <Button type="submit" color="primary">
                  Create
                </Button>
              </DialogActions>
            </form>
          </Dialog>
        </div>
      ) : (
        <Redirect to="/sign-in" />
      )}
    </>
  );
}

export default FolderRoute;
