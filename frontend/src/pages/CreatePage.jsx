import { Container, Box, Button, Heading, Input, VStack,} from "@chakra-ui/react";
import { useState } from "react";
import { useColorModeValue } from "../components/ui/color-mode";
import { useProductStore } from "../store/product";
import { toast } from "react-hot-toast"; // Removed Toaster import

const CreatePage = () => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    image: null,
  });

const {createProduct} = useProductStore();
const handleAddProduct = async() => {
  if (!newProduct.name || !newProduct.price || !newProduct.image) {
    toast.error("Please fill all fields including image.");
    return;
  }

  const formData = new FormData();
  formData.append("name", newProduct.name);
  formData.append("price", newProduct.price);
  formData.append("image", newProduct.image);

  const {success, message} = await createProduct(formData);
  console.log("Success", success);
  console.log("Message", message);

  if (success) {
    toast.success(
      <div>
        <strong>success !</strong>
        <div>Product created successfully.</div>
      </div>,
      {
        style: {
          background: '#9AE6B4', // green.300
          color: '#1A202C', // gray.800 for text
        }
      }
    ); // ✅ Show toast on success
    setNewProduct({
      name: "",
      price: "",
      image: null,
    });// ✅ Reset form only on success

  } else {
    toast.error(
      <div>
        <strong>error !</strong>
        <div>{message || "Failed to create product."}</div>
      </div>,
      {
        style: {
          background: '#ffcccc',
          color: '#1A202C', // gray.800 for text
        }
      }
    ); // ✅ Show toast on error
  }

};

  return (
  <Container maxW="container.sm" >
    {/* Removed Toaster component */}

    <br/>
    <VStack
      spacing={8}>
        <Heading as="h1" size="2xl" textAlign="center" mb={8}><br/>
          Create New Product
        </Heading>

        <Box
            w={{ base: "100%", md: "75%", lg: "50%" }} 
            p={{ base: 4, md: 6 }} 
            bg={useColorModeValue("white", "gray.700")}
            rounded="lg"
            shadow={"md"}
            borderRadius="md"
            mx="auto">

            <VStack spacing={4}>
                <Input 
                  placeholder='Product Name'
                  name="name"                  
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />

                <Input 
                  placeholder="price"
                  name="price"                  
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />
                
                <Input 
                  type="file"
                  accept="image/*"
                  name="image"                  
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.files[0] })} />
                                  
                  <Button colorScheme='blue' w='full' onClick={handleAddProduct}>
                    Add Product
                  </Button>
            </VStack>
        </Box>
    </VStack>    
</Container>);
};

export default CreatePage;
