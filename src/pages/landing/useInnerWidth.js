import { useEffect, useRef, useState } from "react";

export function useInnerWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  const timeOutRef = useRef();

  useEffect(() => {
    const handler = () => {
      if (timeOutRef.current) clearTimeout(timeOutRef.current);

      timeOutRef.current = setTimeout(() => {
        setWidth(window.innerWidth);
      }, 100);
    };

    window.addEventListener("resize", handler);

    return () => window.removeEventListener("resize", handler);
  }, []);

  return { width };
}
