import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {Product} from '@types/product';
import {API_URL} from '@env';

// Fetch all products from the API
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    const response = await axios.get(`${API_URL}/products`);

    return response.data.products; // Assume the API returns all products
  },
);

interface ProductsState {
  products: Product[];
  displayedProducts: Product[]; // Products to display on the frontend
  loading: boolean;
  error: string | null;
  isRefreshing: boolean;
  hasMore: boolean; // Track if there are more products to load
  limit: number; // Number of products to display per "page"
  skip: number; // Number of products to skip
}

const initialState: ProductsState = {
  products: [], // All products fetched from the API
  displayedProducts: [], // Products currently displayed
  loading: false,
  error: null,
  isRefreshing: false,
  hasMore: true, // Assume there are more products initially
  limit: 10, // Default limit for pagination
  skip: 0, // Default skip for pagination
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setRefreshing: (state, action) => {
      state.isRefreshing = action.payload;
    },
    resetProducts: state => {
      state.products = []; // Reset all products
      state.displayedProducts = []; // Reset displayed products
      state.skip = 0; // Reset skip
      state.hasMore = true; // Reset hasMore
    },
    loadMoreProducts: state => {
      const newSkip = state.skip + state.limit;
      const newProducts = state.products.slice(newSkip, newSkip + state.limit);

      if (newProducts.length > 0) {
        state.displayedProducts = [...state.displayedProducts, ...newProducts];
        state.skip = newSkip;
        state.hasMore = true;
      } else {
        state.hasMore = false; // No more products to load
      }
    },
  },
  extraReducers: builder => {
    builder
      // Set loading state when the API call is pending
      .addCase(fetchProducts.pending, state => {
        state.loading = true;
        state.error = null;
      })
      // Set products data when the API call is successful
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.isRefreshing = false;
        state.products = action.payload; // Store all products
        state.displayedProducts = action.payload.slice(0, state.limit); // Display the first "limit" products
        state.hasMore = action.payload.length > state.limit; // Check if there are more products
      })
      // Set error state when the API call fails
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.isRefreshing = false;
        state.error = action.error.message || 'Failed to fetch products';
      });
  },
});

export const {setRefreshing, resetProducts, loadMoreProducts} = productsSlice.actions;

export default productsSlice.reducer;