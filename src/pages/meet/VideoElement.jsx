import { useRef, useEffect } from "react";

function VideoElement({ source, ...others }) {
  const videoRef = useRef();
  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.srcObject = source;
  }, [source]);

  return <video ref={videoRef} {...others}></video>;
}

export default VideoElement;
