import {
  Box,
  Button,
  Center,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useClipboard,
  useDisclosure,
} from "@chakra-ui/react";
import useCreator from "../../hooks/useCreator";
import QRCode from "react-qr-code";

interface ProfileLinksProps {
  address: string;
}

interface CreatorLinksProps {
  value: string;
  label: string;
}

const CreatorLink = ({ value, label }: CreatorLinksProps) => {
  const { hasCopied, onCopy } = useClipboard(value);

  return (
    <>
      <Text mt={4}>{label}</Text>
      <Flex mb={2}>
        <Input value={value} isReadOnly />
        <Button onClick={onCopy} ml={2}>
          {hasCopied ? "Copied" : "Copy"}
        </Button>
      </Flex>
    </>
  );
};

const ProfileLinks = ({ address }: ProfileLinksProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { creator } = useCreator(address);

  // const addressLink = `${process.env.NEXT_PUBLIC_API_URL}/${creator.address}`;
  // const idLink = `${process.env.NEXT_PUBLIC_API_URL}/${creator.id}`;
  const tagLink = `${process.env.NEXT_PUBLIC_API_URL}/${creator.tag}`;

  return (
    <Box>
      <Button onClick={onOpen}>Show links</Button>

      <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Creator links</ModalHeader>
          <ModalCloseButton />
          <ModalBody m={2}>
            <Box>
              <Text>You can use any link you want!</Text>
              {/* <CreatorLink value={idLink} label={"Grateful ID link"} /> */}
              <CreatorLink value={tagLink} label={"Tag link"} />
              {/* <CreatorLink value={addressLink} label={"Address link"} /> */}
              <Text mt={10}>Or use your QR!</Text>
              <Center>
                <QRCode value={tagLink} size={200} />
              </Center>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} variant="outline">
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ProfileLinks;
