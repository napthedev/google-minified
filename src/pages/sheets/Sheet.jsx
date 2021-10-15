import "handsontable/dist/handsontable.full.min.css";

import { CircularProgress, FormControl, MenuItem, Select, Typography } from "@material-ui/core";
import { disable as disableDarkMode, auto as followSystemColorScheme } from "darkreader";
import { useEffect, useState } from "react";

import Handsontable from "handsontable";
import { HotTable } from "@handsontable/react";
import NotFound from "../../components/NotFound";
import axios from "axios";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";

function Sheet() {
  const { id } = useParams();

  const [hotData, setHotData] = useState(Handsontable.helper.createEmptySpreadsheetData(100, 52));
  const [socket, setSocket] = useState();
  const [status, setStatus] = useState(undefined);
  const [title, setTitle] = useState("");
  const [renameInputValue, setRenameInputValue] = useState("");
  const [selectValue, setSelectValue] = useState(0);
  const [permission, setPermission] = useState(false);
  const [editable, setEditable] = useState(false);

  useEffect(() => setRenameInputValue(title), [title]);

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
    if (permission) axios.patch("sheets", { _id: id, data: JSON.stringify(hotData) });
  }, [hotData, permission, id]);

  useEffect(() => {
    axios
      .post("sheets/sheet", { _id: id })
      .then((res) => {
        if (res.status === 200) {
          setTitle(res.data.name);
          setHotData(JSON.parse(res.data.data));
          setStatus(res.status);
          setPermission(res.data.permission);
          setEditable(res.data.permission);
        }
      })
      .catch((err) => {
        console.log(err, err.response);
        setStatus(err.response?.status || 500);
      });

    const mySocket = io(process.env.REACT_APP_SERVER_URL + "sheets");
    mySocket.emit("join-room", id);

    mySocket.on("new-data", (data) => {
      setHotData((prev) => {
        let clone = JSON.parse(JSON.stringify(prev));
        data.forEach((e) => {
          clone[e[0]][e[1]] = e[3];
        });
        return clone;
      });
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
      axios.patch("sheets/name", { _id: id, name: renameInputValue.trim() });
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
            <input onFocus={(e) => e.target.select()} onBlur={handleRenameInputBlur} placeholder="Sheet name" className="rename-input" value={renameInputValue} onChange={(e) => setRenameInputValue(e.target.value)} />
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
      <HotTable
        readOnly={!editable}
        data={hotData}
        colHeaders={true}
        rowHeaders={true}
        height="auto"
        licenseKey="non-commercial-and-evaluation"
        afterChange={(changes, source) => {
          if (source !== "loadData") {
            socket?.emit("update-data", changes);
          }
        }}
      />
    </div>
  );
}

export default Sheet;
