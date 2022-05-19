import { Divider, Flex, Spacer, Tag, Text } from "@chakra-ui/react";
import { BigNumber } from "ethers";
import { formatEther, parseEther } from "ethers/lib/utils";
import { useEffect } from "react";
import { useAccount, useContractRead } from "wagmi";
import GratefulContract from "../../abis/Grateful.json";
import { GRATEFUL_ADDRESS } from "../../constants";
import useCreator from "../../hooks/useCreator";
import useLabel from "../../hooks/useLabel";
import Address from "./Address";
import CreateLabel from "./CreateLabel";
import Unsubscribe from "./Unsubscribe";

interface SubscriptionItemProps {
  creator: string;
}

const SubscriptionItem = ({ creator }: SubscriptionItemProps) => {
  const [{ data: accountData }] = useAccount();

  const { creator: creatorData } = useCreator(creator);
  const isCreator = !!creatorData?.address;

  const user = accountData?.address || "";
  const { label } = useLabel(user, creator);
  const hasLabel = !!label?.content;

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
    getGiverToCreatorFlow({ args: [accountData?.address, creator] });
  }, [accountData?.address, creator, getGiverToCreatorFlow]);

  const daiPrice = BigNumber.from(priceData || 0);
  const flow = BigNumber.from(giverToCreatorFlow || 0);
  const SECONDS_PER_MONTH = 2592000;

  const getCurrentPrice = (value: BigNumber) => value.mul(daiPrice).div(parseEther("1"));
  const getMonthValue = (value: BigNumber) => value.mul(SECONDS_PER_MONTH);

  const total = getMonthValue(getCurrentPrice(flow));

  const addressLink = () => <Address address={creator} />;

  const labelTag = () => {
    if (hasLabel) {
      return (
        <Tag ml={1} variant="subtle" colorScheme="cyan">
          {label.content}
        </Tag>
      );
    }
  };

  return (
    <>
      <Flex alignItems={"center"}>
        {isCreator ? (
          <Text>
            {creatorData.name} ({addressLink()}) {labelTag()}
          </Text>
        ) : (
          <Text>
            {addressLink()} {labelTag()}
          </Text>
        )}
        <Spacer />
        <Text>{`${(+formatEther(total)).toFixed(0)} DAI per month`}</Text>
        <Spacer />
        {accountData && <CreateLabel user={accountData?.address} creator={creator} />}
        <Unsubscribe creator={creator} />
      </Flex>
      <Divider />
    </>
  );
};

export default SubscriptionItem;
