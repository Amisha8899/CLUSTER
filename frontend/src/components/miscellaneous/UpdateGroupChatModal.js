import {Box, Button, IconButton, Spinner, useDisclosure, useToast } from "@chakra-ui/react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
  } from '@chakra-ui/react'
  import { ViewIcon } from "@chakra-ui/icons";
import {
    FormControl,
    Input
  } from '@chakra-ui/react'
import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "./userBadgeItem";
import axios from "axios";
import UserListItem from "./UserLoading";
const UpdateGroupChatModel=({fetchAgain, setfetchagain, fetchMessages})=>{
    const {isOpen , onOpen , onClose} = useDisclosure();
    const [search , setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [groupChatName, setGroupChatName] = useState();
    const [renameLoading, setRenameLoading] = useState(false)
    const {selectedChat, setSelectedChat, user } = ChatState();
    const toast = useToast();
    const handleRemove = async (user1)=>{
        if(selectedChat.groupAdmin._id!==user._id && user1._id==user._id){
            toast({
                title:"Only admins can remove someone",
                status:"error",
                duration:5000,
                isClosable:true,
                position:"bottom",
            });
            return; 
        }
        try{
            setLoading(true);
            const config ={
                headers:{
                    Authorization:`Bearer ${user.token}`,
                },
            };
            const {data} = await axios.put("/api/chat/groupremove",
            {chatId:selectedChat._id,userId:user1._id,}
            ,config);
            user1.id === user._id ? setSelectedChat():setSelectedChat(data); 
            setfetchagain(!fetchAgain);
            fetchMessages();
            setRenameLoading(false);
        } catch(error){
            toast({
                    title:"Error occured",
                    description:error.response.data.message,
                    status:"error",
                    duration:5000,
                    isClosable:true,
                    position:"bottom",
                });
                setLoading(false);
        };
    };
    const handleAddUser = async(user1)=>{
        if(selectedChat.users.find((u)=>u._id===user1._id)){
            toast({
                title:"User already in group",
                status:"error",
                duration:5000,
                isClosable:true,
                position:"bottom",
            });
            return; 
        }
        if(selectedChat.groupAdmin._id!==user._id){
            toast({
                title:"Only admins can add someone",
                status:"error",
                duration:5000,
                isClosable:true,
                position:"bottom",
            });
            return;
        }
        try{
            setLoading(true);
            const config ={
                headers:{
                    Authorization:`Bearer ${user.token}`,
                },
            };
            const {data} = await axios.put("/api/chat/groupadd",
            {chatId:selectedChat._id,userId:user1._id,}
            ,config);
            setSelectedChat(data);
            setfetchagain(!fetchAgain);
            setLoading(false);
        } catch(error){
            toast({
                    title:"Error occured",
                    description:error.response.data.message,
                    status:"error",
                    duration:5000,
                    isClosable:true,
                    position:"bottom",
                });
                setLoading(false);
        };
    };
    const handleRename = async() => {
        if(!groupChatName) return;
        try{
            setRenameLoading(true);
            const config ={
                headers:{
                    Authorization:`Bearer ${user.token}`,
                },
            };
            const {data} = await axios.put("/api/chat/rename",
            {chatId:selectedChat._id,chatName:groupChatName}
            ,config);
            setSelectedChat(data);
            setfetchagain(!fetchAgain);
            setRenameLoading(false);
        } catch(error){
            toast({
                    title:"Error occured",
                    description:error.response.data.message,
                    status:"error",
                    duration:5000,
                    isClosable:true,
                    position:"bottom",
                });
                setRenameLoading(false);
        };
        setGroupChatName("");
    };
    const handleSearch = async(query)=>{
        if(!query){
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers:{
                    Authorization:`Bearer ${user.token}`,
                },
            };
            const {data} = await axios.get(`/api/user?search=${search}`,config);
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            toast({
                title:"Erro Ocurred",
                description:"Fialed to load search Results",
                status:"error",
                duration:5000,
                isClosable:true,
                position:"bottom-left",
            });
            setLoading(false);
        }
       }; 
return(
        <>
<IconButton 
    d={{ base:"flex "}} 
    ml={'2rem'} 
    icon={<ViewIcon />} 
    onClick={onOpen} 
/>
<Modal isOpen={isOpen} onClose={onClose} isCentered>
<ModalOverlay />
<ModalContent>
<ModalHeader
    fontSize="35px"
    fontFamily="Work sans"
    d="flex"
    justifyContent="center"
>{selectedChat.chatName}
</ModalHeader>
    <ModalCloseButton />
    <ModalBody
        display={"flex"}
        flexDir={"column"}
        alignItems={"center"}
    >
      <Box 
         w="100%" 
         d="flex" 
         flexWrap="wrap" 
         pb={3} >
        {selectedChat.users.map((u)=>(
            <UserBadgeItem 
                key={u._id} 
                user={u} 
                handleFunction={()=>handleRemove(u)} />
      ))}</Box>
  <FormControl display={"flex"}>
  <Input 
        placeholder="Chat Name"
        mb={3}
        value={groupChatName}
        onChange={(e)=>setGroupChatName(e.target.value)}
   />
   <Button
         variant="solid"
         colorScheme="teal"
         ml={1}
         isLoading={renameLoading}
         onClick={handleRename}
   >
   Update
   </Button>
</FormControl>
<FormControl>
  <Input placeholder="Add User to group"
  mb={1}
  value={groupChatName}
  onChange={(e)=>handleSearch(e.target.value)}
   />
  
</FormControl>
{loading?(<Spinner size={"lg"} />
):(
    searchResult?.map((user)=>(
        <UserListItem 
        key={user._id}
        user={user}
        handleFunction={()=>handleAddUser(user)}
        />
    ))
)}
    <Box
        w="100%"
        display={"flex"}
        flexWrap={"wrap"}
    >

    </Box>
    </ModalBody>

    <ModalFooter>
      <Button 
          onClick={()=>handleRemove(user)} 
          colorScheme="red"
          mr={3}
          >Leave Group
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>   
        </>
)};
export default UpdateGroupChatModel;