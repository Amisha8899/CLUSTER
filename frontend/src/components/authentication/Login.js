import React, {useState} from "react";
import {VStack, useToast, FormControl, FormLabel, Input, InputGroup, InputRightElement, Button } from '@chakra-ui/react';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import { useHistory } from "react-router-dom";
const Login = ()=>{
    const [show, setShow] = useState(false);
    const [email,setEmail] = useState();
    const[password, setPassword] = useState();
    const handleClick = () => setShow(!show);
    const [loading,setLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();
    // const history = useHistory();
    const submitHandler = async () =>  {
      setLoading(true);
      if(!email || !password){
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
      try {
        const config = {
          headers: {
            "Content-type":"application/json",
          },
        };
        const {data} = await axios.post("api/user/login",
        {
          email,password
        },
        config);
        // console.log(data);
        toast({
          title:"Login Successfull :)",
          status:"success",
          duration: 5000,
          isClosable:true,
          position:"bottom",
        });
        localStorage.setItem("userInfo", JSON.stringify(data));
        setLoading(false);
        navigate("/chats")
        // history.push('/chats')
      } catch (error) {
        toast({
          title:"Error",
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
  <FormControl id="email" isRequired>
    <FormLabel>Email</FormLabel>
        <Input
        value={email}
        placeholder="What is your email? "
        onChange={(e) => setEmail(e.target.value)}
        >
        

        </Input>
  </FormControl>
  <FormControl id="password" isRequired>
    <FormLabel>Password</FormLabel>
    <InputGroup>
        <Input
        value={password}
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
  
  <Button
  colorScheme="blue"
  width="100%"
  isLoading={loading}
  style={{marginTop:15}}
  onClick={submitHandler}
  >Less Go!</Button>
  {/* <Button
  variant="solid"
  colorScheme="yellow"
  width="100%"
  // isLoading={loading}
  onClick={()=>{
    setEmail("");
    setPassword("");
  }}
  >Whom you wanna chat with?</Button> */}
  </VStack>
};
export default Login;