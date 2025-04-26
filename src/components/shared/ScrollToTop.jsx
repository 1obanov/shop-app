import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop({ children }) {
  const location = useLocation();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  return children;
};

export { ScrollToTop };