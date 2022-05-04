import { useToast } from "@chakra-ui/react";
import { useWaitForTransaction } from "wagmi";

const useTransactionToast = () => {
  const toast = useToast();
  const [_, wait] = useWaitForTransaction();

  const showToast = async (hash?: string) => {
    if (hash) {
      toast({
        id: hash,
        title: "Processing transaction...",
        description: `${hash}`,
        status: "info",
        duration: null,
        isClosable: true,
      });

      const txReceipt = await wait({ hash });

      if (txReceipt.error) {
        toast.update(hash, {
          title: "Transaction error",
          description: `${txReceipt.error.message}`,
          status: "error",
          duration: 10000,
          isClosable: true,
        });
      }

      if (txReceipt.data) {
        toast.update(hash, {
          title: "Transaction success",
          description: `${hash}`,
          status: "success",
          duration: 10000,
          isClosable: true,
        });
      }
    }
  };

  return { showToast };
};

export default useTransactionToast;
