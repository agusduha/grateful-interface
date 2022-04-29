import { Box, Heading, HStack, List, ListItem, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { useAccount, useContractRead } from "wagmi";
import GratefulContract from "../../abis/Grateful.json";
import { GRATEFUL_ADDRESS } from "../../constants";

const Subscribers = () => {
  const [{ data: accountData }] = useAccount();

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

  useEffect(() => {
    read();
  }, [accountData?.address, read]);

  const subscribers = userData ? userData[3] : [];

  return (
    <>
      <HStack justifyContent={"space-between"}>
        <Heading>Subscribers</Heading>
        <Text>{`Quantity: ${subscribers.length}`}</Text>
      </HStack>
      <Box overflowY="auto" maxHeight="30vh">
        <List py={2} spacing={2}>
          {userData && (
            <>
              {subscribers.map((address: string) => (
                <ListItem key={address}>{address}</ListItem>
              ))}
            </>
          )}
        </List>
      </Box>
    </>
  );
};

export default Subscribers;
