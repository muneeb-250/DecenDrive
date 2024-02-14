import {
  useContract,
  useAddress,
  useContractRead,
} from "@thirdweb-dev/react";

const Display = () => {
  const address = useAddress();
  const { contract } = useContract(
    "0x4a2A9491dF6BC6072E27969B4E8a2570CC3Ef2c6"
  );
  const {
    data: Imgs,
    isLoading: isImgsLoading,
    isError,
  } = useContractRead(contract, "display", [address]);

  return (
    <div>
      {isImgsLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {isError ? (
            <p className="text-red-500 bg-red-100 p-4 rounded-lg ">Error</p>
          ) : (
            <p>
              {Imgs.map((img: string, i: number) => (
                <img key={i} src={img} alt="img" />
              ))}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Display;
