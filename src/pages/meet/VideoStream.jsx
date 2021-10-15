import { MicNone, MicOff } from "@material-ui/icons";

import VideoElement from "./VideoElement";

function VideoStream({ source, id, username, camera, microphone }) {
  return (
    <div className="video-container">
      {camera && <VideoElement source={source} autoPlay playsInline muted={id === "self" || microphone}></VideoElement>}
      <div className="video-info">
        <div className="is-muted">{microphone ? <MicNone /> : <MicOff color="secondary" />}</div>
        <div>{username}</div>
      </div>
    </div>
  );
}

export default VideoStream;
