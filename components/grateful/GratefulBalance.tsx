import { Box, Heading, Text } from "@chakra-ui/react";
import { BigNumber, ethers } from "ethers";
import { useAccount, useContractRead } from "wagmi";
import GratefulContract from "../../abis/Grateful.json";
import { GRATEFUL_ADDRESS } from "../../constants";

const GratefulBalance = () => {
  const [{ data: accountData }] = useAccount();

  const [{ data: balanceData }] = useContractRead(
    {
      addressOrName: GRATEFUL_ADDRESS,
      contractInterface: GratefulContract.abi,
    },
    "balanceOf",
    {
      args: accountData?.address,
      watch: true,
    }
  );

  const [{ data: priceData }] = useContractRead(
    {
      addressOrName: GRATEFUL_ADDRESS,
      contractInterface: GratefulContract.abi,
    },
    "pricePerShare"
  );

  const balance = BigNumber.from(balanceData || 0);
  const daiPrice = BigNumber.from(priceData || 0);
  const result = balance.mul(daiPrice).div(ethers.utils.parseEther("1"));

  return (
    <Box>
      <Heading>Grateful balance</Heading>
      {accountData && (
        <>
          <Text>{`Vault balance: ${ethers.utils.formatEther(balance?.toString())} yvDAI`}</Text>
          <Text>{`Price per share: ${ethers.utils.formatEther(daiPrice)}`}</Text>
          <Text>{`DAI balance: ${ethers.utils.formatEther(result)} DAI`}</Text>
        </>
      )}
    </Box>
  );
};

export default GratefulBalance;
