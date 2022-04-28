import { Box, Button } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useContractWrite } from "wagmi";
import GratefulContract from "../../abis/Grateful.json";

const WithdrawAll = () => {
  const [{ data, error, loading }, write] = useContractWrite(
    {
      addressOrName: "0xefAB0Beb0A557E452b398035eA964948c750b2Fd",
      contractInterface: GratefulContract.abi,
    },
    "withdrawAllFunds"
  );

  return (
    <Box>
      <Button onClick={() => write()}>Withdraw All</Button>
    </Box>
  );
};

export default WithdrawAll;
