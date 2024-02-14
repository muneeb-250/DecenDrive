import React, { useState, useRef, useEffect } from "react";
import { FileMinusIcon } from "@radix-ui/react-icons";
import axios from "axios";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import {
  useAddress,
  useConnectionStatus,
  useContract,
  useContractWrite,
} from "@thirdweb-dev/react";

const FileUpload = () => {
  const connectionStatus = useConnectionStatus();
  const [file, setFile] = useState<File | undefined>(undefined);
  const [fileName, setFileName] = useState<string | undefined>("");
  const [imageHash, setImageHash] = useState<string | undefined>("");
  const [imgUrl, setImgUrl] = useState<string | undefined>("");
  const InputFileRef = useRef<HTMLInputElement>(null);
  const address = useAddress();
  const { contract } = useContract(
    "0x4a2A9491dF6BC6072E27969B4E8a2570CC3Ef2c6"
  );
  const { mutateAsync: add, error,isError } = useContractWrite(contract, "add");

  const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            Accept: "application/json",
            authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
            pinata_api_key: import.meta.env.VITE_PINATA_API_KEY,
            pinata_secret_api_key: import.meta.env.VITE_PINATA_SECRET_API,
            "Content-Type": "multipart/form-data",
          },
        });

        const imgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
        setImageHash(imgHash);
        // console.log(imgHash);

        try {
          const data = await add({ args: [address, imgHash] });
          console.info("contract call successs", data);
          // setFileName("");
          // setFile(undefined);
          clearFile()
        } catch (err) {
          console.error("contract call failure", );
          clearFile()
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const renderImg = (data: Blob) => {
    let reader2 = new FileReader();
    reader2.readAsArrayBuffer(data);
    reader2.onloadend = () => {
      setImgUrl(URL.createObjectURL(data));
    };
  };

  const retrieveFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const data = e.target.files?.[0]!;
    const reader = new window.FileReader();
    const imgUrl = reader.readAsDataURL(data);
    reader.onloadend = () => {
      setFile(e.target.files?.[0]);
      setFileName(e.target.files?.[0].name);
      renderImg(data);
    };
    e.preventDefault();
  };

  const clearFile = () => {
    setFile(undefined);
    setFileName("");
    setImgUrl("");
    setImageHash("");

    if (InputFileRef.current) {
      InputFileRef.current.value = "";
    }
  };

  useEffect(() => {
    if (connectionStatus === "disconnected") clearFile();
  }, [connectionStatus]);

  return (
    <div className="grid w-full max-w-sm items-center gap-3">
      {imgUrl && (
        <img
          src={imgUrl}
          alt="file"
          className="w-48 h-48 mx-auto rounded border-4 shadow-lg aspect-square object-contain bg-neutral-300/40"
        />
      )}
      <Label htmlFor="picture">Upload a File</Label>
      <div className="flex items-center bg-white rounded-lg shadow-sm [&>input]:cursor-pointer">
        <Input
          id="picture"
          type="file"
          className="border-0"
          ref={InputFileRef}
          onChange={retrieveFile}
          disabled={connectionStatus === "disconnected"}
        />
        {file && (
          <Button
            onClick={clearFile}
            className="p-2 bg-red-500  text-white rounded-l-none"
            disabled={connectionStatus === "disconnected"}
          >
            <FileMinusIcon />
          </Button>
        )}
      </div>

      <Button
        onClick={handleSubmit}
        disabled={!file || connectionStatus === "disconnected"}
      >
        Upload File
      </Button>
     

      {imageHash === "" ? (
        ""
      ) : (
        <p className=" text-white">
          Your file has been uploaded successfully! {" "}
          <a href={imageHash} target="_blank" rel="noreferrer" className="underline text-neutral-200 hover:text-white">
            View Image 
          </a>
        </p>
      )}
    </div>
  );
};

export default FileUpload;
