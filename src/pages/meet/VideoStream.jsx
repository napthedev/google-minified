import { MicNone, MicOff } from "@material-ui/icons";

import VideoElement from "./VideoElement";

function VideoStream({ source, id, username, camera, microphone, photoURL }) {
  return (
    <div className="video-container">
      {camera ? <VideoElement source={source} autoPlay playsInline muted={id === "self" || microphone}></VideoElement> : <img className="center" style={{ borderRadius: "999px" }} src={photoURL} alt="" />}
      <div className="video-info">
        <div className="is-muted">{microphone ? <MicNone /> : <MicOff color="secondary" />}</div>
        <div>{username}</div>
      </div>
    </div>
  );
}

export default VideoStream;
