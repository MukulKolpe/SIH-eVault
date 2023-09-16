import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Text,
  Box,
  StackDivider,
  Heading,
  Button,
  Flex,
  Link,
  Stack,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import documentabi from "../../utils/documentsideabi.json";
import { ParticleProvider } from "@particle-network/provider";
import { useSigner } from "wagmi";
import { useToast } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";

const DocumentCard = ({ doc, signal }) => {
  const toast = useToast();

  const handleDocumentApproval = async () => {
    if (window.ethereum._state.accounts.length !== 0) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_DOCUMENTSIDE_ADDRESS,
        documentabi,
        signer
      );
      const accounts = await provider.listAccounts();
      const tx = await contract.markNotaryApproval(doc.index);
      await tx.wait();
      toast({
        title: "Document Notarized! ",
        description: "Document Approved by Notary Public",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <Heading size="md"> {doc.payload.docTitle}</Heading>
      </CardHeader>
      <CardBody>
        <Text>{doc.payload.docSubject}</Text>
        <Text mt={2}>Associated with: {doc.payload.caseNumber}</Text>
      </CardBody>
      <CardFooter>
        <Stack align={"center"}>
          <Button>
            <Link href={doc.payload.ipfsHash} isExternal>
              View Document
              <ExternalLinkIcon mx="2px" />
            </Link>
          </Button>
          {signal && <Button onClick={handleDocumentApproval}>Approve</Button>}
        </Stack>
      </CardFooter>
    </Card>
  );
};

export default DocumentCard;
