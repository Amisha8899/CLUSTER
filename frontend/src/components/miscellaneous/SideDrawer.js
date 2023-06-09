import { Box, 
    Button, 
    Menu, 
    MenuButton, 
    MenuList, 
    Tooltip, 
    Text, 
    Avatar, 
    MenuItem, 
    MenuDivider, 
    Drawer, 
    DrawerOverlay, 
    DrawerContent, 
    DrawerHeader, 
    DrawerBody,
    Input,
    useDisclosure,
    useToast,
    DrawerCloseButton,
    DrawerFooter
} from "@chakra-ui/react";
import {BellIcon,ChevronDownIcon} from "@chakra-ui/icons";
import React from "react";
import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate} from "react-router-dom";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import UserListItem from "./UserLoading";
import {Spinner } from "@chakra-ui/spinner"
import { getSender } from "../../config/Chatlogics";
const SideDrawer = ()=>{
    const [search , setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState();
    const toast = useToast(); 
    const {user, setSelectedChat, chats, setChats, notifications, setNotifications} = ChatState();
//   const history = useHistory();

const navigate = useNavigate();
const {isOpen, onOpen, onClose, onClick} = useDisclosure();
const logoutHandler =()=>{
    localStorage.removeItem("userInfo");
    navigate("/");
};
const handleSearch = async () => {
    if(!search){
        toast({
            title:"Please enter something in search",
            status:"warning",
            duration:5000,
            isClosable:true,
            position:"top-left",
        });
        return;
    }
    try {
        setLoading(true);
        const config = {
            headers:{
                Authorization:`Bearer ${user.token}`,
                ContentType: 'application/json'
            },
        };
        const {data} = await axios.get(`/api/user?search=${search}`,config);
        
        setLoading(false);
        setSearchResult(data);
    } catch (error) {
        toast({
            title:"Failed to load the search results",
            description: error.message.description,
            status:"error",
            duration:5000,
            isClosable:true,
            position:"bottom-left",
        });

        console.log(error);
    }
   }; 
const accessChat =async (userId) =>{
    try {
        console.log("in access chats try");
        setLoadingChat(true);
        const config ={
            headers: {
                "Content-type":"application/json",
                Authorization:`Bearer ${user.token}`,
            },
        };
        const { data } =await axios.post("/api/chat",{userId},config);
        if(!chats.find((c)=>c._id===data._id)) setChats([data, ...chats]);
        setSelectedChat(data);
        setLoadingChat(false);
        onclose();
    } catch (error) {
        console.log("in access chats catch");
        toast({
            title:"Error fetching the chats",
            description:error.message,
            status:"error",
            duration:5000,
            isClosable:true,
            position:"bottom-left",
        });
    }
   };
   return <>
        <Box
         display="flex"
         justifyContent="space-between"
         alignItems="center"
         bg="white"
         w="100%"
         p="5px 10px 5px 10px"
         borderWidth="5px"
        >
            <Tooltip 
            label="Search user to chat" 
            hasArrow 
            placement="bottom-end">
            <Button variant="ghost" onClick={onOpen}>
            <i className="fa-solid fa-magnifying-glass"></i>
           <Text d={{base:"none",md:"flex"}} px="4">Search User</Text>
           </Button> 
            </Tooltip>
            <Text fontSize="2xl" fontFamily="Poppins" >
            Chat App
            </Text>
            <div>
            <Menu>
                <MenuButton p="1">
                {/* <NotificationBadge count = {notifications.length}
                effect={Effect.SCALE} /> */}
                    <BellIcon />
                </MenuButton>
                <MenuList pl={2}>{!notifications.length && "No new messages"}
                {notifications.map(notif => (
                    <MenuItem key={notif._id} onClick={()=>
                    {setSelectedChat(notif.chat);
                    setNotifications(notifications.filter((n)=>n!==notif));
                    }}>
                    {notif.chat.isGroupChat?`new message in ${notif.chat.chatName}`:`New message from ${getSender(user,notif.chat.users)}`}</MenuItem>
                ))}
                </MenuList>
            </Menu>
            <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic} />
            </MenuButton>
            <MenuList>
            <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
            </ProfileModal>
                <MenuDivider />
                <MenuItem onClick={logoutHandler}>Log Out</MenuItem>
            </MenuList>
            </Menu>
            </div>
        </Box>
        <Drawer placement="left" onClose={onClose} isOpen={isOpen} >
        <DrawerOverlay />
        <DrawerCloseButton />
        <DrawerContent>
        <DrawerHeader borderBottom="1px">Search Users</DrawerHeader>
        <DrawerBody><Box display="flex" pb={2}>
        <Input placeholder="Search by name or email"
        mr={2}
        value={search} 
        onChange={(e) => setSearch(e.target.value)}
        />
        <Button onClick={handleSearch}
        >GO!</Button>
        </Box>
        {loading ? <ChatLoading /> : 
         (
            searchResult?.map((user)=>(
                <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={()=>accessChat(user._id)} />
            ))
         )}
         {loadingChat && <Spinner ml="auto" d="flex"/>}
        </DrawerBody>
        <DrawerFooter>
        <Button variant='outline' mr={3} onClick={onClose}>
              Cancel
            </Button>
        </DrawerFooter>
        </DrawerContent>
        </Drawer>
    </>
};
export default SideDrawer;