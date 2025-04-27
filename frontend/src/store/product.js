const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

import {create} from "zustand";

async function safeJsonResponse(response) {
    try {
        const text = await response.text();
        return text ? JSON.parse(text) : {};
    } catch {
        return {};
    }
}

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

            if (!res.ok) {
                const errorData = await safeJsonResponse(res);
                return { success: false, message: errorData.message || "Failed to create product" };
            }

            const data = await safeJsonResponse(res);
            set((state) => ({ products: [...state.products, data.data] }));
            return { success: true, message: "Product created successfully" };
        } catch (error) {
            return { success: false, message: error.message || "An error occurred" };
        }
    },
    fetchProducts: async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/products`);
            if (!res.ok) {
                return;
            }
            const data = await safeJsonResponse(res);
            set({ products: data.data || [] });
        } catch {
            // ignore errors here
        }
    },
    deleteProduct: async (pid) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/products/${pid}`, {
                method: "DELETE",
            });
            if (!res.ok) {
                const errorData = await safeJsonResponse(res);
                return { success: false, message: errorData.message || "Failed to delete product" };
            }
            const data = await safeJsonResponse(res);
            set(state => ({ products: state.products.filter(product => product._id !== pid) }));
            return { success: true, message: data.message || "Product deleted" };
        } catch (error) {
            return { success: false, message: error.message || "An error occurred" };
        }
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

            if (!res.ok) {
                const errorData = await safeJsonResponse(res);
                return { success: false, message: errorData.message || "Failed to update product" };
            }

            const data = await safeJsonResponse(res);
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
