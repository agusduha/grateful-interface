import { Box, Button } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useContractWrite } from "wagmi";
import GratefulContract from "../../abis/Grateful.json";
import { GRATEFUL_ADDRESS } from "../../constants";

const WithdrawAll = () => {
  const [{ data, error, loading }, write] = useContractWrite(
    {
      addressOrName: GRATEFUL_ADDRESS,
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
