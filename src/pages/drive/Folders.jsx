import { Breadcrumbs, CircularProgress, IconButton, Tooltip, Typography } from "@material-ui/core";
import { Delete, FileCopy, Folder as FolderIcon, GetApp, InsertDriveFile, InsertLink } from "@material-ui/icons";
import { Link, useHistory, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import ClipboardSnackbar from "../../components/ClipboardSnackbar";
import CreateNewFolder from "./CreateNewFolder";
import FileInput from "./FileInput";
import NotFound from "../../components/NotFound";
import RenameDialog from "./RenameDialog";
import Title from "../../components/Title";
import { anchorDownloadFile } from "../../shared/utils";
import axios from "axios";
import { io } from "socket.io-client";
import { useStore } from "../../shared/store";

function Folder({ uploadFile }) {
  const currentUser = useStore((state) => state.currentUser);
  let { id: currentFolderId } = useParams();
  currentFolderId = typeof currentFolderId === "undefined" ? null : currentFolderId;

  useEffect(() => {
    (async () => {
      currentFolderIdRef.current = currentFolderId;

      let socket = io(process.env.REACT_APP_SERVER_URL + "drive");
      socket.emit("join-room", currentFolderIdRef.current || currentUser.id);

      socket.on("new-data", () => {
        fetchFolderData();
      });

      setNotFound(false);
      setLoading(true);
      await fetchFolderData();
      setLoading(false);

      const clickHandler = (e) => {
        let clickedOutside = true;

        let foldersEl = Array.prototype.slice.call(document.getElementsByClassName("folder-box"));
        let filesEl = Array.prototype.slice.call(document.getElementsByClassName("file-box"));
        let allEl = foldersEl.concat(filesEl);

        for (const el of allEl) {
          if (el.contains(e.target)) {
            clickedOutside = false;
          }
        }

        if (clickedOutside) setSelected([]);
      };
      window.addEventListener("click", clickHandler);

      return () => {
        socket.disconnect();
        window.removeEventListener("click", clickHandler);
      };
    })();
  }, [currentFolderId, currentUser]);

  const currentFolderIdRef = useRef();

  const history = useHistory();

  const [path, setPath] = useState([]);

  const [allFolder, setAllFolder] = useState([]);
  const [allFiles, setAllFiles] = useState([]);

  const [breadcrumb, setBreadcrumb] = useState([]);

  const [selected, setSelected] = useState([]);

  const [permission, setPermission] = useState(undefined);

  const [loading, setLoading] = useState(true);

  const [notFound, setNotFound] = useState(false);

  const [fileDragging, setFileDragging] = useState(false);

  const fetchFolderData = async () => {
    if (currentFolderIdRef.current !== null) {
      let response;
      try {
        response = await axios.post("drive/folder", {
          _id: currentFolderIdRef.current,
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

    const folderChild = await axios.post("drive/child", {
      path: currentFolderIdRef.current,
    });

    setAllFolder(folderChild.data.folders);
    setAllFiles(folderChild.data.files);
    setSelected([]);
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

  const downloadFile = () => {
    function download(i) {
      if (i < selected.length) {
        const file = allFiles.find((elem) => elem._id === selected[i].id);

        anchorDownloadFile(file.url + "?dl=1");

        setTimeout(() => {
          i++;
          download(i);
        }, 1000);
      }
    }

    download(0);
  };

  const deleteFileOrFolder = (type, id) => {
    axios
      .delete("drive", {
        data: { _id: id, type },
      })
      .catch((err) => console.log(err, err.response));
  };

  const dragBlur = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setFileDragging(false);
  };

  const dragFocus = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setFileDragging(true);
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
          uploadFile(files[i], path);
        }
      }

      setFileDragging(false);
    } catch (error) {
      setFileDragging(false);
    }
  };

  return (
    <>
      <Title title={currentFolderId ? `${breadcrumb.length > 0 ? breadcrumb.slice(-1)[0].name : ""} - Folder - Google Drive Minified` : "My Drive - Google Drive Minified"} />
      <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }} onDrop={dropFile} onDragLeave={dragBlur} onDragEnter={dragFocus} onDragOver={dragFocus} className={fileDragging ? "file-dragging" : ""}>
        {(permission || typeof permission === "undefined") && !notFound && (
          <div style={{ padding: "20px 20px 0 20px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))" }}>
            <CreateNewFolder path={path} permission={permission} />
            <FileInput
              className="center-div"
              disabled={!permission}
              label={
                <>
                  <InsertDriveFile style={{ marginRight: 10 }} />
                  <span>Upload a file</span>
                </>
              }
              onChange={(e) => uploadFile(e.target.files[0], path)}
            />
            <FileInput
              multiple
              className="center-div"
              disabled={!permission}
              label={
                <>
                  <FileCopy style={{ marginRight: 10 }} />
                  <span>Upload files</span>
                </>
              }
              onChange={(e) => {
                let files = e.target.files;
                Object.keys(files).forEach((e) => {
                  uploadFile(files[e], path);
                });
              }}
            />
          </div>
        )}

        {!notFound ? (
          <div className="main">
            <div className="actions-wrapper">
              <Breadcrumbs>
                {permission !== false ? <Link to="/drive">My Drive</Link> : <span>Shared with me</span>}

                {breadcrumb.map((e, index) => (
                  <Link key={index} to={e._id}>
                    {e.name}
                  </Link>
                ))}
              </Breadcrumbs>
              <div>
                {selected.length === 1 && (
                  <ClipboardSnackbar content={selected[0].type === "folder" ? `${window.location.origin}/drive/folder/${selected[0].id}` : `${window.location.origin}/drive/file/${selected[0].id}`} message="URL Copied to clipboard">
                    <Tooltip title="Copy Link">
                      <IconButton color="default">
                        <InsertLink />
                      </IconButton>
                    </Tooltip>
                  </ClipboardSnackbar>
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
                    <RenameDialog selected={selected} />

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
                    <div onClick={(event) => handleClicks(event, e._id, "folder")} key={e._id} className={"folder-box" + (selected.filter((elem) => elem.id === e._id).length === 1 ? " selected" : "")}>
                      <FolderIcon className="dynamic-icon" />
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
                    <div onClick={(event) => handleClicks(event, e._id, "file")} className={"file-box square" + (selected.filter((elem) => elem.id === e._id).length === 1 ? " selected" : "")} key={e._id}>
                      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
                        <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%" }}>
                          <div className="center-div" style={{ flexGrow: 1 }}>
                            <div className="center-div" style={{ height: "40%" }}>
                              <img draggable={false} alt="" onError={(e) => (e.target.src = "https://raw.githubusercontent.com/NAPTheDev/file-icons/master/default_file.svg")} src={`https://raw.githubusercontent.com/NAPTheDev/file-icons/master/file/${e.name.split(".")[e.name.split(".").length - 1].toLowerCase()}.svg`} height="100%" />
                            </div>
                          </div>
                          <div className="file-box-label">
                            <Typography>{e.name}</Typography>
                          </div>
                        </div>
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
      </div>
    </>
  );
}

export default Folder;
