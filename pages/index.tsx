import { Button, Container, Heading, Text, useDisclosure } from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Account from "../components/Account";
import Balance from "../components/Balance";
import Grateful from "../components/Grateful";

const Home: NextPage = () => {
  return (
    <Container>
      <Heading>I&apos;m Grateful</Heading>

      <Account />
      <Balance />
      <Grateful />
    </Container>
  );
};

export default Home;
