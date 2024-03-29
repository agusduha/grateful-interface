import { Center, Flex, Heading, HStack, Spacer, StatUpArrow, Text } from "@chakra-ui/react";
import { BigNumber } from "ethers";
import { formatEther, parseEther } from "ethers/lib/utils";
import { useEffect } from "react";
import { useAccount, useContractRead } from "wagmi";
import GratefulContract from "../../abis/Grateful.json";
import { GRATEFUL_ADDRESS } from "../../constants";
import usePricePerShare from "../../hooks/usePricePerShare";
import BalanceCounter from "./BalanceCounter";
import Profile from "./Profile";
import SendGratitude from "./SendGratitude";
import Subscribe from "./Subscribe";
import Withdraw from "./Withdraw";

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

  const { priceData } = usePricePerShare();

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
  const daiTotalFlow = getCurrentPrice(totalFlow);

  const monthIncomingFlow = getMonthValue(getCurrentPrice(incomingFlow));
  const monthOutgoingFlow = getMonthValue(getCurrentPrice(outgoingFlow));
  const monthTotalFlow = getMonthValue(getCurrentPrice(totalFlow));

  return (
    <Flex h={"100%"} flexDirection={"column"}>
      <Heading>Grateful balance</Heading>
      {accountData && (
        <>
          <HStack marginY={3}>
            {/* <BalanceCounter label={"Vault balance:"} symbol={"yvDAI"} balance={balance} flow={totalFlow} freq={1} /> */}
            <BalanceCounter label={"DAI balance:"} symbol={"DAI"} balance={daiBalance} flow={daiTotalFlow} freq={1} />

            <Center>
              (<StatUpArrow />
              <Text color={"green"}>2.14%</Text>)
            </Center>
          </HStack>

          <HStack>
            <Text fontWeight={700}>{"Incoming flow:"}</Text>
            <Text>{`${(+formatEther(monthIncomingFlow)).toFixed(4)} DAI per month`}</Text>
          </HStack>
          <HStack>
            <Text fontWeight={700}>{"Outgoing flow:"}</Text>
            <Text>{`${(+formatEther(monthOutgoingFlow)).toFixed(4)} DAI per month`}</Text>
          </HStack>
          <HStack>
            <Text fontWeight={700}>{"Total flow:"}</Text>
            <Text>{`${(+formatEther(monthTotalFlow)).toFixed(4)} DAI per month`}</Text>
          </HStack>
          <Spacer />
          <Center m={2} justifyContent={"space-evenly"}>
            <Profile address={accountData.address} />
            <Subscribe balance={formatEther(daiBalance)} />
            <SendGratitude balance={formatEther(daiBalance)} />
            <Withdraw balance={formatEther(daiBalance)} />
          </Center>
        </>
      )}
    </Flex>
  );
};

export default GratefulBalance;
