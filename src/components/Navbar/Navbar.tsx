"use client";
import { useState, useEffect } from "react";
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  Icon,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, AddIcon } from "@chakra-ui/icons";
import { ParticleProvider } from "@particle-network/provider";
// import { CgProfile } from "react-icons/cg";
// import Avatar from "avataaars";
// import { generateRandomAvatarOptions } from "../../utils/avatar";
// import { px } from "framer-motion";
import { Link } from "@chakra-ui/next-js";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import documentabi from "../../utils/documentsideabi.json";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { address, isConnected } = useAccount();
  const [role, setRole] = useState("1");
  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    let contract;
    if (window.ethereum._state.accounts.length !== 0) {
      contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_DOCUMENTSIDE_ADDRESS,
        documentabi,
        signer
      );
    } else {
      const particleProvider = new ParticleProvider(particle.auth);
      const accounts = particleProvider.request({
        method: "eth_accounts",
      });
      const ethersProvider = new ethers.providers.Web3Provider(
        particleProvider,
        "any"
      );
      const pSigner = ethersProvider.getSigner();

      contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_DOCUMENTSIDE_ADDRESS,
        documentabi,
        pSigner
      );
    }
    contract
      .userAddresstoUser(address)
      .then((result) => {
        setRole(result.role.toNumber());
      })
      .catch((err) => {});
  }, [address, role]);

  return (
    <>
      <Box bg={useColorModeValue("white", "gray.800")} px={10}>
        <Flex
          h={16}
          alignItems="center"
          justifyContent="space-between"
          mx="auto"
        >
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack
            spacing={8}
            alignItems={"center"}
            fontSize="26px"
            fontWeight="0"
            ml="2"
            color="brand.00"
          >
            <Link href="/">Legal eVault</Link>
          </HStack>
          <Flex alignItems={"center"}>
            <div style={{ display: "flex" }}>
              {role === 0 ? (
                <HStack
                  as={"nav"}
                  spacing={4}
                  display={{ base: "none", md: "flex" }}
                  marginRight={4}
                >
                  <Link href="/user-registration">
                    <Button w="full" variant="ghost">
                      User Registration
                    </Button>
                  </Link>
                </HStack>
              ) : null}
              {role === 0 ? (
                <HStack
                  as={"nav"}
                  spacing={4}
                  display={{ base: "none", md: "flex" }}
                  marginRight={4}
                >
                  <Link href="/legal-professional-registration">
                    <Button w="full" variant="ghost">
                      Legal Professional Registration
                    </Button>
                  </Link>
                </HStack>
              ) : null}
              {role === 5 ? (
                <HStack
                  as={"nav"}
                  spacing={4}
                  display={{ base: "none", md: "flex" }}
                  marginRight={4}
                >
                  <Link href="/admin">
                    <Button w="full" variant="ghost">
                      Admin
                    </Button>
                  </Link>
                </HStack>
              ) : null}
              {role === 2 || role === 5 || role === 3 ? (
                <HStack
                  as={"nav"}
                  spacing={4}
                  display={{ base: "none", md: "flex" }}
                  marginRight={4}
                >
                  <Link href="/upload-document">
                    <Button w="full" variant="ghost">
                      Upload Documents
                    </Button>
                  </Link>
                </HStack>
              ) : null}
              {role === 2 || role === 1 || role === 3 ? (
                <HStack
                  as={"nav"}
                  spacing={4}
                  display={{ base: "none", md: "flex" }}
                  marginRight={4}
                >
                  <Link href="/profile">
                    <Button w="full" variant="ghost">
                      Profile
                    </Button>
                  </Link>
                </HStack>
              ) : null}
              {role === 3 || role === 4 ? (
                <HStack
                  as={"nav"}
                  spacing={4}
                  display={{ base: "none", md: "flex" }}
                  marginRight={4}
                >
                  <Link href="/Documents">
                    <Button w="full" variant="ghost">
                      Case Details
                    </Button>
                  </Link>
                </HStack>
              ) : null}
              <ConnectButton />
            </div>

            {/* {state == null ? (
                <Button
                  display="flex"
                  flexDir="row"
                  variant={"solid"}
                  colorScheme={"teal"}
                  size={"sm"}
                  mr={4}
                  leftIcon={<Icon as={CgProfile} boxSize={6} />}
                  onClick={() => auth.signIn() && navigate("/profile")}
                >
                  Sign In
                </Button>
              ) : (
                <Menu>
                  <MenuButton
                    as={Button}
                    rounded={"full"}
                    variant={"link"}
                    cursor={"pointer"}
                    minW={0}
                  >
                    <Avatar
                      size={"sm"}
                      style={{
                        width: "40px",
                        height: "40px",
                      }}
                      avatarStyle="Circle"
                      {...generateRandomAvatarOptions()}
                    />
                  </MenuButton>
                  <MenuList>
                    <MenuItem>
                      Welcome,{" "}
                      {state.userId.slice(0, 4) + "..." + state.userId.slice(-4)}
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem as={Link} to="/profile">
                      Profile
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem onClick={() => auth.signOut()}>Sign Out</MenuItem>
                  </MenuList>
                </Menu>
              )} */}
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              <Link href="/user-registration">
                <Button w="full" variant="ghost">
                  User Registration
                </Button>
              </Link>
            </Stack>
            <Stack as={"nav"} spacing={4}>
              <Link href="/legal-professional-registration">
                <Button w="full" variant="ghost">
                  Legal Professional Registration
                </Button>
              </Link>
            </Stack>
            <Stack as={"nav"} spacing={4}>
              <Link href="/admin">
                <Button w="full" variant="ghost">
                  Admin
                </Button>
              </Link>
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}
