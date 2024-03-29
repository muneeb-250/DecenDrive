import React from "react";
import { createRoot } from "react-dom/client";
import { Sepolia } from "@thirdweb-dev/chains";
import App from "./App";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import "./styles/globals.css";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <ThirdwebProvider
      clientId={import.meta.env.VITE_TEMPLATE_CLIENT_ID}
      activeChain={Sepolia}
    >
      <App />
    </ThirdwebProvider>
  </React.StrictMode>
);
