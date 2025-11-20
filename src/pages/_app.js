import "@/styles/globals.css";
import "../styles/TableStyles.css";
import { useEffect } from "react";

export default function App({ Component, pageProps }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleContextMenu = (e) => e.preventDefault();
      window.addEventListener("contextmenu", handleContextMenu);

      return () => {
        window.removeEventListener("contextmenu", handleContextMenu);
      };
    }
  }, []);

  return <Component {...pageProps} />;
}
