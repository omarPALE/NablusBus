import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to the top
  }, [pathname]); // Trigger on pathname change

  return null; // This component doesn't render anything
};

export default ScrollToTop;
