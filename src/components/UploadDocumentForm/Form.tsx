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

const UploadDocumentForm = () => {
  const toast = useToast();
  const inputRef = useRef(null);
  const [displayDocument, setDisplayDocument] = useState();
  const [ipfsUrl, setIpfsUrl] = useState("");
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
            <Input id="name" placeholder="Name" autoComplete="name" />
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
                    htmlFor="file-upload"
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
              Document Number
            </FormLabel>
            <Input
              id="caseNumber"
              placeholder="Five Digit Document Number"
              minLength={6}
              maxLength={6}
            />
          </FormControl>
        </SimpleGrid>
        <Button
          display="block"
          mx="auto"
          mt={6}
          w="10rem"
          colorScheme="purple"
          variant="solid"
        >
          Submit Document
        </Button>
      </Box>
    </>
  );
};

export default UploadDocumentForm;
