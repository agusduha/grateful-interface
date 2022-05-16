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
  Spinner,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";

interface CreateProfileProps {
  address: string;
}

const CreateProfile = ({ address }: CreateProfileProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();

  const [isLoading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const handleName = (event: any) => setName(event.target.value);

  const [tag, setTag] = useState("");
  const handleTag = (event: any) => setTag(event.target.value);

  const onCreate = async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address, name, tag }),
    };

    setLoading(true);
    const result = await fetch("http://localhost:3000/api/creators", requestOptions);

    toast({
      title: result.ok ? "Profile created!" : "Profile creation failed",
      status: result.ok ? "success" : "error",
      duration: 10000,
      isClosable: true,
    });

    onClose();
    setLoading(false);
  };

  return (
    <Box>
      <Button onClick={onOpen}>Create Profile</Button>

      <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create your profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody m={2}>
            <Box>
              <Text>{`Current address: ${address}`}</Text>
              <FormLabel htmlFor="name" mt={4}>
                Name
              </FormLabel>
              <Input id="name" placeholder="Insert your name" value={name} onChange={handleName} />
              <FormLabel htmlFor="tag" mt={4}>
                Tag
              </FormLabel>
              <Input id="tag" placeholder="Insert your tag" value={tag} onChange={handleTag} />
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

export default CreateProfile;