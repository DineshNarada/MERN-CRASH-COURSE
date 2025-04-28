import express from "express";
import { createProduct } from "../controllers/product.controller.js";
import { getProducts } from "../controllers/product.controller.js";
import { updateProduct } from "../controllers/product.controller.js";
import { deleteProduct } from "../controllers/product.controller.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", getProducts);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
