import React, { useState, useRef } from "react";
import {
  Progress,
  Box,
  ButtonGroup,
  Button,
  Heading,
  Flex,
  FormControl,
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
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Icon,
  chakra,
  VisuallyHidden,
  Text,
  Stack,
  ring,
} from "@chakra-ui/react";

import { useToast } from "@chakra-ui/react";
import { ethers } from "ethers";
import { ParticleProvider } from "@particle-network/provider";
import { useSigner } from "wagmi";
import documentabi from "../../utils/documentsideabi.json";

const UploadDocumentForm = () => {
  const toast = useToast();
  const inputRef = useRef(null);
  const [displayDocument, setDisplayDocument] = useState();
  const [ipfsUrl, setIpfsUrl] = useState("");
  const [documentName, setDocumentName] = useState("");
  const [documentDescription, setDocumentDescription] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [clientEmail, setClientEmail] = useState("");

  const changeHandler = () => {
    setDisplayDocument(inputRef.current?.files[0]);
  };
  const uploadIPFS = async () => {
    const form = new FormData();
    form.append("file", displayDocument ? displayDocument : "");

    const options = {
      method: "POST",
      body: form,
      headers: {
        Authorization: process.env.NEXT_PUBLIC_NFTPort_API_KEY,
      },
    };

    await fetch("https://api.nftport.xyz/v0/files", options)
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        console.log(response.ipfs_url);
        setIpfsUrl(response.ipfs_url);
        if (displayDocument) {
          toast({
            title: "Document Uploaded to the IPFS.",
            description: "Congratulations 🎉 ",
            status: "success",
            duration: 1000,
            isClosable: true,
            position: "top-right",
          });
        } else {
          toast({
            title: "Document not Uploaded to the IPFS.",
            description: "Please attach the degree certificate ",
            status: "error",
            duration: 1000,
            isClosable: true,
            position: "top-right",
          });
        }
      })
      .catch((err) => console.error(err));
  };
  const handleSubmit = async () => {
    if (window.ethereum._state.accounts.length !== 0) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_DOCUMENTSIDE_ADDRESS,
        documentabi,
        signer
      );
      const accounts = await provider.listAccounts();

      const userid = await contract.userAddresstoId(accounts[0]);

      console.log(accounts[0]);
      console.log(contract);
      const tx = await contract.uploadDocument(
        documentName,
        documentDescription,
        ipfsUrl,
        userid,
        witnessArray,
        userid,
        witnessArray,
        documentNumber
      );
      console.log(tx);
      await tx.wait();
      toast({
        title: "Document Uploaded.",
        description: "Congratulations 🎉 ",
        status: "success",
        duration: 1000,
        isClosable: true,
        position: "top-right",
      });
    } else {
      const particleProvider = new ParticleProvider(particle.auth);
      const accounts = await particleProvider.request({
        method: "eth_accounts",
      });
      const ethersProvider = new ethers.providers.Web3Provider(
        particleProvider,
        "any"
      );
      const signer = ethersProvider.getSigner();

      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_DOCUMENTSIDE_ADDRESS,
        documentabi,
        signer
      );

      console.log(contract);
      const userid = await contract.userAddresstoId(accounts[0]);
      const tx = await contract.uploadDocument(
        documentName,
        documentDescription,
        ipfsUrl,
        userid,
        witnessArray,
        userid,
        witnessArray,
        documentNumber
      );
      await tx.wait();
      toast({
        title: "Document Uploaded.",
        description: "Congratulations 🎉 ",
        status: "success",
        duration: 1000,
        isClosable: true,
        position: "top-right",
      });

      console.log(tx);
    }
  };
  const [inputFields, setInputFields] = useState([{ value: "" }]);

  const handleAddField = () => {
    const newInputFields = [...inputFields, { value: "" }];
    setInputFields(newInputFields);
  };

  const handleInputChange = (index, event) => {
    const newInputFields = [...inputFields];
    newInputFields[index].value = event.target.value;
    setInputFields(newInputFields);
  };

  const handleRemoveField = (index) => {
    const newInputFields = [...inputFields];
    newInputFields.splice(index, 1);
    setInputFields(newInputFields);
  };

  //console.log(inputFields);
  const [witnessArray, setWitnessArray] = useState([]);
  console.log(window.ethereum._state.accounts.length !== 0);

  const createWitnessArray = async () => {
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
      const accounts = await particleProvider.request({
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

    console.log(contract);
    // iterate over inputFields and create an array of witnesses
    const witnessList = [];
    let s1 = 0;

    for (let i = 0; i < inputFields.length; i++) {
      let id = await contract.userEmailtoId(inputFields[i].value);
      if (id.toNumber() === 0) {
        s1 = 1;

        break;
      }
      witnessList.push(id.toNumber());
    }

    if (s1 === 1) {
      toast({
        title: "Witnesses not found.",
        description: "Please enter valid email address ",
        status: "error",
        duration: 1000,
        isClosable: true,
        position: "top-right",
      });
    } else {
      toast({
        title: "Witnesses added.",
        description: "Witnesses added successfully ",
        status: "success",
        duration: 1000,
        isClosable: true,
        position: "top-right",
      });
    }

    setWitnessArray(witnessList);

    // console.log(setWitnessArray(witnessList));
  };
  console.log(witnessArray);
  return (
    <>
      <Box
        borderWidth="1px"
        rounded="lg"
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
        maxWidth={800}
        p={6}
        m="10px auto"
        as="form"
      >
        <SimpleGrid columns={1} spacing={6}>
          <Heading w="100%" textAlign={"center"} fontWeight="normal" mb="2%">
            Upload Document
          </Heading>
          <FormControl mr="2%">
            <FormLabel htmlFor="name" fontWeight={"normal"}>
              Document Name
            </FormLabel>
            <Input
              id="name"
              placeholder="Name"
              autoComplete="name"
              onChange={(e) => setDocumentName(e.target.value)}
            />
          </FormControl>
          <FormControl id="email" mt={1}>
            <FormLabel
              fontSize="sm"
              fontWeight="md"
              color="gray.700"
              _dark={{
                color: "gray.50",
              }}
            >
              About the Document
            </FormLabel>
            <Textarea
              placeholder="Description about the document."
              rows={3}
              shadow="sm"
              focusBorderColor="brand.400"
              fontSize={{
                sm: "sm",
              }}
              onChange={(e) => setDocumentDescription(e.target.value)}
            />
            <FormHelperText>
              Brief description about the document. URLs are hyperlinked.
            </FormHelperText>
          </FormControl>
          <FormControl mt="2%">
            <FormLabel
              fontWeight={"normal"}
              color="gray.700"
              _dark={{
                color: "gray.50",
              }}
            >
              Upload Document
            </FormLabel>

            <Flex
              mt={1}
              justify="center"
              px={6}
              pt={5}
              pb={6}
              borderWidth={2}
              _dark={{
                color: "gray.500",
              }}
              borderStyle="dashed"
              rounded="md"
            >
              <Stack spacing={1} textAlign="center">
                <Icon
                  mx="auto"
                  boxSize={12}
                  color="gray.400"
                  _dark={{
                    color: "gray.500",
                  }}
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Icon>
                <Text>{displayDocument?.name}</Text>
                <Flex
                  fontSize="sm"
                  color="gray.600"
                  _dark={{
                    color: "gray.400",
                  }}
                  alignItems="baseline"
                >
                  <chakra.label
                    cursor="pointer"
                    rounded="md"
                    fontSize="md"
                    color="brand.600"
                    _dark={{
                      color: "brand.200",
                    }}
                    pos="relative"
                    _hover={{
                      color: "brand.400",
                      _dark: {
                        color: "brand.300",
                      },
                    }}
                  >
                    <span>{"Upload Document"}</span>
                    <VisuallyHidden>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        ref={inputRef}
                        onChange={changeHandler}
                        accept=".pdf,.docx,.doc"
                      />
                    </VisuallyHidden>
                  </chakra.label>
                  <Text pl={1}>or drag and drop</Text>
                </Flex>
                <Text
                  fontSize="xs"
                  color="gray.500"
                  _dark={{
                    color: "gray.50",
                  }}
                >
                  PDF, DOCX, DOC up to 10MB
                </Text>
              </Stack>
            </Flex>
          </FormControl>

          <Button onClick={uploadIPFS}>Upload to IPFS</Button>

          <FormControl mr="2%">
            <FormLabel htmlFor="name" fontWeight={"normal"}>
              Case Number
            </FormLabel>
            <Input
              id="caseNumber"
              placeholder="Six Digit Document Number"
              minLength={6}
              maxLength={6}
              autoComplete="caseNumber"
              onChange={(e) => setDocumentNumber(e.target.value)}
            />
            <FormHelperText>
              This will help in retrival of the document.
            </FormHelperText>
          </FormControl>
          <FormControl mt="2%">
            <FormLabel htmlFor="email" fontWeight={"normal"}>
              Client Email address
            </FormLabel>
            <Input
              id="email"
              type="email"
              placeholder="client@gmail.com"
              autoComplete="email"
              onChange={(e) => setClientEmail(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="name" fontWeight={"normal"}>
              Witness Email Addresses
            </FormLabel>

            {inputFields.map((inputField, index) => (
              <div key={index}>
                <Flex mt={4}>
                  <Input
                    type="text"
                    placeholder="Enter email address"
                    value={inputField.value}
                    onChange={(e) => handleInputChange(index, e)}
                    mr={4}
                  />
                  <Button onClick={() => handleRemoveField(index)}>
                    Remove
                  </Button>
                </Flex>
              </div>
            ))}
            <Flex mt={6}>
              <Button onClick={handleAddField} mr={4}>
                Add Witness
              </Button>
              <Button onClick={createWitnessArray} ml={4}>
                Confirm Witnesses
              </Button>
            </Flex>
          </FormControl>
        </SimpleGrid>
        <Button
          display="block"
          mx="auto"
          mt={6}
          w="10rem"
          colorScheme="purple"
          variant="solid"
          onClick={() => {
            handleSubmit();
          }}
        >
          Submit Document
        </Button>
      </Box>
    </>
  );
};

export default UploadDocumentForm;
