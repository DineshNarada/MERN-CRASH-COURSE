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
    const { name, price } = req.body; //User input data
    const file = req.file;

    if (!name || !price || !file) {
        return res.status(400).json({ success: false, message: "Please provide all the fields!" });
    }

    const newProduct = new Product({
        name,
        price,
        image: file.path, // Save the file path in the image field
    });

    try {
        await newProduct.save(); // Save the product to the database
        // Prepend server URL to image path for frontend access
        const productWithFullImageUrl = newProduct.toObject();
        productWithFullImageUrl.image = `${req.protocol}://${req.get('host')}/${newProduct.image}`;
        res.status(201).json({ success: true, data: productWithFullImageUrl });
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ success: false, message: "Server error!", error: error.message });
    }
}

export const updateProduct = async (req, res) => {
    const { id } = req.params; // Extract the product ID from the request parameters
    const { name, price } = req.body;
    const file = req.file;

    // Check if the product ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Product not found!" });
    }

    try {
        const updateData = {
            name,
            price,
        };

        if (file) {
            updateData.image = file.path; // Update image path if new image uploaded
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true }); // Update the product in the database
        // Prepend server URL to image path for frontend access
        const productWithFullImageUrl = updatedProduct.toObject();
        productWithFullImageUrl.image = `${req.protocol}://${req.get('host')}/${updatedProduct.image}`;
        res.status(200).json({ success: true, message: "Product updated successfully...!", data: productWithFullImageUrl });
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