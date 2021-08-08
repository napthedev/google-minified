import { Redirect, Link, useParams, useHistory } from "react-router-dom";
import { userContext } from "../../App";
import { useState, useContext, useEffect, useRef } from "react";
import { List, ListItem, Button, Menu, MenuItem, Breadcrumbs, IconButton, Tooltip, Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress } from "@material-ui/core";
import { Storage, Delete, CloudUpload, CreateNewFolder, InsertDriveFile, FileCopy, InsertLink, Create, GetApp, Folder as FolderIcon } from "@material-ui/icons";
import axios from "axios";
import NotFound from "../NotFound";

function Folder(props) {
  const { currentUser } = useContext(userContext);
  let { id: currentFolderId } = useParams();
  currentFolderId = typeof currentFolderId === "undefined" ? null : currentFolderId;

  const { uploadFile } = props;
  const fileInput = useRef();

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

  const [loading, setLoading] = useState(true);

  const [notFound, setNotFound] = useState(false);

  const fetchFolderData = async () => {
    if (currentFolderId !== null) {
      let response;
      try {
        response = await axios.post(process.env.REACT_APP_SERVER_URL + "drive/get-folder", {
          _id: currentFolderId,
        });
      } catch (err) {
        setNotFound(true);
        return;
      }

      let data = response.data.folder;
      setPath([...data.path, data._id]);

      setPermission(response.data.permission);

      if (response.data.permission) {
        setBreadcrumb([
          ...response.data.pathObj,
          {
            _id: data._id,
            name: data.name,
          },
        ]);
      } else {
        setBreadcrumb([{ _id: data._id, name: data.name }]);
      }
    } else {
      setBreadcrumb([]);
      setPermission(true);
    }

    const folderChild = await axios.post(process.env.REACT_APP_SERVER_URL + "drive/folder-child", {
      parentId: currentFolderId,
    });

    setAllFolder(folderChild.data.folders);
    setAllFiles(folderChild.data.files);
  };

  useEffect(async () => {
    setNotFound(false);
    setLoading(true);
    await fetchFolderData();
    setLoading(false);

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
    await axios.post(process.env.REACT_APP_SERVER_URL + "drive/create-folder", {
      name: createFolderName,
      path: path,
      parentId: currentFolderId,
    });

    fetchFolderData();
  };

  const handleClicks = (e, id, type) => {
    if (e.detail === 1) {
      if (e.ctrlKey) {
        let clone = [...selected];
        clone.push(id);
        setSelected(clone);
      } else {
        setSelected([id]);
      }
    } else if (e.detail === 2) {
      if (type === "folder") history.push("/drive/folder/" + id);
    }
  };

  return (
    <>
      {!currentUser && !currentFolderId ? (
        <Redirect to={`/sign-in?redirect=${encodeURIComponent(window.location.pathname)}`} />
      ) : (
        <div style={{ display: "flex", flexGrow: 1, alignItems: "stretch" }}>
          <List component="nav" className="main-column">
            {permission !== false && (
              <>
                {permission && (
                  <Button style={{ margin: 10 }} onClick={(e) => setUploadMenuOpened(e.currentTarget)} variant="outlined" color="primary">
                    <CloudUpload />
                    <Typography className="responsive-label" style={{ marginLeft: 10 }}>
                      Upload
                    </Typography>
                  </Button>
                )}
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
                  <input type="file" hidden onChange={(e) => uploadFile(e, currentFolderId)} ref={fileInput} />
                  <MenuItem
                    style={{ gap: 10 }}
                    onClick={() => {
                      fileInput.current.click();
                      setUploadMenuOpened(null);
                    }}
                  >
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
          {!notFound ? (
            <div className="main">
              <div className="actions-wrapper">
                <Breadcrumbs>
                  {permission !== false ? <Link to="/drive">My Drive</Link> : <a href="#">Shared with me</a>}

                  {breadcrumb.map((e, index) => (
                    <Link key={index} to={e._id}>
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

              {loading ? (
                <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", flexGrow: 1 }}>
                  <CircularProgress />
                </div>
              ) : (
                <>
                  {allFolder.length === 0 && allFiles.length === 0 && <Typography>This folder is empty</Typography>}

                  {allFolder.length > 0 && (
                    <Typography style={{ margin: 10 }} variant="subtitle2">
                      Folders
                    </Typography>
                  )}

                  <div className="main-grid">
                    {allFolder.map((e) => (
                      <div onClick={(event) => handleClicks(event, e._id, "folder")} key={e._id} className={"folder-container" + (selected.includes(e._id) ? " selected" : "")}>
                        <FolderIcon className="gray-icon" />
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
                      <div onClick={(event) => handleClicks(event, e._id, "file")} className={"file-container" + (selected.includes(e._id) ? " selected" : "")} key={e._id}>
                        <div className="center-div" style={{ flexGrow: 1 }}>
                          <div className="center-div" style={{ height: "40%" }}>
                            <img onError={(e) => (e.target.src = "https://raw.githubusercontent.com/NAPTheDev/file-icons/master/default_file.svg")} src={`https://raw.githubusercontent.com/NAPTheDev/file-icons/master/file/${e.name.split(".")[e.name.split(".").length - 1]}.svg`} height="100%" />
                          </div>
                        </div>
                        <div className="file-container-label">
                          <Typography>{e.name}</Typography>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <NotFound />
          )}
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
      )}
    </>
  );
}

export default Folder;
