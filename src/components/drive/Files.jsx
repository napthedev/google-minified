import { useParams, useLocation, useHistory } from "react-router-dom";
import { useEffect, useState } from "react";

import axios from "axios";

import NotFound from "../NotFound";
import { Button, CircularProgress, IconButton, Tooltip, Snackbar } from "@material-ui/core";
import { InsertLink, GetApp, ArrowBack, Close } from "@material-ui/icons";

import { copyToClipboard } from "../Functions";

import Highlight from "react-highlight";
import "../../css/railscasts.min.css";

import { anchorDownloadFile } from "../Functions";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Files() {
  const query = useQuery();
  const back = query.get("back");

  const history = useHistory();

  const { id } = useParams();

  const [view, setView] = useState(0);
  const [data, setData] = useState("");
  const [type, setType] = useState("");

  const [file, setFile] = useState({
    name: "",
    url: "",
  });

  const [snackbarOpened, setSnackbarOpened] = useState(false);

  useEffect(async () => {
    axios
      .post(process.env.REACT_APP_SERVER_URL + "drive/get-file", { _id: id })
      .then(async (res) => {
        document.title = res.data.name + " - File - Google Drive Minified";

        if (res.data.type.startsWith("text")) {
          const textData = await axios.get(res.data.url);
          setData(textData.data);
          setType("text");
        } else if (res.data.type.startsWith("audio")) {
          setType("audio");
          setData(res.data.url);
        } else if (res.data.type.startsWith("video")) {
          setData(res.data.url);
          setType("video");
        } else if (res.data.type.startsWith("image")) {
          setData(res.data.url);
          setType("image");
        } else if (res.data.type === "application/pdf") {
          setData(res.data.url);
          setType("pdf");
        } else {
          setType("unknown");
        }
        setFile({
          name: res.data.name,
          url: res.data.url,
        });
        setView(200);
      })
      .catch((err) => {
        console.log(err, err.response);
        setView(err.response?.status ? err.response?.status : false);
      });
  }, []);

  const copyLink = () => {
    copyToClipboard(window.location.origin + window.location.pathname).then(() => {
      setSnackbarOpened(true);
    });
  };

  const downloadFile = () => {
    anchorDownloadFile(file.url + "?dl=1");
  };

  return (
    <>
      {view === 200 ? (
        <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 50, paddingLeft: 10, width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
              {Boolean(Number(back)) && (
                <Tooltip title="Back" onClick={() => history.goBack()}>
                  <IconButton>
                    <ArrowBack />
                  </IconButton>
                </Tooltip>
              )}
              <img style={{ height: 30, width: "auto", padding: "0 20px 0 10px" }} onError={(e) => (e.target.src = "https://raw.githubusercontent.com/NAPTheDev/file-icons/master/default_file.svg")} src={`https://raw.githubusercontent.com/NAPTheDev/file-icons/master/file/${file.name.split(".")[file.name.split(".").length - 1].toLowerCase()}.svg`} height="100%" />
              <p style={{ maxWidth: Boolean(Number(back)) ? "calc(100vw - 230px)" : "calc(100vw - 180px)" }}>{file.name}</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", marginRight: 10 }}>
              <Tooltip title="Copy link" onClick={copyLink}>
                <IconButton>
                  <InsertLink />
                </IconButton>
              </Tooltip>
              <Tooltip title="Download" onClick={downloadFile}>
                <IconButton color="primary">
                  <GetApp />
                </IconButton>
              </Tooltip>
            </div>
          </div>
          <div style={{ flex: 1, height: "calc(100vh - 50px)" }}>
            {type === "text" ? (
              <div className="highlight-js-container">
                <Highlight className={file.name.split(".")[file.name.split(".").length - 1]}>{data}</Highlight>
              </div>
            ) : type === "video" ? (
              <div className="center-container">
                <video style={{ maxHeight: "60%", maxWidth: "100%", outline: "none" }} controls src={data}></video>
              </div>
            ) : type === "audio" ? (
              <div className="center-container">
                <audio controls src={data}></audio>
              </div>
            ) : type === "image" ? (
              <div className="center-container" style={{ flex: "1" }}>
                <img className="responsive-image" src={data} />
              </div>
            ) : type === "pdf" ? (
              <div style={{ display: "flex", flexDirection: "column", height: "100%", alignItems: "center" }}>
                <iframe frameBorder={0} style={{ maxWidth: 600, width: "100%", height: "100%", flexGrow: 1 }} src={data + "#toolbar=0"} />
              </div>
            ) : (
              <div className="center-container">
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <h1>File cannot be previewed</h1>
                  <Button color="primary" variant="contained" onClick={downloadFile}>
                    <GetApp style={{ marginRight: 10 }} />
                    Download
                  </Button>
                </div>
              </div>
            )}
          </div>

          <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
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
      ) : view === 404 ? (
        <NotFound />
      ) : view === 0 ? (
        <div className="center-container">
          <CircularProgress />
        </div>
      ) : (
        <div className="center-container">
          <h1 style={{ textAlign: "center" }}>Something went wrong. Try again later</h1>
        </div>
      )}
    </>
  );
}

export default Files;
