import { Box, Text } from "@chakra-ui/react";
import { useAccount, useBalance, useBlockNumber, useNetwork } from "wagmi";

const Balance = () => {
  const [{ data: accountData }] = useAccount();

  const [{ data: balanceData }] = useBalance({
    addressOrName: accountData?.address,
    watch: false,
  });

  const [{ data: daiData }] = useBalance({
    addressOrName: accountData?.address,
    token: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
  });

  return (
    <Box>
      {accountData && <Text>{`Ξ ${Number(balanceData?.formatted).toFixed(4)} ${balanceData?.symbol}`}</Text>}
      {accountData && <Text>{`${Number(daiData?.formatted).toFixed(4)} ${daiData?.symbol}`}</Text>}
    </Box>
  );
};

export default Balance;
