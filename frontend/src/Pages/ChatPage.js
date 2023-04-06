import { Box } from "@chakra-ui/react";
import React from "react";
import { useState } from "react";
import {ChatState} from "../Context/ChatProvider";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import MyChats from "../components/miscellaneous/MyChats";
import ChatBox from "../components/miscellaneous/ChatBox";
const ChatPage = () => {
    const {user} = ChatState();
    const [fetchAgain, setFetchAgain]=useState(false);
    return( <>
    {user && <SideDrawer />}
    <Box 
    display="flex"
    flexDirection="row"
    justifyContent="space-between"
    w="100%"
    h="91.5vh"
    p="30px">
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
    </Box>
    </>)
};
export default ChatPage;