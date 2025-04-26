import { useColorMode } from "./ui/color-mode";
import { Button, Container, Flex, HStack, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FaRegPlusSquare, FaSun, FaMoon } from "react-icons/fa";



const Navbar = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    

  return (
    <Container maxW={"1140px"} px={4}>
      
        <Flex
            py={4}
            h={16}
            alignItems={"center"}
            justifyContent={"space-between"}
            flexDir={{  
                base: "column",
                sm: "row",}}
    >
        
        <Link to={"/"}>
              <Text
                fontSize={{base: "22px", sm: "28px" }}
                fontWeight={"bold"}
                textTransform={"uppercase"}
                textAlign={"center"}
                bg={"blue.600"}
                //bgGradient={"linear(to-r, teal.500, blue.500)"}
                bgClip={"text"}
              >
                Product Store 🛒
              </Text>
              </Link>

        <HStack spacing={2} alignItems={"center"}>
            <Link to={"/create"}>
                <Button >
                    <FaRegPlusSquare fontSize={{base: "22px", sm: "28px" }}/>
                </Button>
            </Link>
            <Button onClick={toggleColorMode}>{colorMode === "light" ?
                <FaMoon fontSize={{base: "22px", sm: "28px" }} /> : 
                <FaSun fontSize={{base: "22px", sm: "28px" }} />}
            </Button>
        </HStack>
         
    </Flex>
   
  </Container>);

};

export default Navbar;
//<Button colorScheme="teal">