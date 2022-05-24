import { useCallback, useEffect, useState } from "react";
import { useNetwork, useSignMessage } from "wagmi";
import { SiweMessage } from "siwe";
import { Button, MenuItem, useToast } from "@chakra-ui/react";

interface LoginProps {
  address: string;
  menu?: boolean;
  onSignIn?: () => {};
}

const Login = ({ address, menu = true, onSignIn }: LoginProps) => {
  const toast = useToast();

  const [
    {
      data: { chain },
    },
  ] = useNetwork();

  const [state, setState] = useState<{
    address?: string;
    error?: Error;
    loading?: boolean;
  }>({});

  const [, signMessageAsync] = useSignMessage();

  const signIn = useCallback(async () => {
    try {
      const chainId = chain?.id;
      if (!address || !chainId) return;

      setState((x) => ({ ...x, error: undefined, loading: true }));
      // Fetch random nonce, create SIWE message, and sign with wallet
      const nonceRes = await fetch("/api/auth/nonce");
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: "Sign in with Ethereum to the app.",
        uri: window.location.origin,
        version: "1",
        chainId,
        nonce: await nonceRes.text(),
      });
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });

      if (signature.error) throw new Error("Error signing message");

      // Verify signature
      const verifyRes = await fetch("/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, signature }),
      });

      console.log("VERIFY RES", verifyRes);

      if (!verifyRes.ok) throw new Error("Error verifying message");

      if (verifyRes.ok) {
        toast({
          title: `Signed in as ${address}!`,
          status: "success",
          duration: 10000,
          isClosable: true,
        });
      }

      handler();
      !!onSignIn && onSignIn();
      //   setState((x) => ({ ...x, address, loading: false }));
    } catch (error: any) {
      toast({
        title: `Error signing in`,
        status: "error",
        duration: 10000,
        isClosable: true,
      });

      setState((x) => ({ ...x, error, loading: false }));
    }
  }, [address, chain?.id, signMessageAsync, toast, onSignIn]);

  const handler = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const json = await res.json();
      setState((x) => ({ ...x, address: json.address }));
    } catch (_error) {}
  };

  // Fetch user when:
  useEffect(() => {
    // 1. page loads
    handler();

    // 2. window is focused (in case user logs out of another window)
    window.addEventListener("focus", handler);
    return () => window.removeEventListener("focus", handler);
  }, []);

  if (menu) {
    return state.address ? (
      <MenuItem
        onClick={async () => {
          await fetch("/api/auth/logout");

          toast({
            title: `Signed out correctly!`,
            status: "success",
            duration: 10000,
            isClosable: true,
          });

          setState({});
        }}
      >
        Sign Out
      </MenuItem>
    ) : (
      <MenuItem disabled={state.loading} onClick={signIn}>
        Sign-In with Ethereum
      </MenuItem>
    );
  } else {
    return (
      <Button disabled={state.loading} onClick={signIn}>
        Sign-In with Ethereum
      </Button>
    );
  }
};

export default Login;
