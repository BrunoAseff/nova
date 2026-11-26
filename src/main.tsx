import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "@/app/App";
import { startAmbientEngine } from "@/lib/audio/ambient";
import "@fontsource-variable/figtree";
import "@/styles/globals.css";

startAmbientEngine();

const root = document.getElementById("root");
if (!root) throw new Error("#root não encontrado");

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
