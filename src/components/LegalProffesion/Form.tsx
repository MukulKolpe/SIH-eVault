"use client";

import { useState, useRef } from "react";
import { ethers } from "ethers";
import { ParticleProvider } from "@particle-network/provider";
import { useSigner } from "wagmi";
import documentabi from "../../utils/documentsideabi.json";
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
} from "@chakra-ui/react";

import { useToast } from "@chakra-ui/react";
import requestabi from "../../utils/requestsideabi.json";

const Form1 = ({ getEmail, getName, getAdhar, getRole }) => {
  const handleName = (e) => {
    getName(e);
  };

  const handleEmail = (e) => {
    getEmail(e);
  };

  const handleAdhar = (e) => {
    getAdhar(e);
  };

  const handleRole = (e) => {
    getRole(e);
  };
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  return (
    <>
      <Heading w="100%" textAlign={"center"} fontWeight="normal" mb="2%">
        Legal Professionals Registration
      </Heading>

      <FormControl mr="5%">
        <FormLabel htmlFor="first-name" fontWeight={"normal"}>
          Name
        </FormLabel>
        <Input
          id="first-name"
          placeholder="Full name"
          onChange={(e) => handleName(e.target.value)}
        />
      </FormControl>

      <FormControl mt="2%">
        <FormLabel htmlFor="email" fontWeight={"normal"}>
          Email address
        </FormLabel>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          autoComplete="email"
          onChange={(e) => handleEmail(e.target.value)}
        />
        <FormHelperText>We&apos;ll never share your email.</FormHelperText>
      </FormControl>

      <FormControl>
        <FormLabel htmlFor="password" fontWeight={"normal"} mt="2%">
          Aadhar Number
        </FormLabel>
        <InputGroup size="md">
          <Input
            pr="4.5rem"
            placeholder="Enter Aadhar Card Number"
            onChange={(e) => handleAdhar(e.target.value)}
          />
        </InputGroup>
      </FormControl>
      <FormControl mt="2%">
        <FormLabel
          htmlFor="country"
          fontSize="sm"
          fontWeight="md"
          color="gray.700"
          _dark={{
            color: "gray.50",
          }}
        >
          Select Role
        </FormLabel>
        <Select
          id="country"
          name="country"
          autoComplete="country"
          placeholder="Select option"
          focusBorderColor="brand.400"
          shadow="sm"
          size="sm"
          w="full"
          rounded="md"
          onChange={(e) => handleRole(e.target.value)}
        >
          <option>Lawyer</option>
          <option>Judge</option>
          <option>Other</option>
        </Select>
      </FormControl>
    </>
  );
};

