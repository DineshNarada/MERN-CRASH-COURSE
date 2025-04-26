import { Box } from "@chakra-ui/react";

export const DecorativeBox = (props) => {
  return (
    <Box
      p={2}
      borderWidth="1px"
      borderRadius="md"
      borderColor="gray.200"
      boxShadow="sm"
      {...props}
    >
      {props.children}
    </Box>
  );
};
