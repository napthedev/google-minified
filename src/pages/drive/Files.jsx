import "../../css/railscasts.min.css";
import "../../css/vs.min.css";

import { ArrowBack, GetApp, InsertLink } from "@material-ui/icons";
import { Button, CircularProgress, IconButton, Tooltip } from "@material-ui/core";
import { useContext, useEffect, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";

import ClipboardSnackbar from "../../components/ClipboardSnackbar";
import Highlight from "react-highlight";
import NotFound from "../../components/NotFound";
import Title from "../../components/Title";
import { anchorDownloadFile } from "../../shared/utils";
import axios from "axios";
import { userContext } from "../../App";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Files() {
  const query = useQuery();
  const back = query.get("back");

  const history = useHistory();

  const { id } = useParams();

  const { theme } = useContext(userContext);

  const [view, setView] = useState(0);
  const [data, setData] = useState("");
  const [type, setType] = useState("");

  const [file, setFile] = useState({
    name: "",
    url: "",
  });

  useEffect(() => {
    (async () => {
      axios
        .post("drive/file-info", { _id: id })
        .then(async (res) => {
          if (res.data.type.startsWith("text") || res.data.type === "application/json") {
            const textData = (await axios.get(res.data.url)).data;
            setData(typeof textData === "string" ? textData : JSON.stringify(textData, null, 4));
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
    })();
  }, [id]);

  const downloadFile = () => {
    anchorDownloadFile(file.url + "?dl=1");
  };

  return (
    <>
      <Title title={`${file.name} - File - Google Drive Minified"`} />
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
              <img style={{ height: 30, width: "auto", padding: "0 20px 0 10px" }} onError={(e) => (e.target.src = "https://raw.githubusercontent.com/NAPTheDev/file-icons/master/default_file.svg")} src={`https://raw.githubusercontent.com/NAPTheDev/file-icons/master/file/${file.name.split(".")[file.name.split(".").length - 1].toLowerCase()}.svg`} height="100%" alt="" />
              <p style={{ maxWidth: Boolean(Number(back)) ? "calc(100vw - 230px)" : "calc(100vw - 180px)" }}>{file.name}</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", marginRight: 10 }}>
              <ClipboardSnackbar content={window.location.origin + window.location.pathname} message="URL Copied to clipboard">
                <Tooltip title="Copy link">
                  <IconButton>
                    <InsertLink />
                  </IconButton>
                </Tooltip>
              </ClipboardSnackbar>
              <Tooltip title="Download" onClick={downloadFile}>
                <IconButton color="primary">
                  <GetApp />
                </IconButton>
              </Tooltip>
            </div>
          </div>
          <div style={{ flex: 1, height: "calc(100vh - 50px)" }}>
            {type === "text" ? (
              <div className={`highlight-js-container ${theme.palette.type}`}>
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
                <img className="responsive-image" src={data} alt="" />
              </div>
            ) : type === "pdf" ? (
              <div style={{ display: "flex", flexDirection: "column", height: "100%", alignItems: "center" }}>
                <iframe frameBorder={0} title="PDF File" style={{ maxWidth: 600, width: "100%", height: "100%", flexGrow: 1 }} src={data + "#toolbar=0"} />
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
