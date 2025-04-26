import Product from "../models/product.model.js"; // Import the Product model
import mongoose from "mongoose"; // Import mongoose to interact with MongoDB

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
    const product = req.body; //User input data

    if(!product.name || !product.price || !product.image) {
        return res.status(400).json({ success:false, message: "Please provide all the fields!" });
    }

    const newProduct = new Product(product); // Create a new product instance

    try {
        await newProduct.save(); // Save the product to the database
        res.status(201).json({ success: true, data: newProduct });
    }catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ success: false, message: "Server error!", error: error.message });
    }
}

export const updateProduct = async (req, res) => {
    const { id } = req.params; // Extract the product ID from the request parameters
    const product = req.body; // User input data
    // Check if the product ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Product not found!" });
    }
    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, product, { new: true });// Update the product in the database
        res.status(200).json({ success: true, message: "Product updated successfully...!", data: updatedProduct });
    } catch (error) {
        console.error("Error in updating product:", error.message);
        res.status(500).json({ success: false, message: "Server error!" });
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