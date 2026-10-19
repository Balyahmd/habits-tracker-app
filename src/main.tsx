import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./index.css";
import App from "./App.tsx";
import { clearDataIfVersionChanged } from "./utils/storage.ts";
import ThemeProvider from "./components/ThemeProvider.tsx";

const dataWasCleared = clearDataIfVersionChanged();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <App dataWasCleared={dataWasCleared} />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);
