import type { NextPage } from "next";
import { Box, Center, Heading, HStack, Link, Spinner, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { Container } from "../components/Container";
import useCreator from "../hooks/useCreator";
import Account from "../components/grateful/Account";
import { DarkModeSwitch } from "../components/DarkModeSwitch";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import Subscribe from "../components/grateful/Subscribe";
import { useAccount, useContractRead } from "wagmi";
import { GRATEFUL_ADDRESS } from "../constants";
import GratefulContract from "../abis/Grateful.json";
import { BigNumber } from "ethers";
import { formatEther, parseEther } from "ethers/lib/utils";
import { useEffect } from "react";
import Deposit from "../components/grateful/Deposit";
import usePricePerShare from "../hooks/usePricePerShare";

const Crreator: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const { creator, isLoading, isError } = useCreator(String(id));
  const isCreator = !!creator?.address;

  const [{ data: accountData }] = useAccount();

  const [{ data: balanceData }, balanceOf] = useContractRead(
    {
      addressOrName: GRATEFUL_ADDRESS,
      contractInterface: GratefulContract.abi,
    },
    "balanceOf",
    {
      args: accountData?.address,
    }
  );

  const { priceData } = usePricePerShare();

  const [{ data: giverToCreatorFlow }, getGiverToCreatorFlow] = useContractRead(
    {
      addressOrName: GRATEFUL_ADDRESS,
      contractInterface: GratefulContract.abi,
    },
    "getGiverToCreatorFlow",
    {
      skip: true,
    }
  );

  const daiPrice = BigNumber.from(priceData || 0);
  const getCurrentPrice = (value: BigNumber) => value.mul(daiPrice).div(parseEther("1"));

  const balance = BigNumber.from(balanceData || 0);
  const daiBalance = getCurrentPrice(balance);
  const hasBalance = daiBalance.gte(1);

  useEffect(() => {
    balanceOf({ args: [accountData?.address] });
    getGiverToCreatorFlow({ args: [accountData?.address, creator?.address] });
  }, [accountData?.address, creator?.address, getGiverToCreatorFlow, balanceOf]);

  const flow = BigNumber.from(giverToCreatorFlow || 0);
  const isSubscribed = flow.gt(0);

  return (
    <Container height="100vh" justifyContent="center">
      {isLoading && <Spinner />}
      {isError && <Text>Creator not found</Text>}
      {isCreator && (
        <>
          <Heading>{creator.name}</Heading>
          <Text>{creator.description}</Text>
          <Text>Grateful ID: {creator.id}</Text>

          <Text>
            Creator address:{" "}
            <Link href={`https://etherscan.io/address/${creator.address}`} isExternal>
              {creator.address} <ExternalLinkIcon mx="2px" />
            </Link>
          </Text>

          <Text>Creator tag: {creator.tag}</Text>

          <HStack mt={4}>
            {hasBalance ? (
              isSubscribed ? (
                <Text>User already subscribed</Text>
              ) : (
                <Subscribe balance={formatEther(daiBalance)} creator={creator} />
              )
            ) : (
              <Deposit />
            )}
          </HStack>
        </>
      )}

      <Account />
      <DarkModeSwitch />
    </Container>
  );
};

export default Crreator;
