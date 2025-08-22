import "primereact/resources/themes/lara-light-cyan/theme.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "yet-another-react-lightbox/styles.css";
import App from "./App.jsx";
import "./index.css";



import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/AuthContext.jsx";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
