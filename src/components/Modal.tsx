import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardFooter,
} from "./ui/card";
import { useContract, useContractWrite } from "@thirdweb-dev/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {  useState } from "react";

type ModalPropTypes = {
  isOpen: boolean;
  onClose: () => void;
};
const Modal = ({ isOpen, onClose }: ModalPropTypes) => {
  const [enterAddr,setEnterAddr] = useState<string>("")
  const { contract } = useContract(
    "0x4a2A9491dF6BC6072E27969B4E8a2570CC3Ef2c6"
    );
    const { mutateAsync: allow } = useContractWrite(contract, "allow");
    
    const handleSubmit = async () => {
    try {
      const data = await allow({ args: [enterAddr] });
      console.info("contract call successs", data);
    } catch (error) {
      console.error(error)
    }
  };
  const handleInput = (e:string) => {
    setEnterAddr((prev)=> e)
  }
  
  if (!isOpen) return null;
  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50 bg-black bg-opacity-25 backdrop-blur-sm">
      <Card title="Images" className="relative min-w-[400px]">
        <CardHeader>
          <CardTitle className="text-3xl font-black tracking-tighter">Share</CardTitle>
        </CardHeader>
        <CardContent>
          <Label>Enter address: </Label>
          <Input onChange={(e)=>handleInput(e.target.value)} />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            onClick={onClose}
            variant={"secondary"}
            className="hover:bg-gray-200"
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit}>
            Share Access
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Modal;
