import React, { useEffect, useState } from "react";
import {
  Flex,
  Box,
  Text,
  Heading,
  Link,
  Button,
  Image,
  Badge,
} from "@chakra-ui/react";
import documentabi from "../../utils/documentsideabi.json";
import { ethers } from "ethers";
import { useToast } from "@chakra-ui/react";
import { ParticleProvider } from "@particle-network/provider";
import requestabi from "../../utils/requestsideabi.json";

function DocumentCardProfile({
  title,
  description,
  link,
  stakeholder,
  notary,
  final,
  userid,
  docsid,
}) {
  const toast = useToast();
  const docsApproval = async () => {
    let contract;
    if (window.ethereum._state.accounts.length !== 0) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_REQUESTSIDE_ADDRESS,
        requestabi,
        signer
      );
    } else {
      const particleProvider = new ParticleProvider(particle.auth, "any");
      const accounts = particleProvider.request({
        method: "eth_accounts",
      });
      const ethersProvider = new ethers.providers.Web3Provider(
        particleProvider,
        "any"
      );
      const pSigner = ethersProvider.getSigner();
      contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_REQUESTSIDE_ADDRESS,
        requestabi,
        pSigner
      );
    }
    const witnessApproval = await contract.markWitnessApproval(userid, docsid);
    console.log(witnessApproval);
    await witnessApproval.wait();
    toast({
      title: "Document Approved! ",
      description: "You've successfully approved the document.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };
  useEffect(() => {
    console.log(docsid, userid);
  });
  return (
    <Flex
      maxW="lg"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="lg"
      p="4"
      mb="4"
      align="center"
      _hover={{ boxShadow: "xl" }}
    >
      <Box flex="1">
        <Heading size="md" mb="2">
          {title}
        </Heading>
        <Text fontSize="sm" color="gray.600" mb="4">
          {description}
        </Text>
        <Text color="gray.400">
          {stakeholder ? (
            <Badge colorScheme="green" mr="2" p="1">
              Approved
            </Badge>
          ) : (
            <Badge colorScheme="red" mr="2" p="1">
              Not Approved
            </Badge>
          )}
          Stakeholder Status
        </Text>
        <Text color="gray.400">
          {notary ? (
            <Badge colorScheme="green" mr="2" p="1">
              Approved
            </Badge>
          ) : (
            <Badge colorScheme="red" mr="2" p="1">
              Not Approved
            </Badge>
          )}
          Notary Status
        </Text>
        <Text color="gray.400" mb="3">
          {final ? (
            <Badge colorScheme="green" mr="2" p="1">
              Approved
            </Badge>
          ) : (
            <Badge colorScheme="red" mr="2" p="1">
              Not Approved
            </Badge>
          )}
          Final Status
        </Text>

        <Link href={link} color="teal" isExternal mt="12">
          View Document
        </Link>
        <Button ml={6} onClick={docsApproval}>
          Approve
        </Button>
      </Box>
    </Flex>
  );
}

export default DocumentCardProfile;
