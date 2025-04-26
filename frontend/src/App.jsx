import { Box } from "@chakra-ui/react"
import { Route, Routes } from "react-router-dom";
import { useColorModeValue } from "./components/ui/color-mode.jsx";
import { Toaster } from "react-hot-toast";

import CreatePage from "./pages/CreatePage";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";

function App() {

  return (
    <Box minH={"100vh"} bg={useColorModeValue("gray.100", "gray.900")} >
      <Navbar />
      
      <Toaster 
        toastOptions={{         
          duration: 3000,}}                  
        position="bottom-right"
        reverseOrder={false}
        gutter={8}
      />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreatePage />} />
        </Routes>              
    </Box>
  );
}

export default App