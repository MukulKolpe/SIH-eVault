import React from "react";
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

function DocumentCard({
  title,
  description,
  link,
  stakeholder,
  notary,
  final,
}) {
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
      </Box>
    </Flex>
  );
}

export default DocumentCard;
