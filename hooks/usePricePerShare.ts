import { BigNumber } from "ethers";
import { useContractRead } from "wagmi";
import { GRATEFUL_ADDRESS } from "../constants";
import GratefulContract from "../abis/Grateful.json";

const usePricePerShare = () => {
  const [{ data: priceData }] = useContractRead(
    {
      addressOrName: GRATEFUL_ADDRESS,
      contractInterface: GratefulContract.abi,
    },
    "pricePerShare"
  );

  return {
    priceData,
  };
};

export default usePricePerShare;
