import { DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import { useContractWrite } from "wagmi";
import GratefulContract from "../../abis/Grateful.json";
import { GRATEFUL_ADDRESS } from "../../constants";
import useTransactionToast from "../../hooks/useTransactionToast";

interface SubscribeProps {
  creator: string;
}

interface ResultProps {
  data?: ethers.providers.TransactionResponse;
  error?: Error;
}

const Unsubscribe = ({ creator }: SubscribeProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [{ loading: isLoading }, unsubscribeFromCreator] = useContractWrite(
    {
      addressOrName: GRATEFUL_ADDRESS,
      contractInterface: GratefulContract.abi,
    },
    "unsubscribeFromCreator"
  );

  const { showToast } = useTransactionToast();

  const handleResult = (result: ResultProps) => {
    const { data } = result;
    if (data) {
      showToast(data.hash);
      onClose();
    }
  };

  const onUnsubscribe = async () => {
    const result = await unsubscribeFromCreator({ args: [creator] });
    handleResult(result);
  };

  return (
    <Box>
      <IconButton aria-label="Unsubscribe" variant="outline" mr={1} icon={<DeleteIcon />} onClick={onOpen} />

      <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Unsubscribe from creator</ModalHeader>
          <ModalCloseButton />
          <ModalBody m={2}>
            <Box>
              <Text>{`Are you sure you want to unsubscribe from ${creator}?`}</Text>
            </Box>
          </ModalBody>
          {isLoading ? (
            <ModalFooter>
              <Center w={"100%"}>
                <Spinner />
              </Center>
            </ModalFooter>
          ) : (
            <ModalFooter>
              <Button mr={3} onClick={onUnsubscribe}>
                Unsubscribe
              </Button>
              <Button onClick={onClose} variant="outline">
                Cancel
              </Button>
            </ModalFooter>
          )}
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Unsubscribe;
