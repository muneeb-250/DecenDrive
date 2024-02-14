import {
  ConnectWallet,
  useDisconnect,
  useConnectionStatus,
  useAddress,
} from "@thirdweb-dev/react";
import { Button } from "./components/ui/button";
import FileUpload from "./components/FileUpload";
import Modal from "./components/Modal";
import Display from "./components/Display";
import { useState } from "react";
export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const connectionStatus = useConnectionStatus();
  const address = useAddress();

  const disconnect = useDisconnect();
  const formatAddr = (addr: string) =>
    `${addr.slice(0, 5)}...${addr.slice(-4)}`;

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  return (
    <main className="main h-[100vh] flex flex-col justify-center bg-gradient-to-br from-indigo-400 to-indigo-600 relative">
      <Button
        className="absolute top-2 left-2 bg-white text-black hover:text-white "
        onClick={toggleModal}
        disabled={connectionStatus === "disconnected"}
      >
        Share
      </Button>
      <div className="flex p-5 gap-3 flex-col justify-center items-center">
        <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-orange-400 to-orange-600">
          DecenDrive
        </h1>
        {connectionStatus === "disconnected" && (
          <>
            <ConnectWallet theme={"light"} />
          </>
        )}
        {connectionStatus === "connected" && (
          <>
            <p className="text-white text-lg">
              Connected Wallet: <code>{formatAddr(address ?? "")}</code>
            </p>
            <Button onClick={disconnect}>Disconnect</Button>
          </>
        )}

        <FileUpload />
        {/* <Display /> */}
        <Modal onClose={toggleModal} isOpen={modalOpen} />
      </div>
    </main>
  );
}
