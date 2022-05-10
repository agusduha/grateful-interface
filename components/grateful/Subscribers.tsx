import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Box, Heading, HStack, IconButton, List, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useAccount, useContractRead } from "wagmi";
import GratefulContract from "../../abis/Grateful.json";
import { GRATEFUL_ADDRESS } from "../../constants";
import SubscriberItem from "./SubscriberItem";

const Subscribers = () => {
  const [page, setPage] = useState(0);
  const [currentSubscribers, setCurrentSubscribers] = useState([]);

  const [{ data: accountData }] = useAccount();

  const [{ data: userData }, getUserData] = useContractRead(
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

  useEffect(() => {
    getUserData();
  }, [accountData?.address, getUserData]);

  const subscribers = userData ? userData[3] : [];
  const pageLimit = 4;
  const totalPages = Math.ceil(subscribers.length / pageLimit);

  useEffect(() => {
    const start = page * pageLimit;
    const end = page * pageLimit + pageLimit;
    setCurrentSubscribers(subscribers.slice(start, end));
  }, [subscribers, page]);

  const increasePage = () => setPage((value) => (value < totalPages - 1 ? value + 1 : value));
  const decreasePage = () => setPage((value) => (value > 0 ? value - 1 : value));

  return (
    <>
      <HStack justifyContent={"space-between"}>
        <Heading>Subscribers</Heading>
        <Text>{`Quantity: ${subscribers.length}`}</Text>
      </HStack>
      <Box overflowY="auto" maxHeight="25vh" height={"25vh"}>
        <List py={2} spacing={2}>
          {userData && (
            <>
              {currentSubscribers.map((address: string) => (
                <SubscriberItem key={address} creator={address} />
              ))}
            </>
          )}
        </List>
      </Box>
      <HStack justifyContent={"end"}>
        <IconButton aria-label="Previous page" variant="unstyled" icon={<ChevronLeftIcon />} onClick={decreasePage} />
        <Text>{page + 1}</Text>
        <IconButton aria-label="Next page" variant="unstyled" icon={<ChevronRightIcon />} onClick={increasePage} />
      </HStack>
    </>
  );
};

export default Subscribers;
