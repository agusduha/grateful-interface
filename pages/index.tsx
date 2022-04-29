import type { NextPage } from "next";
import { Grid, GridItem, Heading, GridItemProps } from "@chakra-ui/react";
import { Hero } from "../components/Hero";
import { Container } from "../components/Container";
import { Main } from "../components/Main";
import { DarkModeSwitch } from "../components/DarkModeSwitch";
import Account from "../components/grateful/Account";
import Balance from "../components/grateful/Balance";
import { MainGridItem } from "../components/MainGridItem";
import GratefulBalance from "../components/grateful/GratefulBalance";
import Subscriptions from "../components/grateful/Subscriptions";
import Subscribers from "../components/grateful/Subscribers";

const Home: NextPage = () => {
  return (
    <Container height="100vh">
      <Hero title="I'm Grateful" />
      <Main>
        <Grid templateRows="repeat(2, 1fr)" templateColumns="repeat(4, 1fr)" gap={4}>
          <MainGridItem>
            <Balance />
          </MainGridItem>
          <MainGridItem>
            <GratefulBalance />
          </MainGridItem>
          <MainGridItem>
            <Subscriptions />
          </MainGridItem>
          <MainGridItem>
            <Subscribers />
          </MainGridItem>
        </Grid>
      </Main>

      <Account />
      <DarkModeSwitch />
    </Container>
  );
};

export default Home;
