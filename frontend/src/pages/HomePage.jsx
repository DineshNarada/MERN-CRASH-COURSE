import { Container, Text, VStack, SimpleGrid } from "@chakra-ui/react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useProductStore } from "../store/product.js"; // Assuming you have a store to fetch products from
import ProductCard from "../components/ProductCard.jsx"; // Assuming you have a ProductCard component to display each product

const HomePage = () => {
  const{fetchProducts, products } = useProductStore(); // Assuming you have a store to fetch products from

  useEffect(() => {
    fetchProducts(); 
  }, [fetchProducts]); // Fetch products when the component mounts
  console.log("products", products); // Log the products to see if they are fetched correctly
   
  return (
    <Container maxW='container.xl' py={12}>
      <VStack spacing={8}>
        <Text
          fontSize={"30px"} 
          fontWeight={'bold'} 
          textAlign={'center'} 
          bg={'blue.600'}
          //bgGradient={'linear(to-r, teal.500, blue.500)'}
          bgClip={'text'}

          >Current Products🚀
        </Text>

        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 3 }} 
          gap={10}
          w={'full'}
          //justifyItems={'center'}   // Not in Tutorial
          //alignItems={'center'}      // Not in Tutorial
          //spacingX={{ base: 0, md: 10 }} // Not in Tutorial          
        >
          {products.map((product) => (
            <ProductCard key={product._id} product={product}/> // Assuming you have a ProductCard component to display each product
          ))}
        </SimpleGrid>

        {products.length === 0 && (
          <Text
            fontSize={"xl"}
            fontWeight={'bold'}
            textAlign={'center'}
            color={'gray.500'}        
            >No product found.😟 {""}

            <Link to={"/create"}>
              <Text as={'span'} color={'blue.400'} _hover={{ textDecoration: 'underline' }}>
                Create a new product..!
              </Text>
            </Link>  
          </Text>)
        }

      </VStack>
    </Container>      
  );
};

export default HomePage;