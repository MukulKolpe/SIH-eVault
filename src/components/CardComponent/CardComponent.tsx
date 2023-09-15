import {
  Heading,
  Avatar,
  Box,
  Center,
  Image,
  Flex,
  Text,
  Stack,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import documentabi from "../../utils/documentsideabi.json";
import { ParticleProvider } from "@particle-network/provider";
import { useSigner } from "wagmi";
import { useToast } from "@chakra-ui/react";

const CardComponent = ({ sysUser, signal }) => {
  const [size, setSize] = useState("md");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleSizeClick = (newSize) => {
    setSize(newSize);
    onOpen();
  };
  const toast = useToast();

  const approveUser = async () => {
    if (window.ethereum._state.accounts.length !== 0) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        "0xF3b144eFbdE47fFAE49AbcB23CB4F1c5B08F7c73",
        documentabi,
        signer
      );
      const accounts = await provider.listAccounts();
      const currUserId = await contract.userEmailtoId(sysUser.email);
      console.log("Curr UserId: " + currUserId);
      const tx = await contract.verifyUser(currUserId);
      await tx.wait();
      console.log(tx);
      toast({
        title: "Registration approved! ",
        description: "Please refresh the page to see the results.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    }
  };
  return (
    <div>
      <Center py={6}>
        <Box
          maxW={"325px"}
          w={"full"}
          bg={useColorModeValue("white", "gray.800")}
          boxShadow={"2xl"}
          rounded={"md"}
          overflow={"hidden"}
        >
          <Image
            h={"120px"}
            w={"full"}
            src={
              "https://images.unsplash.com/photo-1612865547334-09cb8cb455da?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
            }
            objectFit={"cover"}
          />
          <Flex justify={"center"} mt={-12}>
            <Avatar
              size={"xl"}
              src={sysUser.imageURL}
              alt={"Author"}
              css={{
                border: "2px solid white",
              }}
            />
          </Flex>

          <Box p={6}>
            <Stack spacing={0} align={"center"} mb={5}>
              <Heading fontSize={"2xl"} fontWeight={500} fontFamily={"body"}>
                {sysUser.name}
              </Heading>
              {sysUser.role == 1 && <Text color={"gray.500"}>User</Text>}
              {sysUser.role == 2 && <Text color={"gray.500"}>Lawyer</Text>}
              {sysUser.role == 3 && <Text color={"gray.500"}>Judge</Text>}
              {sysUser.role == 4 && (
                <Text color={"gray.500"}>Govt. Official</Text>
              )}
              {sysUser.role == 5 && <Text color={"gray.500"}>Admin</Text>}
            </Stack>

            <Stack direction={"column"} justify={"left"}>
              <Stack spacing={0} align={"center"}>
                <Text fontWeight={600}>Gender: {sysUser.gender}</Text>
              </Stack>
              <Stack spacing={0} align={"center"}>
                <Text fontWeight={600}>Email: {sysUser.email}</Text>
              </Stack>
              <Stack spacing={0} align={"center"}>
                <Text fontWeight={600}>License No: {sysUser.licenseNum}</Text>
              </Stack>
              <Stack spacing={0} align={"center"}>
                <Text fontWeight={600}>Date of Birth: {sysUser.dob}</Text>
              </Stack>
            </Stack>

            <Button
              w={"full"}
              mt={8}
              bg={useColorModeValue("#151f21", "gray.900")}
              color={"white"}
              rounded={"md"}
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "lg",
              }}
              onClick={() => handleSizeClick("xl")}
            >
              View Degree
            </Button>
            {signal == 1 && (
              <Button
                w={"full"}
                mt={8}
                bg={useColorModeValue("#151f21", "gray.900")}
                color={"white"}
                rounded={"md"}
                _hover={{
                  transform: "translateY(-2px)",
                  boxShadow: "lg",
                }}
                onClick={approveUser}
              >
                Approve
              </Button>
            )}
            <Modal onClose={onClose} size={size} isOpen={isOpen}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Degree</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <img src={sysUser.degreeURL}></img>
                </ModalBody>
                <ModalFooter>
                  <Button onClick={onClose}>Close</Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </Box>
        </Box>
      </Center>
    </div>
  );
};

export default CardComponent;
