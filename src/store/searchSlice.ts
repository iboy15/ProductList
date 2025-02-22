import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

// Define the type for a product
interface Product {
  id: number;
  title: string;
  thumbnail: string;
  // Add other fields as needed
}

// Define the state structure for search
interface SearchState {
  results: Product[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: SearchState = {
  results: [],
  loading: false,
  error: null,
};

// Async thunk to fetch search results
export const fetchSearchResults = createAsyncThunk(
  'search/fetchSearchResults',
  async (query: string) => {
    const response = await axios.get(`https://dummyjson.com/products/search?q=${query}`);
    return response.data.products; // Return the array of products
  },
);

// Create the slice
const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    clearSearchResults: (state) => {
      state.results = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSearchResults.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
      })
      .addCase(fetchSearchResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch search results';
      });
  },
});

// Export actions and reducer
export const {clearSearchResults} = searchSlice.actions;
export default searchSlice.reducer;