import { useEffect, useRef } from "react";

function VideoElement({ source, ...others }) {
  const videoRef = useRef();
  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.srcObject = source;
  }, [source]);

  return <video className="center" ref={videoRef} {...others}></video>;
}

export default VideoElement;