const Form2 = ({ getDob, getGender, getProfile }) => {
  const toast = useToast();
  const inputRef = useRef(null);
  const [displayImage, setDisplayImage] = useState();
  const [ipfsUrl, setIpfsUrl] = useState("");
  const changeHandler = () => {
    setDisplayImage(inputRef.current?.files[0]);
  };

  const uploadIPFS = async () => {
    const form = new FormData();
    form.append("file", displayImage ? displayImage : "");

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
        // console.log(response);
        // console.log(response.ipfs_url);
        setIpfsUrl(response.ipfs_url);

        if (displayImage) {
          toast({
            title: "Display Image Uploaded to the IPFS.",
            description: "Congratulations 🎉 ",
            status: "success",
            duration: 1000,
            isClosable: true,
            position: "top-right",
          });
        } else {
          toast({
            title: "Display Image not Uploaded to the IPFS.",
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

  const handleGender = (e) => {
    getGender(e);
  };

  const handleDob = (e) => {
    getDob(e);
  };
  // console.log(ipfsUrl);

  getProfile(ipfsUrl);
  return (
    <>
      <SimpleGrid>
        <Heading w="100%" textAlign={"center"} fontWeight="normal" mb="2%">
          Other Details
        </Heading>

        <FormControl mr="5%" mt="2%">
          <FormLabel htmlFor="datetime-local" fontWeight={"normal"}>
            Date of Birth
          </FormLabel>
          <Input
            placeholder="Select Date and Time"
            size="md"
            type="date"
            id="datetime-local"
            onChange={(e) => handleDob(e.target.value)}
          />
        </FormControl>

        <FormControl mt="2%">
          <FormLabel
            htmlFor="gender"
            fontSize="sm"
            fontWeight="md"
            color="gray.700"
            _dark={{
              color: "gray.50",
            }}
          >
            Gender
          </FormLabel>
          <Select
            id="gender"
            name="gender"
            autoComplete="gender"
            placeholder="Select option"
            focusBorderColor="brand.400"
            shadow="sm"
            size="sm"
            w="full"
            rounded="md"
            onChange={(e) => handleGender(e.target.value)}
          >
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </Select>
        </FormControl>
        <FormControl mt="2%">
          <FormLabel
            fontWeight={"normal"}
            color="gray.700"
            _dark={{
              color: "gray.50",
            }}
          >
            Profile Image
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
              <Text>{displayImage?.name}</Text>
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
                  <span>{"Upload an Image"}</span>
                  <VisuallyHidden>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      ref={inputRef}
                      onChange={changeHandler}
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
                PNG, JPG, GIF up to 10MB
              </Text>
            </Stack>
          </Flex>
        </FormControl>

        <Button onClick={uploadIPFS} mt="2%">
          Upload to IPFS
        </Button>
      </SimpleGrid>
    </>
  );
};

const Form3 = ({ getLicense, getDegree }) => {
  const toast = useToast();
  const inputRef = useRef(null);
  const [displayImage, setDisplayImage] = useState();
  const [ipfsUrl, setIpfsUrl] = useState("");
  const changeHandler = () => {
    setDisplayImage(inputRef.current?.files[0]);
  };
  const uploadIPFS = async () => {
    const form = new FormData();
    form.append("file", displayImage ? displayImage : "");

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
        // console.log(response);
        // console.log(response.ipfs_url);
        setIpfsUrl(response.ipfs_url);
        if (displayImage) {
          toast({
            title: "Display Image Uploaded to the IPFS.",
            description: "Congratulations 🎉 ",
            status: "success",
            duration: 1000,
            isClosable: true,
            position: "top-right",
          });
        } else {
          toast({
            title: "Display Image not Uploaded to the IPFS.",
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
  getDegree(ipfsUrl);
  const handleLicense = (e) => {
    getLicense(e);
  };
  return (
    <>
      <Heading w="100%" textAlign={"center"} fontWeight="normal">
        Education Details
      </Heading>
      <SimpleGrid columns={1} spacing={6}>
        <FormControl mt="2%">
          <FormLabel
            fontWeight={"normal"}
            color="gray.700"
            _dark={{
              color: "gray.50",
            }}
          >
            Upload Your Degree
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
              <Text>{displayImage?.name}</Text>
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
                  <span>{"Upload an Image"}</span>
                  <VisuallyHidden>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      ref={inputRef}
                      onChange={changeHandler}
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
                PNG, PDF up to 10MB
              </Text>
            </Stack>
          </Flex>
        </FormControl>

        <Button onClick={uploadIPFS} mt="2%" mb="2%">
          Upload Degree
        </Button>

        <FormControl id="email" mt={1}>
          <FormLabel
            fontSize="sm"
            fontWeight="md"
            color="gray.700"
            _dark={{
              color: "gray.50",
            }}
          >
            License Number
          </FormLabel>
          <Input
            placeholder="Enter License Number"
            rows={3}
            shadow="sm"
            focusBorderColor="brand.400"
            fontSize={{
              sm: "sm",
            }}
            onChange={(e) => handleLicense(e.target.value)}
          />
          <FormHelperText>
            We&apos;ll never share your licensenumber.
          </FormHelperText>
        </FormControl>
      </SimpleGrid>
    </>
  );
};

export default function Multistep() {
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(33.33);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [adhar, setAdhar] = useState("");
  const [role, setRole] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [profile, setProfile] = useState();
  const [degree, setDegree] = useState();
  const [license, setLicense] = useState("");

  const handleSubmit = async () => {
    if (window.ethereum._state.accounts.length !== 0) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_REQUESTSIDE_ADDRESS,
        requestabi,
        signer
      );
      const accounts = await provider.listAccounts();

      // console.log(contract);

      let finalrole = 0;
      if (role === "Lawyer") {
        finalrole = 2;
      } else if (role === "Judge") {
        finalrole = 3;
      } else if (role === "Other") {
        finalrole = 4;
      }

      const tx = contract.createUser(
        name,
        profile,
        dob,
        accounts[0],
        license,
        adhar,
        degree,
        gender,
        email,
        finalrole
      );

      // console.log(tx);
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
        process.env.NEXT_PUBLIC_REQUESTSIDE_ADDRESS,
        requestabi,
        signer
      );

      // console.log(contract);

      let finalrole = 0;
      if (role === "Lawyer") {
        finalrole = 2;
      } else if (role === "Judge") {
        finalrole = 3;
      } else if (role === "Other") {
        finalrole = 4;
      }

      const tx = contract.createUser(
        name,
        profile,
        dob,
        accounts[0],
        license,
        adhar,
        degree,
        gender,
        email,
        finalrole
      );

      // console.log(tx);
    }
    //or get accounts with particleProvider

    // toast({
    //   title: "Submission Received",
    //   description:
    //     "Congratulations 🎉 your details are submitted, we'll get back to you soon!",
    //   status: "success",
    //   duration: 3000,
    //   isClosable: true,
    //   position: "top-right",
    // });
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
        <Progress
          hasStripe
          value={progress}
          mb="5%"
          mx="5%"
          isAnimated
        ></Progress>
        {step === 1 ? (
          <Form1
            getName={(q) => setName(q)}
            getEmail={(q) => setEmail(q)}
            getAdhar={(q) => setAdhar(q)}
            getRole={(q) => setRole(q)}
          />
        ) : step === 2 ? (
          <Form2
            getDob={(q) => setDob(q)}
            getGender={(q) => setGender(q)}
            getProfile={(q) => setProfile(q)}
          />
        ) : (
          <Form3
            getDegree={(q) => setDegree(q)}
            getLicense={(q) => setLicense(q)}
          />
        )}
        <ButtonGroup mt="5%" w="100%">
          <Flex w="100%" justifyContent="space-between">
            <Flex>
              <Button
                onClick={() => {
                  setStep(step - 1);
                  setProgress(progress - 33.33);
                }}
                isDisabled={step === 1}
                colorScheme="teal"
                variant="solid"
                w="7rem"
                mr="5%"
              >
                Back
              </Button>
              <Button
                w="7rem"
                isDisabled={step === 3}
                onClick={() => {
                  setStep(step + 1);
                  if (step === 3) {
                    setProgress(100);
                  } else {
                    setProgress(progress + 33.33);
                  }
                }}
                colorScheme="teal"
                variant="outline"
              >
                Next
              </Button>
            </Flex>
            {step === 3 ? (
              <Button
                w="7rem"
                colorScheme="red"
                variant="solid"
                onClick={() => {
                  handleSubmit();
                }}
              >
                Submit
              </Button>
            ) : null}
          </Flex>
        </ButtonGroup>
      </Box>
    </>
  );
}
