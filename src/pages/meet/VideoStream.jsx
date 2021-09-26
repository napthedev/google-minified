import { useRef, useEffect } from "react";
import { MicNone, MicOff } from "@material-ui/icons";

function VideoStream({ source, muted }) {
  const videoRef = useRef();

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.srcObject = source;
  }, [source]);

  return (
    <div className="video-container">
      <video autoPlay playsInline ref={videoRef} muted={muted}></video>
      <div className="is-muted">{muted ? <MicOff color="secondary" /> : <MicNone />}</div>
    </div>
  );
}

export default VideoStream;
