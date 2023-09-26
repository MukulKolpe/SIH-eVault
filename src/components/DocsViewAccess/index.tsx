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
import { useToast } from "@chakra-ui/react";
import { ethers } from "ethers";
import DocumentCardProfile from "../../components/DocumentCardProfile/DocumentCardProfile";
import { ParticleProvider } from "@particle-network/provider";
import requestabi from "../../utils/requestsideabi.json";
import { request } from "http";
import Spinner from "../Spinner/Spinner";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";
import { Badge } from "@chakra-ui/react";
import { Link } from "@chakra-ui/react";
import { ExternalLinkIcon, RepeatClockIcon } from "@chakra-ui/icons";

const index = () => {
  const [totalDocs, setTotalDocs] = useState(0);
  const [userAddress, setUserAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [docsArray, setDocsArray] = useState([]);
  const [uploadedByArr, setUploadedByArr] = useState([]);
  const [ct, setCt] = useState(0);
  let arr1 = [];

  const loadSharedDocs = async () => {
    if (window.ethereum._state.accounts.length !== 0 && ct === 0) {
      setLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_REQUESTSIDE_ADDRESS,
        requestabi,
        signer
      );
      const accounts = await provider.listAccounts();
      const tempUserId = await contract.userAddresstoId(accounts[0]);
      const tempDocsShared = Number(
        await contract.getViewAccessLengthforUser(tempUserId)
      );
      setTotalDocs(tempDocsShared);
      let docData, uploadedUserInfo;
      for (let i = 0; i < tempDocsShared; i++) {
        const tempDocId = await contract.userIdtodocIdViewAccess(
          tempUserId,
          BigInt(i)
        );
        console.log(Number(tempDocId));
        docData = await contract.docIdtoDocument(tempDocId);
        uploadedUserInfo = await contract.userIdtoUser(docData.uploadedBy);
        setDocsArray((prevState) => [
          ...prevState,
          { docPayload: docData, uploadedUserPayload: uploadedUserInfo },
        ]);
        //setUploadedByArr((prevState) => [...prevState, uploadedUserInfo]);
        arr1.push(docData);
        setCt(1);
        setLoading(false);
      }
    }
  };

  // useEffect(() => {
  //   loadSharedDocs();
  // }, []);
  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <Heading mt={10} padding={6}>
        <Center>Documents Shared With You</Center>
      </Heading>
      {totalDocs == 0 ? (
        <Center>
          <Button onClick={loadSharedDocs}>
            <RepeatClockIcon />
            Load Data
          </Button>
        </Center>
      ) : (
        <Center>
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Doc Id.</Th>
                  <Th>Document Name</Th>
                  <Th isNumeric>Witness Approval</Th>
                  <Th isNumeric>Notary Approval</Th>
                  <Th isNumeric>Case Number</Th>
                  <Th isNumeric>Uploaded By</Th>
                  <Th isNumeric>View Document</Th>
                </Tr>
              </Thead>
              <Tbody>
                {docsArray.map((document) => {
                  return (
                    <Tr>
                      <Td>{Number(document.docPayload.documentId)}</Td>
                      <Td>{document.docPayload.docTitle}</Td>
                      <Td>
                        {document.docPayload.approval1 ? (
                          <Badge colorScheme="green">Approved</Badge>
                        ) : (
                          <Badge colorScheme="red">Pending</Badge>
                        )}
                      </Td>
                      <Td>
                        {document.docPayload.approval2 ? (
                          <Badge colorScheme="green">Approved</Badge>
                        ) : (
                          <Badge colorScheme="red">Pending</Badge>
                        )}
                      </Td>
                      <Td>{document.docPayload.caseNumber}</Td>
                      <Td>{document.uploadedUserPayload.name}</Td>
                      <Td>
                        <Link href={document.docPayload.ipfsHash} isExternal>
                          View Document <ExternalLinkIcon mx="2px" />
                        </Link>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>
        </Center>
      )}
    </>
  );
};

export default index;
