import React, { useState, useEffect, useRef } from "react";
import {
  Heading,
  Center,
  Image,
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Stack,
  Flex,
  Icon,
  chakra,
  VisuallyHidden,
  Text,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/toast";
import documentabi from "../../utils/documentsideabi.json";
import { ethers } from "ethers";
import { ParticleProvider } from "@particle-network/provider";
import { userInfo } from "os";
import Spinner from "../Spinner/Spinner";
import requestabi from "../../utils/requestsideabi.json";

function Profile() {
  const toast = useToast();
  const [userAddress, setUserAddress] = useState("");
  const [name, setName] = useState("");
  const [imageURL, setImageURL] = useState(
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJAatIj2Jpys9ItrxGsLMrJD2DlURwmW_hrWfJEGw&s"
  );
  const [dob, setDob] = useState("");
  const [licenseNum, setLicenseNum] = useState("");
  const [aadharNum, setAadharNum] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [degreeURL, setDegreeURL] = useState("");
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
  const inputRef = useRef(null);
  const [displayImage, setDisplayImage] = useState();
  const [ipfsUrl, setIpfsUrl] = useState("");
  const [profileModal, setProfileModal] = useState(false);
  const changeHandler = () => {
    setDisplayImage(inputRef.current?.files[0]);
  };

  const loadUserInfo = async () => {
    setLoading(true);
    if (window.ethereum._state.accounts.length !== 0) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_REQUESTSIDE_ADDRESS,
        requestabi,
        signer
      );
      const accounts = await provider.listAccounts();
      const tempUserId = await contract.userAddresstoId(accounts[0]);
      const userInfo = await contract.userIdtoUser(BigInt(tempUserId));
      setUserAddress(accounts[0]);
      console.log(userInfo);
      setName(userInfo.name);
      setImageURL(userInfo.imageURL);
      setDob(userInfo.dob);
      setLicenseNum(userInfo.licenseNum);
      setAadharNum(userInfo.aadharNum);
      setGender(userInfo.gender);
      setEmail(userInfo.email);
      setDegreeURL(userInfo.degreeURL);
      setLoading(false);
      const roleId = Number(userInfo.role);
      if (roleId == 1) {
        setRole("Client");
      } else if (roleId == 2) {
        setRole("Lawyer");
      } else if (roleId == 3) {
        setRole("Judge");
      } else if (roleId == 4) {
        setRole("Government Official");
      } else {
        setRole("System Admin");
      }
    }
  };

  const handleModal = async () => {
    if (!profileModal) {
      setProfileModal(true);
    } else {
      if (window.ethereum._state.accounts.length !== 0) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          process.env.NEXT_PUBLIC_REQUESTSIDE_ADDRESS,
          requestabi,
          signer
        );
        const tx = await contract.updateUser(userAddress, ipfsUrl);
        await tx.wait();
        toast({
          title: "Profile Picture Updated! ",
          description: "Refresh Page to view changes",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      }
      setProfileModal(false);
    }
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

  useEffect(() => {
    loadUserInfo();
  }, [userAddress]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <Box p={4}>
      <Heading>
        <Center>{name}</Center>
      </Heading>
      <Center mt={4}>
        <Image
          src={imageURL}
          alt="Profile Picture"
          boxSize={120}
          borderRadius="full"
        />
      </Center>
      <Center>
        <Heading as="h2" size="md" mt={4}>
          {role}
        </Heading>
      </Center>

      <Center mt={4}>
        <Box w="90%">
          <form>
            <Stack
              direction={["column", "column", "row"]}
              spacing={4}
              justifyContent="space-between"
            >
              <FormControl>
                <FormLabel fontSize="sm">Name</FormLabel>
                <Input
                  type="text"
                  placeholder="John Doe"
                  rounded="md"
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  value={name}
                />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm">Image URL</FormLabel>
                <Input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  rounded="md"
                  onChange={(e) => {
                    setImageURL(e.target.value);
                  }}
                  value={imageURL}
                />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm">Date of Birth</FormLabel>
                <Input
                  type="date"
                  placeholder="YYYY-MM-DD"
                  rounded="md"
                  onChange={(e) => {
                    setDob(e.target.value);
                  }}
                  value={dob}
                />
              </FormControl>
            </Stack>

            <Stack
              direction={["column", "column", "row"]}
              spacing={4}
              justifyContent="space-between"
              mt={4}
            >
              <FormControl>
                <FormLabel fontSize="sm">User Address</FormLabel>
                <Input
                  type="text"
                  placeholder="0X12...085"
                  rounded="md"
                  onChange={(e) => {
                    setUserAddress(e);
                  }}
                  value={userAddress}
                />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm">License Number</FormLabel>
                <Input
                  type="text"
                  placeholder="907862234"
                  rounded="md"
                  onChange={(e) => {
                    setLicenseNum(e.target.value);
                  }}
                  value={licenseNum}
                />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm">Aadhar Number</FormLabel>
                <Input
                  type="text"
                  placeholder="123456789012"
                  rounded="md"
                  onChange={(e) => setAadharNum(e.target.value)}
                  value={aadharNum}
                />
              </FormControl>
            </Stack>

            <Stack
              direction={["column", "column", "row"]}
              spacing={4}
              justifyContent="space-between"
              mt={4}
            >
              <FormControl>
                <FormLabel fontSize="sm">Gender</FormLabel>
                <Input
                  type="text"
                  placeholder="Male"
                  rounded="md"
                  onChange={(e) => {
                    setGender(e.target.value);
                  }}
                  value={gender}
                />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm">Email</FormLabel>
                <Input
                  type="email"
                  placeholder="john@example.com"
                  rounded="md"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  value={email}
                />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm">Degree URL</FormLabel>
                <Input
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  rounded="md"
                  onChange={(e) => {
                    setDegreeURL(e.target.value);
                  }}
                  value={degreeURL}
                />
              </FormControl>
            </Stack>
            {profileModal && (
              <Stack
                direction={["column", "column", "row"]}
                spacing={4}
                justifyContent="space-between"
                mt={4}
              >
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

                <Button onClick={uploadIPFS} mt="9%">
                  Upload to IPFS
                </Button>
              </Stack>
            )}

            <Center mt={7}>
              <Button
                variant="solid"
                width={["100%", "100%", "25%"]}
                backgroundColor="#0D74FF"
                color="white"
                _hover={{}}
                rounded="md"
                onClick={handleModal}
              >
                Update Profile Picture
              </Button>
            </Center>
          </form>
        </Box>
      </Center>
    </Box>
  );
}

export default Profile;
