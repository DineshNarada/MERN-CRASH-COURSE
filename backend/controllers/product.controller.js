import Product from "../models/product.model.js"; // Import the Product model
import mongoose from "mongoose"; // Import mongoose to interact with MongoDB
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL,
});

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find({}); // Fetch all products from the database
        res.status(200).json({ success: true, message: "Products fetched successfully...!", data: products });
    } catch (error) {
        console.log("Error in fetching products:", error.message);
        res.status(500).json({ success: false, message: "Server error!" });
    }
}

export const createProduct = async (req, res) => {
    const { name, price, image } = req.body; //User input data

    if (!name || !price || !image) {
        return res.status(400).json({ success: false, message: "Please provide all the fields!" });
    }

    const newProduct = new Product({
        name,
        price,
        image, // Save the image URL directly
    });

    try {
        await newProduct.save(); // Save the product to the database
        res.status(201).json({ success: true, data: newProduct });
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ success: false, message: "Server error!", error: error.message });
    }
}

export const updateProduct = async (req, res) => {
    const { id } = req.params; // Extract the product ID from the request parameters
    const { name, price } = req.body;
    let image = req.body.image;

    // Check if the product ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Product not found!" });
    }

    try {
        if (req.file) {
            const uploadResult = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { resource_type: "image" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
            image = uploadResult.secure_url;
        }

        const updateData = {
            name,
            price,
            image, // Update image URL or path
        };

        const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true }); // Update the product in the database
        res.status(200).json({ success: true, message: "Product updated successfully...!", data: updatedProduct });
    } catch (error) {
        console.error("Error in updating product:", error);
        res.status(500).json({ success: false, message: "Server error!", error: error.message });
    }
}

export const deleteProduct = async (req, res) => {
    const { id } = req.params; // Extract the product ID from the request parameters

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Product not found!" });
    }
    
    try {
        await Product.findByIdAndDelete(id); // Find the product by ID and delete it
        res.status(200).json({ success: true, message: "Product deleted"});
    } catch (error) {
        console.error("Error in deleting product:", error.message);
        res.status(500).json({ success: false, message: "Sever error!" });
    }    
}
