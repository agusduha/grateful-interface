import { EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  FormLabel,
  IconButton,
  Input,
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
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";

interface CreateLabelProps {
  user: string;
  creator: string;
}

const CreateLabel = ({ user, creator }: CreateLabelProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();

  const [isLoading, setLoading] = useState(false);

  const [label, setLabel] = useState("");
  const handleLabel = (event: any) => setLabel(event.target.value);

  const onCreate = async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, creator, content: label }),
    };

    setLoading(true);
    const result = await fetch("http://localhost:3000/api/labels", requestOptions);

    toast({
      title: result.ok ? "Label created!" : "Label creation failed",
      status: result.ok ? "success" : "error",
      duration: 10000,
      isClosable: true,
    });

    onClose();
    setLoading(false);
  };

  return (
    <Box>
      <IconButton aria-label="Edit label" variant="outline" mr={1} icon={<EditIcon />} onClick={onOpen} />

      <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create label for creator</ModalHeader>
          <ModalCloseButton />
          <ModalBody m={2}>
            <Box>
              <Text>{`Creator address: ${creator}`}</Text>
              <FormLabel htmlFor="label" mt={4}>
                Label
              </FormLabel>
              <Input id="label" placeholder="Insert your label" value={label} onChange={handleLabel} />
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
              <Button mr={3} onClick={onCreate}>
                Create
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

export default CreateLabel;
