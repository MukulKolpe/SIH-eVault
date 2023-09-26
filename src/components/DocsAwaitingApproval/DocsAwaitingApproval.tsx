"use client";

import React, { useState, useEffect, use } from "react";
import {
  Progress,
  Text,
  Stack,
  chakra,
  Icon,
  VisuallyHidden,
  Box,
  ButtonGroup,
  Button,
  Heading,
  Flex,
  FormControl,
  Grid,
  GridItem,
  FormLabel,
  Input,
  Select,
  SimpleGrid,
  InputLeftAddon,
  InputGroup,
  Textarea,
  FormHelperText,
  InputRightElement,
  Center,
} from "@chakra-ui/react";
import documentabi from "../../utils/documentsideabi.json";
import { useToast } from "@chakra-ui/react";
import { ethers } from "ethers";
import DocumentCardProfile from "../../components/DocumentCardProfile/DocumentCardProfile";
import { ParticleProvider } from "@particle-network/provider";
import requestabi from "../../utils/requestsideabi.json";
import { request } from "http";

const DocsAwaitingApproval = () => {
  const [length, setLength] = useState();
  const [docId, setDocId] = useState();
  const [userId, setUserId] = useState();
  const [docs, setDocs] = useState({});
  const toast = useToast();

  const displayDocsAwaitingApproval = async () => {
    let contract;
    if (window.ethereum._state.accounts.length !== 0) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_REQUESTSIDE_ADDRESS,
        requestabi,
        signer
      );
      const accounts = await provider.listAccounts();
      const userid = await contract.userAddresstoId(accounts[0]);
      console.log(contract);
      console.log(userid.toNumber());
      setUserId(userid.toNumber());

      const witnessArraylength = await contract.getWitnessArrayLengthforUser(
        userid
      );
      const l = witnessArraylength.toNumber();
      setLength(l);
      console.log(witnessArraylength.toNumber());
      const docs = {};

      for (let i = 0; i < l; i++) {
        const docid = await contract.userIdtodocIdWitness(userid, i);
        console.log(docid.toNumber());
        const id = docid.toNumber();
        const docResult = await contract.docIdtoDocument(docid);

        const doc = docResult; // Assuming that docIdtoDocument returns an array with the document at index 0.
        docs[id] = doc;
        setDocId(id);
      }
      setDocs(docs);
      //   const witnessApproval = await contract.markWitnessApproval(userid, docId);
      //   console.log(witnessApproval);
    } else {
      const particleProvider = new ParticleProvider(particle.auth);
      // const accounts = particleProvider.request({
      //   method: "eth_accounts",
      // });
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
      const accounts = await ethersProvider.listAccounts();
      const userid = await contract.userAddresstoId(accounts[0]);
      console.log(contract);
      console.log(userid.toNumber());
      setUserId(userid.toNumber());

      const witnessArraylength = await contract.getWitnessArrayLengthforUser(
        userid
      );
      const l = witnessArraylength.toNumber();
      setLength(l);
      console.log(witnessArraylength.toNumber());
      const docs = {};

      for (let i = 0; i < l; i++) {
        const docid = await contract.userIdtodocIdWitness(userid, i);
        console.log(docid.toNumber());
        const id = docid.toNumber();
        const docResult = await contract.docIdtoDocument(docid);

        const doc = docResult; // Assuming that docIdtoDocument returns an array with the document at index 0.
        docs[id] = doc;
        setDocId(id);
      }
      setDocs(docs);
    }
  };

  console.log(docs);

  useEffect(() => {
    displayDocsAwaitingApproval();
  }, [length > 0]);
  return (
    <>
      <Heading mt={10} padding={6}>
        <Center>Documents waiting for your approval</Center>
      </Heading>
      <Grid
        templateColumns="repeat(2, 1fr)"
        gap={2}
        ml={14}
        mr={6}
        mt={4}
        w="90%"
      >
        {Object.keys(docs).map((key) => {
          const document = docs[key];
          // console.log(document);

          return (
            <GridItem key={key} colSpan={1}>
              <DocumentCardProfile
                key={key}
                title={document[1]}
                description={document[2]}
                link={document[3]}
                stakeholder={document[5]}
                notary={document[6]}
                userid={userId}
                docsid={docId}
                final={document[7]}
              />
            </GridItem>
          );
        })}
      </Grid>
    </>
  );
};

export default DocsAwaitingApproval;
