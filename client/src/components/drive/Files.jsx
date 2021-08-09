import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import axios from "axios";

import NotFound from "../NotFound";
import { CircularProgress } from "@material-ui/core";

function Files() {
  const { id } = useParams();

  const [view, setView] = useState(0);
  const [data, setData] = useState("");
  const [type, setType] = useState("");

  useEffect(async () => {
    axios
      .post(process.env.REACT_APP_SERVER_URL + "drive/get-file", { _id: id })
      .then(async (res) => {
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
        setView(200);
      })
      .catch((err) => {
        console.log(err, err.response);
        setView(err.response?.status ? err.response?.status : 500);
      });
  }, []);

  return (
    <div style={{ height: "100vh" }}>
      {view === 200 ? (
        <>
          {type === "text" ? (
            <div className="center-container">
              <pre>{data}</pre>
            </div>
          ) : type === "video" ? (
            <div className="center-container">
              <video style={{ maxHeight: "50vh", maxWidth: "100%", outline: "none" }} controls src={data}></video>
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
            <div style={{ display: "flex", flexDirection: "column", height: "100vh", alignItems: "center" }}>
              <iframe frameBorder={0} style={{ maxWidth: 600, width: "100%", height: "100%", flexGrow: 1 }} src={data + "#toolbar=0&navpanes=0"} />
            </div>
          ) : (
            ""
          )}
        </>
      ) : view === 404 ? (
        <NotFound />
      ) : view === 0 ? (
        <div className="center-container">
          <CircularProgress />
        </div>
      ) : (
        <h1 style={{ textAlign: "center" }}>{view}</h1>
      )}
    </div>
  );
}

export default Files;
