import { Box, Heading, Text } from "@chakra-ui/react";
import { useAccount, useBalance } from "wagmi";
import { DAI_MAINNET_ADDRESS } from "../../constants";

const Balance = () => {
  const [{ data: accountData }] = useAccount();

  const [{ data: balanceData }] = useBalance({
    addressOrName: accountData?.address,
  });

  const [{ data: daiData }] = useBalance({
    addressOrName: accountData?.address,
    token: DAI_MAINNET_ADDRESS,
  });

  return (
    <Box>
      <Heading>Wallet balance</Heading>
      {accountData && (
        <>
          <Text>{`Ether balance: ${Number(balanceData?.formatted).toFixed(4)} ${balanceData?.symbol}`}</Text>
          <Text>{`DAI balance: ${Number(daiData?.formatted).toFixed(4)} ${daiData?.symbol}`}</Text>
        </>
      )}
    </Box>
  );
};

export default Balance;
