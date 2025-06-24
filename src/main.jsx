import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/styles.css";
import App from "./App.jsx";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Video from "./pages/VideoRecorder.jsx";
import Audio from "./pages/AudioRecorder.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Audio />} />
      <Route path="video" element={<Video />} />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
