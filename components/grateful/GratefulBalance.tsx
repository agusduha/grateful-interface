import { Box, Center, Flex, Heading, Spacer, Text } from "@chakra-ui/react";
import { BigNumber, ethers } from "ethers";
import { formatEther, parseEther } from "ethers/lib/utils";
import { useEffect } from "react";
import { useAccount, useContractRead } from "wagmi";
import GratefulContract from "../../abis/Grateful.json";
import { GRATEFUL_ADDRESS } from "../../constants";
import BalanceCounter from "./BalanceCounter";
import Subscribe from "./Subscribe";

const GratefulBalance = () => {
  const [{ data: accountData }] = useAccount();

  const [{ data: balanceData }] = useContractRead(
    {
      addressOrName: GRATEFUL_ADDRESS,
      contractInterface: GratefulContract.abi,
    },
    "balanceOf",
    {
      args: accountData?.address,
      watch: true,
    }
  );

  const [{ data: priceData }] = useContractRead(
    {
      addressOrName: GRATEFUL_ADDRESS,
      contractInterface: GratefulContract.abi,
    },
    "pricePerShare"
  );

  const [{ data: userData }, read] = useContractRead(
    {
      addressOrName: GRATEFUL_ADDRESS,
      contractInterface: GratefulContract.abi,
    },
    "getUserData",
    {
      args: accountData?.address,
      skip: true,
    }
  );

  const daiPrice = BigNumber.from(priceData || 0);
  const SECONDS_PER_MONTH = 2592000;

  const getCurrentPrice = (value: BigNumber) => value.mul(daiPrice).div(parseEther("1"));
  const getMonthValue = (value: BigNumber) => value.mul(SECONDS_PER_MONTH);

  useEffect(() => {
    read();
  }, [accountData?.address, read]);

  const balance = BigNumber.from(balanceData || 0);
  const daiBalance = getCurrentPrice(balance);

  const incomingFlow: BigNumber = userData ? userData[0] : BigNumber.from(0);
  const outgoingFlow: BigNumber = userData ? userData[1] : BigNumber.from(0);
  const totalFlow = incomingFlow.sub(outgoingFlow);

  const monthIncomingFlow = getMonthValue(getCurrentPrice(incomingFlow));
  const monthOutgoingFlow = getMonthValue(getCurrentPrice(outgoingFlow));
  const monthTotalFlow = getMonthValue(getCurrentPrice(totalFlow));

  return (
    <Flex h={"100%"} flexDirection={"column"}>
      <Heading>Grateful balance</Heading>
      {accountData && (
        <>
          <BalanceCounter label={"Vault balance:"} symbol={"yvDAI"} balance={balance} flow={totalFlow} freq={1} />
          <BalanceCounter label={"DAI balance:"} symbol={"DAI"} balance={daiBalance} flow={totalFlow} freq={1} />
          <Text>{`Incoming flow: ${(+formatEther(monthIncomingFlow)).toFixed(4)} DAI per month`}</Text>
          <Text>{`Outgoing flow: ${(+formatEther(monthOutgoingFlow)).toFixed(4)} DAI per month`}</Text>
          <Text>{`Total flow: ${(+formatEther(monthTotalFlow)).toFixed(4)} DAI per month`}</Text>
          <Spacer />
          <Center m={2}>
            <Subscribe balance={formatEther(daiBalance)} />
          </Center>
        </>
      )}
    </Flex>
  );
};

export default GratefulBalance;
