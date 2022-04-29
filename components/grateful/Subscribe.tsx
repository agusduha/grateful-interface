import { Box, Button } from "@chakra-ui/react";
import { useContractWrite } from "wagmi";
import GratefulContract from "../../abis/Grateful.json";
import { GRATEFUL_ADDRESS } from "../../constants";

const Subscribe = () => {
  const [{ data, error, loading }, write] = useContractWrite(
    {
      addressOrName: GRATEFUL_ADDRESS,
      contractInterface: GratefulContract.abi,
    },
    "subscribeToCreator",
    {
      args: ["0xafa150524Af4e802a5B4CbE2cbE25955Da85dd6a", 0],
    }
  );

  return (
    <Box>
      <Button onClick={() => write()}>Subscribe</Button>
    </Box>
  );
};

export default Subscribe;
