import { Box, Center, Flex, Heading, HStack, Spacer, Text } from "@chakra-ui/react";
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
    <Flex h={"100%"} flexDirection={"column"}>
      <Heading>Wallet balance</Heading>
      {accountData && (
        <>
          <HStack mt={3}>
            <Text fontWeight={700}>{"Ether balance:"}</Text>
            <Text>{`${Number(balanceData?.formatted).toFixed(4)} ${balanceData?.symbol}`}</Text>
          </HStack>

          <HStack>
            <Text fontWeight={700}>{"DAI balance:"}</Text>
            <Text>{`${Number(daiData?.formatted).toFixed(4)} ${daiData?.symbol}`}</Text>
          </HStack>

          {allowance && (
            <HStack>
              <Text fontWeight={700}>{"DAI allowance:"}</Text>
              <Text>{`${formatEther(BigNumber.from(allowance))} ${daiData?.symbol}`}</Text>
            </HStack>
          )}
          <Spacer />
          <Center m={2}>
            <Deposit balance={daiData?.formatted} allowance={allowance} />
          </Center>
        </>
      )}
    </Flex>
  );
};

export default Balance;
