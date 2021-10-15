import "react-quill/dist/quill.snow.css";

import { CircularProgress, FormControl, MenuItem, Select, Typography } from "@material-ui/core";
import { disable as disableDarkMode, auto as followSystemColorScheme } from "darkreader";
import { useEffect, useRef, useState } from "react";

import NotFound from "../../components/NotFound";
import ReactQuill from "react-quill";
import axios from "axios";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";

function Document() {
  const { id } = useParams();

  const [editorValue, setEditorValue] = useState("");
  const [socket, setSocket] = useState();
  const [status, setStatus] = useState(undefined);
  const [title, setTitle] = useState("");
  const [renameInputValue, setRenameInputValue] = useState("");
  const [selectValue, setSelectValue] = useState(0);
  const [permission, setPermission] = useState(false);
  const [editable, setEditable] = useState(false);

  useEffect(() => setRenameInputValue(title), [title]);

  const editorRef = useRef();

  useEffect(() => {
    followSystemColorScheme({
      brightness: 100,
      contrast: 90,
      sepia: 10,
    });

    return () => {
      disableDarkMode();
    };
  }, []);

  useEffect(() => {
    if (permission) axios.patch("docs", { _id: id, data: editorValue });
  }, [editorValue, id, permission]);

  useEffect(() => {
    axios
      .post("docs/document", { _id: id })
      .then((res) => {
        if (res.status === 200) {
          setTitle(res.data.name);
          setEditorValue(res.data.data);
          setStatus(res.status);
          setPermission(res.data.permission);
          setEditable(res.data.permission);
        }
      })
      .catch((err) => {
        console.log(err, err.response);
        setStatus(err.response?.status || 500);
      });

    const mySocket = io(process.env.REACT_APP_SERVER_URL + "docs");
    mySocket.emit("join-room", id);

    mySocket.on("new-data", (data) => {
      editorRef.current?.getEditor().updateContents(data);
    });

    mySocket.on("name", (value) => {
      setTitle(value);
    });
    mySocket.on("editable", (value) => {
      setEditable(Boolean(value));
    });
    setSocket(mySocket);
  }, [id]);

  const handleRenameInputBlur = (e) => {
    if (!renameInputValue.trim()) {
      setRenameInputValue(title);
    } else {
      setTitle(renameInputValue.trim());
      socket?.emit("name", renameInputValue.trim());
      axios.patch("docs/name", { _id: id, name: renameInputValue.trim() });
    }
  };

  if (typeof status === "undefined")
    return (
      <div className="center-container">
        <CircularProgress />
      </div>
    );

  if (status === 404) return <NotFound />;
  if (status !== 200) return <Typography align="center">{status}</Typography>;

  return (
    <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 2% 0 2%", height: 50 }}>
        {permission ? (
          <>
            <input onFocus={(e) => e.target.select()} onBlur={handleRenameInputBlur} placeholder="Document name" className="rename-input" value={renameInputValue} onChange={(e) => setRenameInputValue(e.target.value)} />
            <FormControl>
              <Select
                value={selectValue}
                onChange={(e) => {
                  setSelectValue(e.target.value);
                  socket?.emit("editable", e.target.value);
                }}
              >
                <MenuItem value={0}>Only you can edit</MenuItem>
                <MenuItem value={1}>Everyone can edit</MenuItem>
              </Select>
            </FormControl>
          </>
        ) : (
          <>
            <Typography>{title}</Typography>
            <Typography>Can edit: {String(editable)}</Typography>
          </>
        )}
      </div>
      <ReactQuill
        ref={editorRef}
        modules={{
          toolbar: [[{ header: [1, 2, 3, 4, 5, 6, false] }], [{ font: [] }], [{ list: "ordered" }, { list: "bullet" }], ["bold", "italic", "underline"], [{ color: [] }, { background: [] }], [{ script: "sub" }, { script: "super" }], [{ align: [] }], ["blockquote", "code-block"], ["clean"]],
        }}
        style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
        theme="snow"
        readOnly={!editable}
        value={editorValue}
        onChange={(content, delta, source, editor) => {
          if (source === "user") {
            setEditorValue(content);
            socket?.emit("update-data", delta);
          }
        }}
      />
    </div>
  );
}

export default Document;
