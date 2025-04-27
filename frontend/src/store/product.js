
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

import {create} from "zustand";

export const useProductStore = create((set) => ({
    products: [],
    setProducts: (products) => set({ products }),
    createProduct: async (newProduct) => {
        if (!newProduct.name || !newProduct.price || !newProduct.image) {
          return { success: false, message: "Please provide all fields!" };
        }
        try {         
            const res = await fetch(`${API_BASE_URL}/api/products`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newProduct),
            });

            const data = await res.json();
            set((state) => ({ products: [...state.products, data.data] }));
            return { success: true, message: "Product created successfully" };
        } catch (error) {
            // Catch fetch or JSON parsing errors
            return { success: false, message: error.message || "An error occurred" };
        }
    },
    fetchProducts: async () => {
        const res = await fetch(`${API_BASE_URL}/api/products`);
        const data = await res.json();
        set({ products: data.data });
    },
    deleteProduct: async (pid) => {
        const res = await fetch(`${API_BASE_URL}/api/products/${pid}`, {
            method: "DELETE",
        });
        const data = await res.json();
        if(!data.success) return { success: false, message: data.message };

        // Update the products state by filtering out the deleted product
        set(state => ({ products: state.products.filter(product => product._id !== pid) }));
        return { success: true, message: data.message };
    },
    updateProduct: async (pid, updatedProduct) => {
        try {
          const res = await fetch(`${API_BASE_URL}/api/products/${pid}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedProduct),
          });
    
          const data = await res.json();
          if (!res.ok || !data.success)
            return { success: false, message: data.message };
    
          set((state) => ({
            products: state.products.map((product) =>
              product._id === pid ? data.data : product
            ),
          }));
          return { success: true, message: "Product updated successfully" };
        } catch (error) {
          return {
            success: false,
            message: error.message || "Update failed unexpectedly",
          };
        }
      },  
}));
