import {
  Box,
  Button,
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
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { BigNumber, ethers } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { useState } from "react";
import { useContractWrite, erc20ABI } from "wagmi";
import GratefulContract from "../../abis/Grateful.json";
import { DAI_MAINNET_ADDRESS, GRATEFUL_ADDRESS } from "../../constants";
import useTransactionToast from "../../hooks/useTransactionToast";

interface DepositProps {
  balance: string | undefined;
  allowance: string | undefined;
}

const Deposit = ({ balance, allowance }: DepositProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [value, setValue] = useState("0");
  const handleChange = (value: string) => setValue(value);

  const [, approve] = useContractWrite(
    {
      addressOrName: DAI_MAINNET_ADDRESS,
      contractInterface: erc20ABI,
    },
    "approve"
  );

  const [, depositFunds] = useContractWrite(
    {
      addressOrName: GRATEFUL_ADDRESS,
      contractInterface: GratefulContract.abi,
    },
    "depositFunds"
  );

  const { showToast } = useTransactionToast();

  const onApprove = async () => {
    const result = await approve({ args: [GRATEFUL_ADDRESS, ethers.utils.parseEther(value)] });
    showToast(result.data?.hash);
    onClose();
  };

  const onDeposit = async () => {
    const result = await depositFunds({ args: ethers.utils.parseEther(value) });
    showToast(result.data?.hash);
    onClose();
  };

  return (
    <Box>
      <Button onClick={onOpen}>Deposit</Button>

      <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Deposit funds into Grateful</ModalHeader>
          <ModalCloseButton />
          <ModalBody m={2}>
            <Box>
              <Text>{`Wallet balance: ${Number(balance).toFixed(4)} DAI`}</Text>
              {allowance && <Text>{`Currently allowed: ${formatEther(BigNumber.from(allowance))} DAI`}</Text>}
              {/* <FormControl isRequired> */}
              <FormLabel htmlFor="amount">Amount</FormLabel>
              <NumberInput
                value={value}
                max={Number(balance)}
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
              {/* </FormControl> */}
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onApprove}>
              Allow DAI
            </Button>
            <Button mr={3} onClick={onDeposit}>
              Send deposit
            </Button>
            <Button onClick={onClose} variant="outline">
              Cancel deposit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Deposit;
