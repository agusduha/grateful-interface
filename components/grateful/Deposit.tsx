import { Box, Button } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useContractWrite } from "wagmi";
import GratefulContract from "../../abis/Grateful.json";
import { GRATEFUL_ADDRESS } from "../../constants";

const Deposit = () => {
  const [{ data, error, loading }, write] = useContractWrite(
    {
      addressOrName: GRATEFUL_ADDRESS,
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
