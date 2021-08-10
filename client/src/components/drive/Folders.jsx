import { Redirect, Link, useParams, useHistory } from "react-router-dom";
import { userContext } from "../../App";
import { useState, useContext, useEffect, useRef } from "react";
import { Button, Breadcrumbs, IconButton, Tooltip, Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress, Snackbar } from "@material-ui/core";
import { Delete, CreateNewFolder, InsertDriveFile, FileCopy, InsertLink, Create, GetApp, Folder as FolderIcon, Close } from "@material-ui/icons";
import axios from "axios";
import NotFound from "../NotFound";
import { copyToClipboard } from "../Functions";

function Folder(props) {
  const { currentUser } = useContext(userContext);
  let { id: currentFolderId } = useParams();
  currentFolderId = typeof currentFolderId === "undefined" ? null : currentFolderId;

  useEffect(() => {
    currentFolderIdRef.current = currentFolderId;
  }, [currentFolderId]);

  const currentFolderIdRef = useRef();

  const { uploadFile } = props;
  const fileInput = useRef();
  const multipleFilesInput = useRef();

  const history = useHistory();

  const [currentDialog, setCurrentDialog] = useState("");

  const [dialogOpened, setDialogOpened] = useState(false);
  const [dialogTextField, setDialogTextField] = useState("");
  const [dialogTextFieldError, setDialogTextFieldError] = useState("");

  const [path, setPath] = useState([]);

  const [allFolder, setAllFolder] = useState([]);
  const [allFiles, setAllFiles] = useState([]);

  const [breadcrumb, setBreadcrumb] = useState([]);

  const [selected, setSelected] = useState([]);

  const [permission, setPermission] = useState(undefined);

  const [loading, setLoading] = useState(true);

  const [notFound, setNotFound] = useState(false);

  const [snackbarOpened, setSnackbarOpened] = useState(false);

  const [fileDragging, setFileDragging] = useState(false);

  const [currentFileToRename, setCurrentFileToRename] = useState({ id: "", type: "" });

  const fetchFolderData = async () => {
    if (currentFolderIdRef.current !== null) {
      let response;
      try {
        response = await axios.post(process.env.REACT_APP_SERVER_URL + "drive/get-folder", {
          _id: currentFolderIdRef.current,
        });
      } catch (err) {
        setNotFound(true);
        return;
      }

      let data = response.data.folder;
      setPath([...data.path, data._id]);

      setPermission(response.data.permission);

      console.log(response.data);

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
      parentId: currentFolderIdRef.current,
    });

    setAllFolder(folderChild.data.folders);
    setAllFiles(folderChild.data.files);
  };

  useEffect(() => {
    const bc = new BroadcastChannel("channel");
    bc.onmessage = (message) => {
      fetchFolderData();
    };
  }, []);

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

  const handleDialogFormSubmit = (e) => {
    e.preventDefault();
    if (!dialogTextField.trim()) {
      setDialogTextFieldError("Please enter the name");
    } else {
      setDialogTextField("");
      setDialogTextFieldError("");
      if (currentDialog === "create-new-folder") createNewFolder(dialogTextField);
      else if (currentDialog === "rename") handleRename(dialogTextField);
      setDialogOpened(false);
    }
  };

  const createNewFolder = async (name) => {
    await axios.post(process.env.REACT_APP_SERVER_URL + "drive/create-folder", {
      name,
      path: path,
      parentId: currentFolderId,
    });

    fetchFolderData();
  };

  const handleClicks = (e, id, type) => {
    if (e.detail === 1) {
      if (e.ctrlKey) {
        let clone = [...selected];
        if (clone.filter((e) => e.id === id).length > 0) {
          clone = clone.filter((e) => e.id !== id);
        } else {
          clone.push({ type, id });
        }
        setSelected(clone);
      } else {
        setSelected([{ type, id }]);
      }
    } else if (e.detail === 2) {
      if (type === "folder") history.push("/drive/folder/" + id);
      else if (type === "file") history.push(`/drive/file/${id}?back=1`);
    }
  };

  const copyLink = async () => {
    const urlToCopy = selected[0].type === "folder" ? `${window.location.origin}/drive/folder/${selected[0].id}` : `${window.location.origin}/drive/file/${selected[0].id}`;
    await copyToClipboard(urlToCopy);
    setSnackbarOpened(true);
  };

  const downloadFile = () => {
    function download(i) {
      if (i < selected.length) {
        const file = allFiles.find((elem) => elem._id === selected[i].id);
        let anchor = document.createElement("a");
        anchor.href = file.url + "?dl=1";
        anchor.download = file.name;
        anchor.target = "_blank";
        anchor.style.display = "none";
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);

        setTimeout(() => {
          i++;
          download(i);
        }, 500);
      }
    }

    download(0);
  };

  const fileDragFocus = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setFileDragging(true);
  };

  const fileDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setFileDragging(false);
  };

  const dropFile = (e) => {
    try {
      e.preventDefault();
      e.stopPropagation();
      let items = e.dataTransfer.items;
      let files = e.dataTransfer.files;

      for (let i = 0, item; (item = items[i]); ++i) {
        let entry = item.webkitGetAsEntry();
        if (entry.isFile) {
          console.log(files[i]);
          uploadFile(files[i], currentFolderId);
        }
      }

      setFileDragging(false);
    } catch (error) {
      setFileDragging(false);
    }
  };

  const handleRename = async (name) => {
    await axios
      .post(process.env.REACT_APP_SERVER_URL + "drive/rename", {
        _id: currentFileToRename.id,
        type: currentFileToRename.type,
        name,
      })
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err, err.response));

    fetchFolderData();
  };

  const deleteFileOrFolder = async (type, id) => {
    await axios
      .post(process.env.REACT_APP_SERVER_URL + "drive/delete", {
        type,
        _id: id,
      })
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err, err.response));

    fetchFolderData();
  };

  return (
    <>
      {!currentUser && !currentFolderId ? (
        <Redirect to={`/sign-in?redirect=${encodeURIComponent(window.location.pathname)}`} />
      ) : (
        <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }} onDrop={dropFile} onDragLeave={fileDragLeave} onDragEnter={fileDragFocus} onDragOver={fileDragFocus} className={fileDragging ? " file-dragging" : ""}>
          {permission !== false && !notFound && (
            <div style={{ padding: "20px 20px 0 20px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
              <Button
                onClick={() => {
                  setCurrentDialog("create-new-folder");
                  setDialogOpened(true);
                }}
              >
                <CreateNewFolder style={{ marginRight: 10 }} />
                <span>New Folder</span>
              </Button>
              <input type="file" hidden onChange={(e) => uploadFile(e.target.files[0], currentFolderId)} ref={fileInput} />
              <Button
                onClick={() => {
                  fileInput.current.click();
                }}
              >
                <InsertDriveFile style={{ marginRight: 10 }} />
                <span>Upload a file</span>
              </Button>
              <input
                type="file"
                hidden
                multiple
                onChange={(e) => {
                  let files = e.target.files;
                  console.log(files);
                  Object.keys(files).forEach((e) => {
                    uploadFile(files[e], currentFolderId);
                  });
                }}
                ref={multipleFilesInput}
              />
              <Button
                onClick={() => {
                  multipleFilesInput.current.click();
                }}
              >
                <FileCopy style={{ marginRight: 10 }} />
                <span>Upload files</span>
              </Button>
            </div>
          )}

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
                  {selected.length === 1 && (
                    <Tooltip title="Copy Link" onClick={copyLink}>
                      <IconButton color="default">
                        <InsertLink />
                      </IconButton>
                    </Tooltip>
                  )}

                  {selected.length > 0 && selected.every((e) => e.type === "file") && (
                    <Tooltip title="Download" onClick={downloadFile}>
                      <IconButton color="primary">
                        <GetApp />
                      </IconButton>
                    </Tooltip>
                  )}
                  {permission && (
                    <>
                      {selected.length === 1 && (
                        <Tooltip
                          title="Rename"
                          onClick={() => {
                            setCurrentFileToRename(selected[0]);
                            setCurrentDialog("rename");
                            setDialogOpened(true);
                          }}
                        >
                          <IconButton>
                            <Create />
                          </IconButton>
                        </Tooltip>
                      )}

                      {selected.length > 0 && (
                        <Tooltip
                          title="Delete"
                          onClick={() => {
                            selected.forEach((e) => {
                              deleteFileOrFolder(e.type, e.id);
                            });
                          }}
                        >
                          <IconButton color="secondary">
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      )}
                    </>
                  )}
                </div>
              </div>

              {loading ? (
                <div className="center-container">
                  <CircularProgress />
                </div>
              ) : (
                <>
                  {allFolder.length === 0 && allFiles.length === 0 && (currentFolderId ? <Typography>This folder is empty</Typography> : <Typography>Your Drive is empty</Typography>)}

                  {allFolder.length > 0 && (
                    <Typography style={{ margin: 10 }} variant="subtitle2">
                      Folders
                    </Typography>
                  )}

                  <div className="main-grid">
                    {allFolder.map((e) => (
                      <div onClick={(event) => handleClicks(event, e._id, "folder")} key={e._id} className={"folder-container" + (selected.filter((elem) => elem.id === e._id).length === 1 ? " selected" : "")}>
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
                      <div onClick={(event) => handleClicks(event, e._id, "file")} className={"file-container" + (selected.filter((elem) => elem.id === e._id).length === 1 ? " selected" : "")} key={e._id}>
                        <div className="center-div" style={{ flexGrow: 1 }}>
                          <div className="center-div" style={{ height: "40%" }}>
                            <img draggable={false} onError={(e) => (e.target.src = "https://raw.githubusercontent.com/NAPTheDev/file-icons/master/default_file.svg")} src={`https://raw.githubusercontent.com/NAPTheDev/file-icons/master/file/${e.name.split(".")[e.name.split(".").length - 1].toLowerCase()}.svg`} height="100%" />
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
            <form onSubmit={handleDialogFormSubmit}>
              <DialogTitle>{currentDialog === "create-new-folder" ? "Create New Folder" : currentDialog === "rename" ? "Rename" : ""}</DialogTitle>
              <DialogContent>
                <TextField error={Boolean(dialogTextFieldError)} helperText={dialogTextFieldError} value={dialogTextField} onChange={(e) => setDialogTextField(e.target.value)} type="text" autoFocus margin="dense" label={currentDialog === "create-new-folder" ? "Folder name" : currentDialog === "rename" ? "New name" : ""} fullWidth />
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
          <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            open={snackbarOpened}
            autoHideDuration={5000}
            onClose={() => setSnackbarOpened(false)}
            message="URL Copied to clipboard"
            action={
              <IconButton size="small" aria-label="close" color="inherit" onClick={() => setSnackbarOpened(false)}>
                <Close fontSize="small" />
              </IconButton>
            }
          />
        </div>
      )}
    </>
  );
}

export default Folder;
