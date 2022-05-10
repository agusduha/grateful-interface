import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Heading,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { Connector, useAccount, useConnect } from "wagmi";

const Account = () => {
  const [
    {
      data: { connected, connectors, connector },
      error,
      loading: connectLoading,
    },
    connect,
  ] = useConnect();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [{ data: accountData, loading }, disconnect] = useAccount({
    fetchEns: true,
  });

  const address = accountData?.address;

  useEffect(() => {
    if (connected) {
      onClose();
    }
  }, [connected, onClose]);

  return (
    <Box position="fixed" top={4} right={10}>
      <VStack>
        {!accountData ? <Button onClick={onOpen}>Connect</Button> : <Button onClick={disconnect}>Disconnect</Button>}
        {address && (
          <Link href={`https://etherscan.io/address/${address}`} isExternal>
            {address.substring(0, 6) + "..." + address.substring(address.length - 4, address.length)}{" "}
            <ExternalLinkIcon mx="2px" />
          </Link>
        )}
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Choose wallet provider</ModalHeader>
          <ModalCloseButton />
          <ModalBody m={2}>
            <Box>
              {connectors.map((connector: Connector) => (
                <Button
                  w={"full"}
                  isDisabled={!connector.ready}
                  key={connector.id}
                  onClick={() => connect(connector)}
                  isLoading={connectLoading}
                >
                  {connector.name}
                  {!connector.ready && " (unsupported)"}
                </Button>
              ))}

              {error && <Box>{error?.message ?? "Failed to connect"}</Box>}
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Account;
