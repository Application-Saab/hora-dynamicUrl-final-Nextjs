import { useState, useEffect } from "react";

const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const update = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    update(); // mount pe set
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return screenSize;
};

export default useScreenSize;