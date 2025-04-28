import multer from "multer";

// Use memory storage for multer to get file buffer
const storage = multer.memoryStorage();

const upload = multer({ storage });

export default upload;
