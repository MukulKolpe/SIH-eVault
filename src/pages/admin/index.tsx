import React, { useState, useEffect } from "react";
import {
  Grid,
  GridItem,
  Center,
  Button,
  Flex,
  Stack,
  useColorModeValue,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Card,
} from "@chakra-ui/react";
import Image from "next/image";
import LockSVG from "../../assets/lock-svgrepo-com.svg";
import { ethers } from "ethers";
import { ParticleProvider } from "@particle-network/provider";
import { useSigner } from "wagmi";
import documentabi from "../../utils/documentsideabi.json";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import CardComponent from "@/components/CardComponent/CardComponent";
import SpinnerComponent from "../../components/Spinner/Spinner";

const Admin = () => {
  const [password, setPassword] = useState("");
  const [cards, showCards] = useState(false);
  const [error, showError] = useState(false);
  const [userWallet, setUserWallet] = useState("");
  const [loader, setLoader] = useState(false);
  const [sysUsers, setSysUsers] = useState([]);

  const handleClick = async (e: any) => {
    if (window.ethereum._state.accounts.length !== 0) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_DOCUMENTSIDE_ADDRESS,
        documentabi,
        signer
      );
      const accounts = await provider.listAccounts();
      setUserWallet(accounts[0]);
      if (
        password == "deveshop" &&
        (accounts[0] == "0xaE93A422CB100d43f0F6bc5F0a8322119FD74385" ||
          accounts[0] == "0x12d0Ad7d21bdbe7E05AB0aDd973C58fB48b52Ae5" ||
          accounts[0] == "0xc35fC43ae078961BfC34FfB6c2148571b6f87920")
      ) {
        setLoader(true);
        const totalUsers = Number(await contract.userId());
        console.log(totalUsers);
        // const userData = await contract.userIdtoUser(1);
        // console.log(userData);
        let userData;
        for (let i = 1; i < totalUsers; i++) {
          userData = await contract.userIdtoUser(i);
          console.log(userData);
          setSysUsers((prevState) => [...prevState, userData]);
        }
        setLoader(false);
        showCards(true);
      } else {
        showError(true);
      }
    } else {
      showError(true);
    }
  };

  if (error) {
    return <div>Something went wrong {userWallet}</div>;
  }

  if (loader) {
    return <SpinnerComponent />;
  }

  if (!cards) {
    return (
      <Flex
        align={"center"}
        justify={"center"}
        bg={useColorModeValue("gray.50", "gray.800")}
        flexDir={"row"}
        justifyContent={"space-evenly"}
      >
        <Stack>
          <Stack
            spacing={4}
            w={"full"}
            maxW={"md"}
            rounded={"xl"}
            boxShadow={"lg"}
            p={6}
            my={12}
          >
            <Image src={LockSVG} width={250} alt="Lock SVG" />
          </Stack>
        </Stack>
        <Stack
          spacing={4}
          w={"full"}
          maxW={"md"}
          bg={useColorModeValue("white", "gray.700")}
          rounded={"xl"}
          boxShadow={"lg"}
          p={6}
          my={12}
        >
          <Heading lineHeight={1.1} fontSize={{ base: "2xl", md: "3xl" }}>
            Enter Admin Security Key
          </Heading>
          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </FormControl>
          <Stack spacing={6}>
            <Button
              bg={"blue.400"}
              color={"white"}
              _hover={{
                bg: "blue.500",
              }}
              onClick={(e) => {
                handleClick(e);
              }}
            >
              Submit
            </Button>
          </Stack>
        </Stack>
      </Flex>
    );
  }

  return (
    <Tabs variant="enclosed">
      <TabList>
        <Tab>All</Tab>
        <Tab>Unverified</Tab>
        <Tab>Verified</Tab>
        <Tab>Judges</Tab>
        <Tab>Lawyer</Tab>
        <Tab>Officials</Tab>
        <Tab> Other Users</Tab>

      </TabList>
      <TabPanels>
        <TabPanel>
          <Grid
            templateRows="repeat(2, 1fr)"
            templateColumns="repeat(4, 1fr)"
            gap={4}
          >
            {sysUsers &&
              sysUsers.map((sysUser: any, index: any) => {
                return (
                  <GridItem rowSpan={1} colSpan={1}>
                    <CardComponent sysUser={sysUser} signal={0} />
                  </GridItem>
                );
              })}
          </Grid>
        </TabPanel>
        <TabPanel>
          <Grid
            templateRows="repeat(2, 1fr)"
            templateColumns="repeat(4, 1fr)"
            gap={4}
          >
            {sysUsers &&
              sysUsers
                .filter((sysUser: any) => sysUser.isVerified == false)
                .map((sysUser: any, index: any) => {
                  return (
                    <GridItem rowSpan={1} colSpan={1}>
                      <CardComponent sysUser={sysUser} signal={1} />
                    </GridItem>
                  );
                })}
          </Grid>
        </TabPanel>
        <TabPanel>
          <Grid
            templateRows="repeat(2, 1fr)"
            templateColumns="repeat(4, 1fr)"
            gap={4}
          >
            {sysUsers &&
              sysUsers
                .filter((sysUser: any) => sysUser.isVerified)
                .map((sysUser: any, index: any) => {
                  return (
                    <GridItem rowSpan={1} colSpan={1}>
                      <CardComponent sysUser={sysUser} signal={0} />
                    </GridItem>
                  );
                })}
          </Grid>
        </TabPanel>
        <TabPanel>
          <Grid
            templateRows="repeat(2, 1fr)"
            templateColumns="repeat(4, 1fr)"
            gap={4}
          >
            {sysUsers &&
              sysUsers
                .filter((sysUser: any) => (sysUser.role == 3 && sysUser.isVerified))
                .map((sysUser: any, index: any) => {
                  return (
                    <GridItem rowSpan={1} colSpan={1}>
                      <CardComponent sysUser={sysUser} signal={0} />
                    </GridItem>
                  );
                })}
          </Grid>
        </TabPanel>
        <TabPanel>
          <Grid
            templateRows="repeat(2, 1fr)"
            templateColumns="repeat(4, 1fr)"
            gap={4}
          >
            {sysUsers &&
              sysUsers
                .filter((sysUser: any) => (sysUser.role == 2 && sysUser.isVerified))
                .map((sysUser: any, index: any) => {
                  return (
                    <GridItem rowSpan={1} colSpan={1}>
                      <CardComponent sysUser={sysUser} signal={0} />
                    </GridItem>
                  );
                })}
          </Grid>
        </TabPanel>
        <TabPanel>
          <Grid
            templateRows="repeat(2, 1fr)"
            templateColumns="repeat(4, 1fr)"
            gap={4}
          >
            {sysUsers &&
              sysUsers
                .filter((sysUser: any) => (sysUser.role == 4 && sysUser.isVerified))
                .map((sysUser: any, index: any) => {
                  return (
                    <GridItem rowSpan={1} colSpan={1}>
                      <CardComponent sysUser={sysUser} signal={0} />
                    </GridItem>
                  );
                })}
          </Grid>
        </TabPanel>
        <TabPanel>
          <Grid
            templateRows="repeat(2, 1fr)"
            templateColumns="repeat(4, 1fr)"
            gap={4}
          >
            {sysUsers &&
              sysUsers
                .filter((sysUser: any) => (sysUser.role == 1 && sysUser.isVerified))
                .map((sysUser: any, index: any) => {
                  return (
                    <GridItem rowSpan={1} colSpan={1}>
                      <CardComponent sysUser={sysUser} signal={0} />
                    </GridItem>
                  );
                })}
          </Grid>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default Admin;
