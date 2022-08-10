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
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import { useState } from "react";
import { useContractWrite } from "wagmi";
import GratefulContract from "../../abis/Grateful.json";
import { GRATEFUL_ADDRESS } from "../../constants";
import useTransactionToast from "../../hooks/useTransactionToast";

interface DepositAndSubscribeProps {
  balance?: string;
  creator?: {
    address?: string;
    name?: string;
  };
}

interface ResultProps {
  data?: ethers.providers.TransactionResponse;
  error?: Error;
}

const DepositAndSubscribe = ({ balance, creator }: DepositAndSubscribeProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [value, setValue] = useState("0");

  const [address, setAddress] = useState(creator?.address || "");
  const handleChange = (value: string) => setValue(value);

  const [tier, setTier] = useState(0);
  const handleTier = (value: string) => setTier(Number(value));

  const [{ loading: isLoading }, depositAndSubscribe] = useContractWrite(
    {
      addressOrName: GRATEFUL_ADDRESS,
      contractInterface: GratefulContract.abi,
    },
    "depositAndSubscribe"
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
    const result = await depositAndSubscribe({ args: [ethers.utils.parseEther(value), address, tier] });
    handleResult(result);
  };

  const title = !!creator ? `Subscribe to ${creator.name}` : "Subscribe to a creator";

  return (
    <Box>
      <Button onClick={onOpen}>{"Deposit & Subscribe"}</Button>

      <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody m={2}>
            <Box>
              <FormLabel htmlFor="amount">DAI amount to deposit</FormLabel>
              <NumberInput
                value={value}
                // max={Number(balance)}
                min={0}
                precision={4}
                clampValueOnBlur={false}
                keepWithinRange={false}
                onChange={handleChange}
              >
                <NumberInputField id="amount" />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>

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

export default DepositAndSubscribe;
