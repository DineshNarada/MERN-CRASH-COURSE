import { Container, Button, Heading, Input, VStack, HStack, Box } from "@chakra-ui/react";
import { useState, useRef } from "react";
import { useColorModeValue } from "../components/ui/color-mode";
import { useProductStore } from "../store/product";
import { toast } from "react-hot-toast";

const CreatePage = () => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    image: "", // will store image URL string
  });

  const { createProduct } = useProductStore();

  // Cloudinary unsigned upload preset and URL (replace with your own)
  const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dna7polgw/image/upload";
  const CLOUDINARY_UPLOAD_PRESET = "ncg_preset"; // Unsigned upload preset name

  const fileInputRef = useRef(null);

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        return data.secure_url;
      } else {
        throw new Error("Cloudinary upload failed");
      }
    } catch (error) {
      toast.error("Image upload failed: " + error.message);
      return null;
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const imageUrl = await uploadImageToCloudinary(file);
    if (imageUrl) {
      setNewProduct((prev) => ({ ...prev, image: imageUrl }));
      toast.success("Image uploaded successfully");
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.image) {
      toast.error("Please fill all fields including image.");
      return;
    }

    const productData = {
      name: newProduct.name,
      price: newProduct.price,
      image: newProduct.image,
    };

    const { success, message } = await createProduct(productData);

    if (success) {
      toast.success(
        <div>
          <strong>Success!</strong>
          <div>Product created successfully.</div>
        </div>,
        {
          style: {
            background: "#9AE6B4",
            color: "#1A202C",
          },
        }
      );
      setNewProduct({
        name: "",
        price: "",
        image: "",
      });
    } else {
      toast.error(
        <div>
          <strong>Error!</strong>
          <div>{message || "Failed to create product."}</div>
        </div>,
        {
          style: {
            background: "#ffcccc",
            color: "#1A202C",
          },
        }
      );
    }
  };

  return (
    <Container maxW="container.sm">
      <br />
      <VStack spacing={8}>
        <Heading as="h1" size="2xl" textAlign="center" mb={8}>
          Create New Product
        </Heading>

        <Box
          borderWidth="1px"
          borderRadius="md"
          p={4}
          borderColor={useColorModeValue("gray.200", "gray.600")}
          bg={useColorModeValue("white", "gray.700")}
          w={{ base: "100%", md: "75%", lg: "50%" }}
          mx="auto"
        >
          <VStack spacing={4}>
            <Input
              placeholder="Product Name:"
              name="name"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
            />

            <Input
              placeholder="Price:"
              name="price"
              type="number"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
            />

            {/* Image preview box */}
            {newProduct.image && (
              <Box
                maxW="200px"
                maxH="200px"
                mx="auto"
                borderWidth="1px"
                borderRadius="md"
                overflow="hidden"
              >
                <img
                  src={newProduct.image}
                  alt="Preview"
                  style={{ width: "100%", height: "auto", display: "block" }}
                />
              </Box>
            )}

            <HStack w="full" justify="flex-end">
              <Input
                type="file"
                accept="image/*"
                name="image"
                onChange={handleImageChange}
                ref={fileInputRef}
                display="none"
              />
              <Button onClick={() => fileInputRef.current.click()}>
                Upload Image
              </Button>
            </HStack>

            <Button colorScheme="blue" w="full" onClick={handleAddProduct}>
              Add Product
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default CreatePage;
