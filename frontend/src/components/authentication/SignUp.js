import React, { useState } from "react";
import {VStack, useToast, FormControl, FormLabel, Input, InputGroup, InputRightElement, Button } from '@chakra-ui/react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Signup = ()=>{
    const [show, setShow] = useState(false);
    const [name, setName] = useState();
    const [email,setEmail] = useState();
    const[password, setPassword] = useState();
    const [confirmpassword, setConfirmpassword] = useState();
    const [pic, setPic] = useState();
    const [loading,setLoading] = useState(false);
    const toast = useToast();
    // const history = useHistory();
    const navigate = useNavigate();
    const handleClick = () => setShow(!show);
    const postDetails = (pics) => {
      setLoading(true);
      if( pics === undefined){
        toast({
          title:"Please select an image",
          status:"warning",
          duration: 5000,
          isClosable:true,
          position:"bottom",
        });
        return;
      }
      if(pics.type === "image/jpeg" || pics.type === "image/png"){
        const data = new FormData();
        data.append("file",pics);
        data.append("upload_preset", "ChatApp");
        data.append("cloud_name", "darxylabb");
        fetch("https://api.cloudinary.com/v1_1/darxylabb",{
          method:"post",
          body: data,        
        }).then((res) => res.json())
        .then((data)=> {
          setPic(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
      } else {
        toast({
          title:"Please select an image",
          status:"warning",
          duration: 5000,
          isClosable:true,
          position:"bottom",});
          setLoading(false);
          return;
      }
    };
    const submitHandler = async () => {
      setLoading(true);
      if(!name || !email || !password || !confirmpassword){
        toast({
          title:"Please fill all the field",
          status:"warning",
          duration: 5000,
          isClosable:true,
          position:"bottom",
        });
        setLoading(false);
        return;
      }
      if(password!==confirmpassword){
        toast({
          title:"Passwords do not match",
          status:"warning",
          duration: 5000,
          isClosable:true,
          position:"bottom",
        });
        return;
      }
      try {
        const config = {
          headers: {
            "Content-type":"application/json"
          },
        };
        const { data } = await axios.post("/api/user",{
          name, email,password,pic
        },
        config
        ); 
        toast({
          title:"Registered successfully",
          status:"success",
          duration: 5000,
          isClosable:true,
          position:"bottom",
        });
        localStorage.setItem("userInfo", JSON.stringify(data));
        setLoading(false);
        navigate("/chats");
        // history.pushState('/chats')
      } catch (error) {
        toast({
          title:"Error Occured!",
          description:error.response.data.message,
          status:"error",
          duration: 5000,
          isClosable:true,
          position:"bottom",
        });
        setLoading(false);
      }
    };
    return  <VStack
    spacing="5px"
    align='stretch'
    color="black"
  >
  <FormControl id="first-name" isRequired>
    <FormLabel>Name</FormLabel>
        <Input
        placeholder="Can you tell me your name? "
        onChange={(e) => setName(e.target.value)}
        >
        

        </Input>
  </FormControl>
  <FormControl id="email" isRequired>
    <FormLabel>Email</FormLabel>
        <Input
        placeholder="What is your email? "
        onChange={(e) => setEmail(e.target.value)}
        >
        

        </Input>
  </FormControl>
  <FormControl id="password" isRequired>
    <FormLabel>Password</FormLabel>
    <InputGroup>
        <Input
        type={show ? "text": "password"}
        placeholder="Set a strong password "
        onChange={(e) => setPassword(e.target.value)}
        >
        

        </Input>
        <InputRightElement>
            <Button h="1.75rem" size="sm" onClick={handleClick}> {show ? "Hide" : "Show"} </Button>
        </InputRightElement>
        </InputGroup>
  </FormControl>
  <FormControl id="confirm-paasword" isRequired>
    <FormLabel>Confirm Password</FormLabel>
    <InputGroup>
        <Input
        type={show ? "text": "password"}
        placeholder="Password Confirmation"
        onChange={(e) => setConfirmpassword(e.target.value)}
        >
        

        </Input>
        <InputRightElement>
            <Button h="1.75rem" size="sm" onClick={handleClick}> {show ? "Hide" : "Show"} </Button>
        </InputRightElement>
        </InputGroup>
  </FormControl>
  <FormControl id="pic" isRequired>
    <FormLabel>Pic</FormLabel>
        <Input
        type="file"
        p='1.5'
        accept="image/*"
        placeholder="Can I see how you look :) ? "
        onChange={(e) => postDetails(e.target.files[0])}
        >
        

        </Input>
  </FormControl>
  <Button
  colorScheme="blue"
  width="100%"
  style={{marginTop:15}}
  onClick={submitHandler}
  isLoading={loading}
  >Less Go!</Button>
  </VStack>
};
export default Signup;