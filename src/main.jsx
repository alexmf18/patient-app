import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { PatientProvider } from "./context/PatientContext";
import { ToastProvider } from "./context/ToastContext";
import { router } from "./App";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ToastProvider>
      <AuthProvider>
        <PatientProvider>
          <RouterProvider router={router} />
        </PatientProvider>
      </AuthProvider>
    </ToastProvider>
  </StrictMode>
);
