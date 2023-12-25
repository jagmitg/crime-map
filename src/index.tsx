import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./app/App";

const container = document.getElementById("root") as HTMLElement; // Explicitly cast as HTMLElement
// Ensure container is not null before attempting to createRoot
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
