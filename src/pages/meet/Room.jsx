import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
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
              muted: true,
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
                    muted: false,
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
                    muted: false,
                    priority: false,
                  },
                ];
              });
            });
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }

    myPeer.on("open", (id) => {
      mySocket.emit("join-room", roomId, id, currentUser.username);
      mySocket.on("update-metadata", (data) => {
        console.log(data);
        setMetadata(data);
      });
      mySocket.on("user-disconnected", (userId) => {
        setVideos((prev) => prev.filter((e) => e.id !== userId));
      });
    });
  }, []);

  return (
    <div className="video-grid">
      {videos
        .sort((a, b) => (a.priority === b.priority ? 0 : a.priority ? -1 : 1))
        .map((e) => (
          <VideoStream key={e.id} source={e.source} muted={e.muted} id={e.id} username={e.id === "self" ? currentUser.username : metadata?.find((i) => i.id === e.id)?.username || "User"} />
        ))}
    </div>
  );
}

export default Room;
