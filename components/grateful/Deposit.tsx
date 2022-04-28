import { Box, Button } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useContractWrite } from "wagmi";
import GratefulContract from "../../abis/Grateful.json";

const Deposit = () => {
  const [{ data, error, loading }, write] = useContractWrite(
    {
      addressOrName: "0xefAB0Beb0A557E452b398035eA964948c750b2Fd",
      contractInterface: GratefulContract.abi,
    },
    "depositFunds",
    {
      args: ethers.utils.parseEther("10"),
    }
  );

  return (
    <Box>
      <Button onClick={() => write()}>Deposit</Button>
    </Box>
  );
};

export default Deposit;
