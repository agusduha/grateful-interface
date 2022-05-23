import {
  Box,
  Button,
  Center,
  FormLabel,
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

interface WithdrawProps {
  balance?: string;
}

interface ResultProps {
  data?: ethers.providers.TransactionResponse;
  error?: Error;
}

const Withdraw = ({ balance }: WithdrawProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [amount, setAmount] = useState(0);
  const handleAmount = (value: string) => setAmount(Number(value));

  const [{ loading: isLoading }, withdrawFunds] = useContractWrite(
    {
      addressOrName: GRATEFUL_ADDRESS,
      contractInterface: GratefulContract.abi,
    },
    "withdrawFunds"
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

  const onWithdraw = async () => {
    const vaultAmount = getVaultAmount(BigNumber.from(amount));

    const result = await withdrawFunds({ args: [vaultAmount] });
    handleResult(result);
  };

  return (
    <Box>
      <Button onClick={onOpen}>Withdraw</Button>

      <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Withdraw funds from Grateful</ModalHeader>
          <ModalCloseButton />
          <ModalBody m={2}>
            <Box>
              <Text>{`Current balance: ${Number(balance).toFixed(4)} DAI`}</Text>

              <FormLabel htmlFor="amount" mt={4}>
                Select amount to withdraw
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
              <Button mr={3} onClick={onWithdraw}>
                Withdraw
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

export default Withdraw;
