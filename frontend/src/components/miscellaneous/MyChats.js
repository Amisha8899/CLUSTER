import { AddIcon } from "@chakra-ui/icons";
import { Box, Button, Stack, useToast,Text } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { ChatState } from "../../Context/ChatProvider";
import ChatLoading from "./ChatLoading";
import { getSender } from "../../config/Chatlogics";
import GroupChatModal from "./GroupChatModal";
import { useState } from "react";
import axios from "axios";
const MyChats = ({fetchAgain})=>{
    const [loggedUser, setLoggedUser] = useState();
    const {selectedChat, setSelectedChat, user,chats,setChats} = ChatState();
    const toast = useToast();
    const fetchChats = async () => {
        try{
            const config ={
                headers:{
                    Authorization:`Bearer ${user.token}`,
                },
            };
            const {data} = await axios.get("/api/chat",config);
            setChats(data);
        } catch(error){
            toast({
                    title:"Error occured",
                    description:"Failed to load chats",
                    status:"error",
                    duration:5000,
                    isClosable:true,
                    position:"bottom-left",
                });
        }
    };
    const selectChatHandler = (chat) => {
        setSelectedChat(chat)
    }
    useEffect(()=>{
        setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
        fetchChats();
    },[fetchAgain])
    
    
return( 
<Box display={{base: selectedChat ? "none":"flex", md:"flex"}}
    flexDir="column"
    alignItems="center"
    p={3}
    bg="white"
    w={{base:"100%",md:"31%"}}
    borderRadius="lg"
    borderWidth="1px"
>
<Box 
pb={3} 
px={3} 
fontSize={{base:"28px",md:"30px"}}
fontFamily="work sans"
display="flex"
w="100%"
justifyContent="space-between"
alignItems="center"
>
My chats
<GroupChatModal>
   <Button   
     display={"flex"} 
     fontSize={{base:"17px", md:"10px",lg:"17px"}}
     rightIcon={<AddIcon />}
    > 
    <Text>
     New Group Chat
    </Text>
    </Button>
</GroupChatModal>
</Box>
<Box
d="flex"
flexDir="column"
p={3}
bg="#F8F8F8"
w="100%"
h="100%"
borderRadius="lg"
overflowY="hidden"
>
{chats?(
    <Stack overflowY="scroll">
        {chats.map((chat)=>(
            <Box
            onClick={() => {selectChatHandler(chat)}}
            cursor="pointer"
            backgroundColor={ (chat === selectedChat) ? "#38B2AC" : "#E8E8E8" }
            color={(chat === selectedChat) ? "white" : "black" }
            px={3}
            py={2}
            borderRadius="lg"
            key={chat._id}
            >
            <Text>
                {!chat.isGroupChat? (getSender(loggedUser,chat.users)):(chat.chatName)}
            </Text>
            </Box>
        ))}
    </Stack>
):(
    <ChatLoading />
)}


</Box>
    </Box>) 
};
export default MyChats;