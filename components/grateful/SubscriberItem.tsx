import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Divider, Flex, Link, Spacer, Text } from "@chakra-ui/react";
import { BigNumber } from "ethers";
import { formatEther, parseEther } from "ethers/lib/utils";
import { useEffect } from "react";
import { useAccount, useContractRead } from "wagmi";
import GratefulContract from "../../abis/Grateful.json";
import { GRATEFUL_ADDRESS } from "../../constants";
import Unsubscribe from "./Unsubscribe";

interface SubscriberItemProps {
  creator: string;
}

const SubscriberItem = ({ creator }: SubscriberItemProps) => {
  const [{ data: accountData }] = useAccount();

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

  const [{ data: priceData }] = useContractRead(
    {
      addressOrName: GRATEFUL_ADDRESS,
      contractInterface: GratefulContract.abi,
    },
    "pricePerShare"
  );

  useEffect(() => {
    getGiverToCreatorFlow({ args: [creator, accountData?.address] });
  }, [accountData?.address, creator, getGiverToCreatorFlow]);

  const daiPrice = BigNumber.from(priceData || 0);
  const flow = BigNumber.from(giverToCreatorFlow || 0);
  const SECONDS_PER_MONTH = 2592000;

  const getCurrentPrice = (value: BigNumber) => value.mul(daiPrice).div(parseEther("1"));
  const getMonthValue = (value: BigNumber) => value.mul(SECONDS_PER_MONTH);

  const total = getMonthValue(getCurrentPrice(flow));

  return (
    <>
      <Flex alignItems={"center"}>
        <Link href={`https://etherscan.io/address/${creator}`} isExternal>
          {creator.substring(0, 6) + "..." + creator.substring(creator.length - 4, creator.length)}{" "}
          <ExternalLinkIcon mx="2px" />
        </Link>
        <Spacer />
        <Text>{`${(+formatEther(total)).toFixed(0)} DAI per month`}</Text>
      </Flex>
      <Divider />
    </>
  );
};

export default SubscriberItem;
