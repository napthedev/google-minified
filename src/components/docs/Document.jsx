import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { io } from "socket.io-client";
import axios from "axios";
import { disable as disableDarkMode, auto as followSystemColorScheme } from "darkreader";

function Document() {
  const { id } = useParams();

  const [editorValue, setEditorValue] = useState("");
  const [socket, setSocket] = useState();

  const editorRef = useRef();

  useEffect(() => {
    followSystemColorScheme({
      brightness: 100,
      contrast: 90,
      sepia: 10,
    });

    const interval = setInterval(() => axios.patch("docs", { _id: id, data: content }), 400);

    return () => {
      disableDarkMode();
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    axios
      .post("docs/document", { _id: id })
      .then((res) => {
        if (res.status === 200) setEditorValue(res.data.data);
        else throw new Error("Error");
      })
      .catch((err) => console.log(err, err.response));

    const mySocket = io((process.env.REACT_APP_SERVER_URL || "http://localhost:5000/") + "docs");
    mySocket.emit("join-room", id);

    mySocket.on("new-data", (data) => {
      editorRef.current?.getEditor().updateContents(data);
    });
    setSocket(mySocket);
  }, [id]);

  return (
    <ReactQuill
      ref={editorRef}
      modules={{
        toolbar: [[{ header: [1, 2, 3, 4, 5, 6, false] }], [{ font: [] }], [{ list: "ordered" }, { list: "bullet" }], ["bold", "italic", "underline"], [{ color: [] }, { background: [] }], [{ script: "sub" }, { script: "super" }], [{ align: [] }], ["blockquote", "code-block"], ["clean"]],
      }}
      style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      theme="snow"
      value={editorValue}
      onChange={(content, delta, source, editor) => {
        if (source === "user") {
          setEditorValue(content);
          socket?.emit("update-data", delta);
        }
      }}
    />
  );
}

export default Document;
