import { Button, Dialog, TextField, Tooltip } from "@material-ui/core";
import {
  CallEnd,
  Mic,
  MicOff,
  Share,
  Videocam,
  VideocamOff,
} from "@material-ui/icons";
import { Link, useHistory, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import Peer from "peerjs";
import VideoStream from "./VideoStream";
import { io } from "socket.io-client";
import { useStore } from "../../shared/store";

function Room() {
  const { id: roomId } = useParams();

  const currentUser = useStore((state) => state.currentUser);

  const [videos, setVideos] = useState([]);
  const [socket, setSocket] = useState();
  const [metadata, setMetadata] = useState([]);
  const [peerId, setPeerId] = useState("");
  const [dialogOpened, setDialogOpened] = useState(false);
  const [meetingEnded, setMeetingEnded] = useState(false);

  const history = useHistory();

  useEffect(() => {
    const mySocket = io(process.env.REACT_APP_SERVER_URL + "meet");
    const peer = new Peer();

    setSocket(mySocket);

    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          console.log(stream);

          setVideos((prev) => [
            ...prev,
            {
              id: "self",
              source: stream,
              priority: true,
            },
          ]);

          mySocket.on("new-connection", (data) => {
            let call = peer.call(data, stream);
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

          mySocket.on("meeting-ended", () => {
            setMeetingEnded(true);
          });

          peer.on("call", (call) => {
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

          peer.on("error", (err) => {
            alert("Cannot connect to peer server");
            console.log(err);
          });

          const joinRoom = (id) => {
            setPeerId(id);
            mySocket.emit(
              "join-room",
              roomId,
              id,
              currentUser.username,
              currentUser.id,
              currentUser.photoURL,
              (response) => {
                if (!response) history.push("/meet/error");
              }
            );
          };

          if (peer.id) joinRoom(peer.id);
          else peer.on("open", (id) => joinRoom(id));

          mySocket.on("update-metadata", (data) => {
            setMetadata(data);
          });
          mySocket.on("user-disconnected", (userId) => {
            setVideos((prev) => prev.filter((e) => e.id !== userId));
          });
        })
        .catch((err) => {
          console.log(err);
          alert("Please allow permission");
        });
    } else {
      alert("Your device doesn't have camera and microphone");
    }

    return () => {
      mySocket.disconnect();
      peer.disconnect();
    };
  }, [currentUser, history, roomId]);

  if (meetingEnded)
    return (
      <div className="center-container" style={{ flexDirection: "column" }}>
        <h1>Meeting Ended</h1>
        <Link to="/meet">
          <Button variant="contained" color="primary">
            Return Home
          </Button>
        </Link>
      </div>
    );

  return (
    <>
      <div className="video-grid">
        {videos
          .sort((a, b) => (a.priority === b.priority ? 0 : a.priority ? -1 : 1))
          .map((e) => (
            <VideoStream
              key={e.id}
              source={e.source}
              id={e.id}
              camera={
                metadata?.find(
                  (i) => i.id === (e.id === "self" ? peerId : e.id)
                )?.camera
              }
              microphone={
                metadata?.find(
                  (i) => i.id === (e.id === "self" ? peerId : e.id)
                )?.microphone
              }
              username={
                e.id === "self"
                  ? currentUser.username
                  : metadata?.find((i) => i.id === e.id)?.username || "User"
              }
              photoURL={
                e.id === "self"
                  ? currentUser.photoURL
                  : metadata?.find((i) => i.id === e.id)?.photoURL
              }
            />
          ))}
      </div>
      <div className="room-control">
        <Tooltip title="Toggle Microphone" placement="top">
          <Button
            onClick={() => socket?.emit("toggle-microphone")}
            style={{ borderRadius: 99999, aspectRatio: "1 / 1" }}
            variant="contained"
            color={
              metadata?.find((i) => i.id === peerId)?.microphone
                ? "primary"
                : "secondary"
            }
          >
            {metadata?.find((i) => i.id === peerId)?.microphone ? (
              <Mic />
            ) : (
              <MicOff />
            )}
          </Button>
        </Tooltip>
        <Tooltip title="Toggle Camera" placement="top">
          <Button
            onClick={() => socket?.emit("toggle-camera")}
            style={{ borderRadius: 99999, aspectRatio: "1 / 1" }}
            variant="contained"
            color={
              metadata?.find((i) => i.id === peerId)?.camera
                ? "primary"
                : "secondary"
            }
          >
            {metadata?.find((i) => i.id === peerId)?.camera ? (
              <Videocam />
            ) : (
              <VideocamOff />
            )}
          </Button>
        </Tooltip>
        <Tooltip title="Invite people" placement="top">
          <Button
            onClick={() => setDialogOpened(true)}
            style={{ borderRadius: 99999, aspectRatio: "1 / 1" }}
            variant="contained"
            color="primary"
          >
            <Share />
          </Button>
        </Tooltip>
        {currentUser.id === roomId && (
          <Tooltip title="End meeting" placement="top">
            <Button
              onClick={() => socket.emit("meeting-ended")}
              style={{ borderRadius: 99999, aspectRatio: "1 / 1" }}
              variant="contained"
              color="secondary"
            >
              <CallEnd />
            </Button>
          </Tooltip>
        )}
      </div>
      <Dialog open={dialogOpened} onClose={() => setDialogOpened(false)}>
        <div style={{ width: "100vw", maxWidth: 350, padding: 30 }}>
          <div style={{ width: "100%", paddingBottom: 30 }}>
            <TextField
              style={{ width: "100%" }}
              label="Room ID"
              value={roomId}
              onFocus={(e) => e.target.select()}
            />
          </div>
          <div style={{ width: "100%", paddingBottom: 30 }}>
            <TextField
              style={{ width: "100%" }}
              label="URL"
              value={window.location.href}
              onFocus={(e) => e.target.select()}
            />
          </div>
          <div
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <img
              style={{ maxWidth: "100%", height: "auto" }}
              src={`https://api.qrserver.com/v1/create-qr-code/?size=300&data=${encodeURIComponent(
                window.location.href
              )}`}
              alt="QR Code"
            />
          </div>
        </div>
      </Dialog>
    </>
  );
}

export default Room;
