import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Product } from '@types/product';
import { API_URL } from '@env';
import Toast from 'react-native-simple-toast';

// Fetch all products from the API
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    const response = await axios.get(`${API_URL}/products`);
    return response.data.products; // Assume API returns all products
  }
);

// Fetch a single product detail from the API
export const fetchProductDetail = createAsyncThunk(
  'products/fetchProductDetail',
  async (productId: number) => {
    const response = await axios.get(`${API_URL}/products/${productId}`);
    return response.data; // Assume API returns a single product
  }
);

interface ProductsState {
  products: Product[];
  displayedProducts: Product[];
  productDetail: Product | null;
  loading: boolean;
  error: string | null;
  productLoading: boolean;
  productError: string | null;
  isRefreshing: boolean;
  hasMore: boolean;
  limit: number;
  skip: number;
  favorites: Product[]; // Add favorites array to the state
}

const initialState: ProductsState = {
  products: [],
  displayedProducts: [],
  productDetail: null,
  loading: false,
  error: null,
  productLoading: false,
  productError: null,
  isRefreshing: false,
  hasMore: true,
  limit: 10,
  skip: 0,
  favorites: [], // Initialize favorites as an empty array
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setRefreshing: (state, action: PayloadAction<boolean>) => {
      state.isRefreshing = action.payload;
    },
    resetProducts: (state) => {
      state.products = [];
      state.displayedProducts = [];
      state.skip = 0;
      state.hasMore = true;
    },
    loadMoreProducts: (state) => {
      const newSkip = state.skip + state.limit;
      const newProducts = state.products.slice(newSkip, newSkip + state.limit);

      if (newProducts.length > 0) {
        state.displayedProducts = [...state.displayedProducts, ...newProducts];
        state.skip = newSkip;
        state.hasMore = true;
      } else {
        state.hasMore = false;
      }
    },
    clearProductDetail: (state) => {
      state.productDetail = null;
      state.productError = null;
    },
    // Add a product to favorites
    addFavorite: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      if (!state.favorites.some((item) => item.id === product.id)) {
        state.favorites.push(product);
      }
      Toast.show('Added to favorite', Toast.LONG);
    },
    // Remove a product from favorites
    removeFavorite: (state, action: PayloadAction<number>) => {
      const productId = action.payload;
      state.favorites = state.favorites.filter((item) => item.id !== productId);
      Toast.show('Removed from favorite', Toast.LONG);
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetching all products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.isRefreshing = false;
        state.products = action.payload;
        state.displayedProducts = action.payload.slice(0, state.limit);
        state.hasMore = action.payload.length > state.limit;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.isRefreshing = false;
        state.error = action.error.message || 'Failed to fetch products';
      })

      // Handle fetching product details
      .addCase(fetchProductDetail.pending, (state) => {
        state.productLoading = true;
        state.productError = null;
      })
      .addCase(fetchProductDetail.fulfilled, (state, action) => {
        state.productLoading = false;
        state.productDetail = action.payload;
      })
      .addCase(fetchProductDetail.rejected, (state, action) => {
        state.productLoading = false;
        state.productError = action.error.message || 'Failed to fetch product details';
      });
  },
});

export const {
  setRefreshing,
  resetProducts,
  loadMoreProducts,
  clearProductDetail,
  addFavorite,
  removeFavorite,
} = productsSlice.actions;

export default productsSlice.reducer;