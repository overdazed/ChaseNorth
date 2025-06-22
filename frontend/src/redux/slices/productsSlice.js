import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios";

// Async Thunk to fetch products by Collection and optional filters
// Filters that this thunk will care of:
export const fetchProductsByFilters = createAsyncThunk("products/fetchByFilters", async ({
    collection,
    size,
    color,
    gender,
    minPrice,
    maxPrice,
    sortBy,
    search,
    category,
    material,
    brand,
    limit
}) => {
    const query = new URLSearchParams()
    if (collection) query.append("collection", collection);
    if (size) query.append("size", size);
    if (color) query.append("color", color);
    if (gender) query.append("gender", gender);
    if (minPrice) query.append("minPrice", minPrice);
    if (maxPrice) query.append("maxPrice", maxPrice);
    if (sortBy) query.append("sortBy", sortBy);
    if (search) query.append("search", search);
    if (category) query.append("category", category);
    if (material) query.append("material", material);
    if (brand) query.append("brand", brand);
    if (limit) query.append("limit", limit);

    // make the request to the backend
    const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/products?${query.toString()}`);
    // Send back the data we get from the API
    return response.data;
})

// Async Thunk to fetch details for a single product by ID
export const fetchProductDetails = createAsyncThunk("products/fetchProductDetails", async (id) => {
    const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`
    );
    return response.data;
})

// Async Thunk to fetch similar products
export const updateProduct = createAsyncThunk("products/updateProduct", async ({id, productData}) => {
    // make a put request to update the product
    const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`,
        productData,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`
            }
        }
    );
    return response.data;
}
)


// Async Thunk to Fetch similar products
export const fetchSimilarProducts = createAsyncThunk("products/fetchSimilarProducts", async ({id}) => {
    // Call the API to fetch similar products and return the data
    const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/similar/${id}`
    );
    return response.data;
})

// Set up the slice for managing product related this.state
const productsSlice = createSlice({
    name: "products",
    initialState: {
        // this will store all the fetched products here
        products: [],
        // select a product
        selectedProduct: null, // Keeps track of currently viewed product
        similarProducts: [],
        loading: false,
        error: null,
        // this will track the active filters for fetching products
        filters: {
            category: "",
            size: "",
            color: "",
            gender: "",
            brand: "",
            minPrice: "",
            maxPrice: "",
            sortBy: "",
            search: "",
            material: "",
            collection: "",
        }
    },
    // Define the async thunks
    reducers: {
        // Update the filters
        setFilters: (state, action) => {
            // this will merge the new filters with the existing ones
            state.filters = { ...state.filters, ...action.payload };
        },
        // Add reducer to clear the filters and reset them to default
        clearFilters: (state) => {
            state.filters = {
                category: "",
                size: "",
                color: "",
                gender: "",
                brand: "",
                minPrice: "",
                maxPrice: "",
                sortBy: "",
                search: "",
                material: "",
                collection: "",
            }
        }
    },
    extraReducers: (builder) => {
        builder
            // handle the pending state when fetching products with filters
            .addCase(fetchProductsByFilters.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            // handle the fulfilled state when fetching products with filters
            .addCase(fetchProductsByFilters.fulfilled, (state, action) => {
                state.loading = false;
                // Check if the Action Payload is an Array, or an empty array
                state.products = Array.isArray(action.payload) ? action.payload : [];
            })
            // handle the rejected state when fetching products with filters
            .addCase(fetchProductsByFilters.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // handle fetching single product details
            .addCase(fetchProductDetails.pending, (state) => {
            state.loading = true;
            state.error = null;
            })
            // handle the fulfilled state when fetching products with filters
            .addCase(fetchProductDetails.fulfilled, (state, action) => {
                state.loading = false;
                // Check if the Action Payload is an Array, or an empty array
                state.selectedProduct = action.payload;
            })
            // handle the rejected state when fetching products with filters
            .addCase(fetchProductDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // handle updating a product
            .addCase(updateProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            // handle the fulfilled state when fetching products with filters
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false;
                // Check if the Action Payload is an Array, or an empty array
                const updatedProduct = action.payload;
                // find product in the list and update it, check for product._id equal to updatedProduct._id
                const index = state.products.findIndex(
                    (product) => product._id === updatedProduct._id
                );
                if (index !== -1) {
                    state.products[index] = updatedProduct;
                }
            })
            // handle the rejected state when fetching products with filters
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Add the Add case for fetching similar products
            .addCase(fetchSimilarProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            // handle the fulfilled state when fetching products with filters
            .addCase(fetchSimilarProducts.fulfilled, (state, action) => {
                state.loading = false;
                // Check if the Action Payload is an Array, or an empty array
                state.similarProducts = action.payload;
            })
            // handle the rejected state when fetching products with filters
            .addCase(fetchSimilarProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    }
});

export const { setFilters, clearFilters } = productsSlice.actions;
export default productsSlice.reducer;

// import productsReducer from "./slices/productsSlice"; in store.js