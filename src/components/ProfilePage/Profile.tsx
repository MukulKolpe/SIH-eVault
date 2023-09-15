import React from 'react';
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
} from '@chakra-ui/react';
import { useToast } from '@chakra-ui/toast';

function Profile() {
  const toast = useToast();

  return (
    <Box p={4}>
      <Heading>
        <Center>My Profile</Center>
      </Heading>
      <Center mt={4}>
        <Image
          src={
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJAatIj2Jpys9ItrxGsLMrJD2DlURwmW_hrWfJEGw&s'
          }
          alt="Profile Picture"
          boxSize={120}
          borderRadius="full"
        />
      </Center>
      <Center>
        <Heading as="h2" size="md" mt={4}>
          Profile Name
        </Heading>
      </Center>

      <Center mt={4}>
        <Box w="90%">
          <form>
            <Stack
              direction={['column', 'column', 'row']}
              spacing={4}
              justifyContent="space-between"
            >
              <FormControl isRequired>
                <FormLabel fontSize="sm">Name</FormLabel>
                <Input type="text" placeholder="John Doe" rounded="md" />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize="sm">Image URL</FormLabel>
                <Input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  rounded="md"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize="sm">Date of Birth</FormLabel>
                <Input
                  type="date"
                  placeholder="YYYY-MM-DD"
                  rounded="md"
                />
              </FormControl>
            </Stack>

            <Stack
              direction={['column', 'column', 'row']}
              spacing={4}
              justifyContent="space-between"
              mt={4}
            >
              <FormControl isRequired>
                <FormLabel fontSize="sm">User Address</FormLabel>
                <Input
                  type="text"
                  placeholder="123 Main St, City, Country"
                  rounded="md"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize="sm">License Number</FormLabel>
                <Input type="text" placeholder="LIC12345" rounded="md" />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize="sm">Aadhar Number</FormLabel>
                <Input type="text" placeholder="123456789012" rounded="md" />
              </FormControl>
            </Stack>

            <Stack
              direction={['column', 'column', 'row']}
              spacing={4}
              justifyContent="space-between"
              mt={4}
            >
              <FormControl isRequired>
                <FormLabel fontSize="sm">Gender</FormLabel>
                <Input type="text" placeholder="Male" rounded="md" />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize="sm">Email</FormLabel>
                <Input
                  type="email"
                  placeholder="john@example.com"
                  rounded="md"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize="sm">Degree URL</FormLabel>
                <Input
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  rounded="md"
                />
              </FormControl>
            </Stack>

            <Center mt={7}>
              <Button
                variant="solid"
                width={['100%', '100%', '25%']}
                backgroundColor="#0D74FF"
                color="white"
                _hover={{}}
                rounded="md"
                onClick={() =>
                  toast({
                    title: 'Saved',
                    description: 'Changes are Saved Successfully.',
                    status: 'success',
                    duration: 9000,
                    isClosable: true,
                  })
                }
              >
                Save Changes
              </Button>
            </Center>
          </form>
        </Box>
      </Center>
    </Box>
  );
}

export default Profile;
