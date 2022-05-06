import { Text } from "@chakra-ui/react";
import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { useEffect, useState } from "react";

interface BalanceCounterProps {
  label: string;
  symbol: string;
  balance: BigNumber;
  flow: BigNumber;
  freq: number;
}

const BalanceCounter = ({ label, symbol, balance, flow, freq }: BalanceCounterProps) => {
  const [count, setCount] = useState(balance);

  useEffect(() => {
    setCount(balance);
  }, [balance]);

  useEffect(() => {
    const id = setInterval(() => setCount((oldBalance: BigNumber) => oldBalance.add(flow.div(freq))), 1000 / freq);

    return () => {
      clearInterval(id);
    };
  }, [flow, freq, setCount]);

  return <Text>{`${label} ${formatEther(count)} ${symbol}`}</Text>;
};

export default BalanceCounter;
