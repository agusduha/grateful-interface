import { Box, Button, Text } from "@chakra-ui/react";
import { BigNumber, ethers } from "ethers";
import { useEffect } from "react";
import { useAccount, useContractRead } from "wagmi";
import GratefulContract from "../abis/Grateful.json";
import Deposit from "./grateful/Deposit";
import Subscribe from "./grateful/Subscribe";
import WithdrawAll from "./grateful/WithdrawAll";

const Grateful = () => {
  const [{ data: accountData }] = useAccount();

  const [{ data }] = useContractRead(
    {
      addressOrName: "0xefAB0Beb0A557E452b398035eA964948c750b2Fd",
      contractInterface: GratefulContract.abi,
    },
    "balanceOf",
    {
      args: accountData?.address,
      watch: true,
    }
  );

  const [{ data: userData }, read] = useContractRead(
    {
      addressOrName: "0xefAB0Beb0A557E452b398035eA964948c750b2Fd",
      contractInterface: GratefulContract.abi,
    },
    "getUserData",
    {
      args: accountData?.address,
      skip: true,
    }
  );

  const [{ data: priceData }] = useContractRead(
    {
      addressOrName: "0xefAB0Beb0A557E452b398035eA964948c750b2Fd",
      contractInterface: GratefulContract.abi,
    },
    "pricePerShare"
  );

  useEffect(() => {
    read();
  }, [accountData?.address, read]);

  const balance = BigNumber.from(data || 0);
  const daiPrice = BigNumber.from(priceData || 0);
  const result = balance.mul(daiPrice).div(ethers.utils.parseEther("1"));

  return (
    <Box>
      <Button onClick={() => read()}>Fetch balance</Button>
      {accountData && (
        <Box>
          {data && <Text>{`Vault Balance ${ethers.utils.formatEther(data?.toString())} yvDAI`}</Text>}
          {priceData && <Text>{`Price per share ${ethers.utils.formatEther(priceData)}`}</Text>}
          {result && <Text>{`DAI Balance ${ethers.utils.formatEther(result)} DAI`}</Text>}
          {userData && (
            <Box>
              {<Text>{`Incoming Flow ${userData[0]?.toString()}`}</Text>}
              {<Text>{`Outgoing Flow ${userData[1]?.toString()}`}</Text>}
              {<Text>{`Subscriptions`}</Text>}
              {userData[2].map((address: string) => (
                <Text key={address}>{address}</Text>
              ))}
              {<Text>{`Subscribers`}</Text>}
              {userData[3].map((address: string) => (
                <Text key={address}>{address}</Text>
              ))}
            </Box>
          )}
        </Box>
      )}
      <Deposit />
      <Subscribe />
      <WithdrawAll />
    </Box>
  );
};

export default Grateful;
