import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import documentabi from "../../utils/documentsideabi.json";
import DocumentCard from "../../components/DocumentCard/DocumentCard";
import { ParticleProvider } from "@particle-network/provider";
import {
  Button,
  Flex,
  Box,
  Text,
  Center,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightAddon,
  VStack,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";

const Documents = () => {
  const [length, setLength] = useState();
  const [caseNumber, setCaseNumber] = useState("");
  const [allCases, setAllCases] = useState({});

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

    const fetchData = async () => {
      try {
        const result = await contract.getCaseNumberArrayLength(caseNumber);
        const l = result.toNumber();
        setLength(l);

        const cases = {};

        for (let i = 0; i < l; i++) {
          const docIdResult = await contract.caseNumbertoDocId(caseNumber, i);
          const id = docIdResult.toNumber();

          const docResult = await contract.docIdtoDocument(id);

          const doc = docResult; // Assuming that docIdtoDocument returns an array with the document at index 0.
          cases[id] = doc;
          console.log(doc);
        }

        setAllCases(cases);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [caseNumber]);

  console.log(allCases);

  return (
    <>
      <Flex justifyContent="center">
        <InputGroup borderRadius={5} size="md" ml={6} mr={6} mt={4} w="90%">
          <InputLeftElement pointerEvents="none">
            <Search2Icon color="gray.600" />
          </InputLeftElement>
          <Input
            type="text"
            placeholder="Type Case Number to Continue"
            border="1px solid #949494"
            onChange={(e) => setCaseNumber(e.target.value)}
          />
        </InputGroup>
      </Flex>
      {length === 0 ? (
        <Center h="80vh">
          <Box>
            <Text fontSize="xl" fontWeight="bold" color="gray.600">
              No search results found
            </Text>
            <Text fontSize="md" color="gray.400">
              Please try a different search query.
            </Text>
          </Box>
        </Center>
      ) : null}
      <Grid
        templateColumns="repeat(2, 1fr)"
        gap={2}
        ml={14}
        mr={6}
        mt={4}
        w="90%"
      >
        {Object.keys(allCases).map((key) => {
          const document = allCases[key];
          console.log(document);

          return (
            <GridItem key={document[0]} colSpan={1}>
              <DocumentCard
                key={document[0]}
                title={document[0]}
                description={document[1]}
                link={document[2]}
                stakeholder={document[4]}
                notary={document[5]}
                final={document[6]}
              />
            </GridItem>
          );
        })}
      </Grid>
    </>
  );
};

export default Documents;
