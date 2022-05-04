import { Box, Heading, Text } from "@chakra-ui/react";
import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { useEffect } from "react";
import { erc20ABI, useAccount, useBalance, useContractRead } from "wagmi";
import { DAI_MAINNET_ADDRESS, GRATEFUL_ADDRESS } from "../../constants";
import Deposit from "./Deposit";

const Balance = () => {
  const [{ data: accountData }] = useAccount();

  const [{ data: balanceData }] = useBalance({
    addressOrName: accountData?.address,
  });

  const [{ data: daiData }] = useBalance({
    addressOrName: accountData?.address,
    token: DAI_MAINNET_ADDRESS,
  });

  const [{ data: allowanceData }, getAllowance] = useContractRead(
    {
      addressOrName: DAI_MAINNET_ADDRESS,
      contractInterface: erc20ABI,
    },
    "allowance",
    {
      skip: true,
    }
  );

  const allowance = allowanceData?.toString();

  useEffect(() => {
    getAllowance({ args: [accountData?.address, GRATEFUL_ADDRESS] });
  }, [accountData?.address, getAllowance]);

  return (
    <Box>
      <Heading>Wallet balance</Heading>
      {accountData && (
        <>
          <Text>{`Ether balance: ${Number(balanceData?.formatted).toFixed(4)} ${balanceData?.symbol}`}</Text>
          <Text>{`DAI balance: ${Number(daiData?.formatted).toFixed(4)} ${daiData?.symbol}`}</Text>
          {allowance && <Text>{`DAI allowance: ${formatEther(BigNumber.from(allowance))} ${daiData?.symbol}`}</Text>}
          <Deposit balance={daiData?.formatted} allowance={allowance} />
        </>
      )}
    </Box>
  );
};

export default Balance;
