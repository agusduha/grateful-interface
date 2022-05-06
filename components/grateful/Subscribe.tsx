import {
  Box,
  Button,
  Center,
  Flex,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Spacer,
  Spinner,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import { useState } from "react";
import { useContractWrite } from "wagmi";
import GratefulContract from "../../abis/Grateful.json";
import { GRATEFUL_ADDRESS } from "../../constants";
import useTransactionToast from "../../hooks/useTransactionToast";

interface SubscribeProps {
  balance?: string;
}

interface ResultProps {
  data?: ethers.providers.TransactionResponse;
  error?: Error;
}

const Subscribe = ({ balance }: SubscribeProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [address, setAddress] = useState("");
  const handleChange = (event: any) => setAddress(event.target.value);

  const [tier, setTier] = useState(0);
  const handleTier = (value: string) => setTier(Number(value));

  const [{ loading: isLoading }, subscribeToCreator] = useContractWrite(
    {
      addressOrName: GRATEFUL_ADDRESS,
      contractInterface: GratefulContract.abi,
    },
    "subscribeToCreator"
  );

  const { showToast } = useTransactionToast();

  const handleResult = (result: ResultProps) => {
    const { data } = result;
    if (data) {
      showToast(data.hash);
      onClose();
    }
  };

  const onSubscribe = async () => {
    const result = await subscribeToCreator({ args: [address, tier] });
    handleResult(result);
  };

  return (
    <Box>
      <Button onClick={onOpen}>Subscribe</Button>

      <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Subscribe to a creator</ModalHeader>
          <ModalCloseButton />
          <ModalBody m={2}>
            <Box>
              <Text>{`Current balance: ${Number(balance).toFixed(4)} DAI`}</Text>
              <FormLabel htmlFor="address">Creator address</FormLabel>
              <Input id="address" placeholder="0x..." value={address} onChange={handleChange} />
              <FormLabel htmlFor="tier" mt={4}>
                Select tier (per month)
              </FormLabel>
              <RadioGroup id="tier" defaultValue={0} onChange={handleTier} value={tier}>
                <Flex>
                  <Radio value={0}>1 DAI</Radio>
                  <Spacer />
                  <Radio value={1}>3 DAI</Radio>
                  <Spacer />
                  <Radio value={2}>5 DAI</Radio>
                </Flex>
              </RadioGroup>
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
              <Button mr={3} onClick={onSubscribe}>
                Subscribe
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

export default Subscribe;
