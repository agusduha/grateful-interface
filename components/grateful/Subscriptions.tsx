import { Box, Heading, HStack, List, ListItem, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { useAccount, useContractRead } from "wagmi";
import GratefulContract from "../../abis/Grateful.json";
import { GRATEFUL_ADDRESS } from "../../constants";

const Subscriptions = () => {
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

  const subscriptions = userData ? userData[2] : [];

  return (
    <>
      <HStack justifyContent={"space-between"}>
        <Heading>Subscriptions</Heading>
        <Text>{`Quantity: ${subscriptions.length}`}</Text>
      </HStack>
      <Box overflowY="auto" maxHeight="30vh">
        <List py={2} spacing={2}>
          {userData && (
            <>
              {subscriptions.map((address: string) => (
                <ListItem key={address}>{address}</ListItem>
              ))}
            </>
          )}
        </List>
      </Box>
    </>
  );
};

export default Subscriptions;
