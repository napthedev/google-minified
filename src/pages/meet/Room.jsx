import { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Button, Dialog, TextField, Tooltip } from "@material-ui/core";
import { Mic, MicOff, Videocam, VideocamOff, Share } from "@material-ui/icons";
import VideoStream from "./VideoStream";
import Peer from "peerjs";
import { io } from "socket.io-client";
import { userContext } from "../../App";

function Room() {
  const { id: roomId } = useParams();

  const { currentUser } = useContext(userContext);

  const [videos, setVideos] = useState([]);
  const [socket, setSocket] = useState();
  const [peer, setPeer] = useState();
  const [metadata, setMetadata] = useState([]);
  const [peerId, setPeerId] = useState("");
  const [dialogOpened, setDialogOpened] = useState(false);

  const history = useHistory();

  useEffect(() => {
    const mySocket = io(process.env.REACT_APP_SERVER_URL + "meet");
    const myPeer = new Peer();

    setSocket(mySocket);
    setPeer(myPeer);

    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setVideos((prev) => [
            ...prev,
            {
              id: "self",
              source: stream,
              priority: true,
            },
          ]);

          mySocket.on("new-connection", (data) => {
            let call = myPeer.call(data, stream);
            call.on("stream", (remoteStream) => {
              setVideos((prev) => {
                if (prev.find((e) => e.id === call.peer)) return prev;
                return [
                  ...prev,
                  {
                    id: call.peer,
                    source: remoteStream,
                    priority: false,
                  },
                ];
              });
            });
          });

          myPeer.on("call", (call) => {
            call.answer(stream);
            call.on("stream", (remoteStream) => {
              setVideos((prev) => {
                if (prev.find((e) => e.id === call.peer)) return prev;
                return [
                  ...prev,
                  {
                    id: call.peer,
                    source: remoteStream,
                    priority: false,
                  },
                ];
              });
            });
          });

          myPeer.on("open", (id) => {
            setPeerId(id);
            mySocket.emit("join-room", roomId, id, currentUser.username, currentUser.id, (response) => {
              if (!response) history.push("/meet/error");
            });
            mySocket.on("update-metadata", (data) => {
              setMetadata(data);
            });
            mySocket.on("user-disconnected", (userId) => {
              setVideos((prev) => prev.filter((e) => e.id !== userId));
            });
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }

    return () => {
      mySocket.disconnect();
      myPeer.disconnect();
    };
  }, []);

  return (
    <>
      <div className="video-grid">
        {videos
          .sort((a, b) => (a.priority === b.priority ? 0 : a.priority ? -1 : 1))
          .map((e) => (
            <VideoStream key={e.id} source={e.source} id={e.id} camera={metadata?.find((i) => i.id === (e.id === "self" ? peerId : e.id))?.camera} microphone={metadata?.find((i) => i.id === (e.id === "self" ? peerId : e.id))?.microphone} username={e.id === "self" ? currentUser.username : metadata?.find((i) => i.id === e.id)?.username || "User"} />
          ))}
      </div>
      <div className="room-control">
        <Tooltip title="Toggle Microphone" placement="top">
          <Button onClick={() => socket?.emit("toggle-microphone")} style={{ borderRadius: 99999, aspectRatio: "1 / 1" }} variant="contained" color={metadata?.find((i) => i.id === peerId)?.microphone ? "primary" : "secondary"}>
            {metadata?.find((i) => i.id === peerId)?.microphone ? <Mic /> : <MicOff />}
          </Button>
        </Tooltip>
        <Tooltip title="Toggle Camera" placement="top">
          <Button onClick={() => socket?.emit("toggle-camera")} style={{ borderRadius: 99999, aspectRatio: "1 / 1" }} variant="contained" color={metadata?.find((i) => i.id === peerId)?.camera ? "primary" : "secondary"}>
            {metadata?.find((i) => i.id === peerId)?.camera ? <Videocam /> : <VideocamOff />}
          </Button>
        </Tooltip>
        <Tooltip title="Invite people" placement="top">
          <Button onClick={() => setDialogOpened(true)} style={{ borderRadius: 99999, aspectRatio: "1 / 1" }} variant="contained" color="primary">
            <Share />
          </Button>
        </Tooltip>
      </div>
      <Dialog open={dialogOpened} onClose={() => setDialogOpened(false)}>
        <div style={{ width: "100vw", maxWidth: 350, padding: 30 }}>
          <div style={{ width: "100%", paddingBottom: 30 }}>
            <TextField style={{ width: "100%" }} label="Room ID" value={roomId} onFocus={(e) => e.target.select()} />
          </div>
          <div style={{ width: "100%", paddingBottom: 30 }}>
            <TextField style={{ width: "100%" }} label="URL" value={window.location.href} onFocus={(e) => e.target.select()} />
          </div>
          <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
            <img style={{ maxWidth: "100%", height: "auto" }} src={`https://qrtag.net/api/qr_5.png?url=${encodeURIComponent(window.location.href)}`} alt="QR Code" />
          </div>
        </div>
      </Dialog>
    </>
  );
}

export default Room;
