import { useEffect } from "react";
function Favicon({ icon }) {
  useEffect(() => {
    document.querySelector("link[rel='shortcut icon']").href = icon;
  }, [icon]);
  return <></>;
}

export default Favicon;
