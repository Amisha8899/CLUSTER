import React from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormControl,
    Input,
    Box,
    useDisclosure,
    Button,
    useToast,
    Text
  } from '@chakra-ui/react'
  import { AddIcon } from '@chakra-ui/icons';
import { useState } from "react";
import UserListItem from './UserLoading';
import axios from 'axios';
import UserBadgeItem from './userBadgeItem';
import { ChatState } from "../../Context/ChatProvider";
const GroupChatModal=({children})=>{
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName, setGroupChatName]=useState();
    const [selectedUsers, setSelectedUsers]=useState([]);
    const [search, setSearch]=useState("");
    const [searchResult, setSearchResult]=useState([]);
    const [loading , setLoading]= useState();
    const toast = useToast();
    const {user, chats, setchats} =ChatState();
    const handleSearch=async (query)=>{
        setSearch(query)
        if(!query){
            return
        }
        try {
            setLoading(true)
            const config ={
                headers:{
                    Authorization:`Bearer ${user.token}`,
                },
            };
            const {data} =await axios.get(`/api/user?search=${search}`,config);
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            toast({
                title:"Error occured",
                description:"Failed to load search results",
                status:"error",
                duration:5000,
                isClosable:true,
                position:"bottom-left",
            });
        }
    };
    const handleSubmit =async()=>{
      if(!groupChatName || !selectedUsers){
        toast({
          title:"Plese fill all the fields",
          status:"warning",
          duration:5000,
          isClosable:true,
          position:"top",
        });
        return;
      }
      try {
        setLoading(true)
            const config ={
                headers:{
                    Authorization:`Bearer ${user.token}`,
                },
            };
            const {data} =await axios.post("/api/chat/group",{
              name:groupChatName,
              users: JSON.stringify(selectedUsers.map((u)=>u._id)),
            },config);
            setchats([data,...chats]);
            onClose();
            toast({
              title:"New Group Chat created!",
                status:"success",
                duration:5000,
                isClosable:true,
                position:"bottom",
            });
      } catch (error) {
        toast({
          title:"Some Error Ocurred",
          status:"error",
          duration:5000,
          isClosable:true,
          position:"top",
        })
      }
    };
    const handleDelete=(delUser)=>{
      setSelectedUsers(selectedUsers.filter((sel)=>sel._id!==delUser._id));
    };
    const handleGroup=(userToAdd)=>{
        if(selectedUsers.includes(userToAdd)){
            toast({
                title:"User already added",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"top",
            });
            return;
        }
        setSelectedUsers([...selectedUsers, userToAdd]);
    };
    
    return (
      <>
 <span onClick={onOpen}>{children}</span>
  
<Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
        <ModalContent>
           <ModalHeader
            fontSize="35px"
            fontFamily="work sans"
            d="flex"
            justifyContent="center"
            >Create Group Chat
          </ModalHeader>
        <ModalCloseButton />
    <ModalBody
            d="flex"
            flexDir="column"
            alignItems="center"
    >
    <FormControl>
        <Input 
              placeholder='Chat Name' 
              mb={3} 
              onChange={(e) => setGroupChatName(e.target.value)}
        />
        <Input
                    placeholder='Add Users'
                    mb={1}
                    value=""
                    onChange={(e)=>handleSearch(e.target.value)}
        />
        </FormControl> 
        <Box 
            w="40%" 
            d="flex" 
            flexDir='row'
            flexWrap="wrap"
        >
        {selectedUsers.map((u)=>(
        <UserBadgeItem 
              key={user._id} 
              user={u} 
              handleFunction={()=>handleDelete(u)}
        />
        ))}
        </Box>
             {loading ? (<div>loading</div>):(
              searchResult?.slice(0,4).map((user)=>
              <UserListItem 
                     key={user._id} 
                     user={user} 
                     handleFunction={()=>handleGroup(user)} 
              />
              ))}
            </ModalBody>
  
    <ModalFooter>
        <Button colorScheme='blue' onClick={handleSubmit}>
                Create Chat
        </Button>
    </ModalFooter>
</ModalContent>
</Modal>
      </>
    )
}
export default GroupChatModal;