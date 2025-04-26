import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
},
    {timestamps: true} // This will add createdAt and updatedAt fields automatically
    // {collection: 'products'} // This will set the collection name to 'products' in MongoDB
);

const Product = mongoose.model('Product', productSchema);

export default Product;
    /*  This code defines a Mongoose schema and model for a product in a MongoDB database. 
        The schema includes fields for the product's name, price, and image URL,
        and it automatically manages timestamps for when the product is created and updated.
        The model is then exported for use in other parts of the application.   */
        