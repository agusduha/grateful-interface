import {
  Box,
  Button,
  Center,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Spinner,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { BigNumber, ethers } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { useState } from "react";
import { useContractRead, useContractWrite } from "wagmi";
import GratefulContract from "../../abis/Grateful.json";
import { GRATEFUL_ADDRESS } from "../../constants";
import useTransactionToast from "../../hooks/useTransactionToast";

interface SendGratitudeProps {
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

const SendGratitude = ({ balance, creator }: SendGratitudeProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [address, setAddress] = useState(creator?.address || "");
  const handleChange = (event: any) => setAddress(event.target.value);

  const [amount, setAmount] = useState(0);
  const handleAmount = (value: string) => setAmount(Number(value));

  const [{ loading: isLoading }, sendGratitude] = useContractWrite(
    {
      addressOrName: GRATEFUL_ADDRESS,
      contractInterface: GratefulContract.abi,
    },
    "sendGratitude"
  );

  const [{ data: priceData }] = useContractRead(
    {
      addressOrName: GRATEFUL_ADDRESS,
      contractInterface: GratefulContract.abi,
    },
    "pricePerShare"
  );

  const daiPrice = BigNumber.from(priceData || 0);
  const getVaultAmount = (value: BigNumber) => value.mul(parseEther("1")).mul(parseEther("1")).div(daiPrice);

  const { showToast } = useTransactionToast();

  const handleResult = (result: ResultProps) => {
    const { data } = result;
    if (data) {
      showToast(data.hash);
      onClose();
    }
  };

  const onSend = async () => {
    const vaultAmount = getVaultAmount(BigNumber.from(amount));

    const result = await sendGratitude({ args: [address, vaultAmount] });
    handleResult(result);
  };

  const title = !!creator ? `Send gratitude to ${creator.name}` : "Send gratitude to a creator";

  return (
    <Box>
      <Button onClick={onOpen}>Send</Button>

      <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody m={2}>
            <Box>
              <Text>{`Current balance: ${Number(balance).toFixed(4)} DAI`}</Text>

              {!creator && (
                <>
                  <FormLabel htmlFor="address">Creator address</FormLabel>
                  <Input id="address" placeholder="0x..." value={address} onChange={handleChange} />
                </>
              )}

              <FormLabel htmlFor="amount" mt={4}>
                Select amount to send
              </FormLabel>
              <NumberInput
                id="amount"
                value={amount}
                max={Number(balance)}
                min={0}
                precision={4}
                clampValueOnBlur={false}
                keepWithinRange={false}
                onChange={handleAmount}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
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
              <Button mr={3} onClick={onSend}>
                Send
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

export default SendGratitude;
