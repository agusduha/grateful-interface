import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { Connector, useAccount, useConnect } from "wagmi";
import Address from "./Address";
import Login from "./Login";

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
    <Box position="fixed" top={6} right={10}>
      <VStack>
        {!accountData ? (
          <Button onClick={onOpen}>Connect</Button>
        ) : (
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              {address && <Address address={address} link={false} />}
            </MenuButton>
            <MenuList>
              <Login address={accountData.address} />
              <MenuItem onClick={disconnect}>Disconnect</MenuItem>
            </MenuList>
          </Menu>
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
