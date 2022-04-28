import type { AppProps } from "next/app";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { developmentChains, InjectedConnector, WagmiProvider } from "wagmi";
import { providers } from "ethers";

const provider = () => new providers.JsonRpcProvider();

const chains = developmentChains;

const connectors = () => {
  return [
    new InjectedConnector({
      chains,
      options: {
        shimDisconnect: true,
      },
    }),
  ];
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <WagmiProvider autoConnect connectors={connectors} provider={provider}>
        <Component {...pageProps} />
      </WagmiProvider>
    </ChakraProvider>
  );
}

export default MyApp;
