import { Box, Button } from "@chakra-ui/react";
import { useContractWrite } from "wagmi";
import GratefulContract from "../../abis/Grateful.json";

const Subscribe = () => {
  const [{ data, error, loading }, write] = useContractWrite(
    {
      addressOrName: "0xefAB0Beb0A557E452b398035eA964948c750b2Fd",
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
