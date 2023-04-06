import { ViewIcon } from "@chakra-ui/icons";
import { IconButton, useDisclosure, Button,Image, Text } from "@chakra-ui/react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'
import React from "react";
const ProfileModal = ({user, children}) =>{
    const {isOpen, onOpen, onClose} = useDisclosure();
    
    return(
        <span>
    {
    children?(<span onClick={onOpen}>{children}</span>)
    :(<IconButton d={"flex"} ml={"2rem"} icon={<ViewIcon />} onClick={onOpen} />)
    }
    <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent h="410px">
          <ModalHeader
          fontSize="40px"
          fontFamily="sans-serif"
          display="flex"
          justifyContent="center"
          >{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody
          display="flex"
          flexDir="column"
          alignItems="center"
          justifyContent="space-between"
          >
          <Image
          borderRadius="full"
          boxSize="150px"
          src={user.pic}
          alt={user.name} />
          <Text
          fontSize={{base:"28px",md:"30px"}}
          >Email:{user.email}</Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant='ghost'>Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
        </span>
    )
};
export default ProfileModal;