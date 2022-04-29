import { Box, Text } from "@chakra-ui/react";
import { useBlockNumber } from "wagmi";

const BlockNumber = () => {
  const [{ data: blockData }] = useBlockNumber({
    watch: true,
  });

  return (
    <Box>
      <Text>{`Block number: ${blockData}`}</Text>
    </Box>
  );
};

export default BlockNumber;
