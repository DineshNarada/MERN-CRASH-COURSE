import { Box, Heading, HStack, Image, Text, IconButton, Button, Input, VStack, Dialog, Portal } from "@chakra-ui/react";
import { useColorModeValue } from "./ui/color-mode";
import { MdDelete, MdEdit, MdClose } from "react-icons/md";
import { useProductStore } from "../store/product";
import { toast } from "react-hot-toast";
import React, { useState, useEffect, useRef } from "react";

// Helper function to show toast notifications
const showToast = (type, title, message) => {
  const bgColor = type === "success" ? "#9AE6B4" : "#ffcccc";
  const textColor = "#1A202C";
  if (type === "success") {
    toast.success(
      <div>
        <strong>{title}</strong>
        <div>{message}</div>
      </div>,
      {
        style: {
          background: bgColor,
          color: textColor,
        },
      }
    );
  } else {
    toast.error(
      <div>
        <strong>{title}</strong>
        <div>{message}</div>
      </div>,
      {
        style: {
          background: bgColor,
          color: textColor,
        },
      }
    );
  }
};

// UpdateProductDialog component for updating product details
const UpdateProductDialog = ({ product, isOpen, onClose, onUpdate }) => {
  const [updatedProduct, setUpdatedProduct] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen && product) {
      setUpdatedProduct(product);
      setSelectedImage(null);
    }
  }, [isOpen, product]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files && files.length > 0) {
      setSelectedImage(files[0]);
    } else {
      setUpdatedProduct((prev) => ({
        ...prev,
        [name]: name === "price" ? Number(value) : value,
      }));
    }
  };

  const handleUpdateClick = () => {
    if (selectedImage) {
      const formData = new FormData();
      formData.append("name", updatedProduct.name);
      formData.append("price", updatedProduct.price);
      formData.append("image", selectedImage);
      onUpdate(product._id, formData);
    } else {
      onUpdate(product._id, updatedProduct);
    }
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content
            position="relative"
            bg={useColorModeValue("white", "gray.700")}
            color={useColorModeValue("gray.900", "white")}
            boxShadow="lg"
            borderRadius="md"
          >
            <IconButton
              aria-label="Close"
              position="absolute"
              top={2}
              right={2}
              onClick={onClose}
              size={"1xl"}
              color="red.500"
              bg={"gray.100"}
              _hover={{ bg: "red.500", color: "white" }}
              rounded="1xl"
            >
              {<MdClose />}
            </IconButton>

            <Dialog.Header>
              <Dialog.Title>Update Product</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <VStack spacing={4}>
                <Input
                  placeholder="Product Name"
                  name="name"
                  value={updatedProduct.name || ""}
                  onChange={handleChange}
                />
                <Input
                  placeholder="Price"
                  name="price"
                  type="number"
                  value={updatedProduct.price || ""}
                  onChange={handleChange}
                />
                <HStack w="full" justify="flex-end">
                  <Input
                    type="file"
                    accept="image/*"
                    name="image"
                    onChange={handleChange}
                    ref={fileInputRef}
                    display="none"
                  />
                  <Button onClick={() => fileInputRef.current.click()}>
                    Upload Image
                  </Button>
                </HStack>
              </VStack>
            </Dialog.Body>
            <Dialog.Footer>
              <Button
                mr={3}
                bg="blue.600"
                color="white"
                _hover={{ bg: "blue.700" }}
                onClick={handleUpdateClick}
              >
                Update
              </Button>
              <Button variant="outline" colorScheme="gray" onClick={onClose}>
                Cancel
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

// Main ProductCard component
const ProductCard = ({ product }) => {
  const textColor = useColorModeValue("gray.600", "gray.200");
  const bg = useColorModeValue("white", "gray.800");

  const { deleteProduct, updateProduct } = useProductStore();

  // State to control update dialog visibility
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  // Handler to delete product
  const handleDeleteProduct = async (pid) => {
    const { success, message } = await deleteProduct(pid);
    if (success) {
      showToast("success", "Success!", message || "Product deleted successfully.");
    } else {
      showToast("error", "Error!", message || "Failed to delete product.");
    }
  };

  // Handler to update product
  const handleUpdateProduct = async (pid, updatedProduct) => {
    const { success, message } = await updateProduct(pid, updatedProduct);
    if (success) {
      showToast("success", "Success!", message || "Product updated successfully.");
    } else {
      showToast("error", "Error!", message || "Failed to update product.");
    }
  };

  return (
    <>
      <Box
        shadow="lg"
        rounded="lg"
        overflow="hidden"
        transition="all 0.3s"
        _hover={{ transform: "translateY(-5px)", shadow: "xl" }}
        bg={bg}
      >
        <Image
          src={product.image}
          alt={product.name}
          h={48}
          w="full"
          objectFit="cover"
        />

        <Box p={4}>
          <Heading size="md" as="h3" mb={2}>
            {product.name}
          </Heading>

          <Text fontWeight="bold" fontSize="xl" color={textColor} mb={4}>
            {new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(product.price)}
          </Text>

          <HStack spacing={2}>
            <IconButton
              color="blue.500"
              bg={"gray.300"}
              _hover={{ bg: "blue.500", color: "white" }}
              aria-label="Edit product"
              onClick={() => setIsUpdateDialogOpen(true)}
            >
              <MdEdit />
            </IconButton>

            <IconButton
              color="red.500"
              bg={"gray.300"}
              _hover={{ bg: "red.500", color: "white" }}
              aria-label="Delete product"
              onClick={() => handleDeleteProduct(product._id)}
            >
              <MdDelete />
            </IconButton>
          </HStack>
        </Box>

      </Box>

      <UpdateProductDialog
        product={product}
        isOpen={isUpdateDialogOpen}
        onClose={() => setIsUpdateDialogOpen(false)}
        onUpdate={handleUpdateProduct}
      />
    </>
  );
};

export default ProductCard;
